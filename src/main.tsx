import { enterAlternativeScreen, exitAlternativeScreen } from "ansi-escapes"
import { render } from "ink"

import { App, Providers } from "./app"
import { isGit, listGitFiles } from "./lib/git"

const cwd = process.cwd()

if (await isGit(cwd)) {
  console.log(await listGitFiles(cwd))
}

process.stdout.write(enterAlternativeScreen)
process.on("exit", () => {
  process.stdout.write(exitAlternativeScreen)
})

render(
  <Providers>
    <App />
  </Providers>,
)
