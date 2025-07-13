import { QueryClientProvider, useQuery } from "@tanstack/react-query"
import { Box, useInput } from "ink"
import { useState, type ReactNode } from "react"

import { Select } from "../components/select"
import { isGitDir, listGitFiles } from "../lib/git"

export const App = () => {
  useInput((input, key) => {
    if (key.ctrl && input === "q") {
      return process.exit(0)
    }
  })

  const isGit = useQuery({
    queryKey: ["is-git"],
    queryFn: () => isGitDir(process.cwd()),
  })

  const files = useQuery({
    queryKey: ["files"],
    queryFn: () => listGitFiles("./"),
    enabled: isGit.data,
  })

  const [selectedFiles, setSelectedFiles] = useState<Array<string>>([])

  return (
    <Box flexDirection="column" height={10} width="100%">
      {files.isSuccess && (
        <Select
          borderStyle="round"
          bufferSize={0.4}
          items={files.data}
          shownCount={5}
          value={selectedFiles}
          width="100%"
          onChange={setSelectedFiles}
        />
      )}
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
