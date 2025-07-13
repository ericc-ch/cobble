import { Box, Text, useInput, type BoxProps } from "ink"
import { useState } from "react"

export interface SelectProps extends BoxProps {
  height: number
  items: Array<string>
}

// Modified from https://github.com/vadimdemedes/ink/issues/432#issuecomment-1519671092
export function Select(props: SelectProps) {
  const [contentHeight, setContentHeight] = useState(0)
  const [cursor, setCursor] = useState(0)
  const [offset, setOffset] = useState(0)

  const handleUp = () => {
    setCursor(Math.min(props.items.length - 1, cursor + 1))
  }

  const handleDown = () => {
    setCursor(Math.max(0, cursor - 1))
  }

  useInput((_input, key) => {
    if (key.downArrow) handleUp()
    if (key.upArrow) handleDown()
  })

  const uniqueItems = [...new Set(props.items)]

  const itemsBefore = uniqueItems.slice(0, cursor)
  const currentItem = uniqueItems[cursor]
  const itemsAfter = uniqueItems.slice(cursor + 1)

  const visibleBefore = itemsBefore.slice

  return (
    <Box
      {...props}
      flexDirection="column"
      height={props.height}
      overflow="hidden"
    >
      {/* {uniqueItems.map((item, index) => {
        return (
          <Text
            key={item}
            backgroundColor={index === cursor ? "white" : undefined}
          >
            {item}
          </Text>
        )
      })} */}

      <Text>
        {JSON.stringify(
          { cursor, itemsBefore, currentItem, itemsAfter },
          null,
          2,
        )}
      </Text>
    </Box>
  )
}
