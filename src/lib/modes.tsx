import { type ReactNode } from "react"

import type { FormState } from "../stores/form"

import { FilesSection } from "../sections/files-section"
import { InstructionSection } from "../sections/instruction-section"

export type Mode = "code" | "git-commit"
export type Section = "mode" | "code-files" | "code-instruction"

// Defines the props that will be passed down to every section component.
export interface SectionProps {
  title: string
  isActive: boolean
  activeMode: Mode
  onEscape: () => void
}

// Defines the structure of a section within a mode's configuration.
export interface ModeSection {
  id: string
  shortcut: string // The key the user presses to focus this section.
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
    label: "Code Assistant",
    sections: [
      {
        id: "files",
        shortcut: "1",
        label: "Files",
        component: (props) => <FilesSection {...props} />,
      },
      {
        id: "instruction",
        shortcut: "2",
        label: "Instruction",
        component: (props) => <InstructionSection {...props} />,
      },
    ],
    onSubmit: (data) => {
      console.log("--- Submitting for Code Mode ---")
      console.log("Selected Files:", data.selectedFiles)
      console.log("Instruction:", data.instruction)
      process.exit(0)
    },
  },
  "git-commit": {
    label: "Git Commit Generator",
    sections: [
      {
        id: "instruction",
        shortcut: "1",
        label: "Instruction",
        component: (props) => (
          <InstructionSection
            placeholder="Write additional instruction here... (optional)"
            {...props}
          />
        ),
      },
    ],
    onSubmit: (data) => {
      console.log("--- Submitting for Git Commit Mode ---")
      console.log("Instruction:", data.instruction)
      process.exit(0)
    },
  },
}

export const modeNames = Object.keys(modesConfig) as Array<Mode>
