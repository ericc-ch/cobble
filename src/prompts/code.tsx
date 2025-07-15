// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck I really have no other choice, can't wrap my head around why the JSX isn't properly typed

import { renderToStaticMarkup } from "react-dom/server"

import { replacePlaceholders } from "~/lib/template"

import template from "./code.txt"

interface BuildCodePromptOptions {
  projectFiles: string
  files: Array<{
    path: string
    content: string
  }>
  instruction: string
}

export function buildCodePrompt({
  projectFiles,
  files,
  instruction,
}: BuildCodePromptOptions) {
  const contextXML = (
    <context>
      <project_files>{projectFiles}</project_files>
      {files.map((file) => (
        <file key={file.path} path={file.path}>
          {file.content}
        </file>
      ))}
    </context>
  )

  return replacePlaceholders(template, {
    context: renderToStaticMarkup(contextXML),
    user_query: instruction,
  })
}
