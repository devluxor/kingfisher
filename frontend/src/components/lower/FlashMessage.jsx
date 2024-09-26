const FlashMessage = ({flashMessage}) => {
  return (
    <div 
    className={`flash-message ${flashMessage?.type === 'error' ? 'error' : ''} ${flashMessage ? 'visible' : ''}`}
    data-method={flashMessage?.type ? flashMessage.type : ''}
  >
    <h1
      className={`${flashMessage?.message.charAt(0) === '#' ? 'nest-url' : ''}`}
    >{flashMessage?.message}</h1>
  </div>
  )
}

export default FlashMessage