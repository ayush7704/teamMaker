import { memo, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { mainContext } from './context/context.js'
import { useNavigate } from 'react-router-dom'
import { alertMsgs, alertMsgsTime } from './home.jsx'
import { useGSAP } from "@gsap/react";
import gsap from 'gsap'

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


function saved() {
  const { savedTeam, setsavedTeam, PageHeading, compareObjects, popupAnim, setmodalOpen, setalertMsgsState } = useContext(mainContext)
  const navigate = useNavigate()
  const [detailsModal, setdetailsModal] = useState({ Details: null, opened: false })
  const [savedTeamsState, setsavedTeamsState] = useState({ saveTeams: [], openSavedTeam: null, deletedSavedTeam: null })
  const [savedTeamActionsState, setsavedTeamActionsState] = useState({ editBtnClickBy: null, seeMoreBtnClickBy: null })
  const oldfilters = JSON.parse(sessionStorage.getItem('oldfilters'))


  let render = useRef(0)

  useEffect(() => {
    render.current = render.current + 1;
    console.log(render)
  })

  useEffect(() => {
    console.log(detailsModal)
  }, [detailsModal])

  useLayoutEffect(() => {
    // console.log(savedTeam)
    setsavedTeamsState({ ...savedTeamsState, saveTeams: [...savedTeam] });
    if (savedTeamsState.saveTeams.length > 0) {
      if (oldfilters) {
        // console.log(oldfilters.aTozOptions)
        getFiltersFunc({ a2z: oldfilters.aTozOptions })
      } else {
        // console.log(allfiltersDefault.aTozOptions)
        getFiltersFunc({ a2z: allfiltersDefault.aTozOptions })
      }
    }
  }, [savedTeam]); // Trigger the state update when savedTeam changes


  //  this func will set all values 
  function setfiltersFunc({ aToz }) {
    // console.log(aToz)
    switch (aToz) {
      case aTozOptionsSimplified.newToOld:
        // newest to oldest 
        // console.log(savedTeamsState.saveTeams)
        setsavedTeamsState({
          ...savedTeamsState,
          saveTeams: [...savedTeam].sort((a, b) => new Date(b.savingTime) - new Date(a.savingTime)),
        });
        // console.log(savedTeamsState.saveTeams)
        break;
      case aTozOptionsSimplified.OldToNew:
        // oldest to newest 
        setsavedTeamsState({
          ...savedTeamsState,
          saveTeams: [...savedTeam].sort((a, b) => new Date(a.savingTime) - new Date(b.savingTime)),
        });
        break;
      default:
        // console.log(aToz);
        break;
    }
    // console.log(aToz)
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
            // console.log('random');
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
        // console.log('inside remove')
        let changesSavedOrnot = compareObjects(JSON.parse(localStorage.getItem('savedTeamOpened')), JSON.parse(localStorage.getItem('allTeamAndPlayers')))
        // checking unsaved changes 

        if (changesSavedOrnot) {
          // console.log('inside true')
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

  const openWithGeneratorFunc = useCallback(({ time }) => {
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
        if (time === localSavedsaveTeam.savingTime) { // if the requesting and opened project is same
          navigate('/')
        } else {
          setmodalOpen(true)
        }
      }
    } else {
      open()
    }
  }, [savedTeam])

  return (
    <>
      <PageHeading heading={'saved'} />
      <div className={`${!savedTeamsState.saveTeams.length < 1 ? 'min-h-[80vh]' : ''} relative p-3 pt-4 pb-24 sm:pb-14 sm:p-[1.875rem]`}>
        {
          savedTeamsState.saveTeams.length < 1 ?
            <section className='min-h-[70vh] grid place-items-center'>
              <h1 className='text-[#c4c4c4]'>No saved Projects available.</h1>
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
                    <div key={team.title + team.savingTime} className={`flex gap-3 items-center flex-[1_1_18.75rem] justify-evenly p-[0.625rem] bg-[#000000] rounded-[6.25rem] outline outline-1 ${team.openedInGenerator === true ? 'outline-[#a06800]' : 'outline-[#303030] hover:outline-[#ffa60033]'} ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex && !team.openedInGenerator ? 'outline-[#303030]' : ''} ${team.openedInGenerator && savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? 'outline-[#a06800]' : 'outline-[#303030] '}`}>
                      {/* matching nav bg with this  */}
                      <p className={`flex justify-center items-center rounded-[50%] bg-[#141414] text-[1.05em] flex-[0_0_3.125em] h-[3.125em] ${team.openedInGenerator === true ? 'outline outline-1 outline-[#a06800]' : ''} ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex && !team.openedInGenerator ? 'outline outline-1 outline-[#ffffff]' : ''} ${team.openedInGenerator && savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? 'outline outline-1 outline-[#a06800]' : ''}`}>
                        {/* {(savedTeamsState.saveTeams.toReversed().length - teamIndex)} */}
                        {(teamIndex + 1)}
                      </p>
                      <div>
                        {/* title  */}
                        <p className='text-[1em] capitalize'>{team.title}</p>
                        {/* timing  */}
                        <p className='text-[0.8em] text-[#c4c4c4]'>{(new Date(team.savingTime)).toDateString()} {new Date(team.savingTime).toLocaleTimeString()}</p>
                        {/* <p className='text-[0.8em] text-[#c4c4c4]'>{team.description}</p> */}
                      </div>
                      <div>
                        {/* total players  */}
                        <p className='text-nowrap text-[0.9em]'>{team.players.length}  <span className='text-[#c4c4c4] text-[0.88em] ms-1'> Players</span></p>
                        {/* total teams  */}
                        <p className='text-nowrap text-[0.9em]'>{team.teams.length}  <span className='text-[#c4c4c4] text-[0.88em] ms-1'> Teams</span></p>
                      </div>
                      <div className={`relative p-[0.3125rem] hover:bg-[#141414] rounded-[50%] transition-all ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? 'bg-[#141414]' : ''}`}>

                        <svg className="w-[1.35rem] h-[1.35rem] text-white"
                          viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M12 20q-.825 0-1.412-.587T10 18t.588-1.412T12 16t1.413.588T14 18t-.587 1.413T12 20m0-6q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-6q-.825 0-1.412-.587T10 6t.588-1.412T12 4t1.413.588T14 6t-.587 1.413T12 8" /></svg>

                        <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={team.title + team.savingTime}>
                          <input onFocus={() => {
                            seemoreActionHandlerFunc({ actionType: seeMoreActions.focusSeeMore, time: team.savingTime, index: teamIndex })
                          }} onBlur={() => {
                            seemoreActionHandlerFunc({ actionType: seeMoreActions.blurSeeMore, time: team.savingTime, index: null })
                          }} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={team.title + team.savingTime} type="text" readOnly />
                        </label>

                        {/* matching nav bg with this  */}
                        {savedTeamActionsState.seeMoreBtnClickBy === teamIndex &&
                          <ul className={`bg-[#141414] w-max shadow-[0_0_0.9375rem_-1px_#000000b8] text-[0.9em] sm:text-[0.8em] absolute z-[1] top-[-1.875rem] right-full cursor-pointer rounded-[0.3125rem] border-[0.4px] overflow-hidden ${savedTeamActionsState.seeMoreBtnClickBy === teamIndex ? '' : 'hidden'}
                      ${team.openedInGenerator === true ? 'border-[0.4px] border-[#a06800]' : ''}`}>
                            <li onMouseDown={() => {
                              seemoreActionHandlerFunc({ actionType: seeMoreActions.deleteSavedTeam, time: team.savingTime, openedInGenerator: team.openedInGenerator, index: null })
                            }} className='capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#000000]'>delete</li>
                            <li className='capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#000000]' onMouseDown={(e) => { setdetailsModal({ Details: team, opened: true }) }}>details</li>
                            {
                              // if already opened in generator then  removing li will be visible
                              team.openedInGenerator ?
                                <>
                                  <li className='capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#000000]' onMouseDown={(e) => { navigate('/') }}>
                                    open in generator
                                  </li>
                                  <li className='capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#000000]' onMouseDown={(e) => { seemoreActionHandlerFunc({ actionType: seeMoreActions.removeFromGenerator }) }}>
                                    remove from generator
                                  </li>
                                </>
                                :
                                <li className='capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#000000]' onMouseDown={(e) => { openWithGeneratorFunc({ time: team?.savingTime }) }}>
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
      <Details modalDetails={detailsModal} setmodalDetails={setdetailsModal} openedInGenerator={openWithGeneratorFunc} />
    </>
  )
}

export default saved

function FilterCompo({ getFilters }) {
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
}

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
    }
    )
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
      <button className={`relative w-full bg-[#000000] backdrop-blur-[12px] text-[#e5e5e5] border border-[#333333] rounded-md px-3 py-[0.6rem] flex justify-between items-center focus-within:border-[#a06800] transition-all duration-200`}>
        {currentOption}
        <span className={`ml-2 transform ${AccordionOpened ? 'rotate-180' : 'rotate-0'} transition-transform`}>
          <svg className='w-5 drop-shadow-[0px_0px_3px_currentColor] h-5' viewBox="0 0 24 24" fill="none">
            <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <input ref={selectInput} onFocus={toggleDropdown} onBlur={toggleDropdown} className='cursor-pointer absolute inset-0 opacity-0' id='selectInput' type="button" readOnly />
      </button>
      {/* selected option button ends */}

      {/* Dropdown menu */}
      {/* {AccordionOpened && ( */}
      <div ref={Dropdown} className="absolute divide-y divide-solid divide-[#333333] z-10 w-full *:border-b-[#333333] bg-[#000000] backdrop-blur-[12px] border border-[#333333] mt-2 rounded-md shadow-lg overflow-hidden hidden">
        {options.map((optionsObj, index) => (
          <button key={index} onClick={(e) => { handleOptionClick(optionsObj.option); selectInput.current.blur() }}
            className={`w-full  text-left px-3 py-2 text-[#e5e5e5] hover:bg-[#131313cc] focus:bg-[#3a3a3a] transition-all ${optionsObj.selected ? 'flex justify-between' : ''}`}>
            <span>{optionsObj.option}</span>
            {optionsObj.selected &&
              <span>
                <svg className='w-[1.3125rem] drop-shadow-[0px_0px_3px_currentColor] h-[1.3125rem]' viewBox="0 0 24 24" color="#ffa600" fill="none">
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

const Details = memo(({ modalDetails, setmodalDetails, openedInGenerator }) => {
  const [clarify, setclarify] = useState(
    {
      need_to_recalculate: `${modalDetails.Details?.hasShuffled ? !(modalDetails.Details?.finalTotalTeams === modalDetails.Details?.teams.length && modalDetails.Details?.totalTeams === modalDetails.Details?.teams.length) : false}`,
      players_devided: modalDetails.Details?.hasShuffled ? true : false
    }
  )
  const detailsModalContainer = useRef(null)
  const detailsModal = useRef(null)
  const detailsModalMain = useRef(null)
  const description = modalDetails?.Details?.description || "";
  let no_players = !modalDetails?.Details?.players?.length > 0
  const { contextSafe } = useGSAP();

  useLayoutEffect(() => {
    console.log(modalDetails?.players?.length > 0)
    console.log(no_players)
    setclarify(
      {
        need_to_recalculate: modalDetails.Details?.hasShuffled ? !(modalDetails.Details?.finalTotalTeams === modalDetails.Details?.teams.length && modalDetails.Details?.totalTeams === modalDetails.Details?.teams.length) : false,
        players_devided: modalDetails.Details?.hasShuffled ? true : false
      }
    )
  }, [modalDetails])

  useGSAP(() => {
    if (modalDetails.opened) {
      //while opening

      gsap.fromTo(
        detailsModal.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back" }
      );
      document.body.style.overflow = "hidden";
      gsap.set(detailsModalMain.current, {
        scrollTop: 0
      })
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalDetails]);

  const closingDetailsModal = contextSafe(() => {
    document.body.style.overflow = "";
    gsap.fromTo(
      detailsModal.current,
      { scale: 1, opacity: 1 },
      { scale: 0, opacity: 0, duration: 0.3, ease: "power1" }
    );
    setTimeout(() => {
      setmodalDetails({ Details: null, opened: false })
    }, 150);
  });

  return (
    <section onClick={() => { closingDetailsModal() }} ref={detailsModalContainer} className={`fixed detailmodaContainer z-[26] p-4 backdrop-blur-[2px] inset-0 mx-auto ${modalDetails.opened ? "" : "hidden"}`}>

      <div ref={detailsModal} onClick={(e) => { e.stopPropagation(); }} className={`h-full overflow-hidden text-[0.99em] py-10 sm:pt-[3em] pt-[2.8em] sm:px-4 px-[0.4rem] bg-[#000000] sm:w-5/6 lg:w-[75%] rounded-2xl mx-auto outline outline-1 ${modalDetails?.Details?.openedInGenerator === true ? 'outline-[#a06800]' : 'outline-[#303030]'}`}>
        {/* ======= close btn starts ===== */}
        <button
          onClick={() => { closingDetailsModal() }}
          className="absolute top-2 right-2 sm:p-[0.5em] p-[0.4em] transition-all duration-100 drop-shadow-[0px_0px_5px_white] hover:drop-shadow-[0px_0px_7px_white] border border-1 border-[#ffffff41] hover:border-t hover:border-b rounded-[50%]">
          <svg className="sm:w-[1.1em] sm:h-[1.rem] w-[1em] h-[1em]" viewBox="0 0 24 24" fill="none">
            <path
              d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* ======= close btn ends ===== */}
        <main ref={detailsModalMain} className='h-full overflow-auto'>
          {/* topdiv starts  */}
          <div className="topdiv relative sm:text-base text-sm w-fit flex justify-between sm:gap-[5rem] gap-[3rem] px-5 py-2 overflow-hidden border-b border-t border-[#ffffff41] bg-[#141414] rounded-[4rem] mb-3">
            <div className="whitespace-nowrap">
              <span className="font-medium text-[#ffa600] mr-[2px]">
                {modalDetails?.Details?.players.length}{" "}
              </span>
              <span className="capitalize font-light text-[0.95em]">
                current players
              </span>
            </div>
            <div
              className="whitespace-nowrap"
            >
              <span className={`font-medium fo text-[#ffa600] mr-[2px] ${!modalDetails?.Details?.hasShuffled ? "line-through" : ""} `}>
                {modalDetails?.Details?.teams.length}{" "}
              </span>
              <span className={`capitalize font-light text-[0.95em] ${!modalDetails?.Details?.hasShuffled ? "line-through" : ""}`}>
                total teams
              </span>
            </div>
          </div>
          {/* topdiv ends  */}
          <section className='relative flex flex-wrap items-start gap-8'>
            {/* left section starts  */}
            <section className='lg:flex-[0_1_35%] lg:p-4 md:flex-[0_1_15rem] md:p-3 p-2 md:sticky top-0 flex flex-wrap gap-4 text-[0.96em]'>
              <div className="flex-[1_1_10rem] relative cursor-context-menu">
                <p className='absolute z-[3] translate-y-[-33%] left-3 text-[0.95em] text-[#8f95a0] bg-[#000000]'>Project Title</p>
                <input
                  type="text"
                  value={modalDetails?.Details?.title}
                  className="w-full text-[0.98em] bg-transparent px-3 py-2 mt-1 rounded-md border border-1 border-[#ffffff41] backdrop-blur-[100px] cursor-context-menu text-ellipsis"
                  readOnly
                />
              </div>
              <div className="flex-[1_1_14rem] relative cursor-context-menu">
                <p className='absolute z-[3] translate-y-[-33%] left-3 text-[0.95em] text-[#8f95a0] bg-[#000000]'>Project Timing</p>
                <input
                  value={`${(new Date(modalDetails?.Details?.savingTime)).toDateString()} ${new Date(modalDetails?.Details?.savingTime).toLocaleTimeString()}`}
                  className="w-full text-[0.98em] bg-transparent px-3 py-2 mt-1 rounded-md border border-1 border-[#ffffff41]  backdrop-blur-[100px] cursor-context-menu text-ellipsis"
                  readOnly
                />
              </div>
              <div className="flex-[1_1_12rem] relative cursor-context-menu">
                <p className='absolute z-[3] translate-y-[-33%] left-3 text-[0.95em] text-[#8f95a0] bg-[#000000]'>Project Description</p>
                <input
                  value={description.trim().length > 0 ? description : "Empty"}
                  className={`w-full text-[0.98em] bg-transparent px-3 py-2 mt-1 rounded-md border border-1 border-[#ffffff41]  backdrop-blur-[100px] cursor-context-menu text-ellipsis ${modalDetails?.Details?.description.trim().length < 1 ? "placeholder:text-red-500 text-red-500" : ""}`}
                  readOnly
                />
              </div>
            </section>
            {/* left section ends  */}
            {/* right section starts  */}
            <section className='relative lg:p-4 md:p-3 p-2 md:flex-[1_1] w-full'>
              {/* clarify section starts  */}
              <div className='sticky top-0 z-10 bg-[#000000] flex flex-wrap items-center justify-between gap-4'>
                {clarify.need_to_recalculate &&
                  <div className={`text-red-500 flex-[2_1_0%] text-[0.93em] flex gap-2 items-center`}><span>Recalculation needed</span>
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full  bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                    </span>
                  </div>
                }
                {
                !clarify.players_devided && !no_players &&
                  <div className={`text-red-500 flex-[2_1_0%] text-[0.93em] flex gap-2 items-center`}><span>Players are not divided</span>
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping  rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
                    </span>
                  </div>
                }
                <div className='flex-1 flex justify-end'>
                  <button onClick={() => { openedInGenerator({ time: modalDetails.Details?.savingTime }) }} className={`flex bg-black items-center gap-1 p-[0.2rem_1.3rem] font-medium border-b border-t rounded-[2rem] ${modalDetails?.Details?.openedInGenerator ? "border-[#a06800] hover:border-[#8d5b00] shadow-[0_0_9px_-2px_#a06800] hover:shadow-[0_0_9px_-4px_#a06800]" : "border-[#ffffff41] hover:border-[#202020] shadow-[0_0_9px_-2px_#ffffff41] hover:shadow-[0_0_9px_-4px_#ffffff41]"}`}>open <svg className='w-5 h-5' viewBox="0 0 24 24"><path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2zM14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3z" /></svg></button>
                </div>
              </div>
              {/* clarify section ends  */}
              {
                // when no players available
                no_players && <div className='flex justify-center items-center gap-2 py-5'>
                  <span className='text-red-500 text-[0.9em]'>No players</span> <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping  rounded-full bg-red-400 opacity-75">
                    </span>
                    <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
                  </span>
                </div>
              }
              {
                //  when players available
                !no_players && (modalDetails.Details?.hasShuffled ?
                  <section className="flex flex-wrap gap-x-3 gap-y-6 py-5 text-[0.95em]">
                    {/*devided teams section start */}
                    {
                      modalDetails.Details?.teams.map((team, teamIndex) => (
                        <div key={teamIndex} className={`md:flex-[1_0_12.5rem] sm:flex-[1_0_9.375rem] flex-[1_0_8.125rem]`}>
                          <h1 className="mb-4 text-center text-[1.0375em] font-medium">
                            Team {teamIndex + 1}
                          </h1>
                          <ol className="cardsContainer flex flex-wrap justify-center gap-3 list-inside relative text-[0.97em]">
                            {
                              team.teamPlayers.map((name, index) => (
                                <li key={index} className='md:flex-[0_0_12.5rem] sm:flex-[0_0_12.075rem] flex-[1_0_8.125rem] relative rounded-[0.25rem] p-2 text-wrap border border-1 border-[#ffffff41] backdrop-blur-[100px] transition-all duration-100 ease-in'>{name}</li>
                              ))
                            }
                          </ol>
                        </div>
                      ))
                    }
                    {/* devided teams section ends */}
                  </section>
                  :
                  <div className='text-[0.95em]'>
                    <h1 className="my-4 text-center text-[1.0375em] font-medium">
                      Players
                    </h1>
                    <ol className='list-inside flex flex-wrap justify-center gap-3 text-[0.97em]'>
                      {/* player section starts */}
                      {
                        modalDetails.Details?.players.map((name, index) => (
                          <li key={index} className='md:flex-[0_0_12.5rem] sm:flex-[0_0_12.075rem] flex-[1_1_8.125rem] relative rounded-[0.25rem] p-2 text-wrap border border-1 border-[#ffffff41] backdrop-blur-[100px] transition-all duration-100 ease-in'>{name}</li>
                        ))
                      }
                      {/* player section ends */}
                    </ol>
                  </div>)
              }
            </section>
            {/* right section ends  */}
          </section>
        </main>
      </div>
    </section>
  )
})