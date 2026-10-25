import { useState } from "react";
import { SettingsIcon, CloseIcon, RefreshIcon, TrashIcon, CheckIcon } from "./Icons";

export default function SettingsModal({
  isOpen,
  onClose,
  backendStatus,
  onCheckBackend,
  onClearAllSessions,
  autoScroll,
  onToggleAutoScroll,
}) {
  const [clearedNotice, setClearedNotice] = useState(false);

  if (!isOpen) return null;

  const isConnected = backendStatus === "Connected";
  const isChecking = backendStatus === "Checking...";

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all saved tasks and history?")) {
      onClearAllSessions();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 2500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <SettingsIcon size={18} className="modal-title-icon" />
            <h2 id="settings-title">Workspace Settings</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Section: Backend & AI Engine */}
          <div className="settings-section">
            <h3 className="section-label">AI ENGINE & CONNECTIVITY</h3>

            <div className="setting-row">
              <div className="setting-desc">
                <strong>Backend Endpoint</strong>
                <p>Local Express server processing AI requests</p>
              </div>
              <span className="mono-badge">http://localhost:5001</span>
            </div>

            <div className="setting-row">
              <div className="setting-desc">
                <strong>Connection Health</strong>
                <p>Status of GET /api/health</p>
              </div>
              <div className="status-with-btn">
                <span
                  className={`status-pill ${
                    isConnected ? "online" : "offline"
                  }`}
                >
                  <span className="dot" />
                  {backendStatus}
                </span>
                <button
                  className="icon-action-btn"
                  onClick={onCheckBackend}
                  disabled={isChecking}
                  title="Test backend connection"
                >
                  <RefreshIcon
                    size={14}
                    className={isChecking ? "rotating" : ""}
                  />
                </button>
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-desc">
                <strong>Active AI Model</strong>
                <p>Configured in server runtime</p>
              </div>
              <span className="model-badge">Brain AI Core</span>
            </div>
          </div>

          {/* Section: Preferences */}
          <div className="settings-section">
            <h3 className="section-label">INTERACTION PREFERENCES</h3>

            <div className="setting-row">
              <div className="setting-desc">
                <strong>Auto-scroll on response</strong>
                <p>Automatically scroll down as new AI responses arrive</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => onToggleAutoScroll(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Section: Data & Storage */}
          <div className="settings-section">
            <h3 className="section-label">DATA & LOCAL STORAGE</h3>

            <div className="setting-row">
              <div className="setting-desc">
                <strong>Clear Task History</strong>
                <p>Remove all cached conversations from this browser</p>
              </div>
              <button
                className="action-danger-btn"
                onClick={handleClearHistory}
              >
                {clearedNotice ? (
                  <>
                    <CheckIcon size={14} />
                    <span>Cleared!</span>
                  </>
                ) : (
                  <>
                    <TrashIcon size={14} />
                    <span>Clear All</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <span className="modal-footer-caption">
            Brain AI · Production-Ready Interface
          </span>
          <button className="primary-cta-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
