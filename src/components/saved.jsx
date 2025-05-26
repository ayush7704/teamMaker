import { memo, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, Suspense, lazy } from 'react'
import { mainContext } from './context/context.js'
import FullscreenFallback from './fallback.jsx';
import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import { useNavigate } from 'react-router-dom'
const Details = lazy(() => import("./details.jsx"))

const seeMoreActions = {
  focusSeeMore: 'focusSeeMore',
  blurSeeMore: 'blurSeeMore',
  openWithGenerator: 'openWithGenerator',
  removeFromGenerator: 'removeFromGenerator',
  deleteSavedTeam: 'deleteSavedTeam'
}

const aTozOptionsSimplified = {
  newToOld: 'Newest To Oldest',
  OldToNew: 'Oldest To Newest'
}

const allfiltersDefault = {
  aTozOptions: [
    { option: aTozOptionsSimplified.newToOld, selected: false },
    { option: aTozOptionsSimplified.OldToNew, selected: true },
  ]
}

function Saved() {
  const navigate = useNavigate()
  const { savedTeam, setsavedTeam, PageHeading, compareObjects, popupAnim, setprojectHasChangedModalOpen, setalertMsgsState, alertMsgs, alertMsgsTime } = useContext(mainContext)
  const [detailsModal, setdetailsModal] = useState({ Details: null, opened: false })
  const [savedTeamsState, setsavedTeamsState] = useState({ saveTeams: [], openSavedTeam: null, deletedSavedTeam: null })
  const [savedTeamActionsState, setsavedTeamActionsState] = useState({ editBtnClickBy: null, seeMoreBtnClickBy: null })
  const oldfilters = JSON.parse(sessionStorage.getItem('oldfilters'))

  useLayoutEffect(() => {
    setsavedTeamsState((prev) => ({ ...prev, saveTeams: [...savedTeam] }));
    if (savedTeamsState.saveTeams.length > 0) {
      oldfilters ? getFiltersFunc({ a2z: oldfilters.aTozOptions }) : getFiltersFunc({ a2z: allfiltersDefault.aTozOptions })
    }
  }, [savedTeam]); // Trigger the state update when savedTeam changes


  //  this func will set all values 
  function setfiltersFunc({ aToz }) {
    switch (aToz) {
      case aTozOptionsSimplified.newToOld:
        // newest to oldest 
        setsavedTeamsState({
          ...savedTeamsState,
          saveTeams: [...savedTeam].sort((a, b) => new Date(b.savingTime) - new Date(a.savingTime)),
        });
        break;
      case aTozOptionsSimplified.OldToNew:
        // oldest to newest 
        setsavedTeamsState({
          ...savedTeamsState,
          saveTeams: [...savedTeam].sort((a, b) => new Date(a.savingTime) - new Date(b.savingTime)),
        });
        break;
      default:
        break;
    }
  }

  // i putted them get and set function seprate because when we need to set them we can do this independently

  // this func will get all filter values 
  function getFiltersFunc({ a2z, }) {
    a2z.forEach((elm, ind) => {
      if (elm.selected) {
        switch (elm.option) {
          case aTozOptionsSimplified.newToOld:
            setfiltersFunc({ aToz: elm.option })
            break;
          case aTozOptionsSimplified.OldToNew:
            setfiltersFunc({ aToz: elm.option })
            break;
          default:
            break;
        }
      }
    })
  }

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
        setalertMsgsState(alertMsgs.teamDeleted);
        popupAnim(alertMsgsTime.get(alertMsgs.teamDeleted))
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
          setprojectHasChangedModalOpen(true)
        }
      }
        break;
      default: {
        setsavedTeamsState({ ...savedTeamsState })
        break
      }
    }

  }

  const openWithGeneratorFunc = useCallback(({ time }) => {
    function open() {
      const copyOfsavedTeam = [...savedTeam]
      const resetOld = copyOfsavedTeam.map((team) => { return { ...team, openedInGenerator: false } }) // reseted 

      const openingElm = resetOld.findIndex((elm) => {return JSON.parse(JSON.stringify(elm.savingTime)) === JSON.parse(JSON.stringify(time)) }) // fixed time matching bug by turning both into numbers, format doesn't matter now
    
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
        console.log(JSON.parse(JSON.stringify(time)))
        console.log(localSavedsaveTeam.savingTime)
        if (JSON.parse(JSON.stringify(time)) === localSavedsaveTeam.savingTime) { // if the requesting and opened project is same
          navigate('/')
        } else {
          setprojectHasChangedModalOpen(true)
        }
      }
    } else {
      open()
    }
  }, [savedTeam])

  return (
    <main className={`saved-page ${savedTeamsState.saveTeams.length < 1 ?"min-h-[100dvh] flex flex-col":"pb-[6rem]"}`}>
      <PageHeading heading={'saved'} />
      <div className={`${savedTeamsState.saveTeams.length < 1 ? 'flex-1 grid place-items-center' : ''} relative p-3 pt-4 pb-24 sm:pb-14 sm:p-[1.875rem]`}>
        {
          savedTeamsState.saveTeams.length < 1 ?
            <section className='grid place-items-center'>
              <h1 className='text-[--soft]'>No saved Projects available.</h1>
            </section>
            :
            <>
              <section className='py-4 mb-3'>
                <div className="flex items-center gap-3">
                  <FilterCompo getFilters={getFiltersFunc} />
                </div>
              </section>
              <section className='grid gap-3 w-full sm:max-w-[70%] mx-auto text-[0.8rem] sm:text-[1rem] rounded-sm'>
                {
                  savedTeamsState.saveTeams.map((team, teamIndex) => (
                    <div key={team.title + team.savingTime} className={`flex gap-3 items-center flex-[1_1_18.75rem] justify-evenly p-[0.625rem] bg-[#000000] rounded-[6.25rem] border border-1 ${team.openedInGenerator === true ? 'border-[--lightTheme]' : 'border-[#303030] hover:border-[#ffa60033]'} ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex && !team.openedInGenerator ? 'border-[#303030]' : ''} ${team.openedInGenerator && savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? 'border-[--lightTheme]' : 'border-[#303030] '}`}>
                      {/* matching nav bg with this  */}
                      <p className={`flex justify-center items-center rounded-[50%] bg-[#141414] text-[1.05em] flex-[0_0_3.125em] h-[3.125em] ${team.openedInGenerator === true ? 'border border-1 border-[--lightTheme]' : ''} ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex && !team.openedInGenerator ? 'border border-1 border-[--primary]' : ''} ${team.openedInGenerator && savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? 'border border-1 border-[--lightTheme]' : ''}`}>
                        {(teamIndex + 1)}
                      </p>
                      <div>
                        {/* title  */}
                        <p className='text-[1em] capitalize font-medium Bricolage'>{team.title}</p>
                        {/* timing  */}
                        <p className='text-[0.8em] text-[--soft]'>{(new Date(team.savingTime)).toDateString()} {new Date(team.savingTime).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        {/* total players  */}
                        <p className='text-nowrap text-[0.9em]'>{team.players.length}  <span className='text-[--soft] text-[0.88em] ms-1'> Players</span></p>
                        {/* total teams  */}
                        <p className='text-nowrap text-[0.9em]'>{team.teams.length}  <span className='text-[--soft] text-[0.88em] ms-1'> Teams</span></p>
                      </div>
                      <div className={`relative p-[0.3125rem] hover:bg-[#141414] rounded-[50%] transition-all ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? 'bg-[#141414]' : ''}`}>

                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[1.35rem] h-[1.35rem] text-white"
                          viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 20q-.825 0-1.412-.587T10 18t.588-1.412T12 16t1.413.588T14 18t-.587 1.413T12 20m0-6q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-6q-.825 0-1.412-.587T10 6t.588-1.412T12 4t1.413.588T14 6t-.587 1.413T12 8" /></svg>

                        <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={team.title + team.savingTime}>
                          <input onFocus={() => {
                            seemoreActionHandlerFunc({ actionType: seeMoreActions.focusSeeMore, time: team.savingTime, index: teamIndex })
                          }} onBlur={() => {
                            seemoreActionHandlerFunc({ actionType: seeMoreActions.blurSeeMore, time: team.savingTime, index: null })
                          }} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={team.title + team.savingTime} type="text" readOnly />
                        </label>

                        {/* matching nav bg with this  */}
                        {
                        savedTeamActionsState.seeMoreBtnClickBy === teamIndex &&
                          <ul className={`bg-[#141414] w-max shadow-[0_0_0.9375rem_-1px_#000000b8] p-[0.2rem] text-[0.9em] sm:text-[0.8em] absolute z-[1] top-[-1.875rem] right-[125%] cursor-pointer rounded-[0.3125rem] border-[0.4px] overflow-hidden ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? '' : 'hidden'}
                            ${team.openedInGenerator === true ? 'border-[0.4px] border-[--lightTheme]' : ''}`}>
                            <li onMouseDown={() => {
                              seemoreActionHandlerFunc({ actionType: seeMoreActions.deleteSavedTeam, time: team.savingTime, openedInGenerator: team.openedInGenerator, index: null })
                            }} className='capitalize rounded-[0.1875rem] p-[0.5rem_0.8rem] transition-all duration-150 hover:bg-[#000000]'>delete</li>
                            <li className='capitalize rounded-[0.1875rem] p-[0.5rem_0.8rem] transition-all duration-150 hover:bg-[#000000]' onMouseDown={(e) => { setdetailsModal({ Details: team, opened: true }) }}>details</li>
                            {
                              // if already opened in generator then  removing li will be visible
                              team.openedInGenerator ?
                                <>
                                  <li className='capitalize rounded-[0.1875rem] p-[0.5rem_0.8rem] transition-all duration-150 hover:bg-[#000000]' onMouseDown={(e) => { navigate('/') }}>
                                    open in generator
                                  </li>
                                  <li className='capitalize rounded-[0.1875rem] p-[0.5rem_0.8rem] transition-all duration-150 hover:bg-[#000000]' onMouseDown={(e) => { seemoreActionHandlerFunc({ actionType: seeMoreActions.removeFromGenerator }) }}>
                                    remove from generator
                                  </li>
                                </>
                                :
                                <li className='capitalize rounded-[0.1875rem] p-[0.5rem_0.8rem] transition-all duration-150 hover:bg-[#000000]' onMouseDown={(e) => { openWithGeneratorFunc({ time: team?.savingTime }) }}>
                                  open with generator
                                </li>
                            }
                          </ul>
                        }
                      </div>
                    </div>
                  ))
                }
              </section>
            </>
        }
      </div >
      <Suspense fallback={<FullscreenFallback />}>
        {detailsModal.opened &&
          <Details modalDetails={detailsModal} setmodalDetails={setdetailsModal} openedInGenerator={openWithGeneratorFunc} />}
      </Suspense>
    </main>
  )
}

export default Saved

const FilterCompo = memo(({ getFilters }) => {
  const { saveTeams } = useContext(mainContext)
  const [allFilters, setallFilters] = useState(structuredClone(allfiltersDefault))
  let savedfilters = JSON.parse(sessionStorage.getItem('oldfilters'))

  useLayoutEffect(() => {
    getFilters({ a2z: allFilters.aTozOptions })
  }, [saveTeams])

  useLayoutEffect(() => {
    // initially setup of current filters to sessionStorage
    if (savedfilters) {
      setallFilters(savedfilters)
      getFilters({ a2z: savedfilters.aTozOptions }) // helper
    }
  }, [])

  useLayoutEffect(() => {
    getFilters({ a2z: allFilters.aTozOptions }) // sending filters to parent     
  }, [allFilters])

  return (
    <section className='relative'>
      <AccordionDropdown options={allFilters.aTozOptions} newOptions={setallFilters} />
    </section>
  )
})

const AccordionDropdown = memo(({ options, newOptions }) => {
  const selectInput = useRef(null)
  const Dropdown = useRef(null)
  const [AccordionOpened, setAccordionOpened] = useState(false);
  const defaultSelectedObj = options.find(item => item.selected);
  const defaultSelectedValue = defaultSelectedObj ? defaultSelectedObj.option : null;
  const [currentOption, setcurrentOption] = useState(defaultSelectedValue);


  useEffect(() => {
    setcurrentOption(defaultSelectedValue)
  }, [defaultSelectedObj])

  const toggleDropdown = () => {
    setAccordionOpened(prev => !prev);
  };

  // for options when clicking 
  const handleOptionClick = (option) => {
    setcurrentOption(option);
    // new options 
    const updatedOptions = options.map((object) => {
      return object.option === option ? { ...object, selected: true } : { ...object, selected: false }
    })
    newOptions((prev) => { return { ...prev, aTozOptions: updatedOptions } });
    sessionStorage.setItem('oldfilters', JSON.stringify({ ...allfiltersDefault, aTozOptions: updatedOptions }))
    setAccordionOpened(false);
  };

  useGSAP(() => {
    if (AccordionOpened) {
      gsap.fromTo(Dropdown.current, { y: -30, display: "none" }, { display: "block", y: 0, duration: 0.5, ease: 'back' })
    } else {
      gsap.to(Dropdown.current, { display: "none", top: "100%", duration: 0.5, ease: 'back' })
    }
  }, [AccordionOpened])
  return (
    <div className="relative max-w-64 text-[0.9em]">
      {/* selected option button starts */}
      <button className={`relative w-full bg-[#000000] backdrop-blur-[12px] text-[#e5e5e5] border border-[#303030] rounded-md px-3 py-[0.6rem] flex justify-between items-center focus-within:border-[--lightTheme] transition-all duration-200`}>
        {currentOption}
        <span className={`ml-2 transform ${AccordionOpened ? 'rotate-180' : 'rotate-0'} transition-transform`}>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-5 drop-shadow-[0px_0px_3px_currentColor] h-5' viewBox="0 0 24 24" fill="none">
            <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <input ref={selectInput} onFocus={toggleDropdown} onBlur={toggleDropdown} className='cursor-pointer absolute inset-0 opacity-0' id='selectInput' type="button" readOnly />
      </button>
      {/* selected option button ends */}

      {/* Dropdown menu */}
      {/* {AccordionOpened && ( */}
      <div ref={Dropdown} className="absolute divide-y divide-solid divide-[#303030] z-10 w-full *:border-b-[#303030] bg-[#000000] backdrop-blur-[12px] border border-[#303030] mt-2 rounded-md shadow-lg overflow-hidden hidden">
        {options.map((optionsObj, index) => (
          <button key={index} onClick={(e) => { handleOptionClick(optionsObj.option); selectInput.current.blur() }}
            className={`w-full text-left px-3 py-2 text-[#e5e5e5] hover:bg-[#131313cc] focus:bg-[#222222cc] transition-all ${optionsObj.selected ? 'flex justify-between' : ''}`}>
            <span>{optionsObj.option}</span>
            {optionsObj.selected &&
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" className='w-[1.3125rem] drop-shadow-[0px_0px_3px_currentColor] h-[1.3125rem]' viewBox="0 0 24 24" color="#ffa600" fill="none">
                  <path d="M3 13.3333C3 13.3333 4.5 14 6.5 17C6.5 17 6.78485 16.5192 7.32133 15.7526M17 6C14.7085 7.14577 12.3119 9.55181 10.3879 11.8223" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 13.3333C8 13.3333 9.5 14 11.5 17C11.5 17 17 8.5 22 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>}
          </button>
        ))}
      </div>
      {/* )} */}
      {/* Dropdown menu ends*/}
    </div>
  );
})
