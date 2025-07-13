import { Box, Text, useInput, type BoxProps } from "ink"
import { useState } from "react"

export interface SelectProps extends BoxProps {
  /**
   * Items must be unique strings.
   */
  items: Array<string>
  /**
   * The number of items to show in the list at one time.
   */
  shownCount: number
  /**
   * The size of the buffer zone at the top and bottom of the visible list,
   * as a percentage of the list height, to trigger scrolling.
   * @default 0.2
   */
  bufferSize?: number
  /**
   * An array of the currently selected items.
   */
  value: Array<string>
  /**
   * Callback function that is called when the selection changes.
   * It receives the new array of selected items.
   */
  onChange: (newSelection: Array<string>) => void
}

/**
 * A controlled, scrollable select list component for Ink.
 * Use arrow keys to navigate and spacebar or enter to toggle selection.
 *
 * Modified from https://github.com/vadimdemedes/ink/issues/432#issuecomment-1519671092
 */
export function Select(props: SelectProps) {
  const {
    items,
    shownCount,
    value,
    onChange,
    bufferSize = 0.2,
    ...rest
  } = props
  const [cursor, setCursor] = useState(0) // The absolute position of the cursor in the `items` array
  const [shownCursor, setShownCursor] = useState(0) // The starting index of the visible slice of items

  const safeShownLength = Math.min(shownCount, items.length)
  const bufferLength = Math.floor(safeShownLength * bufferSize)

  const canScrollUp = shownCursor > 0
  const canScrollDown = shownCursor + safeShownLength < items.length

  // Check if the cursor is in the "buffer zone" which triggers scrolling
  const isCursorInPrevBuffer = cursor < shownCursor + bufferLength
  const isCursorInNextBuffer =
    cursor > shownCursor + safeShownLength - 1 - bufferLength

  // Get the slice of items that are currently visible
  const shownItems = items
    .map((item, index) => ({
      name: item,
      originalIndex: index,
    }))
    .slice(shownCursor, shownCursor + safeShownLength)

  /**
   * Moves the cursor up one position and scrolls the visible list if necessary.
   */
  const handlePrev = () => {
    const newCursor = Math.max(0, cursor - 1)
    setCursor(newCursor)

    if (isCursorInPrevBuffer) {
      setShownCursor(Math.max(0, shownCursor - 1))
    }
  }

  /**
   * Moves the cursor down one position and scrolls the visible list if necessary.
   */
  const handleNext = () => {
    const newCursor = Math.min(items.length - 1, cursor + 1)
    setCursor(newCursor)

    if (isCursorInNextBuffer) {
      setShownCursor(Math.min(items.length - safeShownLength, shownCursor + 1))
    }
  }

  /**
   * Toggles the selection status of the item currently under the cursor.
   * It calls the `onChange` prop with the new selection array.
   */
  const handleToggle = () => {
    const itemUnderCursor = items[cursor]
    if (!itemUnderCursor) return // Should not happen, but a good safeguard

    const isSelected = value.includes(itemUnderCursor)
    const newSelection =
      isSelected ?
        value.filter((selectedItem) => selectedItem !== itemUnderCursor)
      : [...value, itemUnderCursor]

    onChange(newSelection)
  }

  useInput((input, key) => {
    if (key.upArrow) handlePrev()
    if (key.downArrow) handleNext()
    if (input === " ") handleToggle()
  })

  return (
    <Box {...rest} flexDirection="column">
      <Box alignItems="center" flexDirection="column">
        <Text color="gray">{canScrollUp ? "▲" : " "}</Text>
      </Box>

      <Box flexDirection="column" height={safeShownLength} overflow="hidden">
        {shownItems.map((item) => {
          const isSelected = value.includes(item.name)
          const isCursorOnItem = cursor === item.originalIndex

          return (
            <Box key={item.name}>
              <Text
                backgroundColor={isCursorOnItem ? "yellow" : undefined}
                color={isCursorOnItem ? "black" : "white"}
              >
                {isSelected ? "[x]" : "[ ]"} {item.name}
              </Text>
            </Box>
          )
        })}
      </Box>

      <Box alignItems="center" flexDirection="column">
        <Text color="gray">{canScrollDown ? "▼" : " "}</Text>
      </Box>
    </Box>
  )
}
