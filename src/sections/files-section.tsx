import { useQuery } from "@tanstack/react-query"
import { Box, Text } from "ink"
import { useEffect, useState } from "react" // Import useEffect and useState

import type { SectionProps } from "../lib/modes"

import { MultiSelect } from "../components/multi-select"
import { getFilesQuery } from "../queries/get-files"
import { useFormActions, useFormModeSelector } from "../stores/form"
import { useUIStore } from "../stores/ui" // Import the UI store

export const FilesSection = ({ title, isActive, activeMode }: SectionProps) => {
  const selectedFiles =
    useFormModeSelector(activeMode, (state) => state?.selectedFiles) ?? []
  const { setSelectedFiles } = useFormActions()
  const { setIsTextInputActive } = useUIStore()
  const [isFiltering, setIsFiltering] = useState(false)

  const filesQuery = useQuery(getFilesQuery(process.cwd()))

  useEffect(() => {
    setIsTextInputActive(isActive && isFiltering)
  }, [isActive, isFiltering, setIsTextInputActive])

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
