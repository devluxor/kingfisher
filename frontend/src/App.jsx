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
        const result = await createNest(source)
        setCurrentNest(result?.nestId)
      } catch(error) {
        console.error(error)
      }
    })()
  }, [])

  return (
    <>
      <h1>🐦Welcome to Kingfisher!🐦</h1>
      <h3>Current nest id: {currentNest ? currentNest : 'loading id'}</h3>
      <h4>List of received requests:</h4>
      <ul className="received-requests"></ul>
      <button>Make test request</button>
    </>
  )
}

export default App
