export default function PixelSoundToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className="history-sound-toggle"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? '关闭音效' : '开启音效'}
    >
      <span aria-hidden="true">{enabled ? '♪' : '×'}</span>
      <span className="history-sound-label">{enabled ? '音效开' : '音效关'}</span>
    </button>
  );
}
