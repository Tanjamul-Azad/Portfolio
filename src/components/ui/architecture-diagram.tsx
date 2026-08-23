import type { ArchitectureDiagram as DiagramData } from "@/types";

/**
 * Layered architecture diagram, drawn as inline SVG.
 *
 * Inline rather than an image file so it inherits the page's theme (every colour
 * is a currentColor-derived token, so it reads correctly in light and dark), the
 * text stays real text for search and screen readers, and it scales without
 * blurring. Layout is computed from the data, so a diagram is described by
 * naming its layers rather than by positioning anything by hand.
 */

const WIDTH = 880;
const PAD_X = 24;
const LABEL_H = 22;
const NODE_H = 62;
const LAYER_GAP = 46; // vertical room for the connector between two layers
const PAD_Y = 12;

const LAYER_BLOCK = LABEL_H + 10 + NODE_H;

/** Split a label into at most two balanced lines so long names stay inside the box. */
function wrap(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current && (current + " " + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

export function ArchitectureDiagram({
  diagram,
  accent = "#f59e0b",
}: {
  diagram: DiagramData;
  accent?: string;
}) {
  const { caption, layers } = diagram;
  const height =
    PAD_Y * 2 + layers.length * LAYER_BLOCK + Math.max(0, layers.length - 1) * LAYER_GAP;

  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/60">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          width="100%"
          role="img"
          aria-label={caption}
          className="min-w-140 text-neutral-900 dark:text-neutral-100"
        >
          <title>{caption}</title>

          <defs>
            <marker
              id="arch-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={accent} />
            </marker>
          </defs>

          {layers.map((layer, layerIndex) => {
            const top = PAD_Y + layerIndex * (LAYER_BLOCK + LAYER_GAP);
            const nodesTop = top + LABEL_H + 10;
            const count = layer.nodes.length;
            const usable = WIDTH - PAD_X * 2;
            const gap = 14;
            const nodeW = (usable - gap * (count - 1)) / count;

            return (
              <g key={layer.title}>
                <text
                  x={PAD_X}
                  y={top + 13}
                  fontSize="11"
                  fontWeight="600"
                  letterSpacing="1.6"
                  fill="currentColor"
                  opacity="0.45"
                >
                  {layer.title.toUpperCase()}
                </text>

                {layer.nodes.map((node, nodeIndex) => {
                  const x = PAD_X + nodeIndex * (nodeW + gap);
                  const lines = wrap(node.label, Math.floor(nodeW / 7.4));
                  const hasDetail = Boolean(node.detail);
                  // Nudge the label up when a detail line sits below it.
                  const firstLineY =
                    nodesTop + NODE_H / 2 - (lines.length - 1) * 7 - (hasDetail ? 7 : 0) + 4;

                  return (
                    <g key={node.label}>
                      <rect
                        x={x}
                        y={nodesTop}
                        width={nodeW}
                        height={NODE_H}
                        rx="10"
                        fill="currentColor"
                        opacity="0.045"
                      />
                      <rect
                        x={x}
                        y={nodesTop}
                        width={nodeW}
                        height={NODE_H}
                        rx="10"
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.18"
                      />
                      {/* Accent stripe ties each box back to the project colour. */}
                      <rect
                        x={x}
                        y={nodesTop}
                        width="3"
                        height={NODE_H}
                        rx="1.5"
                        fill={accent}
                        opacity="0.85"
                      />
                      {lines.map((line, i) => (
                        <text
                          key={line}
                          x={x + nodeW / 2}
                          y={firstLineY + i * 14}
                          fontSize="12.5"
                          fontWeight="600"
                          textAnchor="middle"
                          fill="currentColor"
                        >
                          {line}
                        </text>
                      ))}
                      {node.detail && (
                        <text
                          x={x + nodeW / 2}
                          y={firstLineY + lines.length * 14 + 2}
                          fontSize="10.5"
                          textAnchor="middle"
                          fill="currentColor"
                          opacity="0.55"
                        >
                          {node.detail}
                        </text>
                      )}
                    </g>
                  );
                })}

                {layerIndex < layers.length - 1 && (
                  <g>
                    <line
                      x1={WIDTH / 2}
                      y1={nodesTop + NODE_H + 8}
                      x2={WIDTH / 2}
                      y2={nodesTop + NODE_H + LAYER_GAP - 10}
                      stroke={accent}
                      strokeWidth="1.6"
                      markerEnd="url(#arch-arrow)"
                    />
                    {layer.edgeLabel && (
                      <text
                        x={WIDTH / 2 + 12}
                        y={nodesTop + NODE_H + LAYER_GAP / 2 + 1}
                        fontSize="10.5"
                        fill="currentColor"
                        opacity="0.55"
                      >
                        {layer.edgeLabel}
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-sm text-neutral-500 dark:text-neutral-400">
        {caption}
      </figcaption>
    </figure>
  );
}
