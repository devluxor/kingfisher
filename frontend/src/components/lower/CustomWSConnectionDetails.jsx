const CustomWSConnectionDetails = ({activeMessageId, connectionEstablished, wsServerURL}) => {
  return (
    <div className='message-details' style={{visibility: connectionEstablished ? 'visible' : 'hidden'}}>
      <div className='message-data'>
        <h1>{activeMessageId}</h1>
      </div>
      <div className='message-server-url'>
        <h1>{connectionEstablished && wsServerURL}</h1>
      </div>
    </div>
  )
}

export default CustomWSConnectionDetails