import { QueryClientProvider } from "@tanstack/react-query"
import { Box, Static, Text, useInput } from "ink"
import { type ReactNode } from "react"

import { modesConfig } from "./lib/modes"
import { queryClient } from "./lib/query"
import { getFilesQuery } from "./queries/get-files"
import { ModeSection } from "./sections/mode-section"
import { Shortcuts } from "./sections/shortcuts-section"
import { useFormActions } from "./stores/form"
import { logColors, useLogsStore } from "./stores/logs"
import { useUIStore } from "./stores/ui"

const refreshFiles = () => {
  void queryClient.invalidateQueries(getFilesQuery(process.cwd()))
}

export const App = () => {
  const logs = useLogsStore((state) => state.logs)

  const {
    activeMode,
    activeSectionIndex,
    setActiveSectionIndex,
    isTextInputActive,
  } = useUIStore()
  const { getFormData } = useFormActions()

  const currentModeConfig = modesConfig[activeMode]

  // Always active
  useInput((input, key) => {
    if (key.ctrl && input === "q") process.exit(0)

    if (key.return) {
      const formData = getFormData(activeMode)
      if (formData) currentModeConfig.onSubmit(formData)
    }
  })

  useInput(
    (input, key) => {
      if (input === "0") setActiveSectionIndex(-1)
      if (key.ctrl && input === "r") refreshFiles()

      const sectionIndex = currentModeConfig.sections.findIndex(
        (section) => section.shortcut === input,
      )
      if (sectionIndex !== -1) setActiveSectionIndex(sectionIndex)
    },
    { isActive: !isTextInputActive },
  )

  return (
    <Box flexDirection="column">
      <Static items={logs}>
        {(log) => (
          <Box
            key={log.id}
            borderColor={logColors.get(log.type)}
            borderStyle="round"
          >
            <Text>{log.message}</Text>
          </Box>
        )}
      </Static>

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
          />
        )
      })}

      <Shortcuts
        activeMode={activeMode}
        activeSectionIndex={activeSectionIndex}
      />
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
