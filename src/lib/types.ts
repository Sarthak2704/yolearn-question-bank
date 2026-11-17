export type VerificationStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'PENDING_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';

export type PublishingStatus = 'UNPUBLISHED' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

export type Difficulty = 'VERY_EASY' | 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD';

export type CognitiveLevel =
  | 'REMEMBER'
  | 'UNDERSTAND'
  | 'APPLY'
  | 'ANALYSE'
  | 'EVALUATE'
  | 'CREATE';

export type QuestionNature =
  | 'CONCEPTUAL'
  | 'NUMERICAL'
  | 'THEORETICAL'
  | 'LOGICAL'
  | 'APPLICATION_BASED'
  | 'CALCULATION_BASED';

export type QuestionStyle =
  | 'DIRECT'
  | 'TRICKY'
  | 'MULTI_CONCEPT'
  | 'NCERT_LINE_BASED'
  | 'HOTS'
  | 'FORMULA_BASED'
  | 'DIAGRAM_BASED';

export type QuestionType =
  // Objective
  | 'MCQ'
  | 'MSQ'
  | 'TRUE_FALSE'
  // Numerical
  | 'NUMERICAL'
  | 'INTEGER'
  | 'DECIMAL'
  | 'RANGE'
  // Matching
  | 'MATCH_THE_FOLLOWING'
  | 'MATRIX_MATCH'
  // Subjective
  | 'SUBJECTIVE'
  | 'VERY_SHORT'
  | 'SHORT'
  | 'LONG'
  | 'ESSAY'
  | 'ONE_WORD'
  // Reasoning
  | 'ASSERTION_REASON'
  | 'STATEMENT_BASED'
  | 'MULTIPLE_STATEMENT'
  // Sequencing
  | 'ARRANGE_IN_ORDER'
  | 'CHRONOLOGICAL'
  // Comprehension
  | 'PASSAGE_BASED'
  | 'CASE_BASED'
  // Visual
  | 'DIAGRAM_BASED'
  | 'GRAPH_BASED'
  | 'TABLE_BASED';

export interface QuestionOptionItem {
  id: string;
  text: string;
  isCorrect?: boolean;
  explanation?: string;
  mediaUrl?: string;
}

export interface MatchingPair {
  from: string;
  to: string;
}

export interface RubricItem {
  criteria: string;
  marks: number;
}

export interface QuestionContent {
  statement?: string;
  assertion?: string;
  reason?: string;
  passage?: string;
  instructions?: string;
  listI?: { key: string; text: string }[];
  listII?: { key: string; text: string }[];
  rubric?: RubricItem[];
  matrixRows?: { rowKey: string; label: string }[];
  matrixCols?: { colKey: string; label: string }[];
}

export interface QuestionAnswer {
  correctOptions?: string[];
  numericValue?: number;
  tolerance?: number;
  acceptedMin?: number;
  acceptedMax?: number;
  unit?: string;
  decimalPrecision?: number;
  correctPairs?: MatchingPair[];
  correctOptionId?: string;
  modelAnswer?: string;
  expectedKeywords?: string[];
  matrixMap?: Record<string, string[]>;
}

export interface QuestionSolution {
  stepByStep?: string;
  finalAnswer?: string;
  videoUrl?: string;
  keyFormulas?: string[];
}

export interface QuestionFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  segmentId?: string;
  boardId?: string;
  examId?: string;
  classId?: string;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  type?: string;
  difficulty?: string;
  cognitiveLevel?: string;
  verificationStatus?: string;
  sourceType?: string;
  tagId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
