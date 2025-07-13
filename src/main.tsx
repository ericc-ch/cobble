import { enterAlternativeScreen, exitAlternativeScreen } from "ansi-escapes"
import { render } from "ink"

import { App, Providers } from "./app"

process.stdout.write(enterAlternativeScreen)
process.on("exit", () => {
  process.stdout.write(exitAlternativeScreen)
})

render(
  <Providers>
    <App />
  </Providers>,
)
