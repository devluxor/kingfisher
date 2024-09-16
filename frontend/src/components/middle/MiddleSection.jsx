
const MiddleSection = ({currentNest}) => {
  console.log('MID RENDERED')

  return (
    <section className='main-container middle'>

      <div className='title-container'>
        <h1>Kingfisher</h1>
        <h2>nest#{currentNest.id}</h2>
      </div>

      <div className='stats-container'>
      </div>

    </section>
  )
}

export default MiddleSection