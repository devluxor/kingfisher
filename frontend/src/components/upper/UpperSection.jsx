import { sortDescending } from "../../utils/helpers"

const UpperSection = ({
  requests, 
  activeRequestId, 
  setActiveRequestId,
  messages,
  activeMessageId,
  setActiveMessageId
}) => {
  console.log('UpperSection RENDERED')

  sortDescending(requests)
  sortDescending(messages)

  const newRequestId = requests[0]?.id
  const newMessageId = messages[0]?.id
  return (
    <section className='main-container upper'>
      <div className='arrived-elements requests'>
        {requests.map(r => {
          return <RequestListElement 
            key={r.id} 
            r={r} 
            activeRequestId={activeRequestId} 
            setActiveRequestId={setActiveRequestId}
            newRequestId={newRequestId}
          />
        })}
      </div>
      <div className='arrived-elements messages'>
        {messages.map(m => {
          return <MessageListElement 
            key={m.id}
            m={m}
            setActiveMessageId={setActiveMessageId}
            activeMessageId={activeMessageId}
            newMessageId={newMessageId}
          /> 
        })}
      </div>
    </section>
  )
}

const RequestListElement = ({r, activeRequestId, setActiveRequestId, newRequestId}) => {
  console.log(activeRequestId)
  return (
    <div 
      onClick={() => setActiveRequestId(r.id)} 
      key={r.id} 
      className={`
        request red 
        ${r.id === activeRequestId ? 'active' : ''} 
        ${r.id === newRequestId? 'new' : 'slide-right' } 
      `}
    >R{r.id[0]}</div>
  )
}

const MessageListElement = ({m, activeMessageId, setActiveMessageId, newMessageId}) => {
  return (
    <div 
      onClick={() => setActiveMessageId(m.id)}
      className={`
        message
        ${m.id === activeMessageId ? 'active' : ''}        
        ${m.id === newMessageId ? 'new' : 'slide-left'}        
      `}
      >M{m.id[0]}</div>
  )
}

export default UpperSection