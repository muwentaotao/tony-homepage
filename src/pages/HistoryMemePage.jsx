import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import GameBoard from '../components/history-meme/GameBoard';
import PixelButton from '../components/history-meme/PixelButton';
import PixelSoundToggle from '../components/history-meme/PixelSoundToggle';
import historyMemeQuestions from '../data/historyMemeQuestions';
import usePixelSound from '../hooks/usePixelSound';
import './HistoryMemePage.css';

const titles = ['野生史官', '梗学博士', '史料鉴定大师', '朝代冲浪选手', '群聊太史令'];

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};

const isPlayableQuestion = (question) => (
  question
  && typeof question.question === 'string'
  && typeof question.correctAnswer === 'string'
);

export default function HistoryMemePage() {
  const [phase, setPhase] = useState('welcome');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongAttempt, setWrongAttempt] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [earnedTitle, setEarnedTitle] = useState('');
  const { enabled, setEnabled, play, unlockAndPlay } = usePixelSound();
  const playableQuestionCount = historyMemeQuestions.filter(isPlayableQuestion).length;

  const startRound = useCallback(async () => {
    const preparedQuestions = shuffle(historyMemeQuestions.filter(isPlayableQuestion)).map((question) => ({
      ...question,
      options: shuffle([
        question.correctAnswer,
        ...(Array.isArray(question.wrongAnswers) ? question.wrongAnswers : []),
      ]),
    }));

    if (preparedQuestions.length === 0) return;

    await unlockAndPlay('click');
    setQuestions(preparedQuestions);
    setCurrentIndex(0);
    setWrongAttempt(null);
    setCorrectAnswer(null);
    setEarnedTitle('');
    setPhase('playing');
  }, [unlockAndPlay]);

  const handleAnswer = (option) => {
    const currentQuestion = questions[currentIndex];
    if (correctAnswer) return;

    if (option === currentQuestion.correctAnswer) {
      setCorrectAnswer(option);
      play('correct');
      return;
    }

    setWrongAttempt((attempt) => ({
      option,
      nonce: (attempt?.nonce ?? 0) + 1,
    }));
    play('wrong');
  };

  const handleNext = () => {
    play('next');
    if (currentIndex === questions.length - 1) {
      setEarnedTitle(titles[Math.floor(Math.random() * titles.length)]);
      setPhase('finished');
      return;
    }

    setCurrentIndex((index) => index + 1);
    setWrongAttempt(null);
    setCorrectAnswer(null);
  };

  const toggleSound = () => {
    setEnabled((current) => !current);
  };

  return (
    <main className="history-meme-page">
      <div className="history-minimal-background" aria-hidden="true">
        <span className="history-orbit history-orbit--one" />
        <span className="history-orbit history-orbit--two" />
        <span className="history-short-lines" />
        <span className="history-accent-block history-accent-block--gold" />
        <span className="history-accent-block history-accent-block--blue" />
        <div className="history-pixel-landscape">
          <span className="history-pixel-mountain history-pixel-mountain--left" />
          <span className="history-pixel-mountain history-pixel-mountain--right" />
          <span className="history-pixel-wall" />
          <span className="history-pixel-tower" />
        </div>
      </div>

      <header className="history-topbar">
        <Link to="/" className="history-back-link">
          <span aria-hidden="true">←</span>
          <span>返回主站</span>
        </Link>
        <div className="history-topbar-title">历史梗挑战</div>
        <PixelSoundToggle enabled={enabled} onToggle={toggleSound} />
      </header>

      <div className="history-page-content">
        {phase === 'welcome' && (
          <section className="history-welcome-card history-card-enter">
            <div className="history-identity-mark" aria-hidden="true">史</div>
            <p className="history-kicker">像素史官挑战</p>
            <h1>历史梗，<br />一眼判定。</h1>
            <p className="history-welcome-copy">
              {playableQuestionCount > 0
                ? '不做复杂小游戏。每一题只有一个历史名场面真相，答错继续猜，答对才给史官解释。'
                : '题库还在整理中，请稍后再来。'}
            </p>
            <PixelButton
              className="history-start-button"
              onClick={startRound}
              disabled={playableQuestionCount === 0}
            >
              开始挑战 →
            </PixelButton>
            {playableQuestionCount > 0 && (
              <p className="history-small-note">{playableQuestionCount} 道题 · 不计分 · 只看你有多懂梗</p>
            )}
          </section>
        )}

        {phase === 'playing' && questions[currentIndex] && (
          <GameBoard
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            wrongAttempt={wrongAttempt}
            correctAnswer={correctAnswer}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}

        {phase === 'finished' && (
          <section className="history-finish-card history-card-enter">
            <div className="history-identity-mark history-identity-mark--finish" aria-hidden="true">史</div>
            <p className="history-kicker">像素史官结案</p>
            <h1>挑战完成</h1>
            <p className="history-title-label">本轮称号</p>
            <div className="history-earned-title">{earnedTitle}</div>
            <div className="history-finish-actions">
              <PixelButton onClick={startRound}>再来一轮</PixelButton>
              <Link to="/" className="history-pixel-link">返回主站</Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
