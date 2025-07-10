import {
  Box,
  measureElement,
  Text,
  useInput,
  type BoxProps,
  type DOMElement,
} from "ink"
import { useEffect, useRef, useState, type ReactNode } from "react"

export interface ScrollAreaProps extends BoxProps {
  height: number
  children: ReactNode
}

// Modified from https://github.com/vadimdemedes/ink/issues/432#issuecomment-1519671092
export function ScrollArea(props: ScrollAreaProps) {
  const [contentHeight, setContentHeight] = useState(0)
  const [offset, setOffset] = useState(0)

  const innerRef = useRef<DOMElement>(null)

  useEffect(() => {
    if (!innerRef.current) return

    const dimensions = measureElement(innerRef.current)

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setContentHeight(dimensions.height)
  }, [])

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
        ref={innerRef}
        flexDirection="column"
        flexShrink={0}
        marginTop={-offset}
      >
        <Text>
          {JSON.stringify({
            height: props.height,
            contentHeight,
            offset,
          })}
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          voluptas quos sunt voluptate aut accusantium molestiae perspiciatis
          nemo est, sed suscipit nesciunt id quam. Ipsum veniam iusto adipisci a
          nisi.
        </Text>
        {props.children}
      </Box>
    </Box>
  )
}
