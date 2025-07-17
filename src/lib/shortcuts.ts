type ShortcutMapping = Record<string, string>

export const shortcutMap: Record<string, ShortcutMapping> = {
  global: {
    "ctrl-q": "Quit",
    enter: "Submit",
  },
  mode: {
    "↑/↓": "Navigate",
    space: "Select",
  },
  files: {
    space: "Select",
    "ctrl-a": "Toggle all",
    "/": "Search",
  },
  instruction: {
    "ctrl-r": "Reset input",
  },
}
