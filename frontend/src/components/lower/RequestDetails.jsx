import { useState } from "react"
import { isJSON } from "../../utils/helpers"

const RequestDetails = ({activeRequest}) => {
  const [activeTab, setActiveTab] = useState(c => c || 'Details')

  const activateTab = (e) => {
    console.log(e)
    const tabs = document.querySelectorAll('.tabs > div')
    tabs.forEach(t => t.classList.remove('active'))

    e.target.classList.add('active')
    setActiveTab(e.target.textContent)
  }
  
  const headers = activeRequest && isJSON(activeRequest.headers) ? 
    JSON.parse(activeRequest.headers) :
    activeRequest?.headers

  const body = activeRequest && isJSON(activeRequest.body) ? 
    JSON.parse(activeRequest.body) :
    activeRequest?.body

  const displayContent = () => {
    if (activeTab === 'Details') {
      return <RequestGeneral activeRequest={activeRequest}/>
    } else if (activeTab === 'Headers') {
      return <RequestHeaders headers={headers}/>
    } else {
      return <RequestBody body={body}/>
    }
  }

  return (
    <div className='request-details' style={{visibility: activeRequest ? 'visible' : 'hidden'}}>
      <div className='request-method'>
        <h1>{activeRequest?.method}</h1>
        <p>{activeRequest?.path || '/'}</p>
        <p>{activeRequest?.id}</p>
      </div>

      <div className='request-main-details'>
        <div className="tabs">
          <div 
            className='request-other'
            onClick={(e) => activateTab(e)}
          >Details</div>
          <div 
            className='request-headers'
            onClick={(e) => activateTab(e)}
          >Headers</div>
          <div 
            className='request-body'
            onClick={(e) => activateTab(e)}
          >Body</div>
        </div>

        <div className="content">
          {displayContent()}
        </div>
      </div>
    </div>
  )
}

const RequestGeneral = ({activeRequest}) => {
  if (!activeRequest) return

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>Arrived On</th>
            <td>{activeRequest.arrivedOn || activeRequest.arrived_on}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

const RequestHeaders = ({headers}) => {
  if (!headers) return

  return (
    <>
      <table>
          <tbody>
              {Object.keys(headers).map(header => {

                  return (
                      <tr key={header}>
                          <th>{header}</th>
                          <td>{headers[header]}</td>
                      </tr>
                  )
              })}
          </tbody>
      </table>
    </>
  )
}

const RequestBody = ({body}) => {
  if (!body) return

  if (typeof body === 'string') {
    return <code>{body}</code>
  } else {
    return (
      <table>
        <tbody>
            {Object.keys(body).map(key => {
                return (
                    <tr key={key}>
                        <th>{key}</th>
                        <td>{body[key]}</td>
                    </tr>
                )
            })}
        </tbody>
    </table>
    )
  }
}

export default RequestDetails