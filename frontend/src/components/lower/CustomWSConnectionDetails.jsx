const CustomWSConnectionDetails = ({activeMessage, activeMessageId, connectionEstablished, wsServerURL}) => {
  
  return (
    <div className='message-details' style={{visibility: connectionEstablished ? 'visible' : 'hidden'}}>
      <div className='message-data'>
        <MessageDetails activeMessage={activeMessage}/>
      </div>
      <div className='message-server-url'>
        <h1>{connectionEstablished && wsServerURL}</h1>
      </div>
    </div>
  )
}

const MessageDetails = ({activeMessage}) => {
  if (!activeMessage) return

  return (
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <td>#{activeMessage.id}</td>
          </tr>
          <tr>
            <th>Arrived On</th>
            <td>{activeMessage?.arrived_on || activeMessage?.arrivedOn}</td>
          </tr>
          <tr>
            <th>Data:</th>
            <td>{JSON.stringify(activeMessage.data)}</td>
          </tr>
        </tbody>
      </table>
  )
}

export default CustomWSConnectionDetails