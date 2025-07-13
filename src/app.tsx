import { QueryClientProvider, useQuery } from "@tanstack/react-query"
import { Box, useInput } from "ink"
import TextInput from "ink-text-input"
import { useState, type ReactNode } from "react"

import { Select } from "./components/select"
import { listGitFiles, isGit as isGitFn } from "./lib/git"
import { useStdoutDimensions } from "./lib/hooks"
import { queryClient } from "./lib/query"

export const App = () => {
  const dimensions = useStdoutDimensions()

  const safeHeight = Math.floor(dimensions.height * 0.95)

  useInput((input, key) => {
    if (key.ctrl && input === "q") {
      return process.exit(0)
    }
  })

  const isGit = useQuery({
    queryKey: ["is-git"],
    queryFn: () => isGitFn(process.cwd()),
  })

  const files = useQuery({
    queryKey: ["files"],
    queryFn: () => listGitFiles("./"),
    enabled: isGit.data,
  })

  const [selectedFiles, setSelectedFiles] = useState<Array<string>>([])
  const [instruction, setInstruction] = useState("")

  return (
    <Box flexDirection="column" height={safeHeight} width={dimensions.width}>
      {files.isSuccess && (
        <Select
          borderStyle="round"
          bufferSize={0.4}
          items={files.data}
          shownCount={5}
          value={selectedFiles}
          onChange={setSelectedFiles}
        />
      )}
      <TextInput value={instruction} onChange={setInstruction} />
    </Box>
  )
}

export const Providers = (props: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
