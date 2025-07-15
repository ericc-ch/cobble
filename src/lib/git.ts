import { x } from "tinyexec"

// Modified from https://github.com/JPeer264/node-is-git-repository/blob/main/index.js
export async function isGitDir(path: string) {
  const result = await x("git", ["rev-parse", "--is-inside-work-tree"], {
    nodeOptions: { cwd: path },
  })

  return result.exitCode === 0
}

export async function getGitDir(path: string) {
  const result = await x("git", ["rev-parse", "--git-dir"], {
    nodeOptions: { cwd: path },
    throwOnError: true,
  })

  return result.stdout.trim()
}

export async function listGitFilesRaw(path: string) {
  const result = await x("git", ["ls-files"], {
    nodeOptions: { cwd: path },
    throwOnError: true,
  })

  return result.stdout.trim()
}

export async function listGitFiles(path: string) {
  return (await listGitFilesRaw(path)).split("\n").sort(sortFiles)
}

// Utils

const sortFiles = (a: string, b: string) => {
  const categoryA = getCategory(a)
  const categoryB = getCategory(b)

  // If categories are different, sort by category
  if (categoryA !== categoryB) {
    return categoryA - categoryB
  }

  // Otherwise, sort alphabetically
  return a.localeCompare(b)
}

const getCategory = (path: string): number => {
  const isDot = path.startsWith(".")
  const isDir = path.includes("/")

  if (isDot && isDir) return 1 // .github/, .vscode/
  if (!isDot && isDir) return 2 // src/, test/
  if (isDot && !isDir) return 3 // .gitignore
  return 4 // package.json
}
