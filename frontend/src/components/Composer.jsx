import { useRef, useEffect } from "react";
import { SendIcon } from "./Icons";

export default function Composer({
  value,
  onChange,
  onSubmit,
  isGenerating,
  placeholder = "Ask Brain AI anything... (Shift + Enter for new line)",
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea according to scroll height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 52), 220);
    textarea.style.height = `${nextHeight}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isGenerating && value.trim()) {
        onSubmit(value.trim());
      }
    }
  };

  return (
    <div className="composer-container">
      <form
        className={`composer-box ${isGenerating ? "generating" : ""}`}
        onSubmit={(e) => {
          e.preventDefault();
          if (!isGenerating && value.trim()) {
            onSubmit(value.trim());
          }
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isGenerating}
          aria-label="Describe your task"
          className="composer-textarea"
        />

        <div className="composer-actions">
          <div className="composer-hint">
            <span className="kbd-badge">Enter</span> to send <span className="hint-divider">·</span>{" "}
            <span className="kbd-badge">Shift + Enter</span> for new line
          </div>

          <button
            type="submit"
            className="composer-send-btn"
            disabled={!value.trim() || isGenerating}
            title={isGenerating ? "Thinking..." : "Send task"}
            aria-label={isGenerating ? "Thinking..." : "Send task"}
          >
            {isGenerating ? (
              <span className="spinner-icon" />
            ) : (
              <SendIcon size={16} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
