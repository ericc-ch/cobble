import { Box, Text, useInput } from "ink"
import TextInput from "ink-text-input"
import { useEffect } from "react"

import type { SectionProps } from "../lib/modes"

import { useFormActions, useFormModeSelector } from "../stores/form"
import { useUIStore } from "../stores/ui" // Import the UI store

interface InstructionSectionProps extends SectionProps {
  placeholder?: string
}

export const InstructionSection = ({
  title,
  isActive,
  activeMode,
  placeholder,
}: InstructionSectionProps) => {
  const instruction =
    useFormModeSelector(activeMode, (state) => state?.instruction) ?? ""
  const { setInstruction } = useFormActions()
  const setActiveSectionIndex = useUIStore(
    (state) => state.setActiveSectionIndex,
  )
  const setIsTextInputActive = useUIStore((state) => state.setIsTextInputActive)

  // Sync active state with the global text input state
  useEffect(() => {
    setIsTextInputActive(isActive)
  }, [isActive, setIsTextInputActive])

  useInput(
    (input, key) => {
      if (key.escape) setActiveSectionIndex(-1)
      if (key.ctrl && input === "r")
        // This is stupid but useInput will fire before <TextInput> onChange
        // Therefore the reset gets replaced by onChange value
        // Setting 0 timeout here makes it go after onChange handler
        setTimeout(() => setInstruction(activeMode, ""), 0)
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
          placeholder={placeholder ?? "Write your instruction here..."}
          value={instruction}
          onChange={(value) => setInstruction(activeMode, value)}
        />
      </Box>
    </Box>
  )
}
