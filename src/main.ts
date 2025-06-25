import { renderApp } from "./app"
import { isGit, listFiles } from "./lib/git"

const home = process.env.HOME ?? "~"
const cwd = process.cwd()

console.log(home, await isGit(home))
console.log(cwd, await isGit(cwd))

if (await isGit(cwd)) {
  console.log(await listFiles(cwd))
}

renderApp({
  isGit: await isGit(cwd),
})
