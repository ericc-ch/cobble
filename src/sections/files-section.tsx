import { useQuery } from "@tanstack/react-query"
import { Box, Text, useInput } from "ink"
import { useEffect, useState } from "react" // Import useEffect and useState

import type { SectionProps } from "../lib/modes"

import { MultiSelect } from "../components/multi-select"
import { listGitFiles } from "../lib/git"
import { useFormActions, useFormModeSelector } from "../stores/form"
import { useUIStore } from "../stores/ui" // Import the UI store

export const FilesSection = ({
  title,
  isActive,
  activeMode,
  onEscape,
}: SectionProps) => {
  const selectedFiles =
    useFormModeSelector(activeMode, (state) => state?.selectedFiles) ?? []
  const { setSelectedFiles } = useFormActions()
  const { setIsTextInputActive } = useUIStore() // Get the action
  const [isFiltering, setIsFiltering] = useState(false)

  const filesQuery = useQuery({
    queryKey: ["git-files"],
    queryFn: () => listGitFiles("./"),
  })

  // Set global input lock only if this section is active and filtering
  useEffect(() => {
    setIsTextInputActive(isActive && isFiltering)
  }, [isActive, isFiltering, setIsTextInputActive])

  useInput(
    (_input, key) => {
      if (key.escape) onEscape()
    },
    { isActive },
  )

  if (filesQuery.isPending) {
    return <Text>Loading files...</Text>
  }

  if (filesQuery.isError) {
    return <Text>Error: {filesQuery.error.message}</Text>
  }

  return (
    <Box flexDirection="column">
      <Text color={isActive ? "yellow" : undefined}>{title}</Text>
      <MultiSelect
        borderColor={isActive ? "yellow" : undefined}
        borderStyle="round"
        bufferSize={0.4}
        isActive={isActive}
        items={filesQuery.data}
        shownCount={8}
        value={selectedFiles}
        width="100%"
        onChange={(value) => setSelectedFiles(activeMode, value)}
        onFilteringChange={setIsFiltering} // Update local state on change
      />
    </Box>
  )
}
