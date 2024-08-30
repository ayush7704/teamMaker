import React ,{useContext}from 'react'
import { mainContext } from './context/context'
function howTo() {
  const { PageHeading } = useContext(mainContext)
  return (
    <>
      <PageHeading heading={'how to'} />
      <div className='h-[80vh] p-[30px] grid place-items-center'>
        <h1 className='text-[#c4c4c4]'>sorry we are under development!</h1>
      </div>
    </>
  )
}

export default howTo