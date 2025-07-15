import chokidar from "chokidar"
import { defineCommand, runMain } from "citty"
import consola from "consola"
import { render } from "ink"
import path from "node:path"
import { StrictMode } from "react"

import { App, Providers } from "./app"
import { getGitDir } from "./lib/git"
import { queryClient } from "./lib/query"
import { getFilesQuery } from "./queries/get-files"

async function run() {
  const workingDir = process.cwd()

  try {
    await queryClient.fetchQuery(getFilesQuery(workingDir))
  } catch (error) {
    consola.error(error)
    consola.error("Failed to list files. Are you in a git repository?")
    process.exit(1)
  }

  const gitDir = await getGitDir(workingDir)
  const pathsToWatch = [path.join(gitDir, "index"), path.join(gitDir, "HEAD")]

  const watcher = chokidar.watch(pathsToWatch, {
    cwd: workingDir,
  })

  watcher.on("all", () => {
    // I don't know why but chokidar will not watch
    // This will never get triggered
    void queryClient.invalidateQueries(getFilesQuery(workingDir))
  })

  render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>,
  )
}

const main = defineCommand({
  meta: {
    name: "cobld",
    description: "Simplistic context builder for LLM",
  },
  run,
})

void runMain(main)
