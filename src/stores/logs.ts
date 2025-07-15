import { create } from "zustand"

export interface Log {
  id: string
  type: "info" | "warn" | "success" | "error" | "debug"
  message: string
}

export const logColors = new Map<Log["type"], string>([
  ["info", "blue"],
  ["warn", "yellow"],
  ["success", "green"],
  ["error", "red"],
  ["debug", "magenta"],
])

interface LogsStore {
  logs: Array<Log>
  addLog: (log: Omit<Log, "id">) => void
}

export const useLogsStore = create<LogsStore>()((set) => ({
  logs: [],
  addLog: (log) =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          ...log,
          id: crypto.randomUUID(),
        },
      ],
    })),
}))
