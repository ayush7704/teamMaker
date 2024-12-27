import gsap from 'gsap'
import React, { useContext } from 'react'
import { mainContext } from './context/context'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'


gsap.registerPlugin(ScrollTrigger)
function aboutUs() {
  const { PageHeading } = useContext(mainContext)
  useGSAP(() => {
    gsap.utils.toArray('.card').forEach((el) => {
      gsap.to(el ,{
        opacity: 0.5, ease:'power1',scale: .8,scrollTrigger: {
          trigger: el,
          scrub:1,
          // pin:true,
          // pinSpacing:false,
          start: 'top 0%',
          end:'bottom 0%',
          // markers: true
        }
      })
    })
  }, [])
  return (
    <>
      <PageHeading heading={'about'} />
      {/* Origin story: Share how the idea for the random team maker came about. */}
      {/* <div className=' grid place-items-center'>
        <h1 className='text-[#c4c4c4]'>sorry we are under development!</h1>
      </div> */}
      {/* <div className='min-h-full bruno grid grid-cols-[100%]'>
        <div className='flex flex-col text-[10vw] sm:text-[10vh] p-[3vw]'>
          <h1>design &</h1>
          <h1 className='text-center'>developed by</h1>
          <h1 className='text-end'><a href="https://ayushnagar-portfolio.netlify.app" target='_blank'>ayush nagar</a></h1>
        </div>
      </div> */}
      <div className='relative grid justify-center gap-10'>
        {Array(4).fill(null).map((_, index) => (
          <div key={index} className="sticky card top-0 w-[80vw] mx-auto min-h-[50vh]  backdrop-blur-[8px] rounded-2xl outline outline-1 outline-[#2a2a2a] overflow-auto">           
           
          </div>
        ))}
      </div>
    </>
  )
}

export default aboutUs