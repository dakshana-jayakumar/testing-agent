import { ResearchResult, FixSuggestion } from './research.js';

// Error analysis types
export interface ErrorAnalysis {
  category: ErrorCategory;
  confidence: number;
  suggestions: string[];
  pattern: ErrorPattern | null;
  context: AnalysisContext;
  timestamp: Date;
}

export enum ErrorCategory {
  LOGIC_ERROR = 'Logic Error',
  ENVIRONMENT_ERROR = 'Environment Error',
  RACE_CONDITION = 'Race Condition',
  UI_ERROR = 'UI Error',
  NETWORK_ERROR = 'Network Error',
  CONFIGURATION_ERROR = 'Configuration Error'
}

export interface ErrorPattern {
  id: string;
  pattern: string;
  category: ErrorCategory;
  confidence: number;
  frequency: number;
  lastSeen: Date;
  solutions: Solution[];
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  steps: string[];
  source: SolutionSource;
  confidence: number;
  upvotes: number;
  verified: boolean;
}

export enum SolutionSource {
  STACKOVERFLOW = 'stackoverflow',
  GITHUB = 'github',
  DOCUMENTATION = 'documentation',
  AI_GENERATED = 'ai_generated',
  COMMUNITY = 'community'
}

export interface AnalysisContext {
  errorMessage: string;
  stackTrace?: string;
  filePath?: string;
  lineNumber?: number;
  codeContext?: string;
  environment?: EnvironmentInfo;
  timestamp: Date;
}

export interface EnvironmentInfo {
  nodeVersion?: string;
  platform?: string;
  framework?: string;
  dependencies?: Record<string, string>;
  environment?: 'development' | 'production' | 'test';
}

// Visual analysis types
export interface VisualAnalysis {
  screenshot: Buffer | null;
  domState: DOMState;
  consoleErrors: ConsoleError[];
  networkErrors: NetworkError[];
  performanceMetrics: PerformanceMetrics;
  timestamp: Date;
}

export interface DOMState {
  readyState: DocumentReadyState;
  title: string;
  url: string;
  viewport: Viewport;
  elements: ElementInfo[];
}

export interface ElementInfo {
  tagName: string;
  id?: string;
  className?: string;
  textContent?: string;
  attributes: Record<string, string>;
  boundingRect: BoundingRect;
}

export interface BoundingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Viewport {
  width: number;
  height: number;
  devicePixelRatio: number;
}

export interface ConsoleError {
  type: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  source?: string;
  line?: number;
  column?: number;
  timestamp: Date;
}

export interface NetworkError {
  url: string;
  method: string;
  status: number;
  statusText: string;
  responseTime: number;
  timestamp: Date;
}

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

// Test validation types
export interface TestValidationResult {
  overall: TestQualityScore;
  coverage: CoverageAnalysis;
  flaky: FlakyTestAnalysis;
  performance: TestPerformanceAnalysis;
  recommendations: TestRecommendation[];
  timestamp: Date;
}

export interface TestQualityScore {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: QualityFactor[];
}

export interface QualityFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface CoverageAnalysis {
  lines: CoverageMetric;
  functions: CoverageMetric;
  branches: CoverageMetric;
  statements: CoverageMetric;
  uncoveredFiles: string[];
  gaps: CoverageGap[];
}

export interface CoverageMetric {
  total: number;
  covered: number;
  percentage: number;
}

export interface CoverageGap {
  file: string;
  lines: number[];
  functions: string[];
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface FlakyTestAnalysis {
  flakyTests: FlakyTest[];
  totalRuns: number;
  flakyPercentage: number;
  stabilityScore: number;
}

export interface FlakyTest {
  name: string;
  file: string;
  failureRate: number;
  lastFailures: TestFailure[];
  patterns: string[];
  suggestions: string[];
}

export interface TestFailure {
  timestamp: Date;
  error: string;
  duration: number;
  retries: number;
}

export interface TestPerformanceAnalysis {
  averageDuration: number;
  slowestTests: SlowTest[];
  timeouts: number;
  memoryUsage: MemoryUsage;
}

export interface SlowTest {
  name: string;
  file: string;
  duration: number;
  baseline: number;
  slowdownFactor: number;
}

export interface MemoryUsage {
  peak: number;
  average: number;
  leaks: MemoryLeak[];
}

export interface MemoryLeak {
  test: string;
  before: number;
  after: number;
  leaked: number;
}

export interface TestRecommendation {
  type: 'coverage' | 'performance' | 'flaky' | 'structure' | 'best-practice';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  estimatedImpact: string;
}

// Analysis request and response types
export interface AnalysisRequest {
  type: 'error' | 'visual' | 'test' | 'combined';
  input: AnalysisInput;
  options: AnalysisOptions;
}

export interface AnalysisInput {
  errorMessage?: string;
  filePath?: string;
  url?: string;
  testPath?: string;
  context?: Record<string, unknown>;
}

export interface AnalysisOptions {
  includeResearch?: boolean;
  includeFixes?: boolean;
  includeVisual?: boolean;
  confidenceThreshold?: number;
  maxSuggestions?: number;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: AnalysisError;
  metadata: AnalysisMetadata;
}

export interface AnalysisResult {
  error?: ErrorAnalysis;
  visual?: VisualAnalysis;
  test?: TestValidationResult;
  research?: ResearchResult[];
  fixes?: FixSuggestion[];
}

export interface AnalysisError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AnalysisMetadata {
  requestId: string;
  duration: number;
  aiProvider: string;
  cacheHit: boolean;
  timestamp: Date;
}
