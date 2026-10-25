export default function BrainEmblem({ size = 88, className = "" }) {
  // Sizing calculations for responsive scaling while keeping layout contained
  const svgWidth = Math.round(size * 0.76);
  const svgHeight = Math.round(size * 0.76);

  return (
    <div
      className={`brain-emblem-wrap ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Brain AI Animated Outline Emblem"
    >
      {/* Background radial ambient glow aura */}
      <div className="brain-ambient-halo" />

      {/* Orbital Ring 1 with moving cyan particle */}
      <div className="brain-orbit-track brain-orbit-1">
        <span className="brain-particle particle-cyan" />
      </div>

      {/* Orbital Ring 2 with moving indigo particle */}
      <div className="brain-orbit-track brain-orbit-2">
        <span className="brain-particle particle-indigo" />
      </div>

      {/* Orbital Ring 3 (tilted ellipse) with moving violet particle */}
      <div className="brain-orbit-track brain-orbit-3">
        <span className="brain-particle particle-violet" />
      </div>

      {/* Floating Outline-Only Brain Core */}
      <div className="brain-float-container">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox="48 35 214 214"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="brain-outline-svg"
        >
          <defs>
            {/* Electric Blue to Neon Violet Gradient */}
            <linearGradient
              id="brainNeonStroke"
              x1="55"
              y1="45"
              x2="255"
              y2="240"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* Traveling Shimmer Gradient */}
            <linearGradient
              id="brainShimmerGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="brainGlowFilter" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/*
            RECOGNIZABLE OUTLINE-ONLY BRAIN CONTOURS:
            Every path has fill="none" ensuring 100% transparent interior.
            The dark workspace background shows through.
          */}
          <g
            filter="url(#brainGlowFilter)"
            stroke="url(#brainNeonStroke)"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer Cerebral Cortex Boundary (Frontal -> Parietal -> Occipital -> Cerebellum -> Stem -> Temporal) */}
            <path
              d="M 95 195
                 C 80 185, 68 170, 62 152
                 C 55 133, 56 112, 65 94
                 C 74 76, 90 62, 108 53
                 C 126 44, 148 42, 168 45
                 C 188 48, 207 57, 222 71
                 C 238 85, 248 104, 252 124
                 C 255 142, 251 161, 240 176
                 C 232 187, 221 195, 208 200
                 C 198 204, 186 206, 175 204
                 C 168 203, 163 207, 160 214
                 C 157 221, 154 230, 150 236
                 C 146 242, 138 245, 132 243
                 C 127 241, 126 233, 128 225
                 C 130 216, 133 206, 131 197
                 C 128 188, 121 184, 112 185
                 C 105 186, 99 191, 95 195 Z"
              strokeWidth="2.6"
              fill="none"
            />

            {/* Frontal Lobe & Motor Strip Sulci */}
            <path
              d="M 68 120
                 C 82 116, 98 122, 110 115
                 C 122 108, 128 92, 138 84
                 C 148 76, 162 76, 172 82
                 C 180 87, 185 96, 192 102
                 C 200 109, 212 110, 222 106"
              strokeWidth="2.1"
              fill="none"
            />

            <path
              d="M 90 68
                 C 102 78, 112 92, 114 106
                 C 115 116, 108 126, 100 132
                 C 92 138, 80 140, 72 134"
              strokeWidth="1.9"
              fill="none"
            />

            <path
              d="M 124 50
                 C 134 62, 140 78, 142 94
                 C 144 106, 138 118, 130 126
                 C 122 134, 110 138, 102 146"
              strokeWidth="1.9"
              fill="none"
            />

            {/* Parietal & Sensory Cortex Convolutions */}
            <path
              d="M 160 48
                 C 168 62, 172 78, 172 94
                 C 172 108, 164 122, 156 132
                 C 148 142, 138 152, 136 166"
              strokeWidth="2"
              fill="none"
            />

            <path
              d="M 194 58
                 C 198 72, 198 88, 194 102
                 C 190 114, 180 124, 174 136
                 C 168 148, 168 162, 172 174"
              strokeWidth="1.9"
              fill="none"
            />

            {/* Occipital Lobe Gyri (Rear) */}
            <path
              d="M 226 80
                 C 224 94, 218 108, 214 122
                 C 210 136, 210 152, 218 164
                 C 224 172, 234 178, 242 170"
              strokeWidth="2"
              fill="none"
            />

            <path
              d="M 242 108
                 C 234 116, 226 126, 224 138
                 C 222 148, 226 158, 234 164"
              strokeWidth="1.8"
              fill="none"
            />

            {/* Temporal Lobe Contours (Lower Middle) */}
            <path
              d="M 82 155
                 C 96 148, 112 150, 126 156
                 C 140 162, 154 168, 170 166
                 C 182 164, 194 156, 204 150"
              strokeWidth="2"
              fill="none"
            />

            <path
              d="M 98 174
                 C 112 166, 128 168, 142 174
                 C 152 178, 162 184, 174 182"
              strokeWidth="1.8"
              fill="none"
            />

            {/* Cerebellum Intricate Layered Folia (Lower Rear) */}
            <path
              d="M 182 192
                 C 192 188, 204 186, 216 188
                 C 224 190, 230 196, 228 202
                 C 224 208, 214 210, 204 210
                 C 194 210, 186 206, 178 202"
              strokeWidth="1.8"
              fill="none"
            />

            <path
              d="M 190 198
                 C 200 196, 210 196, 218 198
                 C 224 200, 226 206, 220 210
                 C 212 214, 202 214, 192 212"
              strokeWidth="1.6"
              fill="none"
            />

            <path
              d="M 178 208
                 C 186 214, 196 216, 206 216
                 C 214 216, 220 220, 216 224
                 C 210 228, 198 226, 188 222
                 C 180 218, 174 214, 170 210"
              strokeWidth="1.6"
              fill="none"
            />

            {/* Brainstem / Spinal Tract Contours */}
            <path
              d="M 138 200
                 C 142 210, 144 222, 142 234
                 C 140 240, 136 244, 132 242"
              strokeWidth="2.1"
              fill="none"
            />

            <path
              d="M 148 202
                 C 152 212, 154 224, 150 236"
              strokeWidth="1.9"
              fill="none"
            />

            {/* Internal Neural Synapse Light Nodes */}
            <circle cx="95" cy="94" r="2.2" fill="#00f0ff" />
            <circle cx="142" cy="74" r="2.4" fill="#38bdf8" />
            <circle cx="172" cy="94" r="2.2" fill="#818cf8" />
            <circle cx="214" cy="122" r="2.5" fill="#c084fc" />
            <circle cx="126" cy="146" r="2.2" fill="#38bdf8" />
            <circle cx="170" cy="166" r="2.4" fill="#c084fc" />
            <circle cx="204" cy="200" r="2" fill="#818cf8" />
          </g>

          {/* Traveling Shimmer Overlay Lines */}
          <g stroke="url(#brainShimmerGrad)" strokeLinecap="round" fill="none">
            {/* Shimmer line 1 along Sylvian fissure and temporal lobe */}
            <path
              d="M 75 142
                 C 92 136, 110 140, 126 146
                 C 142 152, 160 154, 176 148
                 C 190 142, 202 132, 216 130"
              strokeWidth="2.4"
              strokeDasharray="25 100"
              className="brain-shimmer-stroke"
            />

            {/* Shimmer line 2 along superior motor strip */}
            <path
              d="M 108 53
                 C 126 44, 148 42, 168 45
                 C 188 48, 207 57, 222 71"
              strokeWidth="2.2"
              strokeDasharray="20 90"
              className="brain-shimmer-stroke-alt"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
