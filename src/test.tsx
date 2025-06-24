import { render, Text } from "ink"
import { useEffect, useState } from "react"

const Counter = () => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      // eslint-disable-next-line max-nested-callbacks
      setCounter((previousCounter) => previousCounter + 1)
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <Text color="green">{counter} tests passed</Text>
}

export const renderApp = () => {
  render(<Counter />)
}
