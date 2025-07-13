import { QueryClientProvider, useQuery } from "@tanstack/react-query"
import { Box, Text, useInput } from "ink"
import { type ReactNode } from "react"

import { ScrollArea } from "./components/scroll-area"
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

  return (
    <Box
      borderColor="yellow"
      borderStyle="single"
      height={safeHeight}
      width={dimensions.width}
    >
      <ScrollArea borderStyle="single" height={safeHeight - 2} width="100%">
        <Text>{JSON.stringify({ dimensions, safeHeight }, null, 2)}</Text>
        <Text>{JSON.stringify(files.data, null, 2)}</Text>
      </ScrollArea>
      <Box borderStyle="single" width="100%">
        <Text>You typed</Text>
      </Box>
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
