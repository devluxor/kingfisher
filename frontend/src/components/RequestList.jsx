import {useState, useEffect } from "react"
import axios from "axios"
import { getNest } from "../services/testApi"
import { createWSClient } from "../services/wsServices"


const RequestsList = ({currentNestId}) => {
  console.log('RequestList Rendered')
  const [requests, setRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  // const { activeWSConnection, setActiveWSConnection } = useContext(WSContext)
  // const navigate = useNavigate()

  // api call to get nest data and load requests
  // make custom hook ?
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let ignore = false;
    (async () => {
      if (ignore) return

      setLoadingRequests(true)
      try {
        console.log('🐲 calling api to get nest data')
        const response = await getNest(currentNestId, source)
        setRequests(response.requests)
      } catch (e) {
        console.error(e)
      }
      setLoadingRequests(false)
    })()

    return () => {
      ignore = true
      setLoadingRequests(false)
      source.cancel()
    }
  }, [currentNestId])
  
  // set the ws connection
  useEffect(() => {
    createWSClient(currentNestId, null, setRequests)
  }, [currentNestId])

  if (loadingRequests || !currentNestId) return <h3>Loading Requests</h3>

  return (
    <> 
      <h4>List of received requests:</h4>
      {requests.length === 0 ? 'No requests yet' :
        <div><h4>{requests.length} Received Request{requests.length > 1 ? 's' : ''}</h4><ul id="received-requests">{
          requests.map(r => <RequestListElement r={r} key={r.id}/>)
        }</ul></div>
      }
    </>
  )
}

const RequestListElement = ({r}) => {
  return <li className="request">🎈 {String(r.timeOfArrival)} {r.method} {r.path}</li>
}

export default RequestsList