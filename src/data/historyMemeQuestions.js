const historyMemeQuestions = [
  {
    id: 'hmq-001',
    question: '中国历史上最早的爱豆是谁？',
    correctAnswer: '秦始皇',
    explanation: '因为他让很多人入坑。',
    wrongAnswers: ['汉武帝', '唐太宗', '武则天', '康熙帝', '乾隆帝'],
  },
  {
    id: 'hmq-002',
    question: '中国历史上谁最爱吃零食？',
    correctAnswer: '袁世凯',
    explanation: '“临时大总统”。',
    wrongAnswers: ['孙中山', '曹操', '刘备', '李世民', '朱元璋'],
  },
  {
    id: 'hmq-003',
    question: '历史上什么东西一直没有涨价过？',
    correctAnswer: '商鞅',
    explanation: '因为他一直是五块。',
    wrongAnswers: ['王安石', '张居正', '李悝', '吴起', '管仲'],
  },
];

const validateHistoryMemeQuestions = (questions) => {
  if (!import.meta.env.DEV) return;

  const seenIds = new Set();

  questions.forEach((question, index) => {
    const questionLabel = question.id || `第 ${index + 1} 道题`;

    if (!question.id) {
      console.warn(`[历史梗题库] 第 ${index + 1} 道题缺少唯一 id。`);
    }

    if (seenIds.has(question.id)) {
      console.warn(`[历史梗题库] 发现重复 id：${question.id}`);
    }
    seenIds.add(question.id);

    if (!Array.isArray(question.wrongAnswers) || question.wrongAnswers.length !== 5) {
      console.warn(
        `[历史梗题库] ${questionLabel} 的 wrongAnswers 必须正好有 5 个，当前为 ${
          Array.isArray(question.wrongAnswers) ? question.wrongAnswers.length : 0
        } 个。`,
      );
    }
  });
};

validateHistoryMemeQuestions(historyMemeQuestions);

export default historyMemeQuestions;
