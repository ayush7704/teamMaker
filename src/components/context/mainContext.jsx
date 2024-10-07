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
        <div className='grid grid-cols-12 items-center py-4 px-4 text-xl'>
            {/* return btn  */}
            <button className={`capitalize col-[1/1] row-start-1 z-[1] inline-flex w-10 h-10 items-center justify-center cursor-pointer outline outline-1 outline-[#707070] hover:shadow-[3px_0px_5px_-2px_black] rounded-full dark:text-white transition-all duration-300`} onClick={() => { window.history.back() }}>
                <span>
                    <svg viewBox="0 0 24 24" className={`w-[1.5rem] h-[1.5rem] dark:drop-shadow-[4px_1px_1px_black] drop-shadow-[3px_0px_1px_black]`} color="#ffffff" fill="none">
                        <path d="M4.80823 9.44118L6.77353 7.46899C8.18956 6.04799 8.74462 5.28357 9.51139 5.55381C10.4675 5.89077 10.1528 8.01692 10.1528 8.73471C11.6393 8.73471 13.1848 8.60259 14.6502 8.87787C19.4874 9.78664 21 13.7153 21 18C19.6309 17.0302 18.2632 15.997 16.6177 15.5476C14.5636 14.9865 12.2696 15.2542 10.1528 15.2542C10.1528 15.972 10.4675 18.0982 9.51139 18.4351C8.64251 18.7413 8.18956 17.9409 6.77353 16.5199L4.80823 14.5477C3.60275 13.338 3 12.7332 3 11.9945C3 11.2558 3.60275 10.6509 4.80823 9.44118Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>
            <h3 className='capitalize col-span-full row-start-1 text-center font-medium'>{heading}</h3>
        </div>
    )
})

const Modal = () => {
    const modalContainer = useRef(null)
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

    const { contextSafe } = useGSAP();

    const backClickedHandle = contextSafe(() => {
        gsap.fromTo(modalContainer.current.children, {scale:0.9}, {scale:1,duration:.8, ease:'back'})
    })

    return (
        <div ref={modalContainer} onClick={backClickedHandle} className={`fixed inset-0 z-20 grid place-items-center backdrop-blur-[2px] ${modalOpen ? '' : 'hidden'}`}>
            <div className={`sm:max-w-[25rem] max-w-[16.875rem] text-[0.9rem] bg-black px-3 py-4 outline outline-1 outline-[#ffffff54] rounded-sm`}>
                <h3 className='capitalize text-lg px-[0.625rem]'>save changes ?</h3>
                <div className='p-[0.625rem]'>
                    <p className='text-[#d1d1d1]'>
                        would you like to save current changes in
                        <span className='whitespace-nowrap'> {savedTeamOpened?.title} ?</span>
                    </p>
                </div>
                <div className='text-end mt-[0.35rem] text-[0.9em]'>
                    <button onClick={(e) => {e.srtopPropagation(); savingFunc({ type: savedTeamReducerActions.saveChanges }); setmodalOpen(false) }} className='capitalize rounded-sm py-1 px-2 hover:bg-[#a06800] bg-[#a0680080]'>save</button>
                    <button onClick={(e) => {e.stopPropagation(); savingFunc({ type: savedTeamReducerActions.discardChanges }); setmodalOpen(false); }} className='capitalize rounded-sm py-1 px-2 bg-[#e8252517] hover:bg-[#e8252538]  ml-2'>discard</button>
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
            < div className={`fixedmsg fixed hidden w-max px-3 sm:max-w-[16.875rem] capitalize text-[0.9rem] text-center  left-1/2 -translate-x-1/2 rounded-sm z-20 p-2 outline outline-1 bg-black outline-[gray] `
            }> {alertMsgsState}</div >
            {/* notifcation div ends  */}
        </>
    )
}