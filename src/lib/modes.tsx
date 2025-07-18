import clipboard from "clipboardy"
import fs from "node:fs/promises"
import { type ReactNode } from "react"

import { buildCodePrompt } from "~/prompts/code"
import { buildGitCommitPrompt } from "~/prompts/git-commit"
import { getFilesQuery } from "~/queries/get-files"

import type { FormState } from "../stores/form"

import { FilesSection } from "../sections/files-section"
import { InstructionSection } from "../sections/instruction-section"
import { useLogsStore } from "../stores/logs"
import { queryClient } from "./query"

export type Mode = "code" | "git-commit"
export type Section = "mode" | "code-files" | "code-instruction"

export interface SectionProps {
  title: string
  isActive: boolean
  activeMode: Mode
}

export interface ModeSection {
  id: string
  label: string // The simple display name for the section.
  component: (props: SectionProps) => ReactNode
}

// Defines the structure for a complete mode.
export interface ModeConfig {
  label: string // The display name for the mode in the selection list.
  sections: Array<ModeSection>
  onSubmit: (data: FormState) => void // The function to run on submission.
}

// The main configuration object for the entire application.
export const modesConfig: Record<Mode, ModeConfig> = {
  code: {
    label: "Code",
    sections: [
      {
        id: "files",
        label: "Files",
        component: (props) => <FilesSection {...props} />,
      },
      {
        id: "instruction",
        label: "Instruction",
        component: (props) => <InstructionSection {...props} />,
      },
    ],
    onSubmit: async (data) => {
      const { addLog } = useLogsStore.getState()

      if (!data.selectedFiles || data.selectedFiles.length === 0) {
        addLog({
          type: "error",
          message: "No files selected.",
        })
        return
      }

      if (!data.instruction) {
        addLog({
          type: "error",
          message: "No instruction provided.",
        })
        return
      }

      const promises = data.selectedFiles.map(async (file) => {
        const content = await fs.readFile(file, "utf8").catch(() => {
          addLog({
            type: "error",
            message: `Failed to read file: ${file}. The file might be deleted from the filesystem, but not from git.`,
          })
          return ""
        })
        return { path: file, content }
      })

      const projectFiles = await queryClient.fetchQuery(
        getFilesQuery(process.cwd()),
      )
      const files = (await Promise.all(promises)).filter((file) => file.content)

      const prompt = buildCodePrompt({
        projectFiles: projectFiles
          .filter((file) => data.selectedFiles?.includes(file))
          .join("\n"),
        files: files,
        instruction: data.instruction,
      })

      await clipboard.write(prompt)

      addLog({
        type: "success",
        message: "Code prompt copied to clipboard.",
      })
    },
  },
  "git-commit": {
    label: "Git Commit",
    sections: [
      {
        id: "instruction",
        label: "Instruction",
        component: (props) => (
          <InstructionSection
            placeholder="Write additional instruction here... (optional)"
            {...props}
          />
        ),
      },
    ],
    onSubmit: async (data) => {
      const { addLog } = useLogsStore.getState()

      const prompt = await buildGitCommitPrompt({
        additionalInstruction: data.instruction,
      })

      await clipboard.write(prompt)

      addLog({
        type: "success",
        message: "Git Commit prompt copied to clipboard.",
      })
    },
  },
}

export const modeNames = Object.keys(modesConfig) as Array<Mode>
