import { Box, Text, useInput } from "ink"
import TextInput from "ink-text-input"
import { useEffect } from "react" // Import useEffect

import type { SectionProps } from "../lib/modes"

import { useFormActions, useFormModeSelector } from "../stores/form"
import { useUIStore } from "../stores/ui" // Import the UI store

export const InstructionSection = ({
  title,
  isActive,
  activeMode,
  onEscape,
}: SectionProps) => {
  const instruction =
    useFormModeSelector(activeMode, (state) => state?.instruction) ?? ""
  const { setInstruction } = useFormActions()
  const { setIsTextInputActive } = useUIStore() // Get the action

  // Sync active state with the global text input state
  useEffect(() => {
    setIsTextInputActive(isActive)
  }, [isActive, setIsTextInputActive])

  useInput(
    (_input, key) => {
      if (key.escape) onEscape()
    },
    { isActive },
  )

  return (
    <Box flexDirection="column">
      <Text color={isActive ? "yellow" : undefined}>{title}</Text>
      <Box
        borderColor={isActive ? "yellow" : undefined}
        borderStyle="round"
        paddingX={1}
      >
        <TextInput
          focus={isActive}
          placeholder="Write your instruction here..."
          value={instruction}
          onChange={(value) => setInstruction(activeMode, value)}
        />
      </Box>
    </Box>
  )
}
