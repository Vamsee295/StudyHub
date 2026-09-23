import {
  CreateAnalysisResponse,
  GetAnalysisResponse,
  ResumeAnalysisRequest,
  ResumeAnalysisSummary,
  ResumeStreamEvent,
} from "./types";
import { sanitizeFileName } from "./validation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const TOKEN_CACHE_DURATION = 60 * 1000;
let cachedToken: string | null = null;
let cachedTokenTime = 0;

function invalidateTokenCache() {
  cachedToken = null;
  cachedTokenTime = 0;
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const now = Date.now();
  if (cachedToken && now - cachedTokenTime < TOKEN_CACHE_DURATION) return cachedToken;

  const legacyToken = window.localStorage.getItem("pathward_access_token");
  if (legacyToken) {
    cachedToken = legacyToken;
    cachedTokenTime = now;
    return legacyToken;
  }

  try {
    const { supabase } = await import("@/lib/supabase/client");
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      cachedToken = data.session.access_token;
      cachedTokenTime = now;
      return data.session.access_token;
    }
  } catch {
    return null;
  }
  return null;
}

async function authorizedHeaders(): Promise<Headers> {
  const headers = new Headers();
  const token = await getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = await authorizedHeaders();
  Object.entries(options.headers || {}).forEach(([key, value]) => {
    if (typeof value === "string") headers.set(key, value);
  });
  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ResumeApiError("connection_error", "Unable to reach the analysis service. Please try again.");
  }

  if (!response.ok) {
    invalidateTokenCache();
    throw ResumeApiError.fromResponse(response.status);
  }
  return response.json() as Promise<T>;
}

export class ResumeApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ResumeApiError";
  }

  static fromResponse(status: number): ResumeApiError {
    if (status === 401) {
      return new ResumeApiError("auth_required", "Sign in again before continuing.", status);
    }
    if (status === 403) {
      return new ResumeApiError("access_denied", "This analysis is not available to your account.", status);
    }
    if (status === 404) {
      return new ResumeApiError("not_found", "This analysis could not be found.", status);
    }
    if (status === 413) {
      return new ResumeApiError("file_too_large", "The resume is too large to analyze.", status);
    }
    if (status === 422) {
      return new ResumeApiError("invalid_request", "Check the resume and target details, then try again.", status);
    }
    if (status >= 500) {
      return new ResumeApiError("service_unavailable", "The analysis service is temporarily unavailable.", status);
    }
    return new ResumeApiError("request_failed", "The request could not be completed.", status);
  }
}

export const resumeAnalysisApi = {
  async createAnalysis(formData: FormData): Promise<ResumeAnalysisSummary> {
    const response = await fetchJson<CreateAnalysisResponse>("/resume/analyses", {
      method: "POST",
      body: formData,
    });
    return response.analysis;
  },

  async getAnalysis(analysisId: string): Promise<GetAnalysisResponse> {
    return fetchJson<GetAnalysisResponse>(`/resume/analyses/${encodeURIComponent(analysisId)}`);
  },

  async processAnalysis(analysisId: string): Promise<ReadableStream<ResumeStreamEvent>> {
    const headers = await authorizedHeaders();
    let response: Response;
    try {
      response = await fetch(`${API_URL}/resume/analyses/${encodeURIComponent(analysisId)}/process`, {
        method: "POST",
        headers,
        cache: "no-store",
      });
    } catch {
      throw new ResumeApiError("connection_error", "Unable to reach the analysis service. Please try again.");
    }
    if (!response.ok) {
      invalidateTokenCache();
      throw ResumeApiError.fromResponse(response.status);
    }
    if (!response.body) {
      throw new ResumeApiError("empty_stream", "The analysis service did not return a processing stream.");
    }
    return parseResumeStream(response.body);
  },
};

function parseResumeStream(body: ReadableStream<Uint8Array>): ReadableStream<ResumeStreamEvent> {
  let buffer = "";
  return (body as any).pipeThrough(new TextDecoderStream()).pipeThrough(
    new TransformStream<string, ResumeStreamEvent>({
      transform(chunk, controller) {
        buffer += chunk;
        const events = parseServerSentEvents(buffer, true);
        buffer = events.remaining;
        for (const event of events.events) controller.enqueue(event);
      },
      flush(controller) {
        for (const event of parseServerSentEvents(buffer, false).events) controller.enqueue(event);
      },
    }),
  );
}

function parseServerSentEvents(
  input: string,
  preserveTrailingEvent: boolean,
): { events: ResumeStreamEvent[]; remaining: string } {
  const normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const events: ResumeStreamEvent[] = [];
  const lines = normalized.split("\n");
  let event = "message";
  let data = "";
  let lastIndex = 0;

  const emit = () => {
    if (data.trim()) {
      try {
        const payload = JSON.parse(data) as ResumeStreamEvent;
        if (payload.type !== event) {
          events.push({
            type: "error",
            error: { code: "invalid_stream", message: "The analysis service returned an invalid update." },
          });
        } else {
          events.push(payload);
        }
      } catch {
        events.push({
          type: "error",
          error: { code: "invalid_stream", message: "The analysis service returned an unreadable update." },
        });
      }
    }
    event = "message";
    data = "";
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line) {
      emit();
      lastIndex = index + 1;
      continue;
    }
    if (line.startsWith(":")) continue;
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      data = data ? `${data}\n${line.slice(5).trimStart()}` : line.slice(5).trimStart();
    }
  }

  if (!preserveTrailingEvent && data.trim()) {
    emit();
    lastIndex = lines.length;
  }

  return { events, remaining: lines.slice(lastIndex).join("\n") };
}

export function getResumeRequestFormData(
  request: ResumeAnalysisRequest,
  file?: File | null,
): FormData {
  const formData = new FormData();
  formData.append("source", request.source);
  if (file) formData.append("file", file, sanitizeFileName(file.name));
  if (request.fileName) formData.append("file_name", request.fileName);
  if (request.fileSize !== undefined) formData.append("file_size", String(request.fileSize));
  if (request.fileMimeType) formData.append("file_mime_type", request.fileMimeType);
  if (request.resumeText) formData.append("resume_text", request.resumeText);
  formData.append("company", request.target.company);
  formData.append("company_type", request.target.companyType);
  formData.append("role", request.target.role);
  if (request.target.customRole) formData.append("custom_role", request.target.customRole);
  if (request.target.jobDescription) formData.append("job_description", request.target.jobDescription);
  return formData;
}
