import { QueryClientProvider } from "@tanstack/react-query"
import { Box, Text, useInput } from "ink"
import { type ReactNode } from "react"

import { modesConfig } from "./lib/modes"
import { queryClient } from "./lib/query"
import { ModeSection } from "./sections/mode-section"
import { useFormActions } from "./stores/form"
import { useUIStore } from "./stores/ui"

export const App = () => {
  const {
    activeMode,
    activeSectionIndex,
    setActiveSectionIndex,
    isTextInputActive, // Get the new state
  } = useUIStore()
  const { getFormData } = useFormActions()

  const currentModeConfig = modesConfig[activeMode]

  useInput(
    (input, key) => {
      // Global quit
      if (key.ctrl && input === "q") process.exit(0)

      // Handle mode selection shortcut
      if (input === "0") {
        setActiveSectionIndex(-1)
        return
      }

      // Find section index based on custom shortcut
      const sectionIndex = currentModeConfig.sections.findIndex(
        (section) => section.shortcut === input,
      )

      if (sectionIndex !== -1) {
        setActiveSectionIndex(sectionIndex)
      }

      // Submission on Enter key when the last section is active
      if (key.return) {
        const formData = getFormData(activeMode)
        if (!formData) return

        currentModeConfig.onSubmit(formData)
      }
    },
    // Prevent this hook from running when a text input is active
    { isActive: !isTextInputActive },
  )

  return (
    <Box flexDirection="column">
      <ModeSection isActive={activeSectionIndex === -1} />

      {currentModeConfig.sections.map((section, index) => {
        const Component = section.component
        const title = `[${section.shortcut}] ${section.label}:`

        return (
          <Component
            key={`${activeMode}-${section.id}`}
            activeMode={activeMode}
            isActive={activeSectionIndex === index}
            title={title}
            onEscape={() => setActiveSectionIndex(-1)}
          />
        )
      })}

      <Box>
        <Text color="gray">Quit: {"<ctrl-q>"}</Text>
      </Box>
    </Box>
  )
}

// Providers wrapper remains the same
export const Providers = (props: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
