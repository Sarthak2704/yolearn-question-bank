'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Layers,
  Settings2,
  CheckCircle2,
} from 'lucide-react';
import QuestionTypeSelector from '@/components/question-engine/QuestionTypeSelector';
import MCQEditor, { OptionItem } from '@/components/question-engine/editors/MCQEditor';
import NumericalEditor, { NumericalConfig } from '@/components/question-engine/editors/NumericalEditor';
import MatchingEditor, { MatchingListItem, MatchingPair } from '@/components/question-engine/editors/MatchingEditor';
import MatrixMatchEditor, { MatrixRowItem, MatrixColItem } from '@/components/question-engine/editors/MatrixMatchEditor';
import SubjectiveEditor, { RubricItem } from '@/components/question-engine/editors/SubjectiveEditor';
import FillBlankEditor, { BlankItem } from '@/components/question-engine/editors/FillBlankEditor';
import AssertionReasonEditor from '@/components/question-engine/editors/AssertionReasonEditor';
import OrderingEditor, { OrderItem } from '@/components/question-engine/editors/OrderingEditor';
import DiagramEditor, { HotspotLabel } from '@/components/question-engine/editors/DiagramEditor';
import TableEditor from '@/components/question-engine/editors/TableEditor';
import QuestionPreview from '@/components/question-engine/preview/QuestionPreview';
import {
  QuestionTypeCode,
  QUESTION_TYPE_REGISTRY,
  getTypeDefinition,
} from '@/lib/question-registry';

function QuestionEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');

  // Type selection state
  const [questionType, setQuestionType] = useState<QuestionTypeCode>('MCQ_SINGLE');
  const [selectedSubtype, setSelectedSubtype] = useState<string | undefined>('Standard 4-Choice');

  // Core metadata
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [cognitiveLevel, setCognitiveLevel] = useState('APPLY');
  const [questionNature, setQuestionNature] = useState('CONCEPTUAL');
  const [questionStyle, setQuestionStyle] = useState('DIRECT');
  const [positiveMarks, setPositiveMarks] = useState('4.0');
  const [negativeMarks, setNegativeMarks] = useState('-1.0');
  const [estimatedTimeSeconds, setEstimatedTimeSeconds] = useState('120');

  // Content
  const [statement, setStatement] = useState('');
  const [assertion, setAssertion] = useState('');
  const [reason, setReason] = useState('');
  const [assertionOption, setAssertionOption] = useState('opt_A');
  const [passageText, setPassageText] = useState('');

  // Options for MCQ / MSQ
  const [options, setOptions] = useState<OptionItem[]>([
    { id: 'opt_A', text: '\\frac{v_0}{2L}', isCorrect: true, explanation: 'Conserving angular momentum about pivot.' },
    { id: 'opt_B', text: '\\frac{3v_0}{4L}', isCorrect: false, explanation: 'Incorrect pivot moment of inertia.' },
    { id: 'opt_C', text: '\\frac{v_0}{L}', isCorrect: false, explanation: '' },
    { id: 'opt_D', text: '\\frac{2v_0}{3L}', isCorrect: false, explanation: '' },
  ]);

  // Numerical config
  const [numericalConfig, setNumericalConfig] = useState<NumericalConfig>({
    numericValue: '4',
    tolerance: '0.0',
    unit: '',
    answerType: 'INTEGER',
  });

  // Matching lists
  const [matchingListI, setMatchingListI] = useState<MatchingListItem[]>([
    { key: 'A', text: "Klinefelter's Syndrome" },
    { key: 'B', text: "Turner's Syndrome" },
    { key: 'C', text: "Down's Syndrome" },
  ]);
  const [matchingListII, setMatchingListII] = useState<MatchingListItem[]>([
    { key: '1', text: '47, XXY' },
    { key: '2', text: '45, XO' },
    { key: '3', text: 'Trisomy 21' },
  ]);
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([
    { from: 'A', to: '1' },
    { from: 'B', to: '2' },
    { from: 'C', to: '3' },
  ]);

  // Matrix Match
  const [matrixRows, setMatrixRows] = useState<MatrixRowItem[]>([
    { rowKey: 'A', label: 'Uniform Solid Sphere rolling without slipping' },
    { rowKey: 'B', label: 'Uniform Hollow Sphere rolling without slipping' },
    { rowKey: 'C', label: 'Uniform Disc rolling without slipping' },
    { rowKey: 'D', label: 'Thin Circular Ring rolling without slipping' },
  ]);
  const [matrixCols, setMatrixCols] = useState<MatrixColItem[]>([
    { colKey: 'p', label: 'Translational KE > Rotational KE' },
    { colKey: 'q', label: 'Translational KE = Rotational KE' },
    { colKey: 'r', label: 'Total KE = 7/10 M v^2' },
    { colKey: 's', label: 'Total KE = 3/4 M v^2' },
  ]);
  const [matrixMap, setMatrixMap] = useState<Record<string, string[]>>({
    A: ['p', 'r'],
    B: ['p'],
    C: ['p', 's'],
    D: ['q'],
  });

  // Subjective
  const [modelAnswer, setModelAnswer] = useState('');
  const [expectedKeywords, setExpectedKeywords] = useState<string[]>([
    'limiting molar conductivity',
    'degree of dissociation',
    'Kohlrausch law',
  ]);
  const [rubric, setRubric] = useState<RubricItem[]>([
    { criteria: "Accurate statement of Kohlrausch's law", marks: 1.5 },
    { criteria: 'Application with strong electrolytes (HCl, CH3COONa, NaCl)', marks: 1.5 },
    { criteria: 'Final mathematical formulation', marks: 1.0 },
  ]);

  // Blanks
  const [blanks, setBlanks] = useState<BlankItem[]>([
    { id: 'blank1', acceptedAnswers: ['mitochondria', 'mitochondrion'], caseSensitive: false },
    { id: 'blank2', acceptedAnswers: ['ATP', 'adenosine triphosphate'], caseSensitive: false },
  ]);

  // Ordering
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: 'step_1', text: 'Prophase I chromosomal condensation and synapsis' },
    { id: 'step_2', text: 'Metaphase I alignment at equatorial plate' },
    { id: 'step_3', text: 'Anaphase I homologous chromosome segregation' },
    { id: 'step_4', text: 'Telophase I nuclear membrane reformation' },
  ]);
  const [correctSequence, setCorrectSequence] = useState<string[]>(['step_1', 'step_2', 'step_3', 'step_4']);

  // Diagram / Labelling
  const [diagramUrl, setDiagramUrl] = useState(
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600'
  );
  const [diagramCaption, setDiagramCaption] = useState('Figure 1: Schematic optical setup');
  const [diagramHotspots, setDiagramHotspots] = useState<HotspotLabel[]>([
    { key: 'A', label: 'Collimator lens' },
    { key: 'B', label: 'Prism table' },
    { key: 'C', label: 'Telescope objective' },
  ]);

  // Table Data
  const [tableHeaders, setTableHeaders] = useState(['Experiment', 'Concentration [A] (M)', 'Initial Rate (M/s)']);
  const [tableRows, setTableRows] = useState([
    ['1', '0.10', '2.0 x 10^-3'],
    ['2', '0.20', '4.0 x 10^-3'],
    ['3', '0.40', '8.0 x 10^-3'],
  ]);

  // Solution
  const [stepByStepSolution, setStepByStepSolution] = useState(
    '1. Applying physical conservation laws from first principles.\n2. Substituting given boundary parameters.'
  );
  const [finalAnswerText, setFinalAnswerText] = useState('Option A is verified to be correct.');

  // Academic Mapping & Source
  const [taxonomyData, setTaxonomyData] = useState<any>({
    subjectId: '',
    subjectCode: 'PHY',
    chapterId: '',
    examId: '',
  });
  const [sourceData, setSourceData] = useState({
    sourceType: 'PYQ',
    sourceName: 'JEE Advanced 2024 Paper 1',
    examName: 'JEE Advanced',
    examYear: '2024',
    paperCode: 'Paper 1 (Code 4)',
  });

  const [taxonomies, setTaxonomies] = useState<any>({ subjects: [], chapters: [], exams: [] });
  const [saving, setSaving] = useState(false);
  const [autoTagging, setAutoTagging] = useState(false);

  useEffect(() => {
    fetch('/api/taxonomy')
      .then((res) => res.json())
      .then((d) => setTaxonomies(d))
      .catch(console.error);

    if (editId) {
      fetch(`/api/questions/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.question) {
            const q = data.question;
            setQuestionType(q.type as QuestionTypeCode);
            setDifficulty(q.difficulty);
            setPositiveMarks(String(q.positiveMarks));
            setNegativeMarks(String(q.negativeMarks));
            setStatement(q.statementText || '');

            try {
              const c = JSON.parse(q.contentJson || '{}');
              if (c.statement) setStatement(c.statement);
              if (c.assertion) setAssertion(c.assertion);
              if (c.reason) setReason(c.reason);
              if (c.passage) setPassageText(c.passage);
            } catch (e) {}

            try {
              if (q.optionsJson) setOptions(JSON.parse(q.optionsJson));
            } catch (e) {}
          }
        })
        .catch(console.error);
    }
  }, [editId]);

  const handleTypeSelect = (typeCode: QuestionTypeCode, subtype?: string) => {
    setQuestionType(typeCode);
    setSelectedSubtype(subtype);
    const def = getTypeDefinition(typeCode);
    setPositiveMarks(String(def.defaultPositiveMarks));
    setNegativeMarks(String(def.defaultNegativeMarks));
  };

  const handleAutoTag = async () => {
    if (!statement) return;
    setAutoTagging(true);
    try {
      const res = await fetch('/api/ai/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statementText: statement }),
      });
      const data = await res.json();
      if (data.suggestedDifficulty) setDifficulty(data.suggestedDifficulty.value);
      if (data.suggestedCognitiveLevel) setCognitiveLevel(data.suggestedCognitiveLevel.value);
      if (data.suggestedNature) setQuestionNature(data.suggestedNature.value);
      if (data.suggestedStyle) setQuestionStyle(data.suggestedStyle.value);

      if (data.suggestedSubject && taxonomies.subjects) {
        const matched = taxonomies.subjects.find((s: any) =>
          s.name.toLowerCase().includes(data.suggestedSubject.name.toLowerCase())
        );
        if (matched) {
          setTaxonomyData((prev: any) => ({
            ...prev,
            subjectId: matched.id,
            subjectCode: matched.code,
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAutoTagging(false);
    }
  };

  const constructCorrectAnswer = () => {
    if (questionType === 'MCQ_SINGLE' || questionType === 'TRUE_FALSE') {
      const correct = options.find((o) => o.isCorrect);
      return { correctOptionId: correct?.id || 'opt_A' };
    }
    if (questionType === 'MCQ_MULTIPLE') {
      const corrects = options.filter((o) => o.isCorrect).map((o) => o.id);
      return { correctOptions: corrects };
    }
    if (questionType === 'ASSERTION_REASON' || questionType === 'STATEMENT_BASED') {
      return { correctOptionId: assertionOption };
    }
    if (questionType.includes('NUMERICAL')) {
      return {
        numericValue: parseFloat(numericalConfig.numericValue) || 0,
        tolerance: parseFloat(numericalConfig.tolerance) || 0,
        acceptedMin: parseFloat(numericalConfig.acceptedMin || '0'),
        acceptedMax: parseFloat(numericalConfig.acceptedMax || '0'),
        unit: numericalConfig.unit,
      };
    }
    if (questionType === 'MATCH_THE_FOLLOWING') {
      return { correctPairs: matchingPairs };
    }
    if (questionType === 'MATRIX_MATCH') {
      return { matrixMap };
    }
    if (questionType === 'ORDERING' || questionType === 'CHRONOLOGICAL_ORDER') {
      return { correctSequence };
    }
    if (questionType.includes('FILL_BLANK')) {
      return { acceptedAnswers: blanks.flatMap((b) => b.acceptedAnswers) };
    }
    if (questionType.includes('ANSWER') || questionType === 'ESSAY') {
      return { modelAnswer, expectedKeywords };
    }
    return { correctOptionId: 'opt_A' };
  };

  const handleSaveQuestion = async (status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED') => {
    setSaving(true);
    try {
      const contentJson = {
        statement,
        assertion,
        reason,
        passage: passageText,
        options,
        matchingListI,
        matchingListII,
        matrixRows,
        matrixCols,
        blanks,
        orderItems,
        diagramUrl,
        diagramCaption,
        tableHeaders,
        tableRows,
        rubric,
      };

      const answerJson = constructCorrectAnswer();

      const payload = {
        type: questionType,
        subtype: selectedSubtype,
        difficulty,
        cognitiveLevel,
        questionNature,
        questionStyle,
        positiveMarks: parseFloat(positiveMarks),
        negativeMarks: parseFloat(negativeMarks),
        estimatedTimeSeconds: parseInt(estimatedTimeSeconds),
        verificationStatus: status,
        statementText: statement,
        contentJson: JSON.stringify(contentJson),
        optionsJson: JSON.stringify(options),
        answerJson: JSON.stringify(answerJson),
        solutionJson: JSON.stringify({
          stepByStep: stepByStepSolution,
          finalAnswer: finalAnswerText,
        }),
        sourceData,
        taxonomyData,
      };

      let res;
      if (editId) {
        res = await fetch(`/api/questions/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const d = await res.json();
      if (d.success) {
        router.push(editId ? `/questions/${editId}` : '/questions');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const previewData = {
    type: questionType,
    statement,
    assertion,
    reason,
    passage: passageText,
    options,
    correctAnswer: constructCorrectAnswer(),
    numericalConfig,
    matchingData: { listI: matchingListI, listII: matchingListII, pairs: matchingPairs },
    matrixData: { rows: matrixRows, cols: matrixCols, matrixMap },
    blanksData: blanks,
    orderingData: { items: orderItems, correctSequence },
    diagramData: { imageUrl: diagramUrl, caption: diagramCaption, hotspots: diagramHotspots },
    tableData: { headers: tableHeaders, rows: tableRows },
    rubricData: rubric,
    modelAnswer,
    stepByStepSolution,
    finalAnswer: finalAnswerText,
    positiveMarks: parseFloat(positiveMarks) || 4.0,
    negativeMarks: parseFloat(negativeMarks) || -1.0,
    sourceData,
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/questions"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>{editId ? 'Edit Educational Question' : 'Universal Question Creation Engine'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                {questionType}
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Configure dynamic response types, LaTeX formulas, scoring rubrics, and interactive live preview.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSaveQuestion('DRAFT')}
            disabled={saving}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSaveQuestion('PENDING_REVIEW')}
            disabled={saving}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Submit for Review'}</span>
          </button>
        </div>
      </div>

      {/* 1. Dynamic Question Type Selector Screen */}
      <QuestionTypeSelector
        selectedType={questionType}
        selectedSubtype={selectedSubtype}
        onSelect={handleTypeSelect}
      />

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dynamic Forms (Cols 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question Statement & Instructions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Question Statement & LaTeX Equations
              </span>
              <button
                type="button"
                onClick={handleAutoTag}
                disabled={autoTagging || !statement}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                title="AI auto-tags syllabus entities from statement"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{autoTagging ? 'Analyzing...' : 'AI Auto-Tag'}</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Statement text (Use <code className="text-indigo-600 font-mono">$...$</code> for inline equations, <code className="text-indigo-600 font-mono">$$...$$</code> for blocks)
              </label>
              <textarea
                rows={4}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Enter mathematical/scientific question statement..."
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* DYNAMIC TYPE-SPECIFIC EDITOR CONTAINER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            {/* Objective MCQ / MSQ / True False */}
            {questionType === 'MCQ_SINGLE' && (
              <MCQEditor options={options} onChange={setOptions} isMultipleCorrect={false} />
            )}
            {questionType === 'MCQ_MULTIPLE' && (
              <MCQEditor options={options} onChange={setOptions} isMultipleCorrect={true} />
            )}
            {questionType === 'TRUE_FALSE' && (
              <MCQEditor
                options={[
                  { id: 'opt_True', text: 'True', isCorrect: true },
                  { id: 'opt_False', text: 'False', isCorrect: false },
                ]}
                onChange={setOptions}
              />
            )}

            {/* Numerical Types */}
            {questionType.includes('NUMERICAL') && (
              <NumericalEditor config={numericalConfig} onChange={setNumericalConfig} />
            )}

            {/* Matching */}
            {questionType === 'MATCH_THE_FOLLOWING' && (
              <MatchingEditor
                listI={matchingListI}
                listII={matchingListII}
                pairs={matchingPairs}
                onChange={(l1, l2, p) => {
                  setMatchingListI(l1);
                  setMatchingListII(l2);
                  setMatchingPairs(p);
                }}
              />
            )}

            {/* Matrix Match */}
            {questionType === 'MATRIX_MATCH' && (
              <MatrixMatchEditor
                rows={matrixRows}
                cols={matrixCols}
                matrixMap={matrixMap}
                onChange={(r, c, m) => {
                  setMatrixRows(r);
                  setMatrixCols(c);
                  setMatrixMap(m);
                }}
              />
            )}

            {/* Subjective */}
            {(questionType.includes('ANSWER') || questionType === 'ESSAY') && (
              <SubjectiveEditor
                modelAnswer={modelAnswer}
                expectedKeywords={expectedKeywords}
                rubric={rubric}
                onChange={(m, k, r) => {
                  setModelAnswer(m);
                  setExpectedKeywords(k);
                  setRubric(r);
                }}
              />
            )}

            {/* Fill in the blanks */}
            {questionType.includes('FILL_BLANK') && (
              <FillBlankEditor blanks={blanks} onChange={setBlanks} />
            )}

            {/* Assertion & Reason */}
            {(questionType === 'ASSERTION_REASON' || questionType === 'STATEMENT_BASED') && (
              <AssertionReasonEditor
                assertion={assertion}
                reason={reason}
                selectedOption={assertionOption}
                onChange={(a, r, opt) => {
                  setAssertion(a);
                  setReason(r);
                  setAssertionOption(opt);
                }}
              />
            )}

            {/* Ordering & Chronology */}
            {(questionType === 'ORDERING' || questionType === 'CHRONOLOGICAL_ORDER') && (
              <OrderingEditor
                items={orderItems}
                correctSequence={correctSequence}
                onChange={(items, seq) => {
                  setOrderItems(items);
                  setCorrectSequence(seq);
                }}
              />
            )}

            {/* Visual Diagram / Labelling */}
            {(questionType.includes('DIAGRAM') ||
              questionType.includes('IMAGE') ||
              questionType === 'LABELLING') && (
              <DiagramEditor
                imageUrl={diagramUrl}
                caption={diagramCaption}
                hotspots={diagramHotspots}
                onChange={(url, cap, hot) => {
                  setDiagramUrl(url);
                  setDiagramCaption(cap);
                  setDiagramHotspots(hot);
                }}
              />
            )}

            {/* Table Based Data Interpretation */}
            {(questionType.includes('TABLE') || questionType === 'OBSERVATION_BASED') && (
              <TableEditor
                headers={tableHeaders}
                rows={tableRows}
                onChange={(h, r) => {
                  setTableHeaders(h);
                  setTableRows(r);
                }}
              />
            )}
          </div>

          {/* Academic Mapping & Marking Config */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              2. Academic Mapping & Scoring Rules
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Subject</label>
                <select
                  value={taxonomyData.subjectId}
                  onChange={(e) => {
                    const sel = taxonomies.subjects?.find((s: any) => s.id === e.target.value);
                    setTaxonomyData({
                      ...taxonomyData,
                      subjectId: e.target.value,
                      subjectCode: sel?.code || 'GEN',
                    });
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="">Select Subject</option>
                  {taxonomies.subjects?.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Chapter</label>
                <select
                  value={taxonomyData.chapterId}
                  onChange={(e) => setTaxonomyData({ ...taxonomyData, chapterId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="">Select Chapter</option>
                  {taxonomies.chapters?.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Positive Marks</label>
                <input
                  type="number"
                  value={positiveMarks}
                  onChange={(e) => setPositiveMarks(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Negative Penalty</label>
                <input
                  type="number"
                  value={negativeMarks}
                  onChange={(e) => setNegativeMarks(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Universal Live Preview (Cols 5) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20">
            <QuestionPreview data={previewData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuestionEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading editor...</div>}>
      <QuestionEditorContent />
    </Suspense>
  );
}
