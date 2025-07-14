import { render } from "ink"

import { App, Providers } from "./app"
import { isGitDir } from "./lib/git"

const isGit = await isGitDir(process.cwd())

if (!isGit) {
  console.error("Not a git repository")
  process.exit(1)
}

// process.stdout.write(enterAlternativeScreen)
// process.on("exit", () => {
//   process.stdout.write(exitAlternativeScreen)
// })

render(
  <Providers>
    <App />
  </Providers>,
)
