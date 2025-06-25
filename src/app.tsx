import { Box, render, Text, useInput } from "ink"

import { useStdoutDimensions } from "./lib/hooks"

export interface AppProps {
  isGit: boolean
}

const App = (props: AppProps) => {
  const dimensions = useStdoutDimensions()

  useInput((input) => {
    console.log(input)
  })

  return (
    <Box borderLeft={false} borderRight={false} borderStyle="single">
      <Box flexDirection="column">
        <Text>{JSON.stringify(props)}</Text>
        <Text>{JSON.stringify(dimensions)}</Text>
      </Box>
    </Box>
  )
}

export const renderApp = (props: AppProps) => {
  render(<App {...props} />)
}
