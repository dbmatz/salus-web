const CENTER = 100;
const SEPALS = Array.from({ length: 5 }, (_, i) => i * 72);
const PETALS = Array.from({ length: 5 }, (_, i) => i * 72 + 36);
const OUTER_FILAMENTS = Array.from({ length: 40 }, (_, i) => i * 9);
const INNER_FILAMENTS = Array.from({ length: 40 }, (_, i) => i * 9 + 4.5);
const STAMENS = Array.from({ length: 5 }, (_, i) => i * 72 + 36);

function rotate(angle: number) {
  return `rotate(${angle} ${CENTER} ${CENTER})`;
}

export function PassionFlower({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {SEPALS.map((angle) => (
        <ellipse
          key={`sepal-${angle}`}
          cx={CENTER}
          cy="38"
          rx="15"
          ry="40"
          transform={rotate(angle)}
          className="fill-secondary stroke-border"
          strokeWidth="1"
        />
      ))}
      {PETALS.map((angle) => (
        <ellipse
          key={`petal-${angle}`}
          cx={CENTER}
          cy="42"
          rx="14"
          ry="36"
          transform={rotate(angle)}
          className="fill-card stroke-border"
          strokeWidth="1"
        />
      ))}
      {OUTER_FILAMENTS.map((angle) => (
        <line
          key={`outer-${angle}`}
          x1={CENTER}
          y1="48"
          x2={CENTER}
          y2="72"
          transform={rotate(angle)}
          className="stroke-primary"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
      {INNER_FILAMENTS.map((angle) => (
        <line
          key={`inner-${angle}`}
          x1={CENTER}
          y1="58"
          x2={CENTER}
          y2="72"
          transform={rotate(angle)}
          className="stroke-chart-4"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
      <circle cx={CENTER} cy={CENTER} r="26" className="fill-secondary" />
      {STAMENS.map((angle) => (
        <g key={`stamen-${angle}`} transform={rotate(angle)}>
          <line
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2="86"
            className="stroke-foreground/40"
            strokeWidth="1.5"
          />
          <ellipse
            cx={CENTER}
            cy="84"
            rx="5"
            ry="3"
            className="fill-accent stroke-foreground/30"
            strokeWidth="1"
          />
        </g>
      ))}
      <circle cx={CENTER} cy={CENTER} r="8" className="fill-accent" />
    </svg>
  );
}
