import React, { useContext } from 'react'
import { mainContext } from './context/context'
function aboutUs() {
  const { PageHeading } = useContext(mainContext)
  return (
    <>
      <PageHeading heading={'about'} />
      <div className='h-[80vh] grid place-items-center'>
        <h1 className='text-[#c4c4c4]'>sorry we are under development!</h1>
      </div>
    </>
  )
}

export default aboutUs