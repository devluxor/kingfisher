import { useEffect, useState } from "react"
import { createNest } from "./services/testApi"
import axios from "axios"

function App() {
  const [currentNest, setCurrentNest] = useState(null)

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    (async () => {
      try {
        const nestId = await createNest(source)
        setCurrentNest(nestId)
      } catch(error) {
        console.error(error)
      }
    })()

    return () => {
      source.cancel('axios request cancelled')
    }
  }, [])


  return (
    <>
      <h1>🐦Welcome to Kingfisher!🐦</h1>
      <h3>Current nest: {currentNest}</h3>
      <button>Get request data</button>
    </>
  )
}

export default App
