import { create } from "zustand"

type Section = "files" | "instruction"

interface UIStore {
  activeSection: "files" | "instruction"
  setActiveSection: (section: Section) => void

  isFilesActive: () => boolean
  isInstructionActive: () => boolean
}

export const useUIStore = create<UIStore>()((set, get) => ({
  activeSection: "files",
  setActiveSection: (section) => set({ activeSection: section }),

  isFilesActive: () => get().activeSection === "files",
  isInstructionActive: () => get().activeSection === "instruction",
}))
