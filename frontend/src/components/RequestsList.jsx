const developmentMode = import.meta.env.DEV

const RequestsList = ({requests}) => {
  developmentMode && console.log('RequestList Rendered')

  if (!requests) return <h3>Loading Requests</h3>

  const requestsReceived = requests.length > 0

  return (
    <> 
      <h4>{ !requestsReceived ? 'No requests yet' : 'List of received requests:'}</h4>
      {requestsReceived && 
        <div>
          <h4>{requests.length} Received Request{requests.length > 1 ? 's' : ''}</h4>
          <ul id="received-requests">
            {requests.map(r => <RequestListElement r={r} key={r.id}/>)}
          </ul>
        </div>
      }
    </>
  )
}

const RequestListElement = ({r}) => {
  const arrivedOn = String(r.arrivedOn || r.arrived_on)
  return <li className="request">🎈 {arrivedOn} {r.method} {r.path? r.path : "/"}</li>
}

export default RequestsList