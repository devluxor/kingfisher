import { useState } from "react"
import { formatDate, parseRequestData } from "../../utils/helpers"

const RequestDetails = ({activeRequest}) => {
  const [activeTab, setActiveTab] = useState(c => c || 'Headers')

  if (!activeRequest) return <EmptyRequestDetails/>

  const activateTab = (e) => {
    const tabs = document.querySelectorAll('.tabs > div')
    tabs.forEach(t => t.classList.remove('active'))

    e.target.classList.add('active')
    setActiveTab(e.target.textContent)
  }
  
  const headers = parseRequestData(activeRequest, 'headers')
  const body = parseRequestData(activeRequest, 'body')
  const query = parseRequestData(activeRequest, 'query')
  const arrivedOn = activeRequest.arrivedOn || activeRequest.arrived_on

  const displayContent = () => {
    if (activeTab === 'Headers') {
      return <RequestDataTable request={activeRequest} data={headers} element={'headers'}/>
    } else if (activeTab === 'Body') {
      return <RequestDataTable request={activeRequest} data={body} element={'body'}/>
    } else if (activeTab === 'Query') {
      return <RequestDataTable request={activeRequest} data={query} element={'query'}/>
    }
  }

  return (
    <div className='request-details visible' data-method={activeRequest.method}>
      <div className='request-method'>
        <h1>{activeRequest.method}</h1>
        <p>{activeRequest.path || '/'}</p>
      </div>

      <div className='request-main-details' >
        <div className="tabs" data-method={activeRequest.method}>
          <div 
            className={`tab request-headers ${activeTab === 'Headers' && 'active'}`}
            onClick={(e) => activateTab(e)}
          >Headers</div>
          {query && Object.keys(query)?.length > 0 && <div 
              className={`tab request-query ${activeTab === 'Query' && 'active'}`}
              onClick={(e) => activateTab(e)}
          >Query</div>}
          {activeRequest.method !== 'GET' && <div 
            className={`tab request-body ${activeTab === 'Body' && 'active'}`}
            onClick={(e) => activateTab(e)}
          >Body</div>}
          <div className="arrived-on">{formatDate(arrivedOn)}</div>
        </div>

        <div className="content">
          {displayContent()}
        </div>
      </div>
    </div>
  )
}

const EmptyRequestDetails = () => {
  return (
    <div className='request-details' style={{visibility: 'hidden'}}>
      <div className='request-method'></div>

      <div className='request-main-details'></div>
      <div className="content"></div>
    </div>
  )
}

const RequestDataTable = ({request, data, element}) => {
  if (!data) return

  if (typeof data === 'string') {
    return <code className="request-data-raw-body">{data}</code>
  } else {
    return (
      <table className={`request-data-table ${element}`} data-method={request.method}>
        <tbody>
            {Object.keys(data).map(key => {
                return (
                    <tr key={key}>
                        <th className="request-data-table-key">{key}</th>
                        <td className="request-data-table-value">{data[key]}</td>
                    </tr>
                )
            })}
        </tbody>
    </table>
    )
  }
}

export default RequestDetails