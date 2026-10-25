import { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import WelcomeScreen from "./components/WelcomeScreen";
import MessageItem from "./components/MessageItem";
import Composer from "./components/Composer";
import HistoryView from "./components/HistoryView";
import CapabilitiesView from "./components/CapabilitiesView";
import SettingsModal from "./components/SettingsModal";
import { checkBackendHealth, sendTaskToAI } from "./services/api";
import "./App.css";

const SESSIONS_STORAGE_KEY = "brain_ai_sessions_v1";
const LEGACY_SESSIONS_STORAGE_KEY = "taskpilot_sessions_v1";
const ACTIVE_SESSION_STORAGE_KEY = "brain_ai_active_session_v1";
const LEGACY_ACTIVE_SESSION_STORAGE_KEY = "taskpilot_active_session_v1";

function buildHistoryFromMessages(messages, upToMessageId = null) {
  const history = [];
  if (!Array.isArray(messages)) return history;

  for (const m of messages) {
    if (upToMessageId && m.id === upToMessageId) {
      break;
    }
    if (
      m.status === "success" &&
      typeof m.task === "string" &&
      typeof m.response === "string" &&
      m.task.trim() &&
      m.response.trim()
    ) {
      history.push({
        role: "user",
        parts: [{ text: m.task.trim() }],
      });
      history.push({
        role: "model",
        parts: [{ text: m.response.trim() }],
      });
    }
  }

  return history;
}

export default function App() {
  // Session history persisted in localStorage with backward compatibility
  const [sessions, setSessions] = useState(() => {
    try {
      const saved =
        localStorage.getItem(SESSIONS_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_SESSIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Restore active session ID or default to latest existing session
  const [activeSessionId, setActiveSessionId] = useState(() => {
    try {
      const savedActive =
        localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_ACTIVE_SESSION_STORAGE_KEY);
      const savedSessions =
        localStorage.getItem(SESSIONS_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_SESSIONS_STORAGE_KEY);
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (savedActive && parsed.some((s) => s.id === savedActive)) {
            return savedActive;
          }
          return parsed[0].id;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const activeSessionIdRef = useRef(activeSessionId);
  const [taskInput, setTaskInput] = useState("");
  const [activeNav, setActiveNav] = useState("Workspace");
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth > 900 : true;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Sync sessions to localStorage (both keys preserved)
  useEffect(() => {
    try {
      const serialized = JSON.stringify(sessions);
      localStorage.setItem(SESSIONS_STORAGE_KEY, serialized);
      localStorage.setItem(LEGACY_SESSIONS_STORAGE_KEY, serialized);
    } catch (err) {
      console.error("Failed to save sessions to localStorage:", err);
    }
  }, [sessions]);

  // Sync activeSessionId to localStorage & ref
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
    try {
      if (activeSessionId) {
        localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, activeSessionId);
        localStorage.setItem(LEGACY_ACTIVE_SESSION_STORAGE_KEY, activeSessionId);
      } else {
        localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
        localStorage.removeItem(LEGACY_ACTIVE_SESSION_STORAGE_KEY);
      }
    } catch (err) {
      console.error("Failed to save activeSessionId to localStorage:", err);
    }
  }, [activeSessionId]);

  // Check backend health on initial mount
  useEffect(() => {
    testBackendConnection();
  }, []);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K for new task
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        startNewTask();
      } else if (e.key === "Escape") {
        setIsSettingsOpen(false);
        if (window.innerWidth <= 768) {
          setIsSidebarOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Current active session & its messages
  const currentSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || null,
    [sessions, activeSessionId]
  );
  const currentMessages = useMemo(
    () => (currentSession ? currentSession.messages : []),
    [currentSession]
  );

  // Auto-scroll when messages change or loading completes
  useEffect(() => {
    if (autoScroll && messagesEndRef.current && currentMessages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages, isGenerating, autoScroll]);

  async function testBackendConnection() {
    setBackendStatus("Checking...");
    try {
      const data = await checkBackendHealth();
      if (data && data.success && data.status === "healthy") {
        setBackendStatus("Connected");
      } else {
        setBackendStatus("Unexpected response");
      }
    } catch (error) {
      setBackendStatus("Connection failed");
      console.warn("Backend connection check failed:", error);
    }
  }

  function startNewTask() {
    activeSessionIdRef.current = null;
    setActiveSessionId(null);
    setTaskInput("");
    setActiveNav("Workspace");
  }

  function handleSelectSession(sessionId) {
    activeSessionIdRef.current = sessionId;
    setActiveSessionId(sessionId);
    setActiveNav("Workspace");
  }

  function handleDeleteSession(sessionId) {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionIdRef.current === sessionId) {
      activeSessionIdRef.current = null;
      setActiveSessionId(null);
    }
  }

  function handleClearAllSessions() {
    setSessions([]);
    activeSessionIdRef.current = null;
    setActiveSessionId(null);
  }

  async function submitTask(explicitPrompt) {
    const promptToSend = (explicitPrompt !== undefined ? explicitPrompt : taskInput).trim();
    if (!promptToSend || isGenerating) return;

    // Use activeSessionIdRef to avoid stale closures during rapid state changes
    let targetSessionId = activeSessionIdRef.current || activeSessionId;
    const now = Date.now();
    const newMessageId = `msg-${now}-${Math.random().toString(36).slice(2, 7)}`;

    const newMsg = {
      id: newMessageId,
      task: promptToSend,
      response: "",
      status: "loading",
      timestamp: now,
    };

    // If starting a brand new conversation without an active session
    if (!targetSessionId) {
      targetSessionId = `session-${now}`;
      activeSessionIdRef.current = targetSessionId;
      setActiveSessionId(targetSessionId);

      const title =
        promptToSend.length > 42
          ? promptToSend.slice(0, 40) + "..."
          : promptToSend;

      const newSession = {
        id: targetSessionId,
        title,
        createdAt: now,
        messages: [newMsg],
      };

      setSessions((prev) => [newSession, ...prev]);
    } else {
      // Append new user message to existing active session
      activeSessionIdRef.current = targetSessionId;
      setActiveSessionId(targetSessionId);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? { ...s, messages: [...s.messages, newMsg] }
            : s
        )
      );
    }

    // Build context history from completed messages in the target session only
    const existingSession = sessions.find((s) => s.id === targetSessionId);
    const history = buildHistoryFromMessages(
      existingSession ? existingSession.messages : []
    );

    setTaskInput("");
    setActiveNav("Workspace");
    setIsGenerating(true);

    try {
      const aiResponse = await sendTaskToAI(promptToSend, history);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === newMessageId
                    ? { ...m, response: aiResponse, status: "success" }
                    : m
                ),
              }
            : s
        )
      );
    } catch (error) {
      console.error("Task execution error:", error);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === newMessageId
                    ? {
                        ...m,
                        response:
                          error.message ||
                          "Could not connect to the backend or AI service. Please verify your connection and try again.",
                        status: "error",
                      }
                    : m
                ),
              }
            : s
        )
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRetry(taskText, messageId) {
    if (isGenerating) return;
    const targetSessionId = activeSessionIdRef.current || activeSessionId;
    if (!targetSessionId) {
      submitTask(taskText);
      return;
    }

    if (messageId) {
      setIsGenerating(true);
      const existingSession = sessions.find((s) => s.id === targetSessionId);
      const history = buildHistoryFromMessages(
        existingSession ? existingSession.messages : [],
        messageId
      );

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === messageId
                    ? { ...m, response: "", status: "loading" }
                    : m
                ),
              }
            : s
        )
      );

      try {
        const aiResponse = await sendTaskToAI(taskText, history);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === targetSessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === messageId
                      ? { ...m, response: aiResponse, status: "success" }
                      : m
                  ),
                }
              : s
          )
        );
      } catch (error) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === targetSessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === messageId
                      ? {
                          ...m,
                          response: error.message || "Failed to regenerate response.",
                          status: "error",
                        }
                      : m
                  ),
                }
              : s
          )
        );
      } finally {
        setIsGenerating(false);
      }
    } else {
      submitTask(taskText);
    }
  }

  function handleSelectSuggestion(suggestionPrompt) {
    submitTask(suggestionPrompt);
  }

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        onNewTask={startNewTask}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        backendStatus={backendStatus}
      />

      {/* Main Content Area */}
      <div className="main-viewport">
        <Topbar
          activeNav={activeNav}
          currentChatTitle={currentSession ? currentSession.title : null}
          backendStatus={backendStatus}
          onCheckBackend={testBackendConnection}
          onNewTask={startNewTask}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="workspace-area">
          {activeNav === "Workspace" ? (
            currentMessages.length === 0 ? (
              /* Beautiful Centered Welcome Screen */
              <div className="scroll-wrapper welcome-scroll">
                <WelcomeScreen
                  taskInput={taskInput}
                  onTaskChange={setTaskInput}
                  onSubmitTask={(prompt) => submitTask(prompt)}
                  onSelectSuggestion={handleSelectSuggestion}
                  isGenerating={isGenerating}
                />
              </div>
            ) : (
              /* Multi-Turn Conversation Thread */
              <div className="conversation-container">
                <div className="scroll-wrapper chat-scroll" ref={scrollContainerRef}>
                  <div className="chat-thread-inner">
                    <div className="conversation-header-strip">
                      <h2 className="thread-title">
                        {currentSession?.title || "Active Discussion"}
                      </h2>
                      <span className="thread-subtitle">
                        Brain AI execution thread
                      </span>
                    </div>

                    {currentMessages.map((msg) => (
                      <MessageItem
                        key={msg.id}
                        message={msg}
                        onRetry={handleRetry}
                        isGenerating={isGenerating}
                      />
                    ))}

                    <div ref={messagesEndRef} className="scroll-anchor" />
                  </div>
                </div>

                {/* Pinned Bottom Composer */}
                <div className="chat-pinned-composer">
                  <div className="pinned-composer-inner">
                    <Composer
                      value={taskInput}
                      onChange={setTaskInput}
                      onSubmit={(prompt) => submitTask(prompt)}
                      isGenerating={isGenerating}
                      placeholder="Follow up or give another task... (Shift + Enter for new line)"
                    />
                    <div className="composer-disclaimer">
                      Brain AI helps you plan and execute tasks. Review important information.
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : activeNav === "Task history" ? (
            <div className="scroll-wrapper">
              <HistoryView
                sessions={sessions}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
                onClearAllSessions={handleClearAllSessions}
                onNewTask={startNewTask}
              />
            </div>
          ) : activeNav === "Tools & agents" ? (
            <div className="scroll-wrapper">
              <CapabilitiesView
                onStartWithPrompt={(prompt) => {
                  setActiveNav("Workspace");
                  submitTask(prompt);
                }}
                backendStatus={backendStatus}
              />
            </div>
          ) : null}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        backendStatus={backendStatus}
        onCheckBackend={testBackendConnection}
        onClearAllSessions={handleClearAllSessions}
        autoScroll={autoScroll}
        onToggleAutoScroll={setAutoScroll}
      />
    </div>
  );
}
