
const RequestDetails = ({activeRequest}) => {
  {/* use classes ???*/}
  return (
    <div className='request-details' style={{visibility: activeRequest ? 'visible' : 'hidden'}}>
      <div className='request-method'>
        <h1>{activeRequest?.method}</h1>
        <p>{activeRequest?.path || '/'}</p>
        <p>{activeRequest?.id}</p>
      </div>
      <div className='request-body-and-headers'>
        <div className='request-headers'>Headers</div>
        <div className='request-body'>Body</div>
      </div>
    </div>
  )
}

export default RequestDetails