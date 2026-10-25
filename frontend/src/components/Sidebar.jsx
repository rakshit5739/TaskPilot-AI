import {
  LogoIcon,
  PlusIcon,
  ChatIcon,
  HistoryIcon,
  SparklesIcon,
  SettingsIcon,
  TrashIcon,
  CloseIcon,
} from "./Icons";

export default function Sidebar({
  isOpen,
  onClose,
  activeNav,
  onSelectNav,
  onNewTask,
  sessions = [],
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onOpenSettings,
  backendStatus,
}) {
  const isConnected = backendStatus === "Connected";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`app-sidebar ${isOpen ? "open" : "collapsed"}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <button
            className="sidebar-brand-btn"
            onClick={() => {
              onSelectNav("Workspace");
              onNewTask();
              if (window.innerWidth <= 768) onClose();
            }}
          >
            <div className="brand-logo-wrap">
              <LogoIcon size={24} />
            </div>
            <div className="brand-text">
              <span className="brand-title">
                Brain <span className="brand-ai">AI</span>
              </span>
              <span className="brand-tagline">INTELLIGENT WORKSPACE</span>
            </div>
          </button>

          <button
            className="mobile-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* New Task CTA Button */}
        <div className="sidebar-cta-wrap">
          <button
            className="sidebar-new-task-btn"
            onClick={() => {
              onSelectNav("Workspace");
              onNewTask();
              if (window.innerWidth <= 768) onClose();
            }}
          >
            <PlusIcon size={16} />
            <span>New Task</span>
            <kbd className="sidebar-kbd">⌘K</kbd>
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="sidebar-nav-section">
          <div className="nav-section-title">NAVIGATION</div>
          <nav className="sidebar-nav-list">
            <button
              className={`nav-button ${activeNav === "Workspace" ? "active" : ""}`}
              onClick={() => {
                onSelectNav("Workspace");
                if (window.innerWidth <= 768) onClose();
              }}
            >
              <ChatIcon size={17} className="nav-btn-icon" />
              <span>Workspace</span>
            </button>

            <button
              className={`nav-button ${activeNav === "Task history" ? "active" : ""}`}
              onClick={() => {
                onSelectNav("Task history");
                if (window.innerWidth <= 768) onClose();
              }}
            >
              <HistoryIcon size={17} className="nav-btn-icon" />
              <span>Task history</span>
              {sessions.length > 0 && (
                <span className="nav-badge">{sessions.length}</span>
              )}
            </button>

            <button
              className={`nav-button ${activeNav === "Tools & agents" ? "active" : ""}`}
              onClick={() => {
                onSelectNav("Tools & agents");
                if (window.innerWidth <= 768) onClose();
              }}
            >
              <SparklesIcon size={17} className="nav-btn-icon" />
              <span>Tools & agents</span>
              <span className="nav-badge-pill">Ready</span>
            </button>
          </nav>
        </div>

        {/* Recent Conversations / Tasks */}
        <div className="sidebar-history-section">
          <div className="nav-section-title">RECENT TASKS</div>
          <div className="recent-sessions-list">
            {sessions.length === 0 ? (
              <div className="empty-history-hint">
                <span>No tasks yet.</span>
                <small>Submitted tasks will appear here.</small>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`recent-session-item ${
                    activeNav === "Workspace" && activeSessionId === session.id
                      ? "active"
                      : ""
                  }`}
                >
                  <button
                    className="recent-session-btn"
                    onClick={() => {
                      onSelectSession(session.id);
                      onSelectNav("Workspace");
                      if (window.innerWidth <= 768) onClose();
                    }}
                    title={session.title}
                  >
                    <ChatIcon size={14} className="session-icon" />
                    <span className="session-title">{session.title}</span>
                  </button>
                  <button
                    className="session-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    title="Delete task"
                    aria-label={`Delete task ${session.title}`}
                  >
                    <TrashIcon size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Footer with Profile & System Status */}
        <div className="sidebar-footer">
          <div className="system-status-indicator">
            <span
              className={`sys-dot ${
                isConnected ? "dot-online" : "dot-offline"
              }`}
            />
            <span className="sys-text">
              {isConnected ? "Engine online" : "Engine offline"}
            </span>
            <span className="sys-ver">v1.0</span>
          </div>

          <div className="user-profile-bar">
            <div className="profile-info" onClick={onOpenSettings}>
              <div className="profile-avatar">AI</div>
              <div className="profile-meta">
                <span className="profile-name">Brain Pilot</span>
                <span className="profile-role">Pro Account</span>
              </div>
            </div>
            <button
              className="footer-settings-btn"
              onClick={onOpenSettings}
              title="Settings"
              aria-label="Settings"
            >
              <SettingsIcon size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
