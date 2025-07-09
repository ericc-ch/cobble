import { Box, render, Text, useInput } from "ink"
import TextInput from "ink-text-input"
import React, { useState } from "react"

import { useStdoutDimensions } from "./lib/hooks"

export interface AppProps {
  isGit: boolean
}

const App = (props: AppProps) => {
  const dimensions = useStdoutDimensions()
  const [value, setValue] = useState("")

  useInput((input) => {
    // You can still handle global input here if needed
  })

  return (
    <Box borderLeft={false} borderRight={false} borderStyle="single">
      <Box flexDirection="column">
        <Text>{JSON.stringify(props)}</Text>
        <Text>{JSON.stringify(dimensions)}</Text>
        <Box marginTop={1}>
          <Text>Enter text: </Text>
          <TextInput value={value} onChange={setValue} />
        </Box>
        <Box marginTop={1}>
          <Text>You typed: {value}</Text>
        </Box>
      </Box>
    </Box>
  )
}

export const renderApp = (props: AppProps) => {
  render(<App {...props} />)
}
