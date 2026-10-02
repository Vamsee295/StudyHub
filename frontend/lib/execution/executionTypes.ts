export interface ParameterDef {
  name: string;
  type: string;
}

export interface FunctionSignature {
  language: string;
  className: string;
  methodName: string;
  returnType: string;
  parameters: ParameterDef[];
}

export interface TestCase {
  id: string;
  input: Record<string, any>;
  expectedOutput: any;
}

export interface ExecutionRequest {
  code: string;
  problemId: string;
  functionSignature: FunctionSignature;
  testCases: TestCase[];
}

export interface TestCaseResult {
  id: string;
  status:
    | "pending"
    | "running"
    | "passed"
    | "failed"
    | "wrong_answer"
    | "compile_error"
    | "runtime_error"
    | "time_limit";
  input: Record<string, any>;
  expectedOutput: any;
  actualOutput?: any;
  runtimeMs?: number;
  error?: string;
}

export interface CompilationErrorMarker {
  line: number;
  column: number;
  message: string;
  severity: string;
}

export interface ExecutionResult {
  status:
    | "accepted"
    | "wrong_answer"
    | "compile_error"
    | "runtime_error"
    | "time_limit"
    | "pending"
    | "running";
  passedTests: number;
  totalTests: number;
  runtimeMs?: number;
  memoryMb?: number;
  testResults: TestCaseResult[];
  compilerError?: string;
  compilerMarkers?: CompilationErrorMarker[];
  runtimeError?: string;
}
