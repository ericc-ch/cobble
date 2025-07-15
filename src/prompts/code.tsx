// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck I really have no other choice, can't wrap my head around why the JSX isn't properly typed

import fs from "node:fs/promises"
import path from "node:path"
import { renderToStaticMarkup } from "react-dom/server"

import { replacePlaceholders } from "~/lib/template"

interface BuildCodePromptOptions {
  projectFiles: string
  files: Array<{
    path: string
    content: string
  }>
  instruction: string
}

export async function buildCodePrompt({
  projectFiles,
  files,
  instruction,
}: BuildCodePromptOptions) {
  const templateFile = path.join(import.meta.dir, "code.txt")
  const template = await fs.readFile(templateFile, "utf8")

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
