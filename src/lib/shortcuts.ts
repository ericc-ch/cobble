type ShortcutMapping = Record<string, string>

export const shortcutMap: Record<string, ShortcutMapping> = {
  global: {
    "ctrl-q": "Quit",
    enter: "Submit",
  },
  // Shortcuts for the mode selection view (when activeSectionIndex is -1).
  mode: {
    "↑/↓": "Navigate",
    space: "Select",
  },
  // Shortcuts for the file selection component.
  files: {
    "↑/↓": "Navigate",
    space: "Toggle file",
    "/": "Search",
    esc: "Exit search",
  },
  // Shortcuts for the instruction input component.
  instruction: {
    esc: "Back to mode select",
    "ctrl-r": "Reset input",
  },
}
