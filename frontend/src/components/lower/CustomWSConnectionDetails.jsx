import { formatDate, parseMessageData } from '../../utils/helpers';


const CustomWSConnectionDetails = ({activeMessage,connectionEstablished, wsServerURL}) => {
  const WS_SERVER_URL_LONG = 40

  const isWSServerURLLong = wsServerURL?.length > WS_SERVER_URL_LONG

  return (
    <div className='message-details' style={{visibility: connectionEstablished ? 'visible' : 'hidden'}}>
      <div className='message-server-url'>
        <h1
          className={`${isWSServerURLLong ? 'long' : ''}`}
        >
          {connectionEstablished && wsServerURL}</h1>
      </div>
      <div className='message-data'>
        <MessageDetails activeMessage={activeMessage}/>
      </div>
    </div>
  )
}

const MessageDetails = ({activeMessage}) => {
  if (!activeMessage) return

  const messageData = parseMessageData(activeMessage)
  const arrivedOn = activeMessage?.arrived_on || activeMessage?.arrivedOn
  
  return (
      <>
        <div className="arrived-on">
          <p>{activeMessage && formatDate(arrivedOn)}</p>
        </div>
        <div className="data">
          <pre className="data">{JSON.stringify(messageData, null, 4).replaceAll('\\"', '')}</pre>
        </div>
      </>
  )
}

export default CustomWSConnectionDetails