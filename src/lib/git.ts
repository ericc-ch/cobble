import { x } from "tinyexec"

import {
  fileSystemSort,
  type DirectoryItem,
  type FileItem,
  type FileSystemItem,
} from "./fs"

// Modified from https://github.com/JPeer264/node-is-git-repository/blob/main/index.js
export async function isGit(path: string) {
  const result = await x("git", ["rev-parse", "--is-inside-work-tree"], {
    nodeOptions: { cwd: path },
  })

  return result.exitCode === 0
}

export async function listGitFiles(path: string) {
  const result = await x("git", ["ls-files"], {
    nodeOptions: { cwd: path },
  })

  const files = result.stdout.split("\n").filter(Boolean)
  return transformPaths(files).sort(fileSystemSort)
}

export function transformPaths(paths: Array<string>): Array<FileSystemItem> {
  const root: Array<FileSystemItem> = []

  for (const path of paths) {
    const parts = path.split("/")
    let currentLevel = root
    let currentPath = ""

    for (const [index, part] of parts.entries()) {
      currentPath = currentPath ? `${currentPath}/${part}` : part
      const isFile = index === parts.length - 1

      const existingItem = currentLevel.find((item) => item.name === part)

      // Item exists, so we check if it's a directory
      // If it is then we set the current level
      if (existingItem) {
        if (existingItem.isDirectory) {
          currentLevel = existingItem.contents
        }
        continue
      }

      // File does not exist, so we create it here
      // If it's file just push
      if (isFile) {
        const newFile: FileItem = {
          name: part,
          fullPath: path,
          isFile: true,
          isDirectory: false,
        }
        currentLevel.push(newFile)

        // If it's a directory we create it
        // Then set the current level
      } else {
        const newDirectory: DirectoryItem = {
          name: part,
          fullPath: currentPath,
          isFile: false,
          isDirectory: true,
          contents: [],
        }

        currentLevel.push(newDirectory)
        currentLevel = newDirectory.contents
      }
    }
  }

  return root
}
