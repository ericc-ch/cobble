import { Box, Text, useInput, type BoxProps } from "ink"
import { useState } from "react"

export interface SelectProps extends BoxProps {
  /**
   * Items must be unique
   */
  items: Array<string>
  shownCount: number
  /**
   * The size of the buffer zone at the top and bottom of the visible list, as a percentage of the list height.
   * @default 0.2
   */
  bufferSize?: number
}

// Modified from https://github.com/vadimdemedes/ink/issues/432#issuecomment-1519671092
export function Select(props: SelectProps) {
  const { items, shownCount, bufferSize = 0.2, ...rest } = props
  const [cursor, setCursor] = useState(0)
  const [shownCursor, setShownCursor] = useState(0)

  const safeShownLength = Math.min(shownCount, items.length)
  const bufferLength = Math.floor(safeShownLength * bufferSize)

  const canScrollUp = shownCursor > 0
  const canScrollDown = shownCursor + safeShownLength < items.length

  const isCursorInPrevBuffer = cursor < shownCursor + bufferLength
  const isCursorInNextBuffer =
    cursor > shownCursor + safeShownLength - bufferLength

  const shownItems = items
    .map((item, index) => ({
      name: item,
      originalIndex: index,
    }))
    .slice(shownCursor, shownCursor + safeShownLength)

  const handlePrev = () => {
    setCursor(Math.max(0, cursor - 1))

    if (isCursorInPrevBuffer) {
      setShownCursor(Math.max(0, shownCursor - 1))
    }
  }

  const handleNext = () => {
    setCursor(Math.min(items.length - 1, cursor + 1))

    if (isCursorInNextBuffer) {
      setShownCursor(Math.min(items.length - safeShownLength, shownCursor + 1))
    }
  }

  useInput((_input, key) => {
    if (key.upArrow) handlePrev()
    if (key.downArrow) handleNext()
  })

  return (
    <Box {...rest} flexDirection="column">
      <Box alignItems="center" flexDirection="column">
        <Text>{canScrollUp ? "^" : "x"}</Text>
      </Box>

      <Box flexDirection="column" height={safeShownLength} overflow="hidden">
        {shownItems.map((item) => {
          return (
            <Box key={item.name}>
              <Text
                backgroundColor={
                  cursor === item.originalIndex ? "yellow" : undefined
                }
              >
                [x] {item.name}
              </Text>
            </Box>
          )
        })}
      </Box>

      <Box alignItems="center" flexDirection="column">
        <Text>{canScrollDown ? "v" : "x"}</Text>
      </Box>
    </Box>
  )
}
