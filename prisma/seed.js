const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding YoLearn Question Bank database...');

  // Reset existing records to allow idempotent re-seeding
  await prisma.yoShortReview.deleteMany();
  await prisma.yoShortBookMapping.deleteMany();
  await prisma.yoShort.deleteMany();
  await prisma.questionBookMapping.deleteMany();
  await prisma.bookPage.deleteMany();
  await prisma.bookTopic.deleteMany();
  await prisma.bookChapter.deleteMany();
  await prisma.book.deleteMany();
  await prisma.questionReview.deleteMany();
  await prisma.questionVersion.deleteMany();
  await prisma.questionDuplicate.deleteMany();
  await prisma.questionTaxonomyMapping.deleteMany();
  await prisma.questionTagMapping.deleteMany();
  await prisma.questionImportItem.deleteMany();
  await prisma.questionImportJob.deleteMany();
  await prisma.question.deleteMany();

  // 1. Users
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@yolearn.ai' },
    update: {},
    create: {
      name: 'Aditya Narayan',
      email: 'admin@yolearn.ai',
      role: 'SUPER_ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const qbManager = await prisma.user.upsert({
    where: { email: 'manager@yolearn.ai' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'manager@yolearn.ai',
      role: 'QB_MANAGER',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  const contentManager = await prisma.user.upsert({
    where: { email: 'content@yolearn.ai' },
    update: {},
    create: {
      name: 'Vikram Mehta',
      email: 'content@yolearn.ai',
      role: 'CONTENT_MANAGER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const smePhysics = await prisma.user.upsert({
    where: { email: 'sme.physics@yolearn.ai' },
    update: {},
    create: {
      name: 'Dr. Rajesh Verma',
      email: 'sme.physics@yolearn.ai',
      role: 'SME',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  // 2. Education Segments
  const segK12 = await prisma.educationSegment.upsert({
    where: { code: 'K12' },
    update: {},
    create: {
      name: 'K-12 Schooling',
      code: 'K12',
      description: 'Classes 1 through 12 across National and State Boards',
      sortOrder: 1,
    },
  });

  const segCompetitive = await prisma.educationSegment.upsert({
    where: { code: 'COMPETITIVE' },
    update: {},
    create: {
      name: 'Competitive Exams',
      code: 'COMPETITIVE',
      description: 'National Level Engineering, Medical and Aptitude Entrances',
      sortOrder: 2,
    },
  });

  // 3. Boards & Exams
  const boardCbse = await prisma.board.upsert({
    where: { code: 'CBSE' },
    update: {},
    create: {
      educationSegmentId: segK12.id,
      name: 'Central Board of Secondary Education (CBSE)',
      code: 'CBSE',
    },
  });

  const boardIcse = await prisma.board.upsert({
    where: { code: 'ICSE' },
    update: {},
    create: {
      educationSegmentId: segK12.id,
      name: 'Council for the Indian School Certificate Examinations (CISCE / ICSE)',
      code: 'ICSE',
    },
  });

  const examJeeMain = await prisma.exam.upsert({
    where: { code: 'JEE_MAIN' },
    update: {},
    create: {
      educationSegmentId: segCompetitive.id,
      name: 'JEE Main (NTA)',
      code: 'JEE_MAIN',
    },
  });

  const examJeeAdv = await prisma.exam.upsert({
    where: { code: 'JEE_ADV' },
    update: {},
    create: {
      educationSegmentId: segCompetitive.id,
      name: 'JEE Advanced (IITs)',
      code: 'JEE_ADV',
    },
  });

  const examNeet = await prisma.exam.upsert({
    where: { code: 'NEET' },
    update: {},
    create: {
      educationSegmentId: segCompetitive.id,
      name: 'NEET-UG (Medical)',
      code: 'NEET',
    },
  });

  const examCuet = await prisma.exam.upsert({
    where: { code: 'CUET' },
    update: {},
    create: {
      educationSegmentId: segCompetitive.id,
      name: 'CUET-UG (Central Universities)',
      code: 'CUET',
    },
  });

  // 4. Academic Classes
  const class10 = await prisma.academicClass.upsert({
    where: { code: 'CLASS_10' },
    update: {},
    create: { name: 'Class 10', code: 'CLASS_10', sortOrder: 10 },
  });

  const class11 = await prisma.academicClass.upsert({
    where: { code: 'CLASS_11' },
    update: {},
    create: { name: 'Class 11', code: 'CLASS_11', sortOrder: 11 },
  });

  const class12 = await prisma.academicClass.upsert({
    where: { code: 'CLASS_12' },
    update: {},
    create: { name: 'Class 12', code: 'CLASS_12', sortOrder: 12 },
  });

  // 5. Subjects
  const subPhysics = await prisma.subject.upsert({
    where: { code: 'PHY' },
    update: {},
    create: { name: 'Physics', code: 'PHY', icon: 'Atom' },
  });

  const subChemistry = await prisma.subject.upsert({
    where: { code: 'CHEM' },
    update: {},
    create: { name: 'Chemistry', code: 'CHEM', icon: 'FlaskConical' },
  });

  const subMaths = await prisma.subject.upsert({
    where: { code: 'MATH' },
    update: {},
    create: { name: 'Mathematics', code: 'MATH', icon: 'Calculator' },
  });

  const subBiology = await prisma.subject.upsert({
    where: { code: 'BIO' },
    update: {},
    create: { name: 'Biology', code: 'BIO', icon: 'Dna' },
  });

  // 6. Chapters, Topics, Subtopics, Concepts
  // Physics: Rotational Motion
  let chapRotation = await prisma.chapter.findFirst({ where: { name: 'Rotational Motion' } });
  if (!chapRotation) {
    chapRotation = await prisma.chapter.create({
      data: {
        subjectId: subPhysics.id,
        classId: class11.id,
        name: 'Rotational Motion',
        chapterNumber: 7,
      },
    });
  }

  let topicInertia = await prisma.topic.findFirst({ where: { name: 'Moment of Inertia', chapterId: chapRotation.id } });
  if (!topicInertia) {
    topicInertia = await prisma.topic.create({
      data: {
        chapterId: chapRotation.id,
        name: 'Moment of Inertia',
        sortOrder: 1,
      },
    });
  }

  let subtopicParallel = await prisma.subtopic.findFirst({ where: { name: 'Parallel Axis Theorem', topicId: topicInertia.id } });
  if (!subtopicParallel) {
    subtopicParallel = await prisma.subtopic.create({
      data: {
        topicId: topicInertia.id,
        name: 'Parallel Axis Theorem',
        sortOrder: 1,
      },
    });
  }

  let conceptParallel = await prisma.concept.findFirst({ where: { name: 'Application of Parallel Axes Theorem to Rigid Bodies', subtopicId: subtopicParallel.id } });
  if (!conceptParallel) {
    conceptParallel = await prisma.concept.create({
      data: {
        subtopicId: subtopicParallel.id,
        name: 'Application of Parallel Axes Theorem to Rigid Bodies',
        code: 'PHY-ROT-001',
      },
    });
  }

  // Chemistry: Electrochemistry
  let chapElectro = await prisma.chapter.findFirst({ where: { name: 'Electrochemistry' } });
  if (!chapElectro) {
    chapElectro = await prisma.chapter.create({
      data: {
        subjectId: subChemistry.id,
        classId: class12.id,
        name: 'Electrochemistry',
        chapterNumber: 3,
      },
    });
  }

  let topicNernst = await prisma.topic.findFirst({ where: { name: 'Nernst Equation and EMF', chapterId: chapElectro.id } });
  if (!topicNernst) {
    topicNernst = await prisma.topic.create({
      data: {
        chapterId: chapElectro.id,
        name: 'Nernst Equation and EMF',
        sortOrder: 1,
      },
    });
  }

  // Maths: Calculus - Definite Integrals
  let chapCalculus = await prisma.chapter.findFirst({ where: { name: 'Definite Integrals' } });
  if (!chapCalculus) {
    chapCalculus = await prisma.chapter.create({
      data: {
        subjectId: subMaths.id,
        classId: class12.id,
        name: 'Definite Integrals',
        chapterNumber: 7,
      },
    });
  }

  let topicKing = await prisma.topic.findFirst({ where: { name: 'Properties of Definite Integrals', chapterId: chapCalculus.id } });
  if (!topicKing) {
    topicKing = await prisma.topic.create({
      data: {
        chapterId: chapCalculus.id,
        name: 'Properties of Definite Integrals',
        sortOrder: 1,
      },
    });
  }

  // Biology: Genetics & Evolution
  let chapGenetics = await prisma.chapter.findFirst({ where: { name: 'Principles of Inheritance and Variation' } });
  if (!chapGenetics) {
    chapGenetics = await prisma.chapter.create({
      data: {
        subjectId: subBiology.id,
        classId: class12.id,
        name: 'Principles of Inheritance and Variation',
        chapterNumber: 5,
      },
    });
  }

  // Chemistry: Class 10 Chemical Reactions & Equations
  let chapReactions = await prisma.chapter.findFirst({ where: { name: 'Chemical Reactions and Equations' } });
  if (!chapReactions) {
    chapReactions = await prisma.chapter.create({
      data: {
        subjectId: subChemistry.id,
        classId: class10.id,
        name: 'Chemical Reactions and Equations',
        chapterNumber: 1,
      },
    });
  }

  let topicChemicalReactions = await prisma.topic.findFirst({ where: { name: 'Types of Chemical Reactions', chapterId: chapReactions.id } });
  if (!topicChemicalReactions) {
    topicChemicalReactions = await prisma.topic.create({
      data: {
        chapterId: chapReactions.id,
        name: 'Types of Chemical Reactions',
        sortOrder: 1,
      },
    });
  }

  // Chemistry: Class 12 Chemical Kinetics
  let chapKinetics = await prisma.chapter.findFirst({ where: { name: 'Chemical Kinetics' } });
  if (!chapKinetics) {
    chapKinetics = await prisma.chapter.create({
      data: {
        subjectId: subChemistry.id,
        classId: class12.id,
        name: 'Chemical Kinetics',
        chapterNumber: 4,
      },
    });
  }

  let topicKinetics = await prisma.topic.findFirst({ where: { name: 'Order and Molecularity of Reaction', chapterId: chapKinetics.id } });
  if (!topicKinetics) {
    topicKinetics = await prisma.topic.create({
      data: {
        chapterId: chapKinetics.id,
        name: 'Order and Molecularity of Reaction',
        sortOrder: 1,
      },
    });
  }

  // 7. Custom Tags
  const tagFrequentlyAsked = await prisma.questionTag.upsert({
    where: { slug: 'frequently-asked' },
    update: {},
    create: { name: 'Frequently Asked', slug: 'frequently-asked', color: '#ef4444' },
  });

  const tagHighWeightage = await prisma.questionTag.upsert({
    where: { slug: 'high-weightage' },
    update: {},
    create: { name: 'High Weightage', slug: 'high-weightage', color: '#f59e0b' },
  });

  const tagJeeAdv = await prisma.questionTag.upsert({
    where: { slug: 'jee-advanced-level' },
    update: {},
    create: { name: 'JEE Advanced Level', slug: 'jee-advanced-level', color: '#8b5cf6' },
  });

  const tagNcert = await prisma.questionTag.upsert({
    where: { slug: 'ncert-based' },
    update: {},
    create: { name: 'NCERT Based', slug: 'ncert-based', color: '#10b981' },
  });

  const tagHots = await prisma.questionTag.upsert({
    where: { slug: 'hots' },
    update: {},
    create: { name: 'HOTS', slug: 'hots', color: '#3b82f6' },
  });

  // 8. Sources
  const sourceJeeAdv2024 = await prisma.questionSource.create({
    data: {
      sourceType: 'PYQ',
      sourceName: 'JEE Advanced 2024 Paper 1',
      examName: 'JEE Advanced',
      examYear: 2024,
      examDate: '2024-05-26',
      shift: 'Morning (09:00 - 12:00)',
      paperCode: 'Paper 1 (Code 4)',
      questionNumber: 'Q.14',
      copyrightInfo: 'National Level Public Examination Question',
    },
  });

  const sourceNeet2023 = await prisma.questionSource.create({
    data: {
      sourceType: 'PYQ',
      sourceName: 'NEET-UG 2023 National Paper',
      examName: 'NEET',
      examYear: 2023,
      examDate: '2023-05-07',
      paperCode: 'Code F3',
      questionNumber: 'Q.108',
      copyrightInfo: 'NTA Public Examination Question',
    },
  });

  const sourceCbse12Maths = await prisma.questionSource.create({
    data: {
      sourceType: 'NCERT',
      sourceName: 'NCERT Exemplar Class 12 Mathematics',
      bookName: 'NCERT Exemplar Problems - Mathematics',
      author: 'NCERT Editorial Board',
      publisher: 'NCERT',
      examYear: 2024,
      pageNumber: '142',
      copyrightInfo: 'Educational Fair Use',
    },
  });

  // 9. Question Groups (Passage / Case Study)
  const groupPassage = await prisma.questionGroup.create({
    data: {
      title: 'Comprehension: Photoelectric Effect and Stopping Potential',
      groupType: 'PASSAGE',
      instruction: 'Read the following paragraph carefully and answer the questions that follow:',
      sharedPassage: 'When electromagnetic radiation of frequency $\\nu$ greater than the threshold frequency $\\nu_0$ falls on a clean photosensitive surface, electrons are emitted instantaneously. According to Einstein\'s photoelectric equation:\n\n$$K_{max} = h\\nu - \\phi = eV_0$$\n\nwhere $\\phi = h\\nu_0$ is the work function of the metal and $V_0$ is the stopping potential. If the intensity of incident radiation is doubled while keeping its frequency constant, the saturation photocurrent doubles but the maximum kinetic energy and stopping potential remain strictly unchanged.',
    },
  });

  // 10. Sample Questions
  // Q1: MCQ Physics JEE Advanced
  const q1 = await prisma.question.create({
    data: {
      code: 'QB-PHY-000001',
      type: 'MCQ',
      difficulty: 'HARD',
      cognitiveLevel: 'APPLY',
      questionNature: 'CALCULATION_BASED',
      questionStyle: 'MULTI_CONCEPT',
      positiveMarks: 4.0,
      negativeMarks: -1.0,
      estimatedTimeSeconds: 180,
      language: 'English',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      contentJson: JSON.stringify({
        statement: 'A uniform thin rod of mass $M$ and length $L$ is pivoted at one of its ends and hangs vertically. A small particle of mass $m = \\frac{M}{3}$ moving horizontally with velocity $v_0$ strikes the lower end of the rod and sticks to it. The angular velocity of the system immediately after the collision is given by:',
      }),
      statementText: 'A uniform thin rod of mass M and length L is pivoted at one of its ends and hangs vertically. A small particle of mass m = M/3 moving horizontally with velocity v0 strikes the lower end of the rod and sticks to it. The angular velocity of the system immediately after the collision is given by:',
      optionsJson: JSON.stringify([
        { id: 'opt_A', text: '$\\omega = \\frac{v_0}{2L}$', isCorrect: true, explanation: 'Conserving angular momentum about the pivot point.' },
        { id: 'opt_B', text: '$\\omega = \\frac{3v_0}{4L}$', isCorrect: false },
        { id: 'opt_C', text: '$\\omega = \\frac{v_0}{L}$', isCorrect: false },
        { id: 'opt_D', text: '$\\omega = \\frac{2v_0}{3L}$', isCorrect: false },
      ]),
      answerJson: JSON.stringify({ correctOptions: ['opt_A'] }),
      solutionJson: JSON.stringify({
        stepByStep: '1. Net external torque about the pivot $O$ during collision is zero, so angular momentum $L_O$ is conserved.\n2. Initial angular momentum: $L_i = m v_0 L = \\left(\\frac{M}{3}\\right) v_0 L$.\n3. Moment of inertia of rod about pivot: $I_{rod} = \\frac{1}{3} M L^2$.\n4. Moment of inertia of particle about pivot: $I_{particle} = m L^2 = \\frac{M}{3} L^2$.\n5. Total moment of inertia $I_{total} = \\frac{1}{3} M L^2 + \\frac{1}{3} M L^2 = \\frac{2}{3} M L^2$.\n6. By conservation of angular momentum: $L_i = I_{total} \\omega \\implies \\frac{M}{3} v_0 L = \\frac{2}{3} M L^2 \\omega \\implies \\omega = \\frac{v_0}{2L}$.',
        finalAnswer: 'Option A is correct: $\\omega = \\frac{v_0}{2L}$',
      }),
      sourceId: sourceJeeAdv2024.id,
      createdById: contentManager.id,
    },
  });

  // Mappings for Q1
  await prisma.questionTaxonomyMapping.create({
    data: {
      questionId: q1.id,
      educationSegmentId: segCompetitive.id,
      examId: examJeeAdv.id,
      classId: class11.id,
      subjectId: subPhysics.id,
      chapterId: chapRotation.id,
      topicId: topicInertia.id,
      subtopicId: subtopicParallel.id,
      conceptId: conceptParallel.id,
      isPrimary: true,
    },
  });

  await prisma.questionTagMapping.create({ data: { questionId: q1.id, tagId: tagFrequentlyAsked.id } });
  await prisma.questionTagMapping.create({ data: { questionId: q1.id, tagId: tagJeeAdv.id } });

  await prisma.questionReview.create({
    data: {
      questionId: q1.id,
      reviewerName: smePhysics.name,
      reviewerRole: 'SME',
      action: 'APPROVE',
      comment: 'Rigorous calculation verified. LaTeX formulas formatted cleanly. Ready for publishing.',
      checklistJson: JSON.stringify({ statementVerified: true, answerVerified: true, solutionVerified: true, latexVerified: true }),
    },
  });

  // Q2: MSQ Chemistry JEE Advanced
  const q2 = await prisma.question.create({
    data: {
      code: 'QB-CHM-000002',
      type: 'MSQ',
      difficulty: 'HARD',
      cognitiveLevel: 'ANALYSE',
      questionNature: 'CONCEPTUAL',
      questionStyle: 'MULTI_CONCEPT',
      positiveMarks: 4.0,
      negativeMarks: -2.0,
      estimatedTimeSeconds: 150,
      language: 'English',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      contentJson: JSON.stringify({
        statement: 'For a galvanic cell undergoing the reaction: $\\text{Zn}(s) + \\text{Cu}^{2+}(aq) \\rightleftharpoons \\text{Zn}^{2+}(aq) + \\text{Cu}(s)$ with $E^\\circ_{\\text{cell}} = 1.10\\text{ V}$ at $298\\text{ K}$, which of the following statements is/are **CORRECT**?',
      }),
      statementText: 'For a galvanic cell undergoing the reaction: Zn(s) + Cu2+(aq) <=> Zn2+(aq) + Cu(s) with E°cell = 1.10 V at 298 K, which of the following statements is/are CORRECT?',
      optionsJson: JSON.stringify([
        { id: 'opt_A', text: 'Equilibrium constant $K$ is related to standard cell potential by $\\ln K = \\frac{nFE^\\circ}{RT}$.', isCorrect: true },
        { id: 'opt_B', text: 'If the concentration of $\\text{Zn}^{2+}$ is increased tenfold, $E_{\\text{cell}}$ decreases by approximately $0.0295\\text{ V}$.', isCorrect: true },
        { id: 'opt_C', text: 'At equilibrium, cell potential $E_{\\text{cell}} = 0\\text{ V}$ and $\\Delta G = 0$.', isCorrect: true },
        { id: 'opt_D', text: 'Standard Gibbs free energy change $\\Delta G^\\circ$ for the cell reaction is positive.', isCorrect: false, explanation: 'Since $E^\\circ > 0$, $\\Delta G^\\circ = -nFE^\\circ < 0$.' },
      ]),
      answerJson: JSON.stringify({ correctOptions: ['opt_A', 'opt_B', 'opt_C'] }),
      solutionJson: JSON.stringify({
        stepByStep: '1. Standard Nernst relationship at equilibrium gives $\\Delta G^\\circ = -RT \\ln K = -nFE^\\circ \\implies \\ln K = \\frac{nFE^\\circ}{RT}$. Statement A is correct.\n2. Nernst equation: $E_{\\text{cell}} = E^\\circ - \\frac{0.0591}{2} \\log \\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}$. Increasing $[\\text{Zn}^{2+}]$ by 10 increases the log term by 1, decreasing potential by $\\frac{0.0591}{2} \\approx 0.0295\\text{ V}$. Statement B is correct.\n3. At electrochemical equilibrium, no current flows, so $E_{\\text{cell}} = 0$ and $\\Delta G = 0$. Statement C is correct.\n4. $\\Delta G^\\circ = -nFE^\\circ = -2 \\times 96500 \\times 1.10 < 0$ (negative, spontaneous). Statement D is incorrect.',
        finalAnswer: 'Options A, B, and C are correct.',
      }),
      sourceId: sourceJeeAdv2024.id,
      createdById: contentManager.id,
    },
  });

  await prisma.questionTaxonomyMapping.create({
    data: {
      questionId: q2.id,
      educationSegmentId: segCompetitive.id,
      examId: examJeeAdv.id,
      classId: class12.id,
      subjectId: subChemistry.id,
      chapterId: chapElectro.id,
      topicId: topicNernst.id,
      isPrimary: true,
    },
  });

  // Q3: Numerical Question (Integer/Decimal)
  const q3 = await prisma.question.create({
    data: {
      code: 'QB-MTH-000003',
      type: 'NUMERICAL',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'APPLY',
      questionNature: 'CALCULATION_BASED',
      questionStyle: 'FORMULA_BASED',
      positiveMarks: 4.0,
      negativeMarks: 0.0,
      estimatedTimeSeconds: 150,
      language: 'English',
      verificationStatus: 'PENDING_REVIEW',
      publishingStatus: 'UNPUBLISHED',
      contentJson: JSON.stringify({
        statement: 'Evaluate the definite integral:\n\n$$I = \\int_{0}^{\\frac{\\pi}{2}} \\frac{\\sin^3 x}{\\sin^3 x + \\cos^3 x} dx$$\n\nIf the value of $I$ is $\\frac{\\pi}{k}$, find the positive integer value of $k$.',
      }),
      statementText: 'Evaluate the definite integral I = integral_0^(pi/2) (sin^3 x)/(sin^3 x + cos^3 x) dx. If the value of I is pi/k, find the positive integer value of k.',
      answerJson: JSON.stringify({
        numericValue: 4,
        tolerance: 0.0,
        acceptedMin: 4,
        acceptedMax: 4,
        answerType: 'INTEGER',
      }),
      solutionJson: JSON.stringify({
        stepByStep: '1. Let $I = \\int_0^{\\pi/2} \\frac{\\sin^3 x}{\\sin^3 x + \\cos^3 x} dx$.\n2. Using king property $\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx$:\n   $I = \\int_0^{\\pi/2} \\frac{\\sin^3(\\pi/2 - x)}{\\sin^3(\\pi/2 - x) + \\cos^3(\\pi/2 - x)} dx = \\int_0^{\\pi/2} \\frac{\\cos^3 x}{\\cos^3 x + \\sin^3 x} dx$.\n3. Adding both equations:\n   $2I = \\int_0^{\\pi/2} \\frac{\\sin^3 x + \\cos^3 x}{\\sin^3 x + \\cos^3 x} dx = \\int_0^{\\pi/2} 1 dx = \\frac{\\pi}{2}$.\n4. Therefore $I = \\frac{\\pi}{4}$. Comparing with $\\frac{\\pi}{k}$, we get $k = 4$.',
        finalAnswer: 'k = 4',
      }),
      sourceId: sourceCbse12Maths.id,
      createdById: contentManager.id,
    },
  });

  await prisma.questionTaxonomyMapping.create({
    data: {
      questionId: q3.id,
      educationSegmentId: segK12.id,
      boardId: boardCbse.id,
      classId: class12.id,
      subjectId: subMaths.id,
      chapterId: chapCalculus.id,
      topicId: topicKing.id,
      isPrimary: true,
    },
  });

  // Q4: Match the Following Question
  const q4 = await prisma.question.create({
    data: {
      code: 'QB-BIO-000004',
      type: 'MATCH_THE_FOLLOWING',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'UNDERSTAND',
      questionNature: 'THEORETICAL',
      questionStyle: 'NCERT_LINE_BASED',
      positiveMarks: 4.0,
      negativeMarks: -1.0,
      estimatedTimeSeconds: 90,
      language: 'English',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      contentJson: JSON.stringify({
        statement: 'Match the genetic disorders listed in **List I** with their characteristic karyotype or defect in **List II**:',
        listI: [
          { key: 'A', text: "Klinefelter's Syndrome" },
          { key: 'B', text: "Turner's Syndrome" },
          { key: 'C', text: "Down's Syndrome" },
          { key: 'D', text: "Sickle Cell Anaemia" },
        ],
        listII: [
          { key: '1', text: 'Trisomy of chromosome 21' },
          { key: '2', text: '47, XXY' },
          { key: '3', text: '45, XO' },
          { key: '4', text: 'Glutamic acid replaced by Valine at 6th position of beta-globin' },
        ],
      }),
      statementText: "Match the genetic disorders in List I with their defect in List II: Klinefelter's, Turner's, Down's, Sickle Cell Anaemia",
      optionsJson: JSON.stringify([
        { id: 'opt_A', text: 'A-2, B-3, C-1, D-4', isCorrect: true },
        { id: 'opt_B', text: 'A-3, B-2, C-1, D-4', isCorrect: false },
        { id: 'opt_C', text: 'A-2, B-1, C-3, D-4', isCorrect: false },
        { id: 'opt_D', text: 'A-1, B-3, C-2, D-4', isCorrect: false },
      ]),
      answerJson: JSON.stringify({
        correctPairs: [
          { from: 'A', to: '2' },
          { from: 'B', to: '3' },
          { from: 'C', to: '1' },
          { from: 'D', to: '4' },
        ],
        correctOptionId: 'opt_A',
      }),
      solutionJson: JSON.stringify({
        stepByStep: "- Klinefelter's Syndrome is caused by the presence of an extra X chromosome resulting in 47, XXY.\n- Turner's Syndrome is due to the absence of one X chromosome resulting in 45, XO.\n- Down's Syndrome is caused by trisomy of chromosome 21 (47, +21).\n- Sickle Cell Anaemia results from the substitution of Glutamic acid by Valine at the 6th position of beta-globin chain.",
        finalAnswer: 'A-2, B-3, C-1, D-4 (Option A)',
      }),
      sourceId: sourceNeet2023.id,
      createdById: contentManager.id,
    },
  });

  await prisma.questionTaxonomyMapping.create({
    data: {
      questionId: q4.id,
      educationSegmentId: segCompetitive.id,
      examId: examNeet.id,
      classId: class12.id,
      subjectId: subBiology.id,
      chapterId: chapGenetics.id,
      isPrimary: true,
    },
  });

  // Q5: Assertion and Reason Question
  const q5 = await prisma.question.create({
    data: {
      code: 'QB-PHY-000005',
      type: 'ASSERTION_REASON',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'UNDERSTAND',
      questionNature: 'LOGICAL',
      questionStyle: 'TRICKY',
      positiveMarks: 4.0,
      negativeMarks: -1.0,
      estimatedTimeSeconds: 100,
      language: 'English',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      contentJson: JSON.stringify({
        assertion: 'The center of mass of a body may lie at a point where there is no actual matter present.',
        reason: 'The center of mass depends on the spatial distribution of mass rather than the physical presence of substance at that geometric coordinate.',
      }),
      statementText: 'Assertion: The center of mass of a body may lie at a point where there is no actual matter present. Reason: The center of mass depends on the spatial distribution of mass rather than the physical presence of substance at that geometric coordinate.',
      optionsJson: JSON.stringify([
        { id: 'opt_A', text: 'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.', isCorrect: true },
        { id: 'opt_B', text: 'Both Assertion and Reason are true but Reason is NOT the correct explanation of Assertion.', isCorrect: false },
        { id: 'opt_C', text: 'Assertion is true but Reason is false.', isCorrect: false },
        { id: 'opt_D', text: 'Assertion is false but Reason is true.', isCorrect: false },
      ]),
      answerJson: JSON.stringify({ correctOptions: ['opt_A'] }),
      solutionJson: JSON.stringify({
        stepByStep: '1. In bodies such as a uniform hollow sphere, ring, or torus, the center of mass lies at the geometric center where no matter exists.\n2. The center of mass is mathematically defined as $\\vec{R}_{cm} = \\frac{\\sum m_i \\vec{r}_i}{M}$, which depends purely on mass distribution and not on having matter at $\\vec{R}_{cm}$.\n3. Both are true and Reason directly explains Assertion.',
        finalAnswer: 'Both Assertion and Reason are true and Reason explains Assertion (Option A).',
      }),
      sourceId: sourceJeeAdv2024.id,
      createdById: contentManager.id,
    },
  });

  await prisma.questionTaxonomyMapping.create({
    data: {
      questionId: q5.id,
      educationSegmentId: segCompetitive.id,
      examId: examJeeMain.id,
      classId: class11.id,
      subjectId: subPhysics.id,
      chapterId: chapRotation.id,
      isPrimary: true,
    },
  });

  // Q6: Passage child question linked to groupPassage
  const q6 = await prisma.question.create({
    data: {
      code: 'QB-PHY-000006',
      type: 'PASSAGE_BASED',
      difficulty: 'EASY',
      cognitiveLevel: 'UNDERSTAND',
      questionNature: 'CONCEPTUAL',
      questionStyle: 'DIRECT',
      positiveMarks: 3.0,
      negativeMarks: -1.0,
      estimatedTimeSeconds: 60,
      language: 'English',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      parentGroupId: groupPassage.id,
      contentJson: JSON.stringify({
        statement: 'Based on the passage above, if the frequency of incident radiation is doubled (with frequency still remaining above $\\nu_0$), the stopping potential $V_0$ will:',
      }),
      statementText: 'Based on the passage above, if the frequency of incident radiation is doubled (with frequency still remaining above nu_0), the stopping potential V0 will:',
      optionsJson: JSON.stringify([
        { id: 'opt_A', text: 'Remain unchanged', isCorrect: false },
        { id: 'opt_B', text: 'Become exactly double', isCorrect: false },
        { id: 'opt_C', text: 'Become more than double', isCorrect: true },
        { id: 'opt_D', text: 'Become less than half', isCorrect: false },
      ]),
      answerJson: JSON.stringify({ correctOptions: ['opt_C'] }),
      solutionJson: JSON.stringify({
        stepByStep: '1. Initial stopping potential: $e V_0 = h\\nu - \\phi \\implies V_0 = \\frac{h\\nu}{e} - \\frac{\\phi}{e}$.\n2. When frequency is doubled to $2\\nu$:\n   $e V_0\' = 2h\\nu - \\phi = 2(h\\nu - \\phi) + \\phi = 2eV_0 + \\phi$.\n3. Since work function $\\phi > 0$, $V_0\' = 2V_0 + \\frac{\\phi}{e} > 2V_0$.\n4. Thus, the new stopping potential becomes more than double.',
        finalAnswer: 'Becomes more than double (Option C).',
      }),
      sourceId: sourceJeeAdv2024.id,
      createdById: contentManager.id,
    },
  });

  // Q7: Subjective Question with Rubric
  const q7 = await prisma.question.create({
    data: {
      code: 'QB-CHM-000007',
      type: 'LONG_ANSWER',
      subtype: 'LONG_ANSWER',
      difficulty: 'HARD',
      cognitiveLevel: 'CREATE',
      questionNature: 'THEORETICAL',
      questionStyle: 'NCERT_LINE_BASED',
      positiveMarks: 5.0,
      negativeMarks: 0.0,
      estimatedTimeSeconds: 300,
      language: 'English',
      verificationStatus: 'PENDING_REVIEW',
      publishingStatus: 'UNPUBLISHED',
      contentJson: JSON.stringify({
        statement: 'State Kohlrausch’s law of independent migration of ions. How does this law help in the determination of limiting molar conductivity ($\\Lambda_m^\\circ$) for a weak electrolyte such as acetic acid ($\\text{CH}_3\\text{COOH}$)? Give the complete mathematical formulation and steps.',
        rubric: [
          { criteria: "Accurate statement of Kohlrausch's law", marks: 1.5 },
          { criteria: 'Explanation of why direct extrapolation fails for weak electrolytes', marks: 1.0 },
          { criteria: 'Application with strong electrolytes (HCl, CH3COONa, NaCl)', marks: 1.5 },
          { criteria: 'Final mathematical equation and cancellation of spectator ions', marks: 1.0 },
        ],
      }),
      statementText: "State Kohlrausch's law of independent migration of ions. How does this law help determine limiting molar conductivity of weak electrolytes like CH3COOH?",
      answerJson: JSON.stringify({
        modelAnswer: 'Kohlrausch’s law states that the limiting molar conductivity of an electrolyte can be represented as the sum of the individual contributions of the anion and cation of the electrolyte:\n\n$$\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ$$\n\nFor weak electrolyte $\\text{CH}_3\\text{COOH}$, degree of dissociation is very low at high concentration and extrapolation of $\\Lambda_m$ vs $\\sqrt{c}$ to zero concentration is not feasible. We can use strong electrolytes $\\text{CH}_3\\text{COONa}$, $\\text{HCl}$, and $\\text{NaCl}$:\n\n$$\\Lambda_m^\\circ(\\text{CH}_3\\text{COOH}) = \\Lambda_m^\\circ(\\text{CH}_3\\text{COONa}) + \\Lambda_m^\\circ(\\text{HCl}) - \\Lambda_m^\\circ(\\text{NaCl})$$',
      }),
      solutionJson: JSON.stringify({
        stepByStep: 'Full model answer provided in rubric specification.',
        finalAnswer: 'Complete theoretical proof and formulation.',
      }),
      sourceId: sourceCbse12Maths.id,
      createdById: contentManager.id,
    },
  });

  // Q9: Matrix Match (JEE Advanced Physics/Chemistry)
  const q9 = await prisma.question.create({
    data: {
      code: 'QB-PHY-000009',
      type: 'MATRIX_MATCH',
      difficulty: 'HARD',
      cognitiveLevel: 'ANALYSE',
      questionNature: 'CONCEPTUAL',
      questionStyle: 'MULTI_CONCEPT',
      positiveMarks: 8.0,
      negativeMarks: -2.0,
      estimatedTimeSeconds: 240,
      language: 'English',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      contentJson: JSON.stringify({
        statement: 'A body of mass $M$ and radius $R$ rolls without slipping on a horizontal rough surface with velocity of center of mass $v$. Match the rolling body in **Column I** with its mechanical energy properties in **Column II**:',
        matrixRows: [
          { rowKey: 'A', label: 'Uniform Solid Sphere' },
          { rowKey: 'B', label: 'Uniform Hollow Sphere' },
          { rowKey: 'C', label: 'Uniform Disc' },
          { rowKey: 'D', label: 'Thin Circular Ring' },
        ],
        matrixCols: [
          { colKey: 'p', label: 'Translational KE > Rotational KE' },
          { colKey: 'q', label: 'Translational KE = Rotational KE' },
          { colKey: 'r', label: 'Total KE = (7/10) M v^2' },
          { colKey: 's', label: 'Total KE = (3/4) M v^2' },
        ],
      }),
      statementText: 'A body of mass M and radius R rolls without slipping on a horizontal rough surface. Match the rolling bodies in Column I (Solid Sphere, Hollow Sphere, Disc, Ring) with their energy relationships in Column II.',
      answerJson: JSON.stringify({
        matrixMap: {
          A: ['p', 'r'],
          B: ['p'],
          C: ['p', 's'],
          D: ['q'],
        },
      }),
      solutionJson: JSON.stringify({
        stepByStep: '1. Solid Sphere: $I = \\frac{2}{5}MR^2$, $K_{rot} = \\frac{1}{5}Mv^2 < K_{trans} = \\frac{1}{2}Mv^2$, $K_{total} = \\frac{7}{10}Mv^2$ (matches p, r).\n2. Hollow Sphere: $I = \\frac{2}{3}MR^2$, $K_{rot} = \\frac{1}{3}Mv^2 < K_{trans}$ (matches p).\n3. Disc: $I = \\frac{1}{2}MR^2$, $K_{total} = \\frac{3}{4}Mv^2$ (matches p, s).\n4. Ring: $I = MR^2$, $K_{rot} = K_{trans} = \\frac{1}{2}Mv^2$ (matches q).',
        finalAnswer: 'A -> p, r; B -> p; C -> p, s; D -> q',
      }),
      sourceId: sourceJeeAdv2024.id,
      createdById: contentManager.id,
    },
  });

  // Q10: Fill in the Blanks (Biology Genetics)
  const q10 = await prisma.question.create({
    data: {
      code: 'QB-BIO-000010',
      type: 'FILL_BLANK_SINGLE',
      difficulty: 'EASY',
      cognitiveLevel: 'REMEMBER',
      questionNature: 'THEORETICAL',
      questionStyle: 'NCERT_LINE_BASED',
      positiveMarks: 2.0,
      negativeMarks: 0.0,
      estimatedTimeSeconds: 45,
      language: 'English',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      contentJson: JSON.stringify({
        statement: 'In human genetic inheritance, the sex-linked recessive disorder where blood fails to coagulate normally due to deficiency of clotting factors is known as [blank1].',
        blanks: [{ id: 'blank1', acceptedAnswers: ['haemophilia', 'hemophilia'], caseSensitive: false }],
      }),
      statementText: 'In human genetic inheritance, the sex-linked recessive disorder where blood fails to coagulate normally due to deficiency of clotting factors is known as [blank1].',
      answerJson: JSON.stringify({
        acceptedAnswers: ['haemophilia', 'hemophilia'],
      }),
      solutionJson: JSON.stringify({
        stepByStep: 'Haemophilia is a sex-linked recessive disease showing transmission from unaffected carrier female to some of the male progeny.',
        finalAnswer: 'haemophilia',
      }),
      sourceId: sourceNeet2023.id,
      createdById: contentManager.id,
    },
  });

  // Q11: Ordering / Sequence (Biology Meiosis I Stages)
  const q11 = await prisma.question.create({
    data: {
      code: 'QB-BIO-000011',
      type: 'ORDERING',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'UNDERSTAND',
      questionNature: 'THEORETICAL',
      questionStyle: 'NCERT_LINE_BASED',
      positiveMarks: 4.0,
      negativeMarks: -1.0,
      estimatedTimeSeconds: 75,
      language: 'English',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      contentJson: JSON.stringify({
        statement: 'Arrange the following chronological sub-stages of Prophase-I of Meiosis in their correct natural sequence of occurrence:',
        orderItems: [
          { id: 'sub_1', text: 'Pachytene (Crossing over between non-sister chromatids)' },
          { id: 'sub_2', text: 'Leptotene (Chromatin begins condensing into visible threads)' },
          { id: 'sub_3', text: 'Diakinesis (Terminalisation of chiasmata)' },
          { id: 'sub_4', text: 'Zygotene (Synapsis and formation of synaptonemal complex)' },
          { id: 'sub_5', text: 'Diplotene (Dissolution of synaptonemal complex and chiasmata appearance)' },
        ],
      }),
      statementText: 'Arrange the following chronological sub-stages of Prophase-I of Meiosis in their correct sequence: Pachytene, Leptotene, Diakinesis, Zygotene, Diplotene.',
      answerJson: JSON.stringify({
        correctSequence: ['sub_2', 'sub_4', 'sub_1', 'sub_5', 'sub_3'],
      }),
      solutionJson: JSON.stringify({
        stepByStep: 'Correct NCERT order of Prophase I: Leptotene -> Zygotene -> Pachytene -> Diplotene -> Diakinesis.',
        finalAnswer: 'Leptotene -> Zygotene -> Pachytene -> Diplotene -> Diakinesis',
      }),
      sourceId: sourceNeet2023.id,
      createdById: contentManager.id,
    },
  });

  // Q12: Table Based Data Interpretation (Chemical Kinetics)
  const q12 = await prisma.question.create({
    data: {
      code: 'QB-CHM-000012',
      type: 'TABLE_BASED',
      difficulty: 'MEDIUM',
      cognitiveLevel: 'APPLY',
      questionNature: 'CALCULATION_BASED',
      questionStyle: 'MULTI_CONCEPT',
      positiveMarks: 4.0,
      negativeMarks: -1.0,
      estimatedTimeSeconds: 150,
      language: 'English',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      contentJson: JSON.stringify({
        statement: 'For the reaction $2A + B \\rightarrow C + D$, initial rate experiments were performed at 298 K with the following observations. Determine the overall order of the reaction with respect to reactant $A$:',
        tableHeaders: ['Experiment', '[A] (mol/L)', '[B] (mol/L)', 'Initial Rate (mol/L·s)'],
        tableRows: [
          ['1', '0.10', '0.10', '6.0 x 10^-3'],
          ['2', '0.30', '0.20', '7.2 x 10^-2'],
          ['3', '0.30', '0.40', '2.88 x 10^-1'],
          ['4', '0.40', '0.10', '2.4 x 10^-2'],
        ],
      }),
      statementText: 'For reaction 2A + B -> C + D, initial rate observations are given in the table. Determine order of reaction with respect to A: (A) 1, (B) 2, (C) 0, (D) 3',
      optionsJson: JSON.stringify([
        { id: 'opt_A', text: 'First order ($m = 1$)', isCorrect: true },
        { id: 'opt_B', text: 'Second order ($m = 2$)', isCorrect: false },
        { id: 'opt_C', text: 'Zero order ($m = 0$)', isCorrect: false },
        { id: 'opt_D', text: 'Half order ($m = 0.5$)', isCorrect: false },
      ]),
      answerJson: JSON.stringify({ correctOptions: ['opt_A'] }),
      solutionJson: JSON.stringify({
        stepByStep: '1. Rate law: $r = k [A]^m [B]^n$.\n2. Compare Exp 1 and Exp 4 where $[B] = 0.10$ M is constant:\n   $\\frac{r_4}{r_1} = \\frac{2.4 \\times 10^{-2}}{6.0 \\times 10^{-3}} = 4$.\n   $\\frac{[A]_4}{[A]_1} = \\frac{0.40}{0.10} = 4$.\n3. Therefore $4^m = 4 \\implies m = 1$ (first order with respect to A).',
        finalAnswer: 'First order (m = 1), Option A.',
      }),
      sourceId: sourceJeeAdv2024.id,
      createdById: contentManager.id,
    },
  });

  // 11. Duplicate Entry demo (Q8 duplicate of Q1)
  const q8 = await prisma.question.create({
    data: {
      code: 'QB-PHY-000008',
      type: 'MCQ',
      difficulty: 'HARD',
      cognitiveLevel: 'APPLY',
      questionNature: 'CALCULATION_BASED',
      questionStyle: 'MULTI_CONCEPT',
      positiveMarks: 4.0,
      negativeMarks: -1.0,
      estimatedTimeSeconds: 180,
      language: 'English',
      verificationStatus: 'DRAFT',
      publishingStatus: 'UNPUBLISHED',
      contentJson: JSON.stringify({
        statement: 'A uniform thin rod having mass $M$ and length $L$ is pivoted at its upper end. A point mass $m = M/3$ moves horizontally with speed $v_0$ and collides with the rod at its lower end, sticking to it. Determine the angular velocity of the composite rod immediately following the collision:',
      }),
      statementText: 'A uniform thin rod having mass M and length L is pivoted at its upper end. A point mass m = M/3 moves horizontally with speed v0 and collides with the rod at its lower end, sticking to it. Determine the angular velocity of the composite rod immediately following the collision:',
      optionsJson: JSON.stringify([
        { id: 'opt_A', text: '$\\omega = \\frac{v_0}{2L}$', isCorrect: true },
        { id: 'opt_B', text: '$\\omega = \\frac{3v_0}{4L}$', isCorrect: false },
        { id: 'opt_C', text: '$\\omega = \\frac{v_0}{L}$', isCorrect: false },
        { id: 'opt_D', text: '$\\omega = \\frac{2v_0}{3L}$', isCorrect: false },
      ]),
      answerJson: JSON.stringify({ correctOptions: ['opt_A'] }),
      sourceId: sourceJeeAdv2024.id,
      createdById: contentManager.id,
    },
  });

  // Duplicate mapping
  await prisma.questionDuplicate.create({
    data: {
      originalQuestionId: q1.id,
      duplicateQuestionId: q8.id,
      similarityScore: 0.94,
      matchType: 'SEMANTIC',
      status: 'PENDING',
      resolutionNotes: 'Identical physics scenario with slight paraphrasing of wording (point mass vs small particle, speed vs velocity). Needs SME merge.',
    },
  });

  // 12. Versions
  await prisma.questionVersion.create({
    data: {
      questionId: q1.id,
      versionNumber: 1,
      contentSnapshotJson: JSON.stringify({
        statement: 'A uniform thin rod of mass M and length L is hinged at one end...',
        answer: 'Option A',
      }),
      changedBy: 'Vikram Mehta (Content Manager)',
      changeReason: 'Initial question creation from scanned PDF of JEE Advanced 2024',
    },
  });

  await prisma.questionVersion.create({
    data: {
      questionId: q1.id,
      versionNumber: 2,
      contentSnapshotJson: JSON.stringify({
        statement: 'A uniform thin rod of mass $M$ and length $L$ is pivoted at one of its ends and hangs vertically...',
        options: 'Added LaTeX equation formatting for options',
      }),
      changedBy: 'Dr. Rajesh Verma (SME)',
      changeReason: 'Corrected notation to standard LaTeX and added full step-by-step angular momentum proof',
    },
  });

  // 13. Import Jobs
  const job1 = await prisma.questionImportJob.create({
    data: {
      fileName: 'JEE_Advanced_2024_Physics_Paper1.pdf',
      fileType: 'PDF',
      fileSize: 4256000,
      totalPages: 18,
      totalDetected: 18,
      successfullyExtracted: 17,
      failedCount: 1,
      pendingReviewCount: 2,
      status: 'EXTRACTION_COMPLETED',
      errorSummary: 'Page 14: diagram resolution too low to extract matrix match labels with >80% confidence.',
    },
  });

  await prisma.questionImportItem.create({
    data: {
      jobId: job1.id,
      pageNumber: 3,
      itemIndex: 1,
      rawContent: 'Q.14 A uniform thin rod of mass M and length L...',
      extractedDataJson: JSON.stringify({ questionCode: 'QB-PHY-000001', type: 'MCQ', confidence: 0.96 }),
      status: 'SUCCESS',
      questionId: q1.id,
    },
  });

  await prisma.questionImportItem.create({
    data: {
      jobId: job1.id,
      pageNumber: 14,
      itemIndex: 18,
      rawContent: 'Q.18 [Matrix Match Table with circuit diagram]',
      status: 'WARNING',
      errorMessage: 'Low OCR confidence on resistor labels (R1 vs R2)',
    },
  });

  const job2 = await prisma.questionImportJob.create({
    data: {
      fileName: 'NEET_2024_Biology_Unit5_Genetics.xlsx',
      fileType: 'XLSX',
      fileSize: 184000,
      totalPages: 1,
      totalDetected: 45,
      successfullyExtracted: 45,
      failedCount: 0,
      pendingReviewCount: 12,
      status: 'COMPLETED',
    },
  });

  // 14. AI Generation Logs
  await prisma.aiGenerationLog.create({
    data: {
      provider: 'gemini',
      model: 'gemini-1.5-pro',
      promptVersion: 'v2.1',
      taskType: 'EXTRACTION',
      inputPrompt: 'Extract structured question JSON from raw OCR text: "A uniform thin rod of mass M and length L..."',
      outputResponse: JSON.stringify({
        type: 'MCQ',
        statement: 'A uniform thin rod of mass $M$ and length $L$...',
        options: [{ id: 'A', text: '\\frac{v_0}{2L}' }],
      }),
      confidenceScoresJson: JSON.stringify({
        subject: 0.99,
        chapter: 0.95,
        topic: 0.88,
        difficulty: 0.82,
        cognitiveLevel: 0.85,
      }),
      executionTimeMs: 1420,
      status: 'SUCCESS',
    },
  });

  // 15. Books Management & Ingestion (Physical Book PDF Ingestion Pipeline)
  const bookScience10 = await prisma.book.create({
    data: {
      code: 'jesc1',
      title: 'Science Class 10 (NCERT)',
      subtitle: 'Textbook in Science for Class X',
      curriculum: 'CBSE',
      grade: 10,
      subjectId: subChemistry.id,
      publisher: 'NCERT',
      academicYear: '2024-2025',
      edition: 'Reprint 2024',
      language: 'English',
      bookType: 'TEXTBOOK',
      isbn: '978-81-7450-492-0',
      coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300',
      pdfUrl: 'https://storage.yolearn.ai/books/cbse/grade10/science/jesc1.pdf',
      s3Path: 'CBSE/Grade 10/Science/1',
      qdrantCollection: 'yolearn_cbse_10_science',
      databaseTarget: 'primary',
      chapterSplit: '1-16,17-38,39-55',
      rawChapterNames: 'Chemical Reactions and Equations, Acids Bases and Salts, Metals and Non-metals',
      status: 'PUBLISHED',
      verificationLevel: 'TOPIC',
      processingProgress: 100,
      currentStage: 'PUBLISHED',
      totalPages: 55,
      totalChapters: 3,
      totalTopics: 6,
    },
  });

  const bookChapReactions = await prisma.bookChapter.create({
    data: {
      bookId: bookScience10.id,
      chapterNumber: 1,
      title: 'Chemical Reactions and Equations',
      pageStart: 1,
      pageEnd: 16,
      introduction: 'Consider the following situations of daily life: milk left at room temperature during summers, an iron tawa exposed to humid atmosphere, grapes getting fermented. In all these cases, the nature and identity of the initial substance have changed.',
      status: 'VERIFIED',
      extractionConfidence: 0.98,
      verifiedBy: 'Dr. Priya Sharma (SME Chemistry)',
      verifiedAt: new Date(),
    },
  });

  const bookTopicTypes = await prisma.bookTopic.create({
    data: {
      chapterId: bookChapReactions.id,
      title: 'Types of Chemical Reactions',
      sortOrder: 2,
      pageReference: 6,
      centralTopicId: topicChemicalReactions.id,
      status: 'VERIFIED',
      extractionConfidence: 0.97,
      contentBlocksJson: JSON.stringify([
        {
          id: 'blk-001',
          type: 'TEXT',
          content: 'We have learnt in Class IX that during a chemical reaction atoms of one element do not change into those of another element. Chemical reactions involve the breaking and making of bonds between atoms to produce new substances.',
          confidence: 0.99,
          page: 6,
          isVerified: true,
        },
        {
          id: 'blk-002',
          type: 'FORMULA',
          content: '2H_2(g) + O_2(g) \\rightarrow 2H_2O(l) \\quad [\\Delta H < 0]',
          confidence: 0.98,
          page: 7,
          isVerified: true,
        },
        {
          id: 'blk-003',
          type: 'IMAGE',
          content: 'Formation of slaked lime by the reaction of calcium oxide with water: CaO(s) + H2O(l) -> Ca(OH)2(aq) + Heat',
          confidence: 0.95,
          page: 7,
          isVerified: true,
        },
      ]),
    },
  });

  await prisma.bookPage.create({
    data: {
      chapterId: bookChapReactions.id,
      pageNumber: 6,
      rawText: 'Activity 1.4: Take a small amount of calcium oxide or quick lime in a beaker. Slowly add water to this. Touch the beaker as shown in Fig. 1.3.',
      extractedJson: JSON.stringify({
        activityNumber: 'Activity 1.4',
        chemicals: ['Calcium Oxide (CaO)', 'Water (H2O)', 'Calcium Hydroxide (Ca(OH)2)'],
        reactionType: 'Exothermic Combination Reaction',
      }),
      imageUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600',
      confidence: 0.96,
      isVerified: true,
      ocrStatus: 'COMPLETED',
    },
  });

  // Book 2: Physics Class 11 Part 1
  const bookPhysics11 = await prisma.book.create({
    data: {
      code: 'keph1',
      title: 'Physics Class 11 Part 1 (NCERT)',
      subtitle: 'Textbook for Class XI',
      curriculum: 'CBSE',
      grade: 11,
      subjectId: subPhysics.id,
      publisher: 'NCERT',
      academicYear: '2024-2025',
      edition: 'Revised Edition 2024',
      language: 'English',
      bookType: 'TEXTBOOK',
      isbn: '978-81-7450-506-4',
      coverUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300',
      pdfUrl: 'https://storage.yolearn.ai/books/cbse/grade11/physics/keph1.pdf',
      s3Path: 'CBSE/Grade 11/Physics/1',
      qdrantCollection: 'yolearn_cbse_11_physics',
      databaseTarget: 'primary',
      chapterSplit: '1-30,31-70,71-120,121-165,166-210',
      rawChapterNames: 'Units and Measurements, Motion in a Straight Line, Motion in a Plane, Laws of Motion, Rotational Motion',
      status: 'VERIFIED',
      verificationLevel: 'PAGE',
      processingProgress: 100,
      currentStage: 'HUMAN_VERIFIED',
      totalPages: 210,
      totalChapters: 5,
      totalTopics: 18,
    },
  });

  const bookChapRotation = await prisma.bookChapter.create({
    data: {
      bookId: bookPhysics11.id,
      chapterNumber: 7,
      title: 'Systems of Particles and Rotational Motion',
      pageStart: 137,
      pageEnd: 178,
      introduction: 'We have so far dealt with the motion of extended bodies treated as a point mass. We now explore rotation of a rigid body about a fixed axis and planar rotational mechanics.',
      status: 'VERIFIED',
      extractionConfidence: 0.99,
      verifiedBy: 'Dr. Rajesh Verma (Physics SME)',
      verifiedAt: new Date(),
    },
  });

  const bookTopicInertia = await prisma.bookTopic.create({
    data: {
      chapterId: bookChapRotation.id,
      title: 'Moment of Inertia and Theorems of Parallel & Perpendicular Axes',
      sortOrder: 6,
      pageReference: 154,
      centralTopicId: topicInertia.id,
      status: 'VERIFIED',
      extractionConfidence: 0.98,
      contentBlocksJson: JSON.stringify([
        {
          id: 'blk-rot-01',
          type: 'FORMULA',
          content: 'I = \\sum_{i=1}^n m_i r_i^2 \\quad \\text{and} \\quad I = I_{cm} + M d^2',
          confidence: 0.99,
          page: 154,
          isVerified: true,
        },
        {
          id: 'blk-rot-02',
          type: 'TEXT',
          content: 'Moment of inertia depends upon mass of the body, its shape and size, distribution of mass about the axis of rotation, and the position and orientation of the axis of rotation.',
          confidence: 0.98,
          page: 155,
          isVerified: true,
        },
      ]),
    },
  });

  await prisma.bookPage.create({
    data: {
      chapterId: bookChapRotation.id,
      pageNumber: 154,
      rawText: 'Section 7.10: Moment of Inertia. We have already mentioned that for rotational motion, the moment of inertia plays the same role as mass does in linear motion.',
      extractedJson: JSON.stringify({
        section: '7.10',
        title: 'Moment of Inertia',
        equations: ['I = \\int r^2 dm', 'I_{rod} = \\frac{1}{12} M L^2'],
      }),
      imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
      confidence: 0.98,
      isVerified: true,
      ocrStatus: 'COMPLETED',
    },
  });

  // Book 3: Chemistry Class 12 Part 1
  const bookChemistry12 = await prisma.book.create({
    data: {
      code: 'lech1',
      title: 'Chemistry Class 12 Part 1 (NCERT)',
      subtitle: 'Textbook in Chemistry for Class XII',
      curriculum: 'CBSE',
      grade: 12,
      subjectId: subChemistry.id,
      publisher: 'NCERT',
      academicYear: '2024-2025',
      edition: 'Latest Edition 2024',
      language: 'English',
      bookType: 'TEXTBOOK',
      isbn: '978-81-7450-648-1',
      coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300',
      pdfUrl: 'https://storage.yolearn.ai/books/cbse/grade12/chemistry/lech1.pdf',
      s3Path: 'CBSE/Grade 12/Chemistry/1',
      qdrantCollection: 'yolearn_cbse_12_chemistry',
      databaseTarget: 'primary',
      chapterSplit: '1-35,36-65,66-98',
      rawChapterNames: 'Solutions, Electrochemistry, Chemical Kinetics',
      status: 'EXTRACTION_COMPLETED',
      verificationLevel: 'CHAPTER',
      processingProgress: 88,
      currentStage: 'HUMAN_VERIFICATION_PENDING',
      totalPages: 98,
      totalChapters: 3,
      totalTopics: 12,
    },
  });

  const bookChapKinetics = await prisma.bookChapter.create({
    data: {
      bookId: bookChemistry12.id,
      chapterNumber: 3,
      title: 'Chemical Kinetics',
      pageStart: 66,
      pageEnd: 98,
      introduction: 'Chemical kinetics is the branch of chemistry which deals with the study of reaction rates and their mechanisms.',
      status: 'PENDING_REVIEW',
      extractionConfidence: 0.94,
    },
  });

  const bookTopicRateLaw = await prisma.bookTopic.create({
    data: {
      chapterId: bookChapKinetics.id,
      title: 'Order and Molecularity of a Reaction',
      sortOrder: 2,
      pageReference: 72,
      centralTopicId: topicKinetics.id,
      status: 'PENDING_REVIEW',
      extractionConfidence: 0.95,
      contentBlocksJson: JSON.stringify([
        {
          id: 'blk-kin-01',
          type: 'FORMULA',
          content: '\\text{Rate} = k [A]^x [B]^y, \\quad \\text{Overall Order} = x + y',
          confidence: 0.98,
          page: 72,
          isVerified: false,
        },
      ]),
    },
  });

  // 16. Question-to-Book Mappings (Unified Cross-Vertical Mapping)
  await prisma.questionBookMapping.create({
    data: {
      questionId: q1.id, // Moment of Inertia thin rod
      bookId: bookPhysics11.id,
      chapterId: bookChapRotation.id,
      bookTopicId: bookTopicInertia.id,
      pageNumber: 154,
      isVerified: true,
    },
  });

  await prisma.questionBookMapping.create({
    data: {
      questionId: q8.id, // Uniform thin rod collision angular speed
      bookId: bookPhysics11.id,
      chapterId: bookChapRotation.id,
      bookTopicId: bookTopicInertia.id,
      pageNumber: 156,
      isVerified: true,
    },
  });

  await prisma.questionBookMapping.create({
    data: {
      questionId: q12.id, // Chemical Kinetics rate law table experiment
      bookId: bookChemistry12.id,
      chapterId: bookChapKinetics.id,
      bookTopicId: bookTopicRateLaw.id,
      pageNumber: 72,
      isVerified: true,
    },
  });

  // 17. YoShorts Video Management
  const shortReactions = await prisma.yoShort.create({
    data: {
      code: 'YS-CHM-001',
      title: '5 Types of Chemical Reactions Explained in 60s',
      description: 'Master Combination, Decomposition, Displacement, Double Displacement, and Redox reactions with everyday examples.',
      transcript: 'Did you know that every chemical change in our universe can be classified into five fundamental types? First: Combination reaction, where two substances combine into one, like 2H2 + O2 -> 2H2O. Second: Decomposition reaction, where one compound breaks down with heat, light or electricity. Third: Displacement reaction, where a more reactive metal kicks out a less reactive one. Fourth: Double displacement, where partners swap ions forming a precipitate. And fifth: Redox, where oxidation and reduction happen hand in hand! Remember: Combination builds up, decomposition tears down!',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400',
      durationSeconds: 58,
      language: 'English',
      curriculum: 'CBSE',
      grade: 10,
      subjectId: subChemistry.id,
      centralTopicId: topicChemicalReactions.id,
      generationStatus: 'GENERATED',
      generationStage: 'READY',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      source: 'YoLearn High-Impact Series',
    },
  });

  await prisma.yoShortBookMapping.create({
    data: {
      yoShortId: shortReactions.id,
      bookId: bookScience10.id,
      chapterId: bookChapReactions.id,
    },
  });

  const shortInertia = await prisma.yoShort.create({
    data: {
      code: 'YS-PHY-001',
      title: 'Moment of Inertia Trick for Rotational Dynamics',
      description: 'Master the Parallel Axis Theorem and rod formulas in 60 seconds with this visual guide.',
      transcript: 'Struggling with rotational motion problems? Here is the ultimate 60-second shortcut! Remember: Moment of Inertia I = sum m_i r_i^2 is simply the rotational analog of mass. For any symmetrical body pivoted at an eccentric axis, use the Parallel Axis Theorem: I = I_cm + M d^2. Notice how d is the perpendicular distance between the center of mass axis and the rotation axis! For a thin rod pivoted at its end, I = 1/12 M L^2 + M (L/2)^2 = 1/3 M L^2! One simple formula saves 3 minutes on JEE Advanced day!',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
      durationSeconds: 62,
      language: 'English',
      curriculum: 'CBSE',
      grade: 11,
      subjectId: subPhysics.id,
      centralTopicId: topicInertia.id,
      generationStatus: 'GENERATED',
      generationStage: 'READY',
      verificationStatus: 'APPROVED',
      publishingStatus: 'PUBLISHED',
      source: 'YoLearn Physics Sprint',
    },
  });

  await prisma.yoShortBookMapping.create({
    data: {
      yoShortId: shortInertia.id,
      bookId: bookPhysics11.id,
      chapterId: bookChapRotation.id,
    },
  });

  const shortKinetics = await prisma.yoShort.create({
    data: {
      code: 'YS-CHM-002',
      title: 'Order of Reaction and Rate Law: Quick Revision',
      description: 'Deduce order of reaction from initial rate data tables in 30 seconds.',
      transcript: 'How do you find the order of a chemical reaction from experimental data? Look at this table: when reactant A doubles while B is constant, what happens to the rate? If rate doubles, order with respect to A is 1! If rate quadruples, 2^m = 4, so order is 2! If rate is unchanged, order is zero! Sum of individual orders gives the overall reaction order. Units of rate constant k: (mol/L)^(1-n) s^-1. Never memorize, always deduce!',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      durationSeconds: 65,
      language: 'English',
      curriculum: 'CBSE',
      grade: 12,
      subjectId: subChemistry.id,
      centralTopicId: topicKinetics.id,
      generationStatus: 'GENERATED',
      generationStage: 'READY',
      verificationStatus: 'PENDING_REVIEW',
      publishingStatus: 'UNPUBLISHED',
      source: 'YoLearn Board Booster',
    },
  });

  await prisma.yoShortBookMapping.create({
    data: {
      yoShortId: shortKinetics.id,
      bookId: bookChemistry12.id,
      chapterId: bookChapKinetics.id,
    },
  });

  const shortBalancing = await prisma.yoShort.create({
    data: {
      code: 'YS-CHM-003',
      title: 'Algebraic Method for Balancing Chemical Equations',
      description: 'A 100% foolproof technique to balance tough chemical equations without guessing.',
      transcript: 'Never guess balancing by trial and error again! Use the algebraic method. Put coefficients a, b, c, d in front of reactants and products. Set up linear equations for each element: carbon, hydrogen, oxygen. Set a = 1, solve the system, and multiply by LCM to clear fractions! It works on combustion, redox, and complex coordination reactions every single time.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
      durationSeconds: 54,
      language: 'English',
      curriculum: 'CBSE',
      grade: 10,
      subjectId: subChemistry.id,
      centralTopicId: topicChemicalReactions.id,
      generationStatus: 'GENERATED',
      generationStage: 'READY',
      verificationStatus: 'CHANGES_REQUESTED',
      publishingStatus: 'UNPUBLISHED',
      source: 'YoLearn Foundation Series',
    },
  });

  await prisma.yoShortBookMapping.create({
    data: {
      yoShortId: shortBalancing.id,
      bookId: bookScience10.id,
      chapterId: bookChapReactions.id,
    },
  });

  // 18. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      userName: superAdmin.name,
      action: 'QUESTION_APPROVED',
      entityType: 'QUESTION',
      entityId: q1.id,
      detailsJson: JSON.stringify({ code: q1.code, reviewer: smePhysics.name }),
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
