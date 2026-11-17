export type QuestionCategory =
  | 'OBJECTIVE'
  | 'NUMERICAL'
  | 'MATCHING'
  | 'SUBJECTIVE'
  | 'FILL_IN_THE_BLANKS'
  | 'REASONING'
  | 'ORDERING'
  | 'COMPREHENSION'
  | 'VISUAL'
  | 'DATA_INTERPRETATION'
  | 'LANGUAGE'
  | 'PRACTICAL';

export type QuestionTypeCode =
  // Objective
  | 'MCQ_SINGLE'
  | 'MCQ_MULTIPLE'
  | 'TRUE_FALSE'
  // Numerical
  | 'NUMERICAL_INTEGER'
  | 'NUMERICAL_DECIMAL'
  | 'NUMERICAL_RANGE'
  | 'NUMERICAL_WITH_UNIT'
  // Matching
  | 'MATCH_THE_FOLLOWING'
  | 'MATRIX_MATCH'
  // Subjective
  | 'VERY_SHORT_ANSWER'
  | 'SHORT_ANSWER'
  | 'LONG_ANSWER'
  | 'ESSAY'
  // Fill in the blanks
  | 'FILL_BLANK_SINGLE'
  | 'FILL_BLANK_MULTIPLE'
  | 'CLOZE_TEST'
  // Reasoning
  | 'ASSERTION_REASON'
  | 'STATEMENT_BASED'
  | 'MULTIPLE_STATEMENT'
  // Ordering
  | 'ORDERING'
  | 'CHRONOLOGICAL_ORDER'
  // Comprehension
  | 'PASSAGE_BASED'
  | 'CASE_BASED'
  | 'PARAGRAPH_BASED'
  // Visual
  | 'IMAGE_BASED'
  | 'DIAGRAM_BASED'
  | 'GRAPH_BASED'
  | 'MAP_BASED'
  // Data Interpretation
  | 'TABLE_BASED'
  | 'CHART_BASED'
  | 'GRAPH_INTERPRETATION'
  // Language
  | 'READING_COMPREHENSION'
  | 'GRAMMAR'
  | 'VOCABULARY'
  | 'SENTENCE_REARRANGEMENT'
  // Practical
  | 'EXPERIMENT_BASED'
  | 'OBSERVATION_BASED'
  | 'LABELLING';

export type EvaluationMethod =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'EXACT_MATCH'
  | 'NUMERICAL_MATCH'
  | 'NUMERICAL_RANGE'
  | 'UNIT_AWARE_NUMERICAL'
  | 'MATCHING_PAIRS'
  | 'MATRIX_MATCH'
  | 'ORDERING'
  | 'KEYWORD_BASED'
  | 'RUBRIC_BASED'
  | 'LABELLING_HOTSPOTS'
  | 'AI_ASSISTED'
  | 'MANUAL';

export interface QuestionTypeDefinition {
  code: QuestionTypeCode;
  name: string;
  category: QuestionCategory;
  description: string;
  defaultPositiveMarks: number;
  defaultNegativeMarks: number;
  evaluationMethod: EvaluationMethod;
  subtypes?: string[];
  features: {
    requiresOptions?: boolean;
    supportsPartialMarking?: boolean;
    supportsTolerance?: boolean;
    requiresUnits?: boolean;
    requiresRubric?: boolean;
    requiresDiagram?: boolean;
    requiresTable?: boolean;
    requiresParentPassage?: boolean;
    requiresBlanks?: boolean;
    requiresOrderSequence?: boolean;
    requiresMatrixGrid?: boolean;
  };
}

export const QUESTION_TYPE_REGISTRY: Record<QuestionTypeCode, QuestionTypeDefinition> = {
  // --- OBJECTIVE ---
  MCQ_SINGLE: {
    code: 'MCQ_SINGLE',
    name: 'Multiple Choice (Single Correct)',
    category: 'OBJECTIVE',
    description: 'Standard 4-option single correct answer choice with +4 / -1 marking scheme.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Standard 4-Choice', '5-Choice', 'Direct Question', 'Assertion Prompt'],
    features: { requiresOptions: true },
  },
  MCQ_MULTIPLE: {
    code: 'MCQ_MULTIPLE',
    name: 'Multiple Select (MSQ / Multi-Correct)',
    category: 'OBJECTIVE',
    description: 'One or more options correct with configurable partial marking rules (JEE Advanced standard).',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -2.0,
    evaluationMethod: 'MULTIPLE_CHOICE',
    subtypes: ['JEE Advanced Style (+4/+3/+2/+1/-2)', 'All-or-Nothing (+4/0)'],
    features: { requiresOptions: true, supportsPartialMarking: true },
  },
  TRUE_FALSE: {
    code: 'TRUE_FALSE',
    name: 'True / False',
    category: 'OBJECTIVE',
    description: 'Binary proposition evaluation statement.',
    defaultPositiveMarks: 2.0,
    defaultNegativeMarks: -0.5,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Standard True/False', 'Correct/Incorrect'],
    features: { requiresOptions: true },
  },

  // --- NUMERICAL ---
  NUMERICAL_INTEGER: {
    code: 'NUMERICAL_INTEGER',
    name: 'Numerical (Integer Type)',
    category: 'NUMERICAL',
    description: 'Single or double-digit non-negative integer response (JEE Advanced standard 0 to 99).',
    defaultPositiveMarks: 3.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'NUMERICAL_MATCH',
    subtypes: ['Single Digit (0-9)', 'Double Digit (00-99)', 'Signed Integer'],
    features: { supportsTolerance: false },
  },
  NUMERICAL_DECIMAL: {
    code: 'NUMERICAL_DECIMAL',
    name: 'Numerical (Decimal with Precision)',
    category: 'NUMERICAL',
    description: 'Real numerical value rounded to specified decimal places with tolerance window.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'NUMERICAL_MATCH',
    subtypes: ['2 Decimal Places', '3 Decimal Places', 'Exact Scientific'],
    features: { supportsTolerance: true },
  },
  NUMERICAL_RANGE: {
    code: 'NUMERICAL_RANGE',
    name: 'Numerical (Range-Based)',
    category: 'NUMERICAL',
    description: 'Acceptable valid numerical interval [min, max] for empirical/calculated problems.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'NUMERICAL_RANGE',
    subtypes: ['Closed Interval [a,b]', 'Percentage Variance'],
    features: { supportsTolerance: true },
  },
  NUMERICAL_WITH_UNIT: {
    code: 'NUMERICAL_WITH_UNIT',
    name: 'Numerical (With Unit Aware)',
    category: 'NUMERICAL',
    description: 'Numerical magnitude coupled with standard physical unit (e.g. J, m/s, kg).',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'UNIT_AWARE_NUMERICAL',
    subtypes: ['SI Unit Required', 'Standard Metric'],
    features: { supportsTolerance: true, requiresUnits: true },
  },

  // --- MATCHING ---
  MATCH_THE_FOLLOWING: {
    code: 'MATCH_THE_FOLLOWING',
    name: 'Match the Following (Column Pairs)',
    category: 'MATCHING',
    description: 'List I paired with List II elements with composite code options or direct 1-to-1 links.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'MATCHING_PAIRS',
    subtypes: ['4x4 Grid', '3x4 Uneven Grid', 'Multiple Correlation'],
    features: { supportsPartialMarking: true },
  },
  MATRIX_MATCH: {
    code: 'MATRIX_MATCH',
    name: 'Matrix Match (Rows to Multi-Column)',
    category: 'MATCHING',
    description: 'Rows (A, B, C, D) mapped to multiple column keys (p, q, r, s, t) with partial scoring.',
    defaultPositiveMarks: 8.0,
    defaultNegativeMarks: -2.0,
    evaluationMethod: 'MATRIX_MATCH',
    subtypes: ['JEE Advanced 4x5 Matrix', 'Partial Credit Per Row (+2/-0.5)'],
    features: { requiresMatrixGrid: true, supportsPartialMarking: true },
  },

  // --- SUBJECTIVE ---
  VERY_SHORT_ANSWER: {
    code: 'VERY_SHORT_ANSWER',
    name: 'Very Short Answer (VSA)',
    category: 'SUBJECTIVE',
    description: 'One sentence or 15-20 words conceptual answer.',
    defaultPositiveMarks: 1.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'KEYWORD_BASED',
    subtypes: ['1 Mark Definition', 'Name the Following', 'Formula State'],
    features: { requiresRubric: false },
  },
  SHORT_ANSWER: {
    code: 'SHORT_ANSWER',
    name: 'Short Answer (SA)',
    category: 'SUBJECTIVE',
    description: '30-50 words response with key concepts and intermediate reasoning.',
    defaultPositiveMarks: 3.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'RUBRIC_BASED',
    subtypes: ['2-Step Derivation', 'Reasoning Explain', 'Difference Distinguish'],
    features: { requiresRubric: true },
  },
  LONG_ANSWER: {
    code: 'LONG_ANSWER',
    name: 'Long Answer (LA)',
    category: 'SUBJECTIVE',
    description: 'Multi-step derivation, proof, or problem solution with 4-part marking rubric.',
    defaultPositiveMarks: 5.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'RUBRIC_BASED',
    subtypes: ['5 Mark CBSE Derivation', 'Proof and Application', 'Analytical Synthesis'],
    features: { requiresRubric: true },
  },
  ESSAY: {
    code: 'ESSAY',
    name: 'Essay Type',
    category: 'SUBJECTIVE',
    description: 'Comprehensive descriptive response evaluated across structure, clarity, and depth.',
    defaultPositiveMarks: 10.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'MANUAL',
    subtypes: ['Case Critique', 'Elaborate Perspective'],
    features: { requiresRubric: true },
  },

  // --- FILL IN THE BLANKS ---
  FILL_BLANK_SINGLE: {
    code: 'FILL_BLANK_SINGLE',
    name: 'Fill in the Blank (Single)',
    category: 'FILL_IN_THE_BLANKS',
    description: 'Sentence with a single embedded inline blank with accepted alternative answers.',
    defaultPositiveMarks: 2.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'EXACT_MATCH',
    subtypes: ['Exact String', 'Case-Insensitive', 'Numeric Blank'],
    features: { requiresBlanks: true },
  },
  FILL_BLANK_MULTIPLE: {
    code: 'FILL_BLANK_MULTIPLE',
    name: 'Fill in the Blanks (Multiple)',
    category: 'FILL_IN_THE_BLANKS',
    description: 'Sentence or paragraph with multiple numbered blanks [blank1], [blank2].',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'EXACT_MATCH',
    subtypes: ['Ordered Blanks', 'Word Bank Assisted'],
    features: { requiresBlanks: true, supportsPartialMarking: true },
  },
  CLOZE_TEST: {
    code: 'CLOZE_TEST',
    name: 'Cloze Test / Missing Words Passage',
    category: 'FILL_IN_THE_BLANKS',
    description: 'Full paragraph with systematically removed words tested for vocabulary and grammar.',
    defaultPositiveMarks: 5.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'EXACT_MATCH',
    subtypes: ['English Grammar Cloze', 'Scientific Terms Cloze'],
    features: { requiresBlanks: true, requiresParentPassage: true },
  },

  // --- REASONING ---
  ASSERTION_REASON: {
    code: 'ASSERTION_REASON',
    name: 'Assertion and Reason',
    category: 'REASONING',
    description: 'Assertion (A) and Reason (R) statements with 4 causal truth choices.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Standard AIIMS/NEET format', 'CBSE Class 10/12 Board format'],
    features: { requiresOptions: true },
  },
  STATEMENT_BASED: {
    code: 'STATEMENT_BASED',
    name: 'Statement Based (Statement I & II)',
    category: 'REASONING',
    description: 'Evaluate veracity of Statement I and Statement II independently.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['NTA NEET/JEE Format'],
    features: { requiresOptions: true },
  },
  MULTIPLE_STATEMENT: {
    code: 'MULTIPLE_STATEMENT',
    name: 'Multiple Statements (I, II, III, IV)',
    category: 'REASONING',
    description: 'Identify which combination of statements (e.g. only I and III) are correct.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['UPSC / Competitive Format', 'NCERT Exemplar Style'],
    features: { requiresOptions: true },
  },

  // --- ORDERING ---
  ORDERING: {
    code: 'ORDERING',
    name: 'Arrange in Correct Sequence',
    category: 'ORDERING',
    description: 'Unordered steps or scientific stages arranged in accurate sequential order.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'ORDERING',
    subtypes: ['Process Stages', 'Algorithm Steps', 'Magnitude Order (Increasing/Decreasing)'],
    features: { requiresOrderSequence: true },
  },
  CHRONOLOGICAL_ORDER: {
    code: 'CHRONOLOGICAL_ORDER',
    name: 'Chronological Historical Order',
    category: 'ORDERING',
    description: 'Historical events, discoveries, or timeline occurrences ordered from earliest to latest.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'ORDERING',
    subtypes: ['Indian History Timeline', 'Scientific Discoveries Timeline'],
    features: { requiresOrderSequence: true },
  },

  // --- COMPREHENSION ---
  PASSAGE_BASED: {
    code: 'PASSAGE_BASED',
    name: 'Passage / Comprehension',
    category: 'COMPREHENSION',
    description: 'Parent reading passage linked to 2–5 independent child questions.',
    defaultPositiveMarks: 3.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Scientific Paper Excerpt', 'Literary Reading', 'JEE Comprehension'],
    features: { requiresParentPassage: true },
  },
  CASE_BASED: {
    code: 'CASE_BASED',
    name: 'Case-Based Study',
    category: 'COMPREHENSION',
    description: 'Real-world practical scenario with context, dataset, and sub-questions (CBSE Board 2024/25).',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['CBSE Class 12 Science Case', 'CBSE Class 10 Math Case Study'],
    features: { requiresParentPassage: true },
  },
  PARAGRAPH_BASED: {
    code: 'PARAGRAPH_BASED',
    name: 'Paragraph Based',
    category: 'COMPREHENSION',
    description: 'Brief paragraph followed by analytical interpretation questions.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Analytical Excerpt'],
    features: { requiresParentPassage: true },
  },

  // --- VISUAL ---
  IMAGE_BASED: {
    code: 'IMAGE_BASED',
    name: 'Image Based Question',
    category: 'VISUAL',
    description: 'High-resolution photograph, specimen image, or astronomical visual.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Biology Specimen', 'Micrograph Analysis'],
    features: { requiresDiagram: true, requiresOptions: true },
  },
  DIAGRAM_BASED: {
    code: 'DIAGRAM_BASED',
    name: 'Diagram / Circuit / Ray Schematic',
    category: 'VISUAL',
    description: 'Circuit diagrams, ray optics setups, anatomy illustrations with labeled parts.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Electric Circuit', 'Optics Ray Diagram', 'Anatomy Diagram'],
    features: { requiresDiagram: true },
  },
  GRAPH_BASED: {
    code: 'GRAPH_BASED',
    name: 'Graph Analysis (x-y Curve)',
    category: 'VISUAL',
    description: 'Kinematics $(v-t)$, thermodynamics $(P-V)$, or calculus function curve analysis.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Kinematics v-t', 'Thermodynamic P-V', 'Chemical Kinetics Rate Curve'],
    features: { requiresDiagram: true },
  },
  MAP_BASED: {
    code: 'MAP_BASED',
    name: 'Map Pointing & Geographic Visual',
    category: 'VISUAL',
    description: 'Geographical, geological, or historical territory map with flagged locations.',
    defaultPositiveMarks: 3.0,
    defaultNegativeMarks: 0.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['CBSE Social Science Map', 'Geology Contour Map'],
    features: { requiresDiagram: true },
  },

  // --- DATA INTERPRETATION ---
  TABLE_BASED: {
    code: 'TABLE_BASED',
    name: 'Table Based / Data Grid',
    category: 'DATA_INTERPRETATION',
    description: 'Structured tabular data grid with empirical experimental readings.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Experimental Readings Table', 'Statistical Frequency Table'],
    features: { requiresTable: true },
  },
  CHART_BASED: {
    code: 'CHART_BASED',
    name: 'Chart Based (Bar / Pie / Histogram)',
    category: 'DATA_INTERPRETATION',
    description: 'Bar charts, pie slices, or demographic charts requiring percentage/ratio computation.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Bar Chart', 'Pie Chart', 'Histogram Distribution'],
    features: { requiresDiagram: true },
  },
  GRAPH_INTERPRETATION: {
    code: 'GRAPH_INTERPRETATION',
    name: 'Graph Interpretation (Multi-Plot)',
    category: 'DATA_INTERPRETATION',
    description: 'Comparative slope, area under the curve, or intersection analysis.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Area Under Curve', 'Tangent Slope Analysis'],
    features: { requiresDiagram: true },
  },

  // --- LANGUAGE ---
  READING_COMPREHENSION: {
    code: 'READING_COMPREHENSION',
    name: 'Reading Comprehension (English / Hindi)',
    category: 'LANGUAGE',
    description: 'Prose or poetry passage with inference, theme, and author intent questions.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Factual Passage', 'Discursive Passage', 'Literary Poem'],
    features: { requiresParentPassage: true },
  },
  GRAMMAR: {
    code: 'GRAMMAR',
    name: 'Grammar / Error Spotting',
    category: 'LANGUAGE',
    description: 'Identify grammatical error, voice transformation, or reported speech.',
    defaultPositiveMarks: 2.0,
    defaultNegativeMarks: -0.5,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Error Correction', 'Direct/Indirect Speech', 'Active/Passive Voice'],
    features: { requiresOptions: true },
  },
  VOCABULARY: {
    code: 'VOCABULARY',
    name: 'Vocabulary (Synonyms / Antonyms)',
    category: 'LANGUAGE',
    description: 'Contextual synonym, antonym, idiom, or one-word substitution.',
    defaultPositiveMarks: 2.0,
    defaultNegativeMarks: -0.5,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Synonym', 'Antonym', 'Idiom Meaning'],
    features: { requiresOptions: true },
  },
  SENTENCE_REARRANGEMENT: {
    code: 'SENTENCE_REARRANGEMENT',
    name: 'Sentence Rearrangement (Para-Jumble)',
    category: 'LANGUAGE',
    description: 'Jumbled sentence fragments (P, Q, R, S) rearranged into coherent syntax.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'ORDERING',
    subtypes: ['Para-Jumbles P-Q-R-S', 'Word Order Syntax'],
    features: { requiresOrderSequence: true },
  },

  // --- PRACTICAL ---
  EXPERIMENT_BASED: {
    code: 'EXPERIMENT_BASED',
    name: 'Experiment & Lab Setup',
    category: 'PRACTICAL',
    description: 'Laboratory apparatus, vernier caliper/screw gauge, titration, or titration curve.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Physics Lab Experiment', 'Chemistry Titration', 'Biology Staining'],
    features: { requiresDiagram: true },
  },
  OBSERVATION_BASED: {
    code: 'OBSERVATION_BASED',
    name: 'Observation & Inference',
    category: 'PRACTICAL',
    description: 'Experimental observation table leading to deduction of physical constant or salt analysis.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'SINGLE_CHOICE',
    subtypes: ['Salt Analysis Flame/Precipitate', 'Ohm\'s Law V-I Readings'],
    features: { requiresTable: true },
  },
  LABELLING: {
    code: 'LABELLING',
    name: 'Diagram Labelling / Hotspot Identification',
    category: 'PRACTICAL',
    description: 'Identify anatomical structures or apparatus parts marked A, B, C, D on a diagram.',
    defaultPositiveMarks: 4.0,
    defaultNegativeMarks: -1.0,
    evaluationMethod: 'LABELLING_HOTSPOTS',
    subtypes: ['Human Eye / Ear', 'Plant Cell Organelles', 'Blast Furnace Parts'],
    features: { requiresDiagram: true },
  },
};

export const QUESTION_CATEGORIES: { category: QuestionCategory; name: string; count: number }[] = [
  { category: 'OBJECTIVE', name: 'Objective Choice', count: 3 },
  { category: 'NUMERICAL', name: 'Numerical & Quantitative', count: 4 },
  { category: 'MATCHING', name: 'Matching & Correlation', count: 2 },
  { category: 'SUBJECTIVE', name: 'Subjective & Descriptive', count: 4 },
  { category: 'FILL_IN_THE_BLANKS', name: 'Fill in the Blanks & Cloze', count: 3 },
  { category: 'REASONING', name: 'Reasoning & Inference', count: 3 },
  { category: 'ORDERING', name: 'Sequencing & Chronology', count: 2 },
  { category: 'COMPREHENSION', name: 'Comprehension & Case Studies', count: 3 },
  { category: 'VISUAL', name: 'Visual & Diagram Based', count: 4 },
  { category: 'DATA_INTERPRETATION', name: 'Data Interpretation', count: 3 },
  { category: 'LANGUAGE', name: 'Language & Grammar', count: 4 },
  { category: 'PRACTICAL', name: 'Practical & Lab Skills', count: 3 },
];

export function getTypesByCategory(category: QuestionCategory): QuestionTypeDefinition[] {
  return Object.values(QUESTION_TYPE_REGISTRY).filter((t) => t.category === category);
}

export function getTypeDefinition(type: string): QuestionTypeDefinition {
  const norm = type.toUpperCase().replace(/\s+/g, '_');
  return (
    QUESTION_TYPE_REGISTRY[norm as QuestionTypeCode] ||
    QUESTION_TYPE_REGISTRY['MCQ_SINGLE']
  );
}
