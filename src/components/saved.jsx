import { useContext, useLayoutEffect, useState } from 'react'
import { mainContext } from './context/context.js'
import { useNavigate } from 'react-router-dom'


const seeMoreActions = {
  focusSeeMore: 'focusSeeMore',
  blurSeeMore: 'blurSeeMore',
  openWithGenerator: 'openWithGenerator',
  removeFromGenerator: 'removeFromGenerator',
  deleteSavedTeam: 'deleteSavedTeam'
}

function saved() {
  const { savedTeam, setsavedTeam, PageHeading, compareObjects, modalOpen, setmodalOpen } = useContext(mainContext)
  const navigate = useNavigate()
  const [savedTeamsState, setsavedTeamsState] = useState({ saveTeams: [], openSavedTeam: null, deletedSavedTeam: null })
  const [savedTeamActionsState, setsavedTeamActionsState] = useState({ editBtnClickBy: null, seeMoreBtnClickBy: null })

  useLayoutEffect(() => {
    setsavedTeamsState({ ...savedTeamsState, saveTeams: [...savedTeam] })
  }, [savedTeam])


  function seemoreActionHandlerFunc({ actionType, time, index, openedInGenerator }) {
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
        // if team is opened in generator 
        if (openedInGenerator) {
          localStorage.setItem('savedTeamOpened', JSON.stringify(false))
          localStorage.setItem('allTeamAndPlayers', JSON.stringify(false))
        }
        setsavedTeamActionsState((prevState) => ({ ...prevState, seeMoreBtnClickBy: index }))
        setsavedTeamsState({ ...savedTeamsState, saveTeams: afterDeletingArr });
        setsavedTeam([...afterDeletingArr])
        break;
      }
      case seeMoreActions.removeFromGenerator: {

        let changesSavedOrnot = compareObjects(JSON.parse(localStorage.getItem('savedTeamOpened')), JSON.parse(localStorage.getItem('allTeamAndPlayers')))
        // checking unsaved changes 
    
        if (changesSavedOrnot) {
          // this local storage data will remove the current opening object from the generator
          localStorage.setItem('savedTeamOpened', JSON.stringify(false))
          localStorage.setItem('allTeamAndPlayers', JSON.stringify(false))
          const resetOld = savedTeam.map((team) => { return { ...team, openedInGenerator: false } })
          setsavedTeam([...resetOld])
        }
        else {
          setmodalOpen(true)
        }
      }
        break;
      default: {
        setsavedTeamsState({ ...savedTeamsState })
        break
      }
    }
  }

  function openWithGeneratorFunc({ time }) {
    function open() {
      const copyOfsavedTeam = [...savedTeam]
      const resetOld = copyOfsavedTeam.map((team) => { return { ...team, openedInGenerator: false } }) // reseted 

      const openingElm = resetOld.findIndex((elm) => { return elm.savingTime === time })
      resetOld[openingElm].openedInGenerator = true; // opening elm value changed 

      localStorage.setItem('allTeamAndPlayers', JSON.stringify(resetOld[openingElm]))
      setsavedTeam([...resetOld])
      navigate('/')
    }
    const localSavedsaveTeam = JSON.parse(localStorage.getItem('savedTeamOpened'))
    const localallTeamAndPlayers = JSON.parse(localStorage.getItem('allTeamAndPlayers'))


    if (localSavedsaveTeam) { // saved team opened or not 
      let changesSavedOrnot = compareObjects(localSavedsaveTeam, localallTeamAndPlayers)
     
      // checking changes are saved or not
      if (changesSavedOrnot) {
        open()
      } else {
        setmodalOpen(true)
      }
    } else {
      open()
    }
  }

  return (
    <>
      <PageHeading heading={'saved'} />
      <div className='min-h-[80vh] p-3 pt-4 pb-24 sm:p-[30px] grid place-items-center'>
        {
          savedTeamsState.saveTeams.length < 1 ? <h1 className='text-[#c4c4c4]'>No saved work available.</h1> :
            <section className='grid gap-3 w-full sm:max-w-[70%] mx-auto text-[0.9rem] sm:text-[1rem] rounded-sm'>
              {
                savedTeamsState.saveTeams.toReversed().map((team, teamIndex) => (
                  <div key={team.title + team.savingTime} className={`flex gap-3 items-center flex-[1_1_300px] justify-evenly p-[10px] bg-[#000000cc] rounded-[100px] outline outline-1 ${team.openedInGenerator === true ? 'outline-[#a06800]' : 'outline-[#303030]'} ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex && !team.openedInGenerator ? 'outline-[#303030]' : ''} ${team.openedInGenerator && savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? 'outline-[#a06800]' : 'outline-[#303030]'}`}>
                    {/* matching nav bg with this  */}
                    <p className={`flex justify-center items-center rounded-[50%] bg-[#141414] flex-[0_0_50px] h-[50px]  ${team.openedInGenerator === true ? 'outline outline-1 outline-[#a06800]' : ''} ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex && !team.openedInGenerator ? 'outline outline-1 outline-[#ffffff]' : ''} ${team.openedInGenerator && savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? 'outline outline-1 outline-[#a06800]' : ''}`}>
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
                    <div className={`relative p-[5px] hover:bg-[#141414] rounded-[50%] transition-all ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? 'bg-[#141414]' : ''}`}>
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

                      {/* matching nav bg with this  */}
                      <ul className={`bg-[#141414] w-max shadow-[0_0_15px_-1px_#000000b8] text-[0.8rem] absolute z-[1] top-[-30px] right-full cursor-pointer rounded-[5px] border-[0.4px] overflow-hidden ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? '' : 'hidden'}
                      ${team.openedInGenerator === true ? 'border-[0.4px] border-[#a06800]' : ''}`}>
                        <li onMouseDown={() => {
                          seemoreActionHandlerFunc({ actionType: seeMoreActions.deleteSavedTeam, time: team.savingTime, openedInGenerator: team.openedInGenerator, index: null })
                        }} className='capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#000000cc]'>delete</li>
                        <li className='capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#000000cc]'>details</li>
                        {
                          // if already opened in generator then  removing li will be visible
                          team.openedInGenerator ?
                            <li className='capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#000000cc]' onMouseDown={(e) => { seemoreActionHandlerFunc({ actionType: seeMoreActions.removeFromGenerator }) }}>
                              remove from generator
                            </li>
                            :
                            <li className='capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#000000cc]' onMouseDown={(e) => { openWithGeneratorFunc({ time: team.savingTime }) }}>
                              open with generator
                            </li>
                        }
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