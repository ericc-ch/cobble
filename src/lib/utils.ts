import child from "node:child_process"

// Modified from https://github.com/JPeer264/node-is-git-repository/blob/main/index.js
export function isGitDirectory(path: string): boolean {
  try {
    child.execSync("git rev-parse --is-inside-work-tree", {
      stdio: "ignore",
      cwd: path,
    })

    return true
  } catch {
    return false
  }
}
