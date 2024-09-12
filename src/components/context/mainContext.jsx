import React, { useRef, useState, useLayoutEffect, memo, useCallback, useContext } from "react";
import { mainContext } from "./context";
import { savedTeamReducerActions, alertMsgs } from "../home";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'


function ContextProvider({ children }) {
    const timeout = useRef(null)
    const [savedTeam, setsavedTeam] = useState([])
    const [modalOpen, setmodalOpen] = useState(false)
    const [alertMsgsState, setalertMsgsState] = useState('minimum 2 players required');

    const { contextSafe } = useGSAP();

    // Notification animation
    const popupAnim = contextSafe(() => {
        clearTimeout(timeout.current) // removing old timeout 
        gsap.fromTo('.fixedmsg', { bottom: 0, opacity: 0.5, display: 'none' }, { bottom: 100, opacity: 1, display: 'block', ease: 'back', duration: 0.5 })
        timeout.current = setTimeout(() => {
            gsap.to('.fixedmsg', { opacity: 0, duration: 0.4, display: 'none' })            
        }, 2000);
    })

    const compareObjects = useCallback((obj1, obj2) => {
        const entries1 = Object.entries(obj1);
        const entries2 = Object.entries(obj2);

        // if the lenth of entries is not equal 
        if (entries1.length !== entries2.length) {
            return false;
        }

        // this for of loop code is not mine here thanks to blackbox ai it hepls me to this. 
        // but comments are mine after understanding the working of this code .
        for (const [key, value] of entries1) {
            const value2 = obj2[key];

            if (typeof value === 'object' && typeof value2 === 'object') {
                // if the values are not equal it will means objects are equal 
                if (!compareObjects(value, value2)) {
                    return false;
                }
            } else if (value !== value2) { // for primitive values 
                return false;
            }
        }

        return true;
    }, [])

    useLayoutEffect(() => {
        const local = localStorage.getItem('savedTeams')
        if (local) {
            setsavedTeam(JSON.parse(localStorage.getItem('savedTeams')))
        }
    }, [])

    useLayoutEffect(() => {      
        localStorage.setItem('savedTeams', JSON.stringify(savedTeam))
    }, [savedTeam])

    return (
        <mainContext.Provider value={{ savedTeam, setsavedTeam, PageHeading, compareObjects, Modal, modalOpen, setmodalOpen, alertMsgsState, setalertMsgsState, Notification, popupAnim }}>
            {children}
        </mainContext.Provider>
    )
}
export default React.memo(ContextProvider)

let PageHeading = memo(({ heading }) => {
    // console.log('pageheading')
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

const Modal = () => {
    const { savedTeam, setsavedTeam, modalOpen, setmodalOpen, setalertMsgsState, popupAnim } = useContext(mainContext)
    const savedTeamOpened = structuredClone(savedTeam.find((savedteam) => { return savedteam.openedInGenerator }))

    const savingFunc = ({ type }) => {
        // structuredClone best way to copy nested arr , obj
        const currentTeam = structuredClone(JSON.parse(localStorage.getItem('allTeamAndPlayers')))
        const copiedsavedTeam = structuredClone(savedTeam)
        const openedArrIndex = copiedsavedTeam.findIndex(savedteam => savedteam.openedInGenerator); // finding opened array index 

        switch (type) {
            case savedTeamReducerActions.saveChanges:
                {
                    copiedsavedTeam[openedArrIndex] = currentTeam // pushing current allTypeplayersAndTeams copy in copy of savedTeam 
                    localStorage.setItem('savedTeamOpened', JSON.stringify(currentTeam)) //updating with latest changes
                    setsavedTeam(copiedsavedTeam); //setting  savedTeam with updated values
                    setalertMsgsState(alertMsgs.savedTeamChangesSaved) // popup msg for changes saved
                    popupAnim()
                }
                break;
            case savedTeamReducerActions.discardChanges:
                {
                    localStorage.setItem('allTeamAndPlayers', JSON.stringify(savedTeamOpened))
                    setalertMsgsState(alertMsgs.changesDiscard)
                    copiedsavedTeam[openedArrIndex] = savedTeamOpened
                    console.log(copiedsavedTeam)
                    console.log(openedArrIndex)
                    console.log(savedTeamOpened)
                    setsavedTeam(copiedsavedTeam)
                    popupAnim()
                }
                break;
            default:
                break;
        }
    }

    return (
        <div className={`fixed inset-0 z-20 grid place-items-center backdrop-blur-[2px] ${modalOpen ? '' : 'hidden'}`}>
            <div className={`sm:max-w-[400px] max-w-[270px] text-[0.9rem] bg-black px-3 py-4 outline outline-1 outline-[#ffffff54] rounded-sm`}>
                <h3 className='text-center capitalize text-lg'>save changes ?</h3>
                <div className='p-[10px]'>
                    <p className='text-[#d1d1d1]'>
                        would you like to save current changes in
                        <span className='whitespace-nowrap'> {savedTeamOpened?.title} ?</span>
                    </p>
                </div>
                <div className='text-end mt-1 text-[0.9em]'>
                    <button onClick={() => { savingFunc({ type: savedTeamReducerActions.saveChanges }); setmodalOpen(false) }} className='capitalize rounded-sm py-1 px-2 bg-[#1364ffde] '>save</button>
                    <button onClick={() => { savingFunc({ type: savedTeamReducerActions.discardChanges }); setmodalOpen(false); }} className='capitalize rounded-sm py-1 px-2 bg-[#e8252538]  ml-2'>discard</button>
                </div>
            </div>
        </div>
    )
}

const Notification = () => {
    const { alertMsgsState } = useContext(mainContext)

    return (
        <>
            {/* notifcation div starts  */}
            < div className={`fixedmsg fixed hidden w-max px-3 sm:max-w-[270px] capitalize text-[0.9rem] text-center  left-1/2 -translate-x-1/2 rounded-sm z-20 p-2 outline outline-1 bg-black outline-[gray] `
            }> {alertMsgsState}</div >
            {/* notifcation div ends  */}
        </>
    )
}