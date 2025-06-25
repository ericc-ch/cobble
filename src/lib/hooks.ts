import { useStdout } from "ink"
import { useEffect, useState } from "react"

interface Dimensions {
  height: number
  width: number
}

// Modified from https://github.com/cameronhunter/ink-monorepo/blob/master/packages/ink-use-stdout-dimensions/src/index.ts
export function useStdoutDimensions(): Dimensions {
  const { stdout } = useStdout()
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: stdout.rows,
    width: stdout.columns,
  })

  useEffect(() => {
    const handler = () => {
      setDimensions({
        height: stdout.rows,
        width: stdout.columns,
      })
    }

    stdout.on("resize", handler)
    return () => {
      stdout.off("resize", handler)
    }
  }, [stdout])

  return dimensions
}
