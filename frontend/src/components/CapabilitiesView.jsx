import { SparklesIcon, BrainIcon, CodeIcon, PlanIcon, TerminalIcon, ArrowRightIcon } from "./Icons";

export default function CapabilitiesView({ onStartWithPrompt, backendStatus }) {
  const isConnected = backendStatus === "Connected";

  const capabilities = [
    {
      icon: BrainIcon,
      title: "Reasoning & Task Decomposition",
      desc: "Breaks complex multifaceted engineering, research, and operational objectives into clear sequential phases.",
      status: "Active",
      example: "Break down the implementation of OAuth2 authentication in Node.js",
    },
    {
      icon: CodeIcon,
      title: "Code Architecture & Synthesis",
      desc: "Generates production-grade algorithms, boilerplate, refactors, and explains complex syntax with markdown formatting.",
      status: "Active",
      example: "Write a high-performance LRU cache in JavaScript with time complexity analysis",
    },
    {
      icon: PlanIcon,
      title: "Project Roadmapping",
      desc: "Structures product launches, technical debt remediation, and sprint plans with realistic time estimates.",
      status: "Active",
      example: "Create a 4-week execution plan to migrate a database to PostgreSQL with zero downtime",
    },
    {
      icon: TerminalIcon,
      title: "Full-Stack Express + AI Engine",
      desc: "Secure backend bridge ensuring your API key remains 100% server-side with rate limiting & retry handling.",
      status: isConnected ? "Online" : "Checking",
      example: "Generate unit tests for an asynchronous REST controller with edge cases",
    },
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-title-wrap">
          <div className="view-icon-badge">
            <SparklesIcon size={22} />
          </div>
          <div>
            <h1 className="view-title">Tools & Capabilities</h1>
            <p className="view-subtitle">
              Brain AI combines advanced reasoning engines with task execution workflows.
            </p>
          </div>
        </div>
      </div>

      <div className="capabilities-grid">
        {capabilities.map((cap, idx) => {
          const IconC = cap.icon;
          return (
            <div key={idx} className="capability-card">
              <div className="cap-top">
                <div className="cap-icon-box">
                  <IconC size={20} />
                </div>
                <span
                  className={`cap-status-badge ${
                    cap.status === "Active" || cap.status === "Online"
                      ? "status-active"
                      : "status-pending"
                  }`}
                >
                  {cap.status}
                </span>
              </div>

              <h3 className="cap-title">{cap.title}</h3>
              <p className="cap-desc">{cap.desc}</p>

              <div className="cap-example-box">
                <span className="cap-example-label">Try prompt:</span>
                <p className="cap-example-text">"{cap.example}"</p>
                <button
                  className="cap-run-btn"
                  onClick={() => onStartWithPrompt(cap.example)}
                >
                  <span>Launch Task</span>
                  <ArrowRightIcon size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="architecture-note-card">
        <div className="note-header">
          <TerminalIcon size={18} />
          <span>Architecture Transparency</span>
        </div>
        <p>
          Brain AI operates in pair-programming and task-planning mode. Prompts are dispatched to the secure backend on port 5001, which delegates to the neural reasoning service and returns structured, actionable responses rendered in rich Markdown.
        </p>
      </div>
    </div>
  );
}
