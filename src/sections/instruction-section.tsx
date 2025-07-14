import { Box, Text, useInput } from "ink"
import TextInput from "ink-text-input"

import type { SectionProps } from "../lib/modes"

import { useFormActions, useFormModeSelector } from "../stores/form"

export const InstructionSection = ({
  title,
  isActive,
  activeMode,
  onEscape,
}: SectionProps) => {
  const instruction =
    useFormModeSelector(activeMode, (state) => state?.instruction) ?? ""
  const { setInstruction } = useFormActions()

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
