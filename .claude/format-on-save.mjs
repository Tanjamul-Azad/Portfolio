// Format-on-save hook: runs `eslint --fix` on the file Claude just edited.
// Reads the PostToolUse hook payload (JSON) from stdin, extracts the file path,
// and only acts on JS/TS sources. Never blocks the edit — formatter errors are swallowed.
import { spawnSync } from "node:child_process";

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input || "{}");
    const file = data?.tool_input?.file_path || data?.tool_response?.filePath;
    if (!file || !/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(file)) return;
    spawnSync("npx", ["eslint", "--fix", file], { stdio: "ignore", shell: true });
  } catch {
    // Intentionally ignore: a formatter failure must never block a file edit.
  }
});
