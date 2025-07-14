import { useQuery } from "@tanstack/react-query"
import { Box, Text, useInput } from "ink"

import type { SectionProps } from "../lib/modes"

import { MultiSelect } from "../components/multi-select"
import { listGitFiles } from "../lib/git"
import { useFormActions, useFormModeSelector } from "../stores/form"

export const FilesSection = ({
  title,
  isActive,
  activeMode,
  onEscape,
}: SectionProps) => {
  const selectedFiles =
    useFormModeSelector(activeMode, (state) => state?.selectedFiles) ?? []
  const { setSelectedFiles } = useFormActions()

  const filesQuery = useQuery({
    queryKey: ["git-files"],
    queryFn: () => listGitFiles("./"),
  })

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
      />
    </Box>
  )
}
