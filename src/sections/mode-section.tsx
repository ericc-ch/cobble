import { Box, Text } from "ink"

import { SingleSelect } from "../components/single-select"
import { modesConfig, type Mode } from "../lib/modes"
import { useUIStore } from "../stores/ui"

export const ModeSection = ({ isActive }: { isActive: boolean }) => {
  const activeMode = useUIStore((state) => state.activeMode)
  const setActiveMode = useUIStore((state) => state.setActiveMode)

  const modeOptions = Object.entries(modesConfig).map(([id, config]) => ({
    value: id,
    label: config.label,
  }))

  return (
    <Box flexDirection="column">
      <Text color={isActive ? "yellow" : undefined}>Mode:</Text>
      <SingleSelect
        borderColor={isActive ? "yellow" : undefined}
        borderStyle="round"
        isActive={isActive}
        items={modeOptions.map((opt) => opt.label)}
        shownCount={5}
        value={modesConfig[activeMode].label}
        onChange={(newLabel) => {
          const newMode = modeOptions.find((opt) => opt.label === newLabel)
          if (newMode) {
            setActiveMode(newMode.value as Mode)
          }
        }}
      />
    </Box>
  )
}
