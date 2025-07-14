import { Box, Text, useInput, type BoxProps } from "ink"
import { useEffect, useState } from "react"

export interface SingleSelectProps extends BoxProps {
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
  isActive?: boolean
  /**
   * The currently selected item. Must be provided.
   */
  value: string
  /**
   * Callback function that is called when the selection changes.
   * It receives the new selected item.
   */
  onChange: (newItem: string) => void
}

/**
 * A controlled, scrollable single select list component for Ink.
 * Use arrow keys to navigate and spacebar or enter to select.
 */

export function SingleSelect(props: SingleSelectProps) {
  const {
    items,
    shownCount,
    value,
    onChange,
    bufferSize = 0.2,
    isActive,
    ...rest
  } = props

  // The absolute position of the cursor in the `items` array
  const [cursor, setCursor] = useState(0)
  // The starting index of the visible slice of items
  const [shownCursor, setShownCursor] = useState(0)

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

  useEffect(() => {
    // When the selected value changes externally, move the cursor to it
    const selectedIndex = items.indexOf(value)
    if (selectedIndex !== -1) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setCursor(selectedIndex)
      // Adjust the shown window if the new value is outside of it
      if (
        selectedIndex < shownCursor
        || selectedIndex >= shownCursor + safeShownLength
      ) {
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setShownCursor(
          Math.max(0, selectedIndex - Math.floor(safeShownLength / 2)),
        )
      }
    }
  }, [value, items, shownCount, shownCursor, safeShownLength])

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
   * Selects the item currently under the cursor and calls the `onChange` prop.
   */
  const handleSelect = () => {
    const itemUnderCursor = items[cursor]
    if (itemUnderCursor) {
      onChange(itemUnderCursor)
    }
  }

  useInput(
    (input, key) => {
      if (key.upArrow) handlePrev()
      if (key.downArrow) handleNext()
      if (input === " " || key.return) handleSelect()
    },
    { isActive },
  )

  return (
    <Box {...rest} flexDirection="column" paddingX={1}>
      <Box flexDirection="column" height={safeShownLength} overflow="hidden">
        {shownItems.map((item, index) => {
          const isSelected = value === item.name
          const isCursorOnItem = cursor === item.originalIndex
          const isFirstShown = index === 0
          const isLastShown = index === shownItems.length - 1

          let indicator = ""
          if (isFirstShown && canScrollUp) {
            indicator = " ▲"
          }

          if (isLastShown && canScrollDown) {
            indicator = " ▼"
          }

          return (
            <Box key={item.name} justifyContent="space-between">
              <Box>
                <Text
                  backgroundColor={isCursorOnItem ? "yellowBright" : undefined}
                >
                  {isSelected ? "[x]" : "[ ]"} {item.name}
                </Text>
              </Box>

              <Text color="white">{indicator}</Text>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
