import { create } from "zustand"

import type { Mode } from "../lib/modes"

// Defines the shape of the form data for any mode.
export interface FormState {
  selectedFiles?: Array<string>
  instruction?: string
}

// Defines the structure of the main store.
interface FormsStore {
  // A record where keys are mode IDs (e.g., 'code') and values are their states.
  formStates: Record<Mode, FormState | undefined>

  actions: {
    // Actions now require a modeId to know which state to update.
    setSelectedFiles: (modeId: Mode, files: Array<string>) => void
    setInstruction: (modeId: Mode, instruction: string) => void

    // The getter also needs the modeId.
    getFormData: (modeId: Mode) => FormState | undefined
  }
}

export const useFormStore = create<FormsStore>()((set, get) => ({
  formStates: {} as Record<Mode, FormState>,
  actions: {
    setSelectedFiles: (modeId, files) =>
      set((state) => ({
        formStates: {
          ...state.formStates,
          [modeId]: { ...state.formStates[modeId], selectedFiles: files },
        },
      })),

    setInstruction: (modeId, instruction) =>
      set((state) => ({
        formStates: {
          ...state.formStates,
          [modeId]: { ...state.formStates[modeId], instruction },
        },
      })),

    getFormData: (modeId) => {
      return get().formStates[modeId]
    },
  },
}))

export const useFormActions = () => useFormStore((state) => state.actions)

export const useFormModeSelector = <T>(
  modeId: Mode,
  selector: (state?: FormState) => T,
) => {
  return useFormStore((state) => selector(state.formStates[modeId]))
}
