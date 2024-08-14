import { useState, useEffect } from "react"
import axios from "axios"
import { getNest } from "../../services/testApi"


const useFetchNest = (currentNestId) => {
  const [nest, setNest] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let ignore = false;
    (async () => {
      if (ignore) return
  
      setLoading(true)
      try {
        console.log('🐲 calling api to get nest data')
        const response = await getNest(currentNestId, source)
        setNest(response)
      } catch (e) {
        console.error(e)
        setError(e)
      }
      setLoading(false)
    })()
  
    return () => {
      ignore = true
      setLoading(false)
      source.cancel()
    }
  }, [currentNestId])

  return {nest, loading, error}
}

export default useFetchNest