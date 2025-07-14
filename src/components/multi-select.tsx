/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
import { Box, Text, useInput, type BoxProps } from "ink"
import TextInput from "ink-text-input"
import { useEffect, useState } from "react"

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
  isActive?: boolean
  /**
   * An array of the currently selected items.
   */
  value: Array<string>
  /**
   * Callback function that is called when the selection changes.
   * It receives the new array of selected items.
   */
  onChange: (newSelection: Array<string>) => void
  /**
   * Callback function that is called when the filtering state changes.
   */
  onFilteringChange?: (isFiltering: boolean) => void
}

/**
 * A controlled, scrollable select list component for Ink.
 * Use arrow keys to navigate and spacebar or enter to toggle selection.
 * Press '/' to filter items.
 */
// eslint-disable-next-line max-lines-per-function
export function MultiSelect(props: SelectProps) {
  const {
    items,
    shownCount,
    value,
    onChange,
    bufferSize = 0.2,
    isActive,
    onFilteringChange,
    ...rest
  } = props

  const [cursor, setCursor] = useState(0) // The absolute position of the cursor in the `filteredItems` array
  const [shownCursor, setShownCursor] = useState(0) // The starting index of the visible slice of items
  const [filter, setFilter] = useState("")
  const [isFiltering, setIsFiltering] = useState(false)

  const handleSetIsFiltering = (filtering: boolean) => {
    setIsFiltering(filtering)
    onFilteringChange?.(filtering)
  }

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase()),
  )

  const safeShownLength = Math.min(shownCount, filteredItems.length)
  const bufferLength = Math.floor(safeShownLength * bufferSize)

  const canScrollUp = shownCursor > 0
  const canScrollDown = shownCursor + safeShownLength < filteredItems.length

  // Check if the cursor is in the "buffer zone" which triggers scrolling
  const isCursorInPrevBuffer = cursor < shownCursor + bufferLength
  const isCursorInNextBuffer =
    cursor > shownCursor + safeShownLength - 1 - bufferLength

  // Get the slice of items that are currently visible
  const shownItems = filteredItems
    .map((item, index) => ({
      name: item,
      originalIndex: index,
    }))
    .slice(shownCursor, shownCursor + safeShownLength)

  useEffect(() => {
    // Reset cursor when filter changes
    setCursor(0)
    setShownCursor(0)
  }, [filter])

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
    const newCursor = Math.min(filteredItems.length - 1, cursor + 1)
    setCursor(newCursor)

    if (isCursorInNextBuffer) {
      setShownCursor(
        Math.min(filteredItems.length - safeShownLength, shownCursor + 1),
      )
    }
  }

  /**
   * Toggles the selection status of the item currently under the cursor.
   * It calls the `onChange` prop with the new selection array.
   */
  const handleToggle = () => {
    const itemUnderCursor = filteredItems[cursor]
    if (!itemUnderCursor) return // Should not happen, but a good safeguard

    const isSelected = value.includes(itemUnderCursor)
    const newSelection =
      isSelected ?
        value.filter((selectedItem) => selectedItem !== itemUnderCursor)
      : [...value, itemUnderCursor]

    onChange(newSelection)
  }

  useInput(
    (input, key) => {
      if (isFiltering) {
        if (key.escape) {
          handleSetIsFiltering(false)
        }
        return
      }

      if (key.upArrow) handlePrev()
      if (key.downArrow) handleNext()
      if (input === " ") handleToggle()
      if (input === "/") {
        handleSetIsFiltering(true)
      }
    },
    { isActive },
  )

  return (
    <Box {...rest} flexDirection="column" paddingX={1}>
      {isFiltering && (
        <Box>
          <Text>Search: </Text>
          <TextInput
            value={filter}
            onChange={setFilter}
            onSubmit={() => handleSetIsFiltering(false)}
          />
        </Box>
      )}

      <Box flexDirection="column" height={safeShownLength} overflow="hidden">
        {shownItems.map((item, index) => {
          const isSelected = value.includes(item.name)
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
                  underline={isSelected}
                  wrap="truncate-middle"
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
