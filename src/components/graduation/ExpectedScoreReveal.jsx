import { useState, useEffect, useRef } from 'react';

const SCORES = ['60+', '65+', '70+', '75+', '80+', '85+', '90+', '95+', '100'];

export default function ExpectedScoreReveal({ expectedScore, disabled }) {
  const [revealed, setRevealed] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [displayScore, setDisplayScore] = useState('??');
  const intervalRef = useRef(null);

  const handleReveal = () => {
    if (revealed || rolling || disabled) return;
    setRolling(true);

    let count = 0;
    const maxCount = 30;
    intervalRef.current = setInterval(() => {
      count++;
      const random = SCORES[Math.floor(Math.random() * SCORES.length)];
      setDisplayScore(random);

      if (count >= maxCount) {
        clearInterval(intervalRef.current);
        setDisplayScore(expectedScore || '85+');
        setRolling(false);
        setRevealed(true);
      }
    }, 80);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      {!revealed ? (
        <button
          onClick={handleReveal}
          disabled={rolling || disabled}
          className="px-8 py-3 rounded-full bg-[#c4a574]/20 border border-[#c4a574]/40 text-[#c4a574] font-medium hover:bg-[#c4a574]/30 transition-all duration-300 disabled:opacity-50"
        >
          {rolling ? (
            <span className="inline-flex items-center gap-2">
              期待值滚动中
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          ) : (
            '领取我的中考期待值'
          )}
        </button>
      ) : (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <p className="text-sm text-tony-muted mb-2">老师对你的中考期待值</p>
          <p className="text-4xl font-bold text-gradient-gold">{displayScore}</p>
        </div>
      )}
    </div>
  );
}
