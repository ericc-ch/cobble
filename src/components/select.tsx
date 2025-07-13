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
  const { bufferSize = 0.2, ...rest } = props
  const [cursor, setCursor] = useState(0)
  const [shownCursor, setShownCursor] = useState(0)

  const shownLength = Math.min(props.shownCount, props.items.length)
  const bufferLength = Math.floor(shownLength * bufferSize)

  const isCursorInPrevBuffer = cursor < shownCursor + bufferLength
  const isCursorInNextBuffer = cursor > shownCursor + shownLength - bufferLength

  const shownItems = props.items
    .map((item, index) => ({
      name: item,
      originalIndex: index,
    }))
    .slice(shownCursor, shownCursor + shownLength)

  const handlePrev = () => {
    setCursor(Math.max(0, cursor - 1))

    if (isCursorInPrevBuffer) {
      setShownCursor(Math.max(0, shownCursor - 1))
    }
  }

  const handleNext = () => {
    setCursor(Math.min(props.items.length - 1, cursor + 1))

    if (isCursorInNextBuffer) {
      setShownCursor(
        Math.min(props.items.length - shownLength, shownCursor + 1),
      )
    }
  }

  useInput((_input, key) => {
    if (key.upArrow) handlePrev()
    if (key.downArrow) handleNext()
  })

  return (
    <Box
      {...rest}
      flexDirection="column"
      height={props.shownCount}
      overflow="hidden"
    >
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
  )
}
