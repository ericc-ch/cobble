import { queryOptions } from "@tanstack/react-query"

import { listGitFiles, listGitFilesRaw } from "../lib/git"

export const getFilesQuery = (path: string) =>
  queryOptions({
    queryKey: ["files", path],
    queryFn: ({ queryKey: [_files, path] }) => listGitFiles(path),
  })

export const getFilesRawQuery = (path: string) =>
  queryOptions({
    queryKey: ["files", "raw", path],
    queryFn: ({ queryKey: [_files, _raw, path] }) => listGitFilesRaw(path),
  })
