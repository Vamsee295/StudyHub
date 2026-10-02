import { ExecutionRequest, ExecutionResult } from "./executionTypes";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const executeCode = async (request: ExecutionRequest, isSubmit: boolean = false): Promise<ExecutionResult> => {
  const endpoint = isSubmit ? "/execution/submit" : "/execution/run";
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Execution failed: ${response.statusText}`);
  }

  return response.json();
};

export const explainError = async (code: string, errorMessage: string, language: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/execution/explain-error`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, error_message: errorMessage, language }),
  });

  if (!response.ok) {
    throw new Error(`Explain request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.explanation;
};
