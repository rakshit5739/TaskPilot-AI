import { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { LogoIcon, CopyIcon, CheckIcon, RefreshIcon } from "./Icons";

export default function MessageItem({ message, onRetry, isGenerating }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.response || message.task);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="message-group" id={`msg-${message.id}`}>
      {/* User Message */}
      <div className="user-message-row">
        <div className="user-avatar-badge" title="You">
          <span>YOU</span>
        </div>
        <div className="user-bubble">
          <div className="user-text">{message.task}</div>
          {message.timestamp && (
            <span className="message-time">{formatTime(message.timestamp)}</span>
          )}
        </div>
      </div>

      {/* Assistant Response */}
      <div className="assistant-message-row">
        <div className="assistant-avatar" title="Brain AI">
          <LogoIcon size={20} className="assistant-logo" />
        </div>

        <div className="assistant-content-wrapper">
          <div className="assistant-meta">
            <span className="assistant-name">Brain AI</span>
            <span className="assistant-model-pill">Brain 2.5</span>
            {message.status === "loading" && (
              <span className="status-badge loading">
                <span className="pulsing-dot" />
                Thinking...
              </span>
            )}
            {message.status === "error" && (
              <span className="status-badge error">Failed</span>
            )}
            {message.timestamp && message.status === "success" && (
              <span className="message-time">{formatTime(message.timestamp)}</span>
            )}
          </div>

          {message.status === "loading" ? (
            <div className="ai-loading-container" role="status" aria-live="polite">
              <div className="thinking-shimmer">
                <div className="shimmer-line short" />
                <div className="shimmer-line medium" />
                <div className="shimmer-line long" />
              </div>
              <div className="thinking-indicator">
                <div className="thinking-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Generating intelligent response...</span>
              </div>
            </div>
          ) : message.status === "error" ? (
            <div className="ai-error-container" role="alert">
              <div className="error-title">Unable to complete request</div>
              <p className="error-message">{message.response}</p>
              <div className="error-actions">
                <button
                  className="retry-button"
                  onClick={() => onRetry(message.task, message.id)}
                  disabled={isGenerating}
                >
                  <RefreshIcon size={14} />
                  <span>Retry request</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="ai-response-body">
                <MarkdownRenderer content={message.response} />
              </div>

              <div className="message-actions-bar">
                <button
                  className="action-pill-btn"
                  onClick={handleCopy}
                  title="Copy full response"
                  aria-label="Copy full response"
                >
                  {copied ? (
                    <>
                      <CheckIcon size={13} className="text-emerald" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  className="action-pill-btn"
                  onClick={() => onRetry(message.task, message.id)}
                  disabled={isGenerating}
                  title="Regenerate this response"
                  aria-label="Regenerate response"
                >
                  <RefreshIcon size={13} />
                  <span>Regenerate</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
