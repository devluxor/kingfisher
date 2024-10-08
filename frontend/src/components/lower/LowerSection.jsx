import RequestDetails from "./RequestDetails"
import CustomWSConnectionDetails from "./CustomWSConnectionDetails"
import MainControlArea from "./MainControlArea"

const LowerSection = ({
  currentNest,
  requests, 
  activeRequestId, 
  testRequest, 
  resetCurrentNest,
  messages,
  createConnection, 
  closeConnection, 
  wsServerURL, 
  setWsServerURL, 
  connectionEstablished,
  activeMessageId,
  activeWSConnection,
  flashMessage,
  setFlashMessage
}) => {

  const activeRequest = requests.find(r => r.id === activeRequestId)
  const activeMessage = messages.find(r => r.id === activeMessageId)

  return (
    <section className='main-container lower'>
      <RequestDetails activeRequest={activeRequest}/>

      <MainControlArea 
        currentNest={currentNest}
        testRequest={testRequest} 
        setWsServerURL={setWsServerURL} 
        connectionEstablished={connectionEstablished} 
        createConnection={createConnection} 
        closeConnection={closeConnection} 
        wsServerURL={wsServerURL} 
        resetCurrentNest={resetCurrentNest}
        flashMessage={flashMessage}
        setFlashMessage={setFlashMessage}
      />

      <CustomWSConnectionDetails
        activeMessage={activeMessage}
        activeMessageId={activeMessageId} 
        connectionEstablished={connectionEstablished} 
        wsServerURL={wsServerURL}
        activeWSConnection={activeWSConnection}
      />

    </section>
  )
}




export default LowerSection