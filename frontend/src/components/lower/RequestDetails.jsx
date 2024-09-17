import { useState } from "react"
import { parseRequestData } from "../../utils/helpers"

const RequestDetails = ({activeRequest}) => {
  const [activeTab, setActiveTab] = useState(c => c || 'Details')

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
  console.log(query)
  const displayContent = () => {
    if (activeTab === 'Details') {
      return <RequestGeneral activeRequest={activeRequest}/>
    } 
    
    if (activeTab === 'Headers') {
      return <RequestDataTable data={headers} element={'headers'}/>
    } else if (activeTab === 'Body') {
      return <RequestDataTable data={body} element={'body'}/>
    } else if (activeTab === 'Query') {
      return <RequestDataTable data={query} element={'query'}/>
    }
  }

  return (
    <div className='request-details'>
      <div className='request-method'>
        <h1>{activeRequest.method}</h1>
        <p>{activeRequest.path || '/'}</p>
      </div>

      <div className='request-main-details'>
        <div className="tabs">
          <div 
            className='tab request-headers'
            onClick={(e) => activateTab(e)}
          >Headers</div>
          {query?.length > 0 && <div 
              className='tab request-query'
              onClick={(e) => activateTab(e)}
          >Query</div>}
          {activeRequest.method !== 'GET' && <div 
            className='tab request-body'
            onClick={(e) => activateTab(e)}
          >Body</div>}
          <div className="arrived-on">{arrivedOn}</div>
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

const RequestDataTable = ({data, element}) => {
  if (!data) return

  if (typeof data === 'string') {
    return <code>{data}</code>
  } else {
    return (
      <table className={`request-data-table ${element}`}>
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