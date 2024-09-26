import { lastNests } from "../../utils/helpers"
import { useNavigate } from "react-router-dom"
import { CircleIcon } from "./Icons"

export const NestHistory = ({
  nestHistoryToggle, 
  currentNest, 
  closeConnection, 
  setWsServerURL, 
  displayFlashMessage, 
  hideFlashMessage
}) => {
  const nestIds = lastNests()

  return (
    <div className={`nest-history ${nestHistoryToggle ? 'visible' : ''}`}>
      {nestIds.map(n => {
        return (
          <NestInCache
            key={n} 
            nestId={n}
            currentNest={currentNest} 
            closeConnection={closeConnection} 
            setWsServerURL={setWsServerURL}
            displayFlashMessage={displayFlashMessage}
            hideFlashMessage={hideFlashMessage}
          />
        )
      })}
    </div>
  )
}

const NestInCache = ({ 
  currentNest, 
  nestId, 
  closeConnection, 
  setWsServerURL, 
  displayFlashMessage, 
  hideFlashMessage
}) => {
  const navigate = useNavigate()

  const goToCachedNest = () => {
    closeConnection()
    setWsServerURL('')
    navigate(`/${nestId}`)
  }

  return (
    <a
      onClick={goToCachedNest}
      onMouseEnter={() => displayFlashMessage(`#${nestId}`)}
      onMouseLeave={hideFlashMessage}
    >
      <CircleIcon currentNest={currentNest} nestId={nestId}/>
    </a>
  )
}