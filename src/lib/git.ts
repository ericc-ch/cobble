import { x } from "tinyexec"

// Modified from https://github.com/JPeer264/node-is-git-repository/blob/main/index.js
export async function isGit(path: string) {
  const result = await x("git", ["rev-parse", "--is-inside-work-tree"], {
    nodeOptions: { cwd: path },
  })

  return result.exitCode === 0
}

export async function listFiles(path: string) {
  const result = await x("git", ["ls-files"], {
    nodeOptions: { cwd: path },
  })

  return result.stdout.split("\n").filter(Boolean)
}
