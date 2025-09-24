// Web research types
export interface ResearchResult {
  id: string;
  title: string;
  url: string;
  source: ResearchSource;
  relevance: number;
  confidence: number;
  summary: string;
  tags: string[];
  votes: number;
  answers: number;
  timestamp: Date;
  metadata: ResearchMetadata;
}

export enum ResearchSource {
  STACKOVERFLOW = 'stackoverflow',
  GITHUB = 'github',
  DOCUMENTATION = 'documentation',
  BLOG = 'blog',
  FORUM = 'forum'
}

export interface ResearchMetadata {
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  accepted?: boolean;
  views?: number;
  language?: string;
  framework?: string;
}

export interface ResearchQuery {
  query: string;
  sources: ResearchSource[];
  maxResults: number;
  confidenceThreshold: number;
  filters: ResearchFilters;
}

export interface ResearchFilters {
  language?: string;
  framework?: string;
  minVotes?: number;
  dateRange?: DateRange;
  tags?: string[];
  hasAcceptedAnswer?: boolean;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface ResearchRequest {
  query: ResearchQuery;
  context: ResearchContext;
  options: ResearchOptions;
}

export interface ResearchContext {
  errorMessage?: string;
  codeContext?: string;
  environment?: string;
  technologies?: string[];
}

export interface ResearchOptions {
  enableCaching?: boolean;
  enableRanking?: boolean;
  includeRelated?: boolean;
  timeout?: number;
}

export interface ResearchResponse {
  success: boolean;
  results: ResearchResult[];
  totalFound: number;
  cached: boolean;
  duration: number;
  query: ResearchQuery;
  metadata: {
    requestId: string;
    timestamp: Date;
    sources: ResearchSourceStats[];
  };
}

export interface ResearchSourceStats {
  source: ResearchSource;
  found: number;
  avgRelevance: number;
  avgConfidence: number;
}

// Fix suggestion types
export interface FixSuggestion {
  id: string;
  title: string;
  description: string;
  category: FixCategory;
  priority: FixPriority;
  confidence: number;
  steps: FixStep[];
  codeChanges: CodeChange[];
  risks: Risk[];
  estimatedTime: string;
  source: FixSource;
  metadata: FixMetadata;
}

export enum FixCategory {
  IMPORT_MISSING = 'import_missing',
  SYNTAX_ERROR = 'syntax_error',
  TYPE_ERROR = 'type_error',
  LOGIC_ERROR = 'logic_error',
  CONFIGURATION = 'configuration',
  DEPENDENCY = 'dependency',
  ENVIRONMENT = 'environment',
  PERFORMANCE = 'performance'
}

export enum FixPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface FixStep {
  order: number;
  title: string;
  description: string;
  command?: string;
  codeChange?: CodeChange;
  verification?: string;
}

export interface CodeChange {
  file: string;
  operation: 'create' | 'update' | 'delete' | 'rename';
  lineNumber?: number;
  columnNumber?: number;
  oldCode?: string;
  newCode: string;
  diff?: string;
}

export interface Risk {
  level: 'low' | 'medium' | 'high';
  description: string;
  mitigation?: string;
}

export enum FixSource {
  AI_ANALYSIS = 'ai_analysis',
  PATTERN_MATCHING = 'pattern_matching',
  COMMUNITY_SOLUTION = 'community_solution',
  DOCUMENTATION = 'documentation',
  BEST_PRACTICE = 'best_practice'
}

export interface FixMetadata {
  aiProvider?: string;
  patternId?: string;
  sourceUrl?: string;
  verified: boolean;
  popularity: number;
  lastUpdated: Date;
}

// Knowledge extraction types
export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  title: string;
  content: string;
  tags: string[];
  relevance: number;
  source: string;
  metadata: KnowledgeMetadata;
}

export enum KnowledgeType {
  ERROR_PATTERN = 'error_pattern',
  SOLUTION = 'solution',
  BEST_PRACTICE = 'best_practice',
  CODE_EXAMPLE = 'code_example',
  TROUBLESHOOTING = 'troubleshooting'
}

export interface KnowledgeMetadata {
  author?: string;
  votes?: number;
  views?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  lastVerified?: Date;
  frameworks?: string[];
  languages?: string[];
}

export interface KnowledgeBase {
  items: KnowledgeItem[];
  categories: KnowledgeCategory[];
  tags: TagStats[];
  lastUpdated: Date;
}

export interface KnowledgeCategory {
  name: string;
  count: number;
  subcategories: string[];
}

export interface TagStats {
  tag: string;
  count: number;
  trending: boolean;
}
