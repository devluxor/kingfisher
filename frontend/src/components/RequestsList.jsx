const RequestsList = ({requests}) => {
  console.log('RequestList Rendered')

  if (!requests) return <h3>Loading Requests</h3>

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