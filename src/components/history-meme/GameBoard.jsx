import { useEffect, useRef } from 'react';
import PixelButton from './PixelButton';

export default function GameBoard({
  question,
  questionNumber,
  totalQuestions,
  wrongAttempt,
  correctAnswer,
  onAnswer,
  onNext,
}) {
  const isLocked = Boolean(correctAnswer);
  const progress = (questionNumber / totalQuestions) * 100;
  const resultRef = useRef(null);

  useEffect(() => {
    if (!isLocked || !resultRef.current) return;

    const scrollTimer = window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);

    return () => window.clearTimeout(scrollTimer);
  }, [isLocked]);

  return (
    <section className="history-game-card history-card-enter">
      <div className="history-question-meta">
        <strong>第 {questionNumber} / {totalQuestions} 题</strong>
      </div>
      <div className="history-progress-track" aria-label={`答题进度 ${questionNumber}/${totalQuestions}`}>
        <div className="history-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="history-question-block">
        <div className="history-question-dots" aria-hidden="true"><span /><span /><span /></div>
        <h2>{question.question}</h2>
      </div>

      <div className="history-options-grid">
        {question.options.map((option) => {
          const isCorrect = correctAnswer === option;
          const isWrongAttempt = wrongAttempt?.option === option;

          return (
            <button
              key={`${question.id}-${option}-${isWrongAttempt ? wrongAttempt.nonce : 0}`}
              type="button"
              disabled={isLocked}
              onClick={() => onAnswer(option)}
              className={`history-option ${isCorrect ? 'history-option--correct' : ''} ${
                isWrongAttempt ? 'history-option--wrong' : ''
              }`}
            >
              <span className="history-option-dot" aria-hidden="true" />
              <span>{option}</span>
              {isCorrect && <span className="history-option-mark">✓</span>}
            </button>
          );
        })}
      </div>

      {isLocked && (
        <div ref={resultRef} className="history-result-panel history-card-enter" aria-live="polite">
          <div className="history-correct-verdict">
            <span className="history-verdict-mark" aria-hidden="true">✓</span>
            <span>史官判定：正确</span>
          </div>
          <div className="history-explanation">
            <div>
              <span className="history-explanation-label">答案说明</span>
              <p>{question.explanation}</p>
            </div>
            <PixelButton onClick={onNext}>
              {questionNumber === totalQuestions ? '查看称号' : '下一题'}
            </PixelButton>
          </div>
        </div>
      )}
    </section>
  );
}
