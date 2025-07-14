import { Box, Text } from "ink"

import { modesConfig, type Mode } from "../lib/modes"
import { shortcutMap } from "../lib/shortcuts"

interface ShortcutsProps {
  activeMode: Mode
  activeSectionIndex: number
}

/**
 * A component that dynamically displays available shortcuts
 * based on the currently active section of the application.
 */
export const Shortcuts = ({
  activeMode,
  activeSectionIndex,
}: ShortcutsProps) => {
  const currentModeConfig = modesConfig[activeMode]
  const activeShortcuts = { ...shortcutMap.global }

  if (activeSectionIndex === -1) {
    Object.assign(activeShortcuts, shortcutMap.mode)
  } else {
    const activeSectionId = currentModeConfig.sections[activeSectionIndex]?.id
    if (activeSectionId) {
      Object.assign(activeShortcuts, shortcutMap[activeSectionId])
    }
  }

  return (
    <Box>
      {Object.entries(activeShortcuts).map(([key, desc]) => (
        <Box key={key} marginRight={2}>
          <Text color="cyan">
            {"<"}
            {key}
            {">"}
          </Text>
          <Text color="gray"> {desc}</Text>
        </Box>
      ))}
    </Box>
  )
}
