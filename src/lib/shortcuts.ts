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
    "↑/↓": "Navigate",
    space: "Select",
    "ctrl-a": "Toggle all",
    "/": "Search",
    esc: "Exit search",
  },
  instruction: {
    esc: "Back to mode select",
    "ctrl-r": "Reset input",
  },
}
