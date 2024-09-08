import MainControls from "./MainControls"
import RequestDetails from "./RequestDetails"
import CustomWSConnectionDetails from "./CustomWSConnectionDetails"

const LowerSection = ({
  currentNest,
  requests, 
  activeRequestId, 
  testRequest, 
  resetCurrentNest,
  createConnection, 
  closeConnection, 
  wsServerURL, 
  setWsServerURL, 
  connectionEstablished,
  activeMessageId,
}) => {

  const activeRequest = requests.find(r => r.id === activeRequestId)

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
        activeMessageId={activeMessageId} 
        connectionEstablished={connectionEstablished} 
        wsServerURL={wsServerURL}
      />

    </section>
  )
}




export default LowerSection