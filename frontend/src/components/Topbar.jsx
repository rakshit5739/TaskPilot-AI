import {
  MenuIcon,
  SidebarCollapseIcon,
  PlusIcon,
  RefreshIcon,
  SettingsIcon,
} from "./Icons";

export default function Topbar({
  activeNav,
  currentChatTitle,
  backendStatus,
  onCheckBackend,
  onNewTask,
  onOpenSettings,
  isSidebarOpen,
  onToggleSidebar,
}) {
  const isConnected = backendStatus === "Connected";
  const isChecking = backendStatus === "Checking...";
  const isFailed = backendStatus === "Connection failed";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-icon-btn mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <MenuIcon size={19} />
        </button>

        <button
          className="topbar-icon-btn desktop-collapse-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <SidebarCollapseIcon size={18} isCollapsed={!isSidebarOpen} />
        </button>

        <div className="topbar-breadcrumb">
          <span className="brand-breadcrumb">Brain AI</span>
          <span className="breadcrumb-slash">/</span>
          <span className="active-view-name">
            {activeNav === "Workspace"
              ? currentChatTitle || "New Task"
              : activeNav}
          </span>
        </div>

        <span className="model-chip" title="Active AI model">
          <span className="model-dot" />
          Brain 2.5 Flash
        </span>
      </div>

      <div className="topbar-right">
        {/* Backend health status pill */}
        <div
          className={`backend-status-pill ${
            isConnected ? "status-connected" : isFailed ? "status-failed" : "status-unknown"
          }`}
          title={`Backend status: ${backendStatus}. Click refresh to test connection.`}
        >
          <span className="status-dot" />
          <span className="status-text">
            {isChecking
              ? "Checking..."
              : isConnected
              ? "Backend Active"
              : isFailed
              ? "Offline"
              : "Not tested"}
          </span>
          <button
            className="status-refresh-btn"
            onClick={onCheckBackend}
            disabled={isChecking}
            aria-label="Refresh backend connection"
            title="Recheck backend health"
          >
            <RefreshIcon size={12} className={isChecking ? "rotating" : ""} />
          </button>
        </div>

        <button
          className="topbar-action-btn new-task-top-btn"
          onClick={onNewTask}
          title="Start new task (⌘K)"
        >
          <PlusIcon size={15} />
          <span>New Task</span>
        </button>

        <button
          className="topbar-icon-btn"
          onClick={onOpenSettings}
          title="Settings"
          aria-label="Open settings"
        >
          <SettingsIcon size={17} />
        </button>
      </div>
    </header>
  );
}
