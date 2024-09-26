import { SendIcon, CopyIcon, PlusCircleIcon, WSIcon, ClockIcon } from "./Icons"

const MainControlBar = ({
  displayFlashMessage, 
  hideFlashMessage, 
  resetCurrentNest, 
  nestHistoryToggle, 
  wsToggleOn, 
  toggleWSConnectionPanel,
  copyNest,
  currentNest,
  setNestHistoryToggle,
  testRequest
}) => {
  return (
    <div className='main-controls'>
      <button onClick={() => testRequest(currentNest.id)}>
        <SendIcon displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage}/>
      </button>
      <button
        onClick={copyNest}
      ><CopyIcon displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage}/></button>
      <button onClick={resetCurrentNest}><PlusCircleIcon  displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage} /></button>
      <button onClick={() => setNestHistoryToggle(s => !s)}>
        <ClockIcon nestHistoryToggle={nestHistoryToggle} displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage}/>
      </button>
      <WSIcon wsToggleOn={wsToggleOn} toggleWSConnectionPanel={toggleWSConnectionPanel} displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage} />
    </div>
  )
}

export default MainControlBar