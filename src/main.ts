import { renderApp } from "./app"
import { isGitDirectory } from "./lib/utils"

const home = process.env.HOME ?? "~"
const cwd = process.cwd()

console.log(home, isGitDirectory(home))
console.log(cwd, isGitDirectory(cwd))

renderApp()
