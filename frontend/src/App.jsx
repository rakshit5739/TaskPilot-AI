
import { useState } from "react";
import {
  checkBackendHealth,
  sendTaskToAI,
} from "./services/api";
import "./App.css";

const suggestions = [
  {
    icon: "✧",
    title: "Plan a project",
    description: "Break a big goal into actionable steps",
    prompt:
      "Create a step-by-step plan to build a personal portfolio website.",
  },
  {
    icon: "⌘",
    title: "Research a topic",
    description: "Organize research into useful findings",
    prompt: "Create a research plan to understand how AI agents work.",
  },
  {
    icon: "↗",
    title: "Solve a problem",
    description: "Think through a problem systematically",
    prompt: "Help me create a practical weekly productivity plan.",
  },
];

function App() {
  const [task, setTask] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeNav, setActiveNav] = useState("Workspace");
  const [backendStatus, setBackendStatus] = useState("Not tested");
  const [isGenerating, setIsGenerating] = useState(false);

  async function testBackendConnection() {
    setBackendStatus("Checking...");

    try {
      const data = await checkBackendHealth();

      if (data.success && data.status === "healthy") {
        setBackendStatus("Connected");
      } else {
        setBackendStatus("Unexpected response");
      }
    } catch (error) {
      setBackendStatus("Connection failed");
      console.error("Backend connection error:", error);
    }
  }

  async function submitTask(value = task) {
    const cleanTask = value.trim();

    if (!cleanTask || isGenerating) return;

    const messageId = `${Date.now()}-${Math.random()}`;

    // Add the user's task immediately and mark it as processing.
    setMessages((previous) => [
      ...previous,
      {
        id: messageId,
        task: cleanTask,
        response: "",
        status: "loading",
      },
    ]);

    setTask("");
    setActiveNav("Workspace");
    setIsGenerating(true);

    try {
      // Ask our backend to generate a real Gemini response.
      const aiResponse = await sendTaskToAI(cleanTask);

      setMessages((previous) =>
        previous.map((message) =>
          message.id === messageId
            ? {
                ...message,
                response: aiResponse,
                status: "success",
              }
            : message
        )
      );
    } catch (error) {
      console.error("AI task error:", error);

      setMessages((previous) =>
        previous.map((message) =>
          message.id === messageId
            ? {
                ...message,
                response:
                  error.message ||
                  "Something went wrong. Please try again.",
                status: "error",
              }
            : message
        )
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function startNewTask() {
    setMessages([]);
    setTask("");
    setActiveNav("Workspace");
  }

  const backendConnected = backendStatus === "Connected";

  function handleTaskKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      if (!isGenerating) {
        submitTask();
      }
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={startNewTask}>
          <span className="brand-mark">
            <span>✳</span>
          </span>

          <span className="brand-copy">
            <strong>
              TaskPilot<span> AI</span>
            </strong>
            <small>YOUR INTELLIGENT WORKSPACE</small>
          </span>
        </button>

        <button className="new-task-button" onClick={startNewTask}>
          <span>＋</span> New task
          <span className="shortcut">⌘ K</span>
        </button>

        <div className="nav-label">WORKSPACE</div>

        <nav className="navigation">
          {[
            ["Workspace", "◈"],
            ["Task history", "◷"],
            ["Tools & agents", "✧"],
          ].map(([label, icon]) => (
            <button
              key={label}
              className={`nav-item ${
                activeNav === label ? "active" : ""
              }`}
              onClick={() => setActiveNav(label)}
            >
              <span className="nav-icon">{icon}</span>
              {label}

              {label === "Task history" && messages.length > 0 && (
                <span className="nav-count">{messages.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <div className="nav-label">RECENT ACTIVITY</div>

        <div className="recent-list">
          {messages.length === 0 ? (
            <p className="empty-recent">
              Your recent tasks will appear here.
            </p>
          ) : (
            messages
              .slice(-5)
              .reverse()
              .map((message) => (
                <button
                  className="recent-item"
                  key={message.id}
                  onClick={() => setActiveNav("Workspace")}
                >
                  <span>↳</span>
                  <span>{message.task}</span>
                </button>
              ))
          )}
        </div>

        <div className="sidebar-bottom">
          <div className="system-card">
            <div className="system-heading">
              <span className="status-dot" />
              <span>LOCAL SYSTEM</span>
              <span className="system-live">READY</span>
            </div>

            <div className="system-caption">
              Interface operational
            </div>

            <div className="system-bars">
              {[
                35, 55, 42, 76, 48, 88, 62, 38, 72,
                52, 91, 44, 68, 36, 59, 81, 47, 70,
              ].map((height, index) => (
                <span
                  key={index}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <button
            className="profile-button"
            onClick={() => setActiveNav("Settings")}
          >
            <span className="avatar">TP</span>

            <span className="profile-copy">
              <strong>TaskPilot User</strong>
              <small>Personal workspace</small>
            </span>

            <span className="profile-menu">···</span>
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span>TaskPilot AI</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{activeNav}</strong>
          </div>

          <div className="topbar-right">
            <span
              className="connection-status"
              aria-live="polite"
              title="Backend connection status"
            >
              <span
                className="status-dot"
                style={{
                  backgroundColor: backendConnected
                    ? "#4ade80"
                    : backendStatus === "Connection failed"
                      ? "#f87171"
                      : "#fbbf24",
                }}
              />

              {backendStatus === "Not tested"
                ? "Backend not tested"
                : backendStatus === "Checking..."
                  ? "Connecting..."
                  : backendStatus === "Connected"
                    ? "Backend connected"
                    : backendStatus}
            </span>

            <span className="topbar-divider" />

            <button
              className="icon-button"
              title="Test backend connection"
              aria-label="Test backend connection"
              onClick={testBackendConnection}
              disabled={backendStatus === "Checking..."}
            >
              ↻
            </button>

            <button
              className="icon-button"
              title="New task"
              aria-label="New task"
              onClick={startNewTask}
            >
              ↗
            </button>
          </div>
        </header>

        <section className="workspace">
          {activeNav === "Workspace" ? (
            <>
              {messages.length === 0 ? (
                <div className="welcome-section">
                  <div className="orbital-logo">
                    <div className="orbital-ring ring-one" />
                    <div className="orbital-ring ring-two" />
                    <div className="orbital-core">✳</div>
                    <span className="orbit-point point-one" />
                    <span className="orbit-point point-two" />
                  </div>

                  <div className="eyebrow">
                    <span className="eyebrow-line" />
                    YOUR AI, READY FOR ACTION
                    <span className="eyebrow-line" />
                  </div>

                  <h1>
                    Good to see you.
                    <br />
                    <span>What are we building today?</span>
                  </h1>

                  <p className="welcome-description">
                    Give TaskPilot a goal. We'll build toward an intelligent
                    agent that can plan, reason, and use tools to get work
                    done.
                  </p>

                  <form
                    className="task-composer"
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitTask();
                    }}
                  >
                    <textarea
                      value={task}
                      onChange={(event) => setTask(event.target.value)}
                      onKeyDown={handleTaskKeyDown}
                      placeholder="Give your agent a task to work on..."
                      rows={2}
                      aria-label="Describe your task"
                    />

                    <div className="composer-footer">
                      <div className="composer-hint">
                        <span className="hint-symbol">✧</span>
                        Clear goals lead to better plans
                      </div>

                      <button
                        className="send-button"
                        type="submit"
                        disabled={!task.trim() || isGenerating}
                      >
                        {isGenerating ? "Thinking..." : "Run task"}
                        <span>{isGenerating ? "…" : "↑"}</span>
                      </button>
                    </div>
                  </form>

                  <div className="suggestion-heading">
                    <span>NOT SURE WHERE TO START?</span>
                    <span className="suggestion-line" />
                  </div>

                  <div className="suggestion-grid">
                    {suggestions.map((suggestion) => (
                      <button
                        className="suggestion-card"
                        key={suggestion.title}
                        disabled={isGenerating}
                        onClick={() => submitTask(suggestion.prompt)}
                      >
                        <span className="suggestion-icon">
                          {suggestion.icon}
                        </span>

                        <span className="suggestion-title">
                          {suggestion.title}
                        </span>

                        <span className="suggestion-description">
                          {suggestion.description}
                        </span>

                        <span className="suggestion-arrow">↗</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="conversation">
                  <div className="conversation-heading">
                    <span className="conversation-kicker">
                      TASK WORKSPACE
                    </span>
                    <h1>Let's work through it.</h1>
                    <p>
                      TaskPilot is processing your requests with Gemini.
                    </p>
                  </div>

                  {messages.map((message) => (
                    <article
                      className="message-block"
                      key={message.id}
                    >
                      <div className="message-user">
                        <span className="avatar small-avatar">YOU</span>

                        <div>
                          <span className="message-label">YOUR TASK</span>
                          <p>{message.task}</p>
                        </div>
                      </div>

                      <div className="agent-response">
                        <div className="response-heading">
                          <span className="response-mark">✳</span>
                          <strong>TaskPilot</strong>

                          {message.status === "loading" && (
                            <span className="demo-badge">
                              THINKING
                            </span>
                          )}

                          {message.status === "success" && (
                            <span className="demo-badge">
                              GEMINI AI
                            </span>
                          )}

                          {message.status === "error" && (
                            <span className="demo-badge">
                              ERROR
                            </span>
                          )}
                        </div>

                        {message.status === "loading" ? (
                          <div
                            className="ai-loading"
                            role="status"
                            aria-live="polite"
                          >
                            <span className="loading-indicator">✧</span>
                            <p>Gemini is thinking about your task...</p>
                          </div>
                        ) : message.status === "error" ? (
                          <div role="alert">
                            <h3>We couldn't complete that request.</h3>
                            <p>{message.response}</p>
                            <button
                              className="send-button"
                              onClick={() => submitTask(message.task)}
                              disabled={isGenerating}
                            >
                              Try again <span>↻</span>
                            </button>
                          </div>
                        ) : (
                          <div className="ai-response-text">
                            {message.response}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}

                  <form
                    className="task-composer followup-composer"
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitTask();
                    }}
                  >
                    <textarea
                      value={task}
                      onChange={(event) => setTask(event.target.value)}
                      onKeyDown={handleTaskKeyDown}
                      placeholder="Describe another task..."
                      rows={2}
                      aria-label="Add another task"
                    />

                    <div className="composer-footer">
                      <span className="composer-hint">
                        Shift + Enter for a new line
                      </span>

                      <button
                        className="send-button"
                        type="submit"
                        disabled={!task.trim() || isGenerating}
                      >
                        {isGenerating ? "Thinking..." : "Send"}
                        <span>{isGenerating ? "…" : "↑"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="placeholder-view">
              <div className="placeholder-icon">✳</div>
              <span className="conversation-kicker">TASKPILOT AI</span>
              <h1>{activeNav}</h1>

              <p>
                This section is part of the workspace design. We'll implement
                its functionality as the agent evolves.
              </p>

              <button className="send-button" onClick={startNewTask}>
                Return to workspace <span>↗</span>
              </button>
            </div>
          )}

          <footer className="workspace-footer">
            <span>
              <span className="footer-dot" /> Built for thoughtful execution
            </span>
            <span>
              TaskPilot AI <span className="footer-separator">·</span> Early
              access
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
