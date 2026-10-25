import BrainEmblem from "./BrainEmblem";
import Composer from "./Composer";
import { PlanIcon, CodeIcon, SearchIcon, BrainIcon } from "./Icons";

const DEFAULT_SUGGESTIONS = [
  {
    icon: PlanIcon,
    title: "Plan a complex project",
    desc: "Create a detailed phase-by-phase execution roadmap",
    prompt: "Create a step-by-step plan to design, build, and deploy a full-stack SaaS application.",
    category: "Planning",
  },
  {
    icon: CodeIcon,
    title: "Explain a technical concept",
    desc: "Deep dive with clear real-world code examples",
    prompt: "Explain how React Server Components work compared to traditional SSR and Client Components with practical examples.",
    category: "Engineering",
  },
  {
    icon: SearchIcon,
    title: "Research and synthesize",
    desc: "Analyze findings and structure key takeaways",
    prompt: "Research the current state of autonomous AI agents in 2026, their architectures, and real-world enterprise adoption.",
    category: "Research",
  },
  {
    icon: BrainIcon,
    title: "Break down a complex task",
    desc: "Deconstruct into prioritized, manageable milestones",
    prompt: "Help me break down the process of migrating a monolithic backend into high-efficiency microservices.",
    category: "Strategy",
  },
];

export default function WelcomeScreen({
  taskInput,
  onTaskChange,
  onSubmitTask,
  onSelectSuggestion,
  isGenerating,
}) {
  return (
    <div className="welcome-container">
      <div className="welcome-hero">
        {/* Animated Centerpiece Emblem with outline-only Brain */}
        <div className="hero-emblem-wrap">
          <BrainEmblem size={88} />
        </div>

        <div className="welcome-pill">
          <span className="pill-dot" />
          <span>BRAIN AI WORKSPACE</span>
        </div>

        <h1 className="welcome-title">
          What would you like to <span className="text-gradient">accomplish?</span>
        </h1>

        <p className="welcome-subtitle">
          Brain AI helps you plan, reason, and execute complex technical tasks
          with intelligent guidance.
        </p>
      </div>

      {/* Main Composer on Welcome Screen */}
      <div className="welcome-composer-section">
        <Composer
          value={taskInput}
          onChange={onTaskChange}
          onSubmit={onSubmitTask}
          isGenerating={isGenerating}
          placeholder="Ask Brain AI to plan, code, research, or analyze a task..."
        />
      </div>

      {/* Suggested Prompts Grid */}
      <div className="suggestions-section">
        <div className="suggestions-header">
          <span className="suggestions-label">SUGGESTED STARTING POINTS</span>
          <span className="suggestions-divider" />
        </div>

        <div className="suggestions-grid">
          {DEFAULT_SUGGESTIONS.map((item, index) => {
            const IconComp = item.icon;
            return (
              <button
                key={index}
                className="suggestion-tile"
                onClick={() => onSelectSuggestion(item.prompt)}
                disabled={isGenerating}
                type="button"
              >
                <div className="tile-top">
                  <div className="tile-icon-box">
                    <IconComp size={16} />
                  </div>
                  <span className="tile-category">{item.category}</span>
                </div>
                <div className="tile-title">{item.title}</div>
                <div className="tile-desc">{item.desc}</div>
                <div className="tile-hover-indicator">
                  <span>Use prompt</span>
                  <span className="tile-arrow">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
