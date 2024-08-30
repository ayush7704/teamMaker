import React, { useState, useEffect, useMemo, useLayoutEffect ,memo} from "react";
import { mainContext } from "./context";

function ContextProvider({ children }) {
    const [savedTeam, setsavedTeam] = useState([])

    useLayoutEffect(() => {
        const local = localStorage.getItem('savedTeams')
        if (local) {
            setsavedTeam(JSON.parse(localStorage.getItem('savedTeams')))
        }
    }, [])
    useLayoutEffect(() => {
        console.log(savedTeam)
        localStorage.setItem('savedTeams', JSON.stringify(savedTeam))
    }, [savedTeam])

    return (
        <mainContext.Provider value={{ savedTeam, setsavedTeam ,PageHeading}}>
            {children}
        </mainContext.Provider>
    )
}
export default React.memo(ContextProvider)

let PageHeading = memo(({ heading }) => {
    console.log('pageheading')
    return (
        <div className='flex items-center gap-4 py-4 px-4 text-xl'>
            {/* return btn  */}

            <div className={`capitalize inline-flex w-10 h-10 items-center justify-center cursor-pointer outline outline-1 outline-[#272727] hover:shadow-[3px_0px_5px_-2px_black] rounded-full dark:text-white transition-all duration-300`} style={{ userSelect: 'none' }} onClick={() => { window.history.back() }}> <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={`1.5rem`} height={`1.5rem`} color='white' fill="none" className='dark:drop-shadow-[4px_1px_1px_black] drop-shadow-[3px_0px_1px_black]'>
                <path d="M4 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.99996 17C8.99996 17 4.00001 13.3176 4 12C3.99999 10.6824 9 7 9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg> </span></div>
            <h3 className='capitalize font-medium'>{heading}</h3>
        </div>
    )
})