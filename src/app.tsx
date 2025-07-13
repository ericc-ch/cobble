import { QueryClientProvider, useQuery } from "@tanstack/react-query"
import { Box, useInput } from "ink"
import { type ReactNode } from "react"

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

  return (
    <Box
      borderColor="yellow"
      borderStyle="single"
      height={safeHeight}
      width={dimensions.width}
    >
      <Select
        height={safeHeight - 2}
        items={[
          "file-1.ts",
          "file-2.ts",
          "file-3.ts",
          "file-4.ts",
          "file-5.ts",
          "file-6.ts",
          "file-7.ts",
          "file-8.ts",
          "file-9.ts",
          "file-10.ts",
          "file-11.ts",
          "file-12.ts",
          "file-13.ts",
          "file-14.ts",
          "file-15.ts",
          "file-16.ts",
          "file-17.ts",
          "file-18.ts",
          "file-19.ts",
          "file-20.ts",
        ]}
      />
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
