import {
  CompanyType,
  ResumeAnalysisRequest,
  ResumeAnalysisTarget,
  ResumeSourceType,
} from "./types";

export const MAX_RESUME_FILE_SIZE = 10 * 1024 * 1024;
export const MIN_RESUME_TEXT_LENGTH = 100;
export const MAX_RESUME_TEXT_LENGTH = 50_000;
export const MAX_COMPANY_LENGTH = 120;
export const MAX_ROLE_LENGTH = 120;
export const MAX_JOB_DESCRIPTION_LENGTH = 12_000;

const companyTypes = new Set<CompanyType>([
  "product",
  "high_volume",
  "fintech_consulting",
  "startup",
  "mass_hiring",
  "other",
]);

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function validateResumeFile(file?: File | null): string | null {
  if (!file) return "Choose a resume PDF before continuing.";
  const extension = file.name.toLowerCase().split(".").pop();
  if (extension !== "pdf") return "Only PDF resumes are supported.";
  if (file.size === 0) return "The selected PDF is empty.";
  if (file.size > MAX_RESUME_FILE_SIZE) {
    return "The resume must be 10 MB or smaller.";
  }
  if (file.type && file.type !== "application/pdf" && file.type !== "application/octet-stream") {
    return "The selected file is not a supported PDF.";
  }
  return null;
}

export function validateTarget(target: ResumeAnalysisTarget): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!target.company.trim()) errors.company = "Enter the target company.";
  else if (target.company.trim().length > MAX_COMPANY_LENGTH) {
    errors.company = `Company name must be ${MAX_COMPANY_LENGTH} characters or fewer.`;
  }
  if (!target.companyType || !companyTypes.has(target.companyType as CompanyType)) errors.companyType = "Select a company type.";
  if (!target.role.trim()) errors.role = "Select a target role.";
  if (target.role === "custom" && !target.customRole?.trim()) {
    errors.customRole = "Enter the custom target role.";
  } else if (target.customRole && target.customRole.length > MAX_ROLE_LENGTH) {
    errors.customRole = `Role must be ${MAX_ROLE_LENGTH} characters or fewer.`;
  }
  if (
    target.jobDescription &&
    target.jobDescription.trim().length > MAX_JOB_DESCRIPTION_LENGTH
  ) {
    errors.jobDescription = `Job description must be ${MAX_JOB_DESCRIPTION_LENGTH} characters or fewer.`;
  }
  return errors;
}

export function validateResumeRequest(
  request: ResumeAnalysisRequest,
  file?: File | null,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (request.source === "pdf") {
    const fileError = validateResumeFile(file);
    if (fileError) errors.resume = fileError;
  } else {
    const length = request.resumeText?.trim().length ?? 0;
    if (length < MIN_RESUME_TEXT_LENGTH) {
      errors.resumeText = `Paste at least ${MIN_RESUME_TEXT_LENGTH} characters from your resume.`;
    } else if (length > MAX_RESUME_TEXT_LENGTH) {
      errors.resumeText = `Resume text must be ${MAX_RESUME_TEXT_LENGTH} characters or fewer.`;
    }
  }
  return { ...errors, ...validateTarget(request.target) };
}

export function getTargetRole(target: ResumeAnalysisTarget): string {
  return target.role === "custom" ? (target.customRole?.trim() || "") : target.role;
}

export function getResumeSourceType(file?: File | null): ResumeSourceType {
  return file ? "pdf" : "text";
}

export function isSafeText(value: string): boolean {
  return value.trim().length > 0 && value.length <= MAX_RESUME_TEXT_LENGTH;
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9._-]+/g, "_").slice(0, 180);
}
