import MainControls from "./MainControls"
import RequestDetails from "./RequestDetails"
import CustomWSConnectionDetails from "./CustomWSConnectionDetails"

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
  activeWSConnection
}) => {

  const activeRequest = requests.find(r => r.id === activeRequestId)
  const activeMessage = messages.find(r => r.id === activeMessageId)

  return (
    <section className='main-container lower'>
      <RequestDetails activeRequest={activeRequest}/>

      <MainControls 
        currentNest={currentNest} 
        testRequest={testRequest} 
        setWsServerURL={setWsServerURL} 
        connectionEstablished={connectionEstablished} 
        createConnection={createConnection} 
        closeConnection={closeConnection} 
        wsServerURL={wsServerURL} 
        resetCurrentNest={resetCurrentNest}
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