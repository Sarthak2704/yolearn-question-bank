import { EvaluationMethod, getTypeDefinition } from './question-registry';

export interface EvaluationInput {
  questionType: string;
  studentResponse: any;
  correctAnswer: any;
  positiveMarks: number;
  negativeMarks: number;
  partialMarkingConfig?: {
    enabled: boolean;
    partialMarksPerCorrect?: number;
    incorrectPenalty?: number;
  };
}

export interface EvaluationResult {
  isCorrect: boolean;
  score: number;
  maxMarks: number;
  negativePenalty: number;
  isPartiallyCorrect?: boolean;
  breakdown: Record<string, any>;
  feedback: string;
}

export function evaluateStudentResponse(input: EvaluationInput): EvaluationResult {
  const { questionType, studentResponse, correctAnswer, positiveMarks, negativeMarks, partialMarkingConfig } = input;
  const typeDef = getTypeDefinition(questionType);
  const method = typeDef.evaluationMethod;

  // Unanswered check
  if (
    studentResponse === undefined ||
    studentResponse === null ||
    studentResponse === '' ||
    (Array.isArray(studentResponse) && studentResponse.length === 0) ||
    (typeof studentResponse === 'object' && Object.keys(studentResponse).length === 0)
  ) {
    return {
      isCorrect: false,
      score: 0,
      maxMarks: positiveMarks,
      negativePenalty: 0,
      breakdown: { status: 'UNANSWERED' },
      feedback: 'Question was left unattempted.',
    };
  }

  switch (method) {
    // 1. Single Choice (MCQ_SINGLE, TRUE_FALSE, ASSERTION_REASON, STATEMENT_BASED)
    case 'SINGLE_CHOICE': {
      const correctOption =
        correctAnswer?.correctOptionId ||
        (Array.isArray(correctAnswer?.correctOptions) ? correctAnswer.correctOptions[0] : correctAnswer);
      const isCorrect = String(studentResponse).trim().toLowerCase() === String(correctOption).trim().toLowerCase();

      return {
        isCorrect,
        score: isCorrect ? positiveMarks : -Math.abs(negativeMarks),
        maxMarks: positiveMarks,
        negativePenalty: isCorrect ? 0 : Math.abs(negativeMarks),
        breakdown: { studentSelected: studentResponse, expected: correctOption },
        feedback: isCorrect ? 'Correct answer!' : `Incorrect. Expected option: ${correctOption}`,
      };
    }

    // 2. Multiple Choice / MSQ (JEE Advanced Multi-Correct with partial scoring)
    case 'MULTIPLE_CHOICE': {
      const correctList: string[] = (correctAnswer?.correctOptions || []).map((s: any) => String(s).trim());
      const studentList: string[] = (Array.isArray(studentResponse) ? studentResponse : [studentResponse]).map((s: any) =>
        String(s).trim()
      );

      const correctSet = new Set(correctList);
      const studentSet = new Set(studentList);

      const chosenCorrect = studentList.filter((opt) => correctSet.has(opt));
      const chosenIncorrect = studentList.filter((opt) => !correctSet.has(opt));

      // Case A: Perfect match (all correct options chosen, no incorrect options)
      if (chosenIncorrect.length === 0 && chosenCorrect.length === correctSet.size) {
        return {
          isCorrect: true,
          score: positiveMarks,
          maxMarks: positiveMarks,
          negativePenalty: 0,
          isPartiallyCorrect: false,
          breakdown: { chosenCorrect, chosenIncorrect, rule: 'FULL_MARKS' },
          feedback: `Full marks awarded (+${positiveMarks}). All correct options selected.`,
        };
      }

      // Case B: Incorrect option selected -> Negative marking applies
      if (chosenIncorrect.length > 0) {
        const penalty = Math.abs(negativeMarks);
        return {
          isCorrect: false,
          score: -penalty,
          maxMarks: positiveMarks,
          negativePenalty: penalty,
          isPartiallyCorrect: false,
          breakdown: { chosenCorrect, chosenIncorrect, rule: 'PENALTY_INCORRECT_CHOSEN' },
          feedback: `Incorrect option (${chosenIncorrect.join(', ')}) chosen. Penalty of -${penalty} applied.`,
        };
      }

      // Case C: Only correct options selected, but not all of them -> Partial marking
      // JEE Advanced Partial Marking Scheme: +1 mark for each correct option marked, 0 incorrect
      const partialPoints = chosenCorrect.length * (partialMarkingConfig?.partialMarksPerCorrect || 1.0);
      const finalScore = Math.min(partialPoints, positiveMarks);

      return {
        isCorrect: false,
        isPartiallyCorrect: true,
        score: finalScore,
        maxMarks: positiveMarks,
        negativePenalty: 0,
        breakdown: { chosenCorrect, chosenIncorrect, rule: 'PARTIAL_CREDIT' },
        feedback: `Partial credit awarded: ${chosenCorrect.length} of ${correctSet.size} correct options selected (+${finalScore}).`,
      };
    }

    // 3. Numerical Match (Integer or Decimal with tolerance)
    case 'NUMERICAL_MATCH': {
      const studentNum = parseFloat(studentResponse);
      const correctNum = parseFloat(correctAnswer?.numericValue !== undefined ? correctAnswer.numericValue : correctAnswer);
      const tolerance = parseFloat(correctAnswer?.tolerance || 0.0);

      if (isNaN(studentNum)) {
        return {
          isCorrect: false,
          score: -Math.abs(negativeMarks),
          maxMarks: positiveMarks,
          negativePenalty: Math.abs(negativeMarks),
          breakdown: { error: 'INVALID_NUMBER' },
          feedback: 'Provided response is not a valid numerical value.',
        };
      }

      const diff = Math.abs(studentNum - correctNum);
      const isCorrect = diff <= tolerance + 0.000001;

      return {
        isCorrect,
        score: isCorrect ? positiveMarks : -Math.abs(negativeMarks),
        maxMarks: positiveMarks,
        negativePenalty: isCorrect ? 0 : Math.abs(negativeMarks),
        breakdown: { studentValue: studentNum, targetValue: correctNum, tolerance, diff },
        feedback: isCorrect
          ? `Accurate numerical answer (+${positiveMarks}).`
          : `Incorrect. Expected ${correctNum} (tolerance ±${tolerance}).`,
      };
    }

    // 4. Numerical Range [min, max]
    case 'NUMERICAL_RANGE': {
      const studentNum = parseFloat(studentResponse);
      const minVal = parseFloat(correctAnswer?.acceptedMin ?? correctAnswer?.min ?? 0);
      const maxVal = parseFloat(correctAnswer?.acceptedMax ?? correctAnswer?.max ?? 0);

      const isCorrect = !isNaN(studentNum) && studentNum >= minVal && studentNum <= maxVal;

      return {
        isCorrect,
        score: isCorrect ? positiveMarks : -Math.abs(negativeMarks),
        maxMarks: positiveMarks,
        negativePenalty: isCorrect ? 0 : Math.abs(negativeMarks),
        breakdown: { studentValue: studentNum, range: [minVal, maxVal] },
        feedback: isCorrect
          ? `Within acceptable interval [${minVal}, ${maxVal}].`
          : `Out of bounds. Expected value within [${minVal}, ${maxVal}].`,
      };
    }

    // 5. Unit-Aware Numerical
    case 'UNIT_AWARE_NUMERICAL': {
      const studentNum = parseFloat(studentResponse?.value ?? studentResponse);
      const studentUnit = String(studentResponse?.unit ?? '').trim().toLowerCase();
      const targetNum = parseFloat(correctAnswer?.numericValue ?? 0);
      const targetUnit = String(correctAnswer?.unit ?? '').trim().toLowerCase();
      const tolerance = parseFloat(correctAnswer?.tolerance ?? 0.0);

      const numCorrect = !isNaN(studentNum) && Math.abs(studentNum - targetNum) <= tolerance + 0.000001;
      const unitCorrect = studentUnit === targetUnit || (studentUnit === '' && targetUnit === '');

      const isCorrect = numCorrect && unitCorrect;
      return {
        isCorrect,
        score: isCorrect ? positiveMarks : -Math.abs(negativeMarks),
        maxMarks: positiveMarks,
        negativePenalty: isCorrect ? 0 : Math.abs(negativeMarks),
        breakdown: { studentNum, studentUnit, targetNum, targetUnit },
        feedback: isCorrect
          ? `Correct magnitude and unit (${studentNum} ${targetUnit}).`
          : `Mismatch. Expected ${targetNum} ${targetUnit}.`,
      };
    }

    // 6. Matching Pairs
    case 'MATCHING_PAIRS': {
      const expectedPairs: { from: string; to: string }[] = correctAnswer?.correctPairs || [];
      const studentPairs: { from: string; to: string }[] = studentResponse?.pairs || studentResponse || [];

      let matchedCount = 0;
      for (const ep of expectedPairs) {
        const found = studentPairs.some(
          (sp) => String(sp.from).trim() === String(ep.from).trim() && String(sp.to).trim() === String(ep.to).trim()
        );
        if (found) matchedCount++;
      }

      const isCorrect = matchedCount === expectedPairs.length && expectedPairs.length > 0;
      const score = isCorrect
        ? positiveMarks
        : matchedCount > 0
        ? parseFloat(((matchedCount / expectedPairs.length) * positiveMarks).toFixed(1))
        : -Math.abs(negativeMarks);

      return {
        isCorrect,
        isPartiallyCorrect: matchedCount > 0 && !isCorrect,
        score,
        maxMarks: positiveMarks,
        negativePenalty: matchedCount === 0 ? Math.abs(negativeMarks) : 0,
        breakdown: { matchedCount, totalPairs: expectedPairs.length },
        feedback: isCorrect
          ? 'All matching pairs correctly mapped!'
          : `Matched ${matchedCount} of ${expectedPairs.length} pairs.`,
      };
    }

    // 7. Matrix Match
    case 'MATRIX_MATCH': {
      const expectedMatrix: Record<string, string[]> = correctAnswer?.matrixMap || {};
      const studentMatrix: Record<string, string[]> = studentResponse?.matrixMap || studentResponse || {};

      let totalRows = Object.keys(expectedMatrix).length || 4;
      let correctRows = 0;

      for (const [rowKey, expCols] of Object.entries(expectedMatrix)) {
        const studCols = (studentMatrix[rowKey] || []).map((c) => String(c).trim());
        const expSet = new Set(expCols.map((c) => String(c).trim()));
        const studSet = new Set(studCols);

        if (expSet.size === studSet.size && [...expSet].every((c) => studSet.has(c))) {
          correctRows++;
        }
      }

      const isCorrect = correctRows === totalRows && totalRows > 0;
      const partialPerCol = positiveMarks / totalRows;
      const score = isCorrect ? positiveMarks : parseFloat((correctRows * partialPerCol).toFixed(1));

      return {
        isCorrect,
        isPartiallyCorrect: correctRows > 0 && !isCorrect,
        score,
        maxMarks: positiveMarks,
        negativePenalty: 0,
        breakdown: { correctRows, totalRows },
        feedback: isCorrect
          ? 'Matrix mapping 100% correct!'
          : `Correctly mapped ${correctRows} of ${totalRows} matrix rows (+${score} marks).`,
      };
    }

    // 8. Ordering / Sequence
    case 'ORDERING': {
      const expectedSeq: string[] = (correctAnswer?.correctSequence || []).map((s: any) => String(s).trim());
      const studentSeq: string[] = (Array.isArray(studentResponse) ? studentResponse : []).map((s: any) =>
        String(s).trim()
      );

      const isCorrect =
        expectedSeq.length > 0 &&
        expectedSeq.length === studentSeq.length &&
        expectedSeq.every((val, idx) => val === studentSeq[idx]);

      return {
        isCorrect,
        score: isCorrect ? positiveMarks : -Math.abs(negativeMarks),
        maxMarks: positiveMarks,
        negativePenalty: isCorrect ? 0 : Math.abs(negativeMarks),
        breakdown: { studentSequence: studentSeq, expectedSequence: expectedSeq },
        feedback: isCorrect ? 'Sequence order is completely correct!' : 'Incorrect sequential arrangement.',
      };
    }

    // 9. Exact Match / Fill in the Blanks
    case 'EXACT_MATCH': {
      const acceptedAnswers: string[] = (
        Array.isArray(correctAnswer?.acceptedAnswers)
          ? correctAnswer.acceptedAnswers
          : [correctAnswer?.text || correctAnswer]
      ).map((a: any) => String(a).trim().toLowerCase());

      const studentStr = String(studentResponse).trim().toLowerCase();
      const isCorrect = acceptedAnswers.some((ans) => ans === studentStr);

      return {
        isCorrect,
        score: isCorrect ? positiveMarks : -Math.abs(negativeMarks),
        maxMarks: positiveMarks,
        negativePenalty: isCorrect ? 0 : Math.abs(negativeMarks),
        breakdown: { studentInput: studentResponse, acceptedAnswers },
        feedback: isCorrect ? 'Exact text match verified!' : 'Incorrect entry.',
      };
    }

    // 10. Keyword & Rubric Based (Subjective)
    case 'RUBRIC_BASED':
    case 'KEYWORD_BASED':
    case 'MANUAL':
    default: {
      const keywords: string[] = (correctAnswer?.expectedKeywords || []).map((k: string) => k.toLowerCase());
      const studentText = String(studentResponse || '').toLowerCase();

      let matchedKeywords = 0;
      for (const kw of keywords) {
        if (studentText.includes(kw)) matchedKeywords++;
      }

      const keywordRatio = keywords.length > 0 ? matchedKeywords / keywords.length : 1.0;
      const score = parseFloat((keywordRatio * positiveMarks).toFixed(1));

      return {
        isCorrect: keywordRatio >= 0.8,
        isPartiallyCorrect: keywordRatio > 0 && keywordRatio < 0.8,
        score,
        maxMarks: positiveMarks,
        negativePenalty: 0,
        breakdown: { matchedKeywords, totalKeywords: keywords.length, keywordRatio },
        feedback: `Evaluated against academic keywords (${matchedKeywords}/${keywords.length} terms found). Assigned +${score} marks.`,
      };
    }
  }
}
