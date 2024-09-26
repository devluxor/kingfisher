import { PowerIcon } from "./Icons"

const MessagesControl = ({
  connectionEstablished, 
  wsServerURL, 
  setWsServerURL, 
  connectionOn, 
  connectionOff
}) => {
  return (
    <div className='messages-control expandable'>
      <form>
        <input
          readOnly={connectionEstablished}
          type="text" 
          id="wsServerURL" 
          value={wsServerURL} 
          name="wsServerURL" 
          placeholder="WebSocket Server URL" 
          required
          onChange={e => setWsServerURL(e.target.value)}
        ></input><br/>
      
        {!connectionEstablished && <button className="ws-connection" onClick={e => connectionOn(e)}>
          <PowerIcon/>
        </button>}
        {connectionEstablished && 
        <button className="ws-connection active" onClick={e => connectionOff(e)}>
          <PowerIcon/>
        </button>}
      </form>
    </div>
  )
}

export default MessagesControl