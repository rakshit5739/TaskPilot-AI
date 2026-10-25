import { useState } from "react";
import { HistoryIcon, ChatIcon, TrashIcon, SearchIcon, PlusIcon, ArrowRightIcon } from "./Icons";

export default function HistoryView({
  sessions = [],
  onSelectSession,
  onDeleteSession,
  onClearAllSessions,
  onNewTask,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (ts) => {
    if (!ts) return "Recently";
    const date = new Date(ts);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-title-wrap">
          <div className="view-icon-badge">
            <HistoryIcon size={22} />
          </div>
          <div>
            <h1 className="view-title">Task History</h1>
            <p className="view-subtitle">
              Review and continue your past tasks, plans, and AI conversations.
            </p>
          </div>
        </div>

        <div className="view-actions">
          {sessions.length > 0 && (
            <button
              className="action-danger-btn"
              onClick={onClearAllSessions}
              title="Clear all saved history"
            >
              <TrashIcon size={14} />
              <span>Clear History</span>
            </button>
          )}

          <button className="primary-cta-btn" onClick={onNewTask}>
            <PlusIcon size={15} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="history-search-bar">
          <SearchIcon size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search past tasks and discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="history-search-input"
          />
        </div>
      )}

      <div className="history-list-wrap">
        {sessions.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon-box">
              <HistoryIcon size={32} />
            </div>
            <h3>No past tasks found</h3>
            <p>
              When you submit prompts to Brain AI, your tasks and reasoning
              sessions will be automatically preserved here.
            </p>
            <button className="primary-cta-btn" onClick={onNewTask}>
              <span>Start your first task</span>
              <ArrowRightIcon size={14} />
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-card">
            <p>No tasks matched your search "{searchQuery}".</p>
          </div>
        ) : (
          <div className="history-grid">
            {filtered.map((session) => {
              const msgCount = session.messages?.length || 0;
              const firstTask =
                session.messages?.[0]?.task || session.title;

              return (
                <div key={session.id} className="history-card">
                  <div className="history-card-header">
                    <span className="history-card-date">
                      {formatDate(session.createdAt)}
                    </span>
                    <span className="history-card-badge">
                      {msgCount} {msgCount === 1 ? "turn" : "turns"}
                    </span>
                  </div>

                  <h3 className="history-card-title">{session.title}</h3>

                  <p className="history-card-preview">{firstTask}</p>

                  <div className="history-card-footer">
                    <button
                      className="history-resume-btn"
                      onClick={() => onSelectSession(session.id)}
                    >
                      <ChatIcon size={14} />
                      <span>Resume Conversation</span>
                    </button>

                    <button
                      className="history-delete-btn"
                      onClick={() => onDeleteSession(session.id)}
                      title="Delete this task"
                      aria-label="Delete this task"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
