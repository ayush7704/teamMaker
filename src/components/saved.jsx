import React, { useContext, useEffect, useLayoutEffect, useReducer, useState } from 'react'
import { mainContext } from './context/context.js'
import { NavLink, useNavigate } from 'react-router-dom'


const seeMoreActions = {
  focusSeeMore: 'focusSeeMore',
  blurSeeMore: 'blurSeeMore',
  openWithGenerator: 'openWithGenerator',
  deleteSavedTeam: 'deleteSavedTeam'
}

function saved() {
  const { savedTeam, setsavedTeam ,PageHeading} = useContext(mainContext)
  const navigate = useNavigate()
  console.log(savedTeam)
  const [savedTeamsState, setsavedTeamsState] = useState({ saveTeams: [], openSavedTeam: null, deletedSavedTeam: null })
  const [savedTeamActionsState, setsavedTeamActionsState] = useState({ editBtnClickBy: null, seeMoreBtnClickBy: null })

  useLayoutEffect(() => {
    console.log(savedTeam)
    setsavedTeamsState({ ...savedTeamsState, saveTeams: [...savedTeam] })
  }, [savedTeam])


  function seemoreActionHandlerFunc({ actionType, time, index }) {

    console.log(actionType)
    switch (actionType) {
      case seeMoreActions.focusSeeMore: {
        setsavedTeamActionsState((prevState) => ({ ...prevState, seeMoreBtnClickBy: index }))
        break;
      }
      case seeMoreActions.blurSeeMore: {
        setsavedTeamActionsState((prevState) => ({ ...prevState, seeMoreBtnClickBy: index }))
        break;
      }
      case seeMoreActions.deleteSavedTeam: {
        const afterDeletingArr = savedTeamsState.saveTeams.filter((currentTeam, teamIndex) => { return currentTeam.savingTime !== time })
        console.log(afterDeletingArr)
        setsavedTeamActionsState((prevState) => ({ ...prevState, seeMoreBtnClickBy: index }))
        setsavedTeamsState({ ...savedTeamsState, saveTeams: afterDeletingArr });
        setsavedTeam([...afterDeletingArr])
        break;
      }
      default: {
        setsavedTeamsState({ ...savedTeamsState })
        break
      }
    }
  }

  function openWithGeneratorFunc({ time }) {
    const copyOfsavedTeam = [...savedTeam]
    const resetOld = copyOfsavedTeam.map((team) => { return { ...team, openedInGenerator: false } })
    console.log(resetOld)
    const openingElm = resetOld.findIndex((elm) => { return elm.savingTime === time })
    resetOld[openingElm].openedInGenerator = true
    console.log(resetOld[openingElm])
    setsavedTeam([...resetOld])
    navigate('/')
  }

  return (
    <>
      <PageHeading heading={'saved'} />
      <div className='min-h-[80vh] p-3 pt-4 pb-24 sm:p-[30px] grid place-items-center'>
        {
          savedTeamsState.saveTeams.length < 1 ? <h1 className='text-[#c4c4c4]'>sorry we are under development!</h1> :
            <section className='grid gap-3 w-full sm:max-w-[70%] mx-auto text-[0.9rem] sm:text-[1rem] bg-[#0a0a0acc] rounded-sm'>
              {
                savedTeamsState.saveTeams.toReversed().map((team, teamIndex) => (
                  <div key={team.title + team.savingTime} className='flex gap-3 items-center flex-[1_1_300px] justify-evenly p-[10px] outline outline-1 outline-[#303030]'>
                    <p className={`flex justify-center items-center rounded-[50%] bg-[rgb(23_23_23)] flex-[0_0_50px] h-[50px]  ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex || team.openedInGenerator === true ? 'outline outline-1 outline-[#00ff00]' : ''}`}>
                      {(savedTeamsState.saveTeams.toReversed().length - teamIndex)}
                    </p>
                    <div>
                      <p className='text-[1em]'>{team.title}</p>
                      <p className='text-[0.8em] text-[#c4c4c4]'>{(new Date(team.savingTime)).toDateString()} {new Date(team.savingTime).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p className='text-nowrap text-[0.9em]'>{team.players.length} players</p>
                      <p className='text-nowrap text-[0.9em]'>{team.finalTotalTeams} teams</p>
                    </div>
                    <div className='relative'>
                      <svg className='w-[20px] h-[20px] text-white rotate-90' viewBox="0 0 24 24" fill="none">
                        <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                      </svg>

                      <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={team.title + team.savingTime}>
                        <input onFocus={() => {
                          seemoreActionHandlerFunc({ actionType: seeMoreActions.focusSeeMore, time: team.savingTime, index: teamIndex })
                        }} onBlur={() => {
                          seemoreActionHandlerFunc({ actionType: seeMoreActions.blurSeeMore, time: team.savingTime, index: null })
                        }} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={team.title + team.savingTime} type="text" readOnly />
                      </label>


                      <ul className={`bg-[#0e0d0d] w-max shadow-[0_0_15px_-1px_#000000b8] text-[0.8rem] absolute z-[1] top-[-30px] right-full p-1 cursor-pointer rounded-sm border-[0.4px] ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? '' : 'hidden'}`}>
                        <li onMouseDown={() => {
                          seemoreActionHandlerFunc({ actionType: seeMoreActions.deleteSavedTeam, time: team.savingTime, index: null })
                        }} className='capitalize p-2 transition-all duration-150 hover:bg-[#262626]'>delete</li>
                        <li className='capitalize p-2 transition-all duration-150 hover:bg-[#262626]'>details</li>
                        <li className='capitalize p-2 transition-all duration-150 hover:bg-[#262626]' onMouseDown={(e) => { e.preventDefault(); openWithGeneratorFunc({ time: team.savingTime }) }}>
                          open with generator
                        </li>
                      </ul>
                    </div>

                  </div>
                ))
              }
            </section>
        }
      </div >
    </>
  )
}

export default saved