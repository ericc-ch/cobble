import { Box, measureElement, useInput, type BoxProps } from "ink"
import { useState, type ReactNode } from "react"

export interface ScrollAreaProps extends BoxProps {
  height: number
  children: ReactNode
}

// Modified from https://github.com/vadimdemedes/ink/issues/432#issuecomment-1519671092
export function ScrollArea(props: ScrollAreaProps) {
  const [contentHeight, setContentHeight] = useState(0)
  const [offset, setOffset] = useState(0)

  const handleScrollDown = () =>
    setOffset(Math.min(contentHeight - props.height, offset + 1))

  const handleScrollUp = () => setOffset(Math.max(0, offset - 1))

  useInput((_input, key) => {
    if (key.downArrow) handleScrollDown()
    if (key.upArrow) handleScrollUp()
  })

  return (
    <Box
      {...props}
      flexDirection="column"
      height={props.height}
      overflow="hidden"
    >
      <Box
        ref={(ref) => {
          if (!ref) return

          const dimensions = measureElement(ref)
          setContentHeight(dimensions.height)
        }}
        flexDirection="column"
        flexShrink={0}
        marginTop={-offset}
      >
        {props.children}
      </Box>
    </Box>
  )
}
