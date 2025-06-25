import { Box, render, Text } from "ink"

import { useStdoutDimensions } from "./lib/hooks"

const Counter = () => {
  const dimensions = useStdoutDimensions()

  return (
    <Box borderLeft={false} borderRight={false} borderStyle="single">
      <Text>{JSON.stringify(dimensions)}</Text>
    </Box>
  )
}

export const renderApp = () => {
  render(<Counter />)
}
