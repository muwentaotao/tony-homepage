import { useCallback, useEffect, useRef, useState } from 'react';

const SOUND_PREFERENCE_KEY = 'history-meme-sound-enabled';

const soundPatterns = {
  click: [
    { frequency: 360, duration: 0.035, offset: 0, volume: 0.5 },
    { frequency: 480, duration: 0.035, offset: 0.032, volume: 0.35 },
  ],
  wrong: [
    { frequency: 180, duration: 0.07, offset: 0, volume: 0.42 },
    { frequency: 125, duration: 0.11, offset: 0.065, volume: 0.32 },
  ],
  correct: [
    { frequency: 392, duration: 0.055, offset: 0, volume: 0.38 },
    { frequency: 523, duration: 0.06, offset: 0.055, volume: 0.4 },
    { frequency: 784, duration: 0.11, offset: 0.115, volume: 0.36 },
  ],
  next: [
    { frequency: 466, duration: 0.04, offset: 0, volume: 0.32 },
    { frequency: 622, duration: 0.065, offset: 0.04, volume: 0.34 },
  ],
};

export default function usePixelSound() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return window.localStorage.getItem(SOUND_PREFERENCE_KEY) !== 'false';
    } catch {
      return true;
    }
  });
  const contextRef = useRef(null);

  const ensureContext = useCallback(async () => {
    if (!contextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      contextRef.current = new AudioContext();
    }

    if (contextRef.current.state === 'suspended') {
      await contextRef.current.resume();
    }

    return contextRef.current;
  }, []);

  const playWithContext = useCallback((context, type) => {
    if (!context || !enabled) return;

    const now = context.currentTime;
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(0.085, now);
    masterGain.connect(context.destination);

    soundPatterns[type]?.forEach(({ frequency, duration, offset, volume }) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const startAt = now + offset;

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, startAt);
      gain.gain.setValueAtTime(volume, startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
      oscillator.connect(gain);
      gain.connect(masterGain);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration);
    });
  }, [enabled]);

  const unlockAndPlay = useCallback(async (type = 'click') => {
    const context = await ensureContext();
    playWithContext(context, type);
  }, [ensureContext, playWithContext]);

  const play = useCallback((type) => {
    playWithContext(contextRef.current, type);
  }, [playWithContext]);

  useEffect(() => () => {
    contextRef.current?.close().catch(() => {});
  }, []);

  const updateEnabled = useCallback((nextValue) => {
    setEnabled((current) => {
      const resolved = typeof nextValue === 'function' ? nextValue(current) : nextValue;
      try {
        window.localStorage.setItem(SOUND_PREFERENCE_KEY, String(resolved));
      } catch {
        // Sound preference remains valid for the current page when storage is unavailable.
      }
      return resolved;
    });
  }, []);

  return {
    enabled,
    setEnabled: updateEnabled,
    play,
    unlockAndPlay,
  };
}
