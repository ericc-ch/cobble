import ignore from "ignore"
import fs from "node:fs/promises"
import path from "node:path"

export type FileSystemItem = FileItem | DirectoryItem

export interface FileItem {
  name: string
  fullPath: string
  isFile: true
  isDirectory: false
}

export interface DirectoryItem {
  name: string
  fullPath: string
  isFile: false
  isDirectory: true
  contents: Array<FileSystemItem>
}

interface ScanOptions {
  directoryPath: string
  rootPath: string
  ig: ReturnType<typeof ignore>
}

async function scanDirectoryRecursive(
  options: ScanOptions,
): Promise<Array<FileSystemItem>> {
  const results: Array<FileSystemItem> = []

  try {
    const items = await fs.readdir(options.directoryPath)

    for (const item of items) {
      const fullPath = path.join(options.directoryPath, item)
      const relativePath = path.relative(options.rootPath, fullPath)

      if (options.ig.ignores(relativePath)) {
        continue
      }

      try {
        const stats = await fs.stat(fullPath)
        const name = path.basename(fullPath)

        if (stats.isDirectory()) {
          const contents = await scanDirectoryRecursive({
            directoryPath: fullPath,
            rootPath: options.rootPath,
            ig: options.ig,
          })

          results.push({
            name,
            fullPath,
            isFile: false,
            isDirectory: true,
            contents,
          })
        } else if (stats.isFile()) {
          results.push({
            name,
            fullPath,
            isFile: true,
            isDirectory: false,
          })
        }
      } catch (err) {
        console.error(`Could not stat path ${fullPath}:`, err)
      }
    }
  } catch (err) {
    console.error(`Could not read directory ${options.directoryPath}:`, err)
  }

  return results
}

export async function scanDirectoryTree(
  directoryPath: string,
): Promise<Array<FileSystemItem>> {
  const resolvedPath = path.resolve(directoryPath)
  const ig = ignore()

  ig.add([".git", "node_modules"])

  const gitignorePath = path.join(resolvedPath, ".gitignore")
  try {
    const gitignoreContent = await fs.readFile(gitignorePath, "utf8")
    ig.add(gitignoreContent)
  } catch {
    // Do nothing if no .gitignore is found
  }

  return (
    await scanDirectoryRecursive({
      directoryPath: resolvedPath,
      rootPath: resolvedPath,
      ig,
    })
  ).sort(fileSystemSort)
}

export const fileSystemSort = (
  a: FileSystemItem,
  b: FileSystemItem,
): number => {
  // Rule 1: Directories first, then files.
  if (a.isDirectory && !b.isDirectory) {
    return -1
  }
  if (!a.isDirectory && b.isDirectory) {
    return 1
  }

  // At this point, a and b are of the same type (either both directories or both files).

  // Rule 2: For directories, those starting with a dot '.' come first.
  if (a.isDirectory && b.isDirectory) {
    const aIsDot = a.name.startsWith(".")
    const bIsDot = b.name.startsWith(".")

    if (aIsDot && !bIsDot) {
      return -1
    }
    if (!aIsDot && bIsDot) {
      return 1
    }
  }

  // Rule 3: Sort alphabetically for all other cases.
  return a.name.localeCompare(b.name)
}
