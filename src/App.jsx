import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import React, { useReducer, useState, useEffect, useRef } from 'react'

const reducerTypes = {
  addPlayer: 'addPlayer',
  editPlayer: 'editPlayer',
  deletePlayer: 'deletePlayer',
  addTeam: 'addTeam',
  addTeamBlur: 'addTeamBlur',
  teamShuffle: 'teamShuffle',
  removeAll: 'removeAll',
  titleChange: 'titleChange',
}

const reducer = (oldobj, action) => {
  let worker;
  // for adding players 
  if (action.type === reducerTypes.addPlayer) {
    worker = { ...oldobj, players: [...oldobj.players, action.payload.playerName] }
    if (worker.hasShuffled) {
      try {
        let flatArr = [];
        worker.teams.forEach((element, elmInd) => {
          let a = element.teamPlayers
          flatArr = flatArr.concat(a)
          // console.log(element.teamPlayers)
        });
        console.log(flatArr)
        if (flatArr.length < worker.players.length) {
          console.log(worker.players[worker.players.length - 1])
          flatArr.push(worker.players[worker.players.length - 1])
         console.log(flatArr)
          worker.players.map( (element, elmInd) => {
            let startIndex = Math.floor((elmInd % worker.players.length) / worker.teams.length)
            worker.teams[(elmInd % worker.teams.length)].teamPlayers.splice(startIndex,1,flatArr[elmInd])
            // worker.teams[(elmInd % worker.teams.length)].teamPlayers.splice(startIndex, 1, flatArr[elmInd])
          });         
          console.log(worker)
          return { ...worker }
        }
        // worker.players = [...flatArr]
      } catch (error) {
        console.log(error)
      }
    }
    console.log('end.......')
    return { ...worker }
  }

  // for deleting players 
  else if (action.type === reducerTypes.deletePlayer) {
    worker = { ...oldobj }
    const split = action.payload.details.whichArray.split('.')
    let [one, two] = split;

    // two='teamPlayers'
    // console.log(one)
    // console.log(two)
    // console.log(split)
    // console.log(worker?.[one][two].teamPlayers[Number(action.payload.details.playerIndex)])
    // console.log(two ? worker?.[one][two].teamPlayers[Number(action.payload.details.playerIndex)] : worker?.[one][Number(action.payload.details.playerIndex)])
    // console.log(action.payload.details.whichArray)
    // console.log(Number(action.payload.details.playerIndex))
    two ? worker?.[one][two].teamPlayers.splice(Number(action.payload.details.playerIndex), 1) : worker?.[one].splice(Number(action.payload.details.playerIndex), 1)
    if (two) {
      // for changing the  real players array
      try {
        let flatArr = [];
        worker[one].forEach((element, elmInd) => {
          let a = element.teamPlayers
          flatArr = flatArr.concat(a)
          console.log(element.teamPlayers)
        });
        console.log(flatArr)
        worker.players = [...flatArr]
      } catch (error) {
        console.log(error)
      }
    }
    // console.log(oldobj?.[one][action.payload.details.playerIndex])
    // console.log(oldobj?.[one]?.[two][action.payload.details.playerIndex])
    // console.log(two ? oldobj?.[one]?.[two][action.payload.details.playerIndex] : oldobj?.[one][action.payload.details.playerIndex])

    // worker.splice(action.payload.whichplayer, 1)
    return { ...worker }
    // return { ...oldobj, players: [...worker] }
  }

  else if (action.type === reducerTypes.editPlayer) {
    worker = { ...oldobj }
    const split = action.payload.details.whichArray.split('.')
    let [one, two] = split;
    // console.log(action.payload.details)
    if (two) {
      worker[one][two].teamPlayers[Number(action.payload.details.editBtnClickBy)] = action.payload.details.playerName
      // for changing the  real players array
      try {
        let flatArr = [];
        worker[one].forEach((element, elmInd) => {
          let a = element.teamPlayers
          flatArr = flatArr.concat(a)
          console.log(element.teamPlayers)
        });
        console.log(flatArr)
        worker.players = [...flatArr]
      } catch (error) {
        console.log(error)
      }
    } else { worker[one][Number(action.payload.details.editBtnClickBy)] = action.payload.details.playerName }
    // two ? worker?.[one][two].teamPlayers[Number(action.payload.details.playerIndex)] = action.payload.details.playerName : worker?.[one][Number(action.payload.details.playerIndex)]
    // worker = [...oldobj.players]
    // worker[action.payload.whichplayer] = action.payload.newplayer
    return { ...worker }
    // return { ...oldobj, players: [...worker] }
  }

  // after changing total teams 
  else if (action.type === reducerTypes.addTeamBlur) {
    worker = { ...oldobj }
    console.log(oldobj)
    // if input is '' or less than 2
    if (Number(action.payload.newTotalTeams) <= 2) {
      worker.totalTeams = 2
      while (worker.teams.length !== 2) {
        if (worker.teams.length > worker.totalteams) {
          worker.teams.pop()
        } else {
          const name = `team${worker.teams.length + 1}`
          console.log(name)
          worker.teams.push({ teamName: name, teamPlayers: [] })
        }
      }
      return { ...worker }
    }

    // if input is equal or greater 3
    else if (action.payload.newTotalTeams >= 3) {
      worker = { ...oldobj }
      while (Number(worker.teams.length) !== Number(action.payload.newTotalTeams)) {
        if (worker.teams.length > Number(action.payload.newTotalTeams)) {
          worker.teams.pop()
        } else {
          const name = `team${worker.teams.length + 1}`
          worker.teams.push({ teamName: name, teamPlayers: [] })
        }
      }
      return { ...worker, totalTeams: Number(action.payload.newTotalTeams), finalTotalTeams: Number(action.payload.newTotalTeams) }
    }

  }

  else if (action.type === reducerTypes.addTeam) {
    worker = { ...oldobj }
    console.log({ ...oldobj })
    if (Number(action.payload.newTotalTeams) < 0) {
      return { ...worker, finalTotalTeams: 2 }
    }
    else {
      // alert('sfd')
      console.log(worker)
      // while teams are not equal to the current totalteams this loop will run
      while (Number(worker.teams.length) !== Number(action.payload.newTotalTeams)) {
        if (worker.teams.length > Number(action.payload.newTotalTeams)) {
          worker.teams.pop()
        } else {
          const name = `team${worker.teams.length + 1}`
          worker.teams.push({ teamName: name, teamPlayers: [] })
        }
      }
      return { ...worker, totalTeams: action.payload.newTotalTeams, finalTotalTeams: 2 }
    }
  }
  else if (action.type === reducerTypes.teamShuffle) {
    console.log([...action.payload.newTeams])
    return { ...oldobj, teams: [...action.payload.newTeams], hasShuffled: true }
  }
  else if (action.type === reducerTypes.removeAll) {
    return { players: [], finalTotalTeams: 2, totalTeams: 2, teams: [{ teamName: 'team1', teamPlayers: [] }, { teamName: 'team2', teamPlayers: [] }], hasShuffled: false, title: 'Fifa team 2026' }
  }
  else if (action.type === reducerTypes.titleChange) {
    console.log('aagyi.....')
    console.log({ ...oldobj })
    return { ...oldobj, title: action.newTitle }
  }
  // console.log(oldobj)
}

function App() {
  const render = useRef(0)
  const mainInput = useRef(null)
  const titleInput = useRef(null)
  const anim = useRef(null)
  const formSubmitBtnState = { add: 'add', edit: 'editing' }
  const [generateBtn, setgenerateBtn] = useState({ processing: false, })

  const [allTypeplayersAndTeams, setAllTypeplayersAndTeams] = useReducer(reducer, { players: [], finalTotalTeams: 2, totalTeams: 2, teams: [{ teamName: 'team1', teamPlayers: [] }, { teamName: 'team2', teamPlayers: [] }], hasShuffled: false, title: 'Fifa team 2026' })

  const [PlayerInfoAndMore, setPlayerInfoAndMore] = useState({ playerName: '', whichArray: 'players', playerIndex: null, editBtnClickBy: null, currentInputBtn: formSubmitBtnState.add })

  useEffect(() => {
    render.current = render.current + 1
    console.log('render  ' + render.current)
  })

  useEffect(() => {
    console.log(allTypeplayersAndTeams)
    console.log(allTypeplayersAndTeams.teams)
  }, [allTypeplayersAndTeams])
  useEffect(() => {
    console.log(PlayerInfoAndMore)
  }, [PlayerInfoAndMore])
  useEffect(() => {
    console.log(generateBtn)
  }, [generateBtn])


  function formSubmit(e) {
    e.preventDefault()
    if (PlayerInfoAndMore.currentInputBtn === formSubmitBtnState.edit) {
      // while editing 
      setAllTypeplayersAndTeams({ type: reducerTypes.editPlayer, payload: { details: { ...PlayerInfoAndMore } } });
      // setAllTypeplayersAndTeams({ type: reducerTypes.editPlayer, payload: { whichplayer: PlayerInfoAndMore.editBtnClickBy, newplayer: PlayerInfoAndMore.playerName } });
    } else {
      setAllTypeplayersAndTeams({ type: reducerTypes.addPlayer, payload: { playerName: PlayerInfoAndMore.playerName } });
      mainInput.current.focus()
    }
    setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: '', editBtnClickBy: null, whichArray: null, whichplayer: null, currentInputBtn: formSubmitBtnState.add })
  }

  const { contextSafe } = useGSAP();
  const onClickGood = contextSafe(async () => {
    console.log({ ...allTypeplayersAndTeams })
    let worker = { ...allTypeplayersAndTeams }
    // worker.teams = [{ teamName: 'team1', teamPlayers: [] }, { teamName: 'team2', teamPlayers: [] }]
    let uniqueRandomsArr = new Set([])

    console.log('running ......... start .......')
    await new Promise((resolve) => {
      gsap.fromTo('.cards', { rotateY: '0deg' }, { rotateY: '180deg', duration: 1, });
      setTimeout(() => {
        resolve('dfd')
      }, 1000);
    })

    // console.log(allTypeplayersAndTeams)
    await new Promise(async (resolve) => {
      console.log('running .........' + new Date)
      const promises = allTypeplayersAndTeams.players.map(async (element, index) => {
        while (uniqueRandomsArr.size !== allTypeplayersAndTeams.players.length) {
          let random = Math.floor(Math.random() * allTypeplayersAndTeams.players.length)
          uniqueRandomsArr.add(random)
        }
      });
      await Promise.all(promises);

      const teamsArrEmpty = allTypeplayersAndTeams.teams.map(async (team, teamIndex) => {
        worker.teams[teamIndex].teamPlayers = []
        return undefined
      })

      await Promise.all(teamsArrEmpty)

      console.log(worker.teams)
      console.log(uniqueRandomsArr)
      const promises2 = allTypeplayersAndTeams.players.map(async (element, index) => {
        let name = `team${index % allTypeplayersAndTeams.teams.length}`
        // this is dynamic start index calculator for splicing in all teams array 
        let startIndex = Math.floor((index % allTypeplayersAndTeams.players.length) / allTypeplayersAndTeams.teams.length)
        console.log(allTypeplayersAndTeams.teams.length)
        console.log(index % allTypeplayersAndTeams.teams.length)
        console.log({ ...worker.teams[(index % allTypeplayersAndTeams.teams.length)] })
        console.log(worker.teams)
        console.log(worker.teams[(index % allTypeplayersAndTeams.teams.length)].teamPlayers)
        worker.teams[(index % allTypeplayersAndTeams.teams.length)].teamPlayers.splice(startIndex, 1, allTypeplayersAndTeams.players[Array.from(uniqueRandomsArr)[index]])
        // worker.teams[(index % allTypeplayersAndTeams.teams.length)].teamPlayers.push(allTypeplayersAndTeams.players[Array.from(uniqueRandomsArr)[index]])

      });

      await Promise.all(promises2);
      console.log('down .........' + new Date)
      // console.log(worker)
      setAllTypeplayersAndTeams({ type: reducerTypes.teamShuffle, payload: { newTeams: [...worker.teams] } })
      resolve('done')

    })
    // console.log('runningdfsfdfsfsf.......' + new Date)
    // console.log(uniqueRandomsArr)
    // console.log('done .........')
    gsap.fromTo('.cards', { rotateY: '180deg' }, { rotateY: '360deg', duration: 1, });
    setgenerateBtn({ processing: false })
    // return () => {
    //   anim.current.removeEventListener('click', onClickGood);
    // };
  });

  return (
    <section className='min-h-[100vh] bg-black text-white'>

      <div className="wrapper sm:w-[75%] mx-auto p-3 pb-20">

        {/* details div starts  */}
        <div className="details lg:max-w-[35%] sm:max-w-[75%] mx-auto p-2">

          {/* current players div starts  */}
          <div className='flex justify-between p-2'>
            <span className='capitalize'>current players</span>
            <span className='capitalize'>{allTypeplayersAndTeams.players.length}</span>
          </div>
          {/* current players div ends  */}

          {/* total teams label starts  */}
          <label htmlFor='totalTeamsInput' className='flex justify-between p-2'>
            <span className='capitalize'>total teams</span>
            <input type="number" name="totalTeamsInput" id="totalTeamsInput" value={allTypeplayersAndTeams.totalTeams} className='w-[40px] text-end bg-transparent focus:outline-none' onChange={(e) => setAllTypeplayersAndTeams({ type: reducerTypes.addTeam, payload: { newTotalTeams: e.target.value } })} onBlur={(e) => { setAllTypeplayersAndTeams({ type: reducerTypes.addTeamBlur, payload: { newTotalTeams: e.target.value } }); }} />
          </label>
          {/* total teams label ends  */}

          {/* add title div starts  */}
          <div className='p-2'>
            <label htmlFor="titleForGenerationTeam">Title</label>
            <input ref={titleInput} value={allTypeplayersAndTeams.title} onChange={(e) => setAllTypeplayersAndTeams({ type: reducerTypes.titleChange, newTitle: e.target.value })} type="text" name="titleForGenerationTeam" id='titleForGenerationTeam' placeholder='Title' className='w-full bg-transparent px-3 py-2 mt-2 rounded-md outline outline-1 outline-[#ffffff41] focus:outline-[#4d4aff]' />
          </div>
          {/* add title div ends  */}

        </div>
        {/* details div ends  */}

        {/* form start  */}
        <form onSubmit={formSubmit} onReset={() => setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: '' })} className='lg:max-w-[35%] sm:max-w-[75%] mx-auto p-2'>
          <div className='flex p-2 items-center gap-2'>
            {/* main input btn starts  */}
            <div className='relative flex-1'>

              <input ref={mainInput} type="text" name="playerName" id="formInput" placeholder='Add player' className='w-full bg-transparent px-3 py-2  rounded-md outline outline-1 outline-[#ffffff41] focus:outline-[#4d4aff] pr-[40px]' value={PlayerInfoAndMore.playerName} onChange={(e) => { setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: e.target.value }) }} required autoFocus />

              {/* submit button starts  */}
              <button type="submit" className='absolute p-2 right-0 h-full border-l border-lime-400'>
                {
                  PlayerInfoAndMore.currentInputBtn === formSubmitBtnState.add ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" color="#a3e635" fill="none">
                      <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="21" height="21" color="#a3e635" fill="none">
                      <path d="M3 13.3333C3 13.3333 4.5 14 6.5 17C6.5 17 6.78485 16.5192 7.32133 15.7526M17 6C14.7085 7.14577 12.3119 9.55181 10.3879 11.8223" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 13.3333C8 13.3333 9.5 14 11.5 17C11.5 17 17 8.5 22 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                }
              </button>
              {/* submit button ends  */}

            </div>
            {/* main input btn ends  */}

            {/* reset button starts  */}
            {
              // only  visible while editing name 
              PlayerInfoAndMore.currentInputBtn === formSubmitBtnState.edit &&
              <button onClick={() => { setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.add, playerName: '', playerIndex: null, editBtnClickBy: null, whichArray: null }) }} type="reset" value={'cancle'} className='p-2 border-[#ffffff41] border-2 rounded-[50%]'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" color="#e50f0f" fill="none">
                  <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            }
            {/* reset button ends  */}
          </div>
        </form>
        {/* form ends  */}

        <main className='py-[25px]'>
          <div className='mx-auto my-4 text-center'>
            <button onClick={() => { setgenerateBtn({ processing: true }); onClickGood(); }} ref={anim} className='bg-[#ffff0004] outline-lime-50  outline-1 outline px-3 py-2 rounded-sm mr-2' disabled={generateBtn.processing}>Generate</button>
            {
              allTypeplayersAndTeams.players.length > 0 && <button onClick={() => { setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: '', editBtnClickBy: null, whichArray: null, whichplayer: null, currentInputBtn: formSubmitBtnState.add }); setAllTypeplayersAndTeams({ type: reducerTypes.removeAll }) }} className='bg-[#a53a274f] capitalize  outline-1 outline-lime-50 outline px-3 py-2 rounded-sm'>clear all</button>
            }
          </div>
          <div>
            <h1 className='p-3 capitalize bg-[#1d1d1d] mb-4' onClick={() => titleInput.current.focus()}>{allTypeplayersAndTeams.title}</h1>
          </div>
          {
            allTypeplayersAndTeams.hasShuffled ?

              <section className='flex flex-wrap gap-3 py-5'>
                {allTypeplayersAndTeams.teams.map((team, teamValIndex) => (
                  <div key={teamValIndex} className='md:flex-[1_0_200px] sm:flex-[1_0_150px] flex-[1_0_130px] '>
                    <h1 className='mb-4 text-center'>Team {(teamValIndex + 1)}</h1>
                    <ol className='cardsContainer flex flex-wrap justify-center gap-3 list-inside relative '>
                      {team.teamPlayers.map((val, valIndex) => (
                        // console.log('hello');
                        <li key={`${team.teamName}-${valIndex}`} className='cards md:flex-[0_0_200px] sm:flex-[0_0_150px] flex-[1_0_130px] relative rounded-md p-2 pt-3 text-wrap bg-[rgb(44_44_44)]'>
                          <span>{val}</span>

                          {/*== backface of card starts  ==*/}
                          <div className='back absolute inset-0 rounded-[inherit]'></div>
                          {/*== backface of card ends  ==*/}

                          {/*====  three dots starts  =====*/}
                          <span className='seeMore absolute rounded-[50%]  p-[2px] top-[0px] right-1'>
                            <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={`${team.teamName}-${valIndex}`}>
                              <input onFocus={() => {
                                setPlayerInfoAndMore({ ...PlayerInfoAndMore, whichArray: `teams.${teamValIndex}`, playerIndex: valIndex })
                              }} onBlur={() => {
                                setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerIndex: null })
                              }} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={`${team.teamName}-${valIndex}`} type="text" />
                            </label>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#ffffff" fill="none">
                                <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                              </svg>
                            </span>
                          </span>
                          {/*====  three dots ends  =====*/}

                          {/*==== actions starts  =====*/}
                          <ul className={`popupContainer backdrop-blur-[4px]  shadow-[0_0_15px_-1px_#000000b8] text-[0.9rem] absolute z-[1] top-[30px] right-0 p-1 cursor-pointer rounded-sm border-[0.4px] ${PlayerInfoAndMore.whichArray === `teams.${teamValIndex}` && PlayerInfoAndMore.playerIndex === valIndex ? '' : 'hidden'}`}>

                            {/*==== editing li starts  ====*/}
                            <li onMouseDown={() => {
                              setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.edit, whichArray: `teams.${teamValIndex}`, playerName: val, editBtnClickBy: valIndex });
                              setTimeout(() => mainInput.current.focus(), 100);
                            }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 `}>
                              <span>edit...</span>
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#ffffff" fill="none">
                                  <path d="M10.5 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C8.12805 13.9629 11.2057 13.6118 14 14.4281" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                                  <path d="M18.4332 13.8485C18.7685 13.4851 18.9362 13.3035 19.1143 13.1975C19.5442 12.9418 20.0736 12.9339 20.5107 13.1765C20.6918 13.2771 20.8646 13.4537 21.2103 13.8067C21.5559 14.1598 21.7287 14.3364 21.8272 14.5214C22.0647 14.9679 22.0569 15.5087 21.8066 15.9478C21.7029 16.1298 21.5251 16.3011 21.1694 16.6437L16.9378 20.7194C16.2638 21.3686 15.9268 21.6932 15.5056 21.8577C15.0845 22.0222 14.6214 22.0101 13.6954 21.9859L13.5694 21.9826C13.2875 21.9752 13.1466 21.9715 13.0646 21.8785C12.9827 21.7855 12.9939 21.6419 13.0162 21.3548L13.0284 21.1988C13.0914 20.3906 13.1228 19.9865 13.2807 19.6232C13.4385 19.2599 13.7107 18.965 14.2552 18.375L18.4332 13.8485Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </li>
                            {/*==== editing li ends  ====*/}

                            {/*==== deleting li starts  ====*/}
                            <li onMouseDown={() => {
                              setAllTypeplayersAndTeams({ type: reducerTypes.deletePlayer, payload: { details: { ...PlayerInfoAndMore } } }); setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: '', whichArray: `teams.${teamValIndex}`, playerIndex: null, currentInputBtn: formSubmitBtnState.add, editBtnClickBy: null })
                            }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150`}>
                              <span>delete</span>
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#ffffff" fill="none">
                                  <path d="M13 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C7.97679 14.053 10.8425 13.6575 13.5 14.2952" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                                  <path d="M16 22L19 19M19 19L22 16M19 19L16 16M19 19L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                              </span>
                            </li>
                            {/*==== deleting li ends  ====*/}

                          </ul>
                          {/*====  actions ends   =====*/}

                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </section>

              :
              <ol className='cardsContainer text-white list-inside flex flex-wrap justify-center gap-3'>
                {allTypeplayersAndTeams.players.map((val, valIndex) => (
                  <li key={val + valIndex + 'players'} className='cards md:flex-[0_0_200px] sm:flex-[0_0_150px] flex-[1_0_130px] relative rounded-md p-2 pt-3 text-wrap bg-[rgb(44_44_44)]'>
                    <span>{val}</span>

                    {/*== backface of card starts  ==*/}
                    <div className='back absolute inset-0 rounded-[inherit]'></div>
                    {/*== backface of card ends  ==*/}

                    {/*====  three dots starts  =====*/}
                    <span className='seeMore absolute rounded-[50%]  p-[2px] top-[0px] right-1'>
                      <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={'Players' + valIndex}>
                        <input onFocus={() => {
                          setPlayerInfoAndMore({ ...PlayerInfoAndMore, whichArray: `players`, playerIndex: valIndex })
                        }} onBlur={() => {
                          setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerIndex: null })
                        }} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={'Players' + valIndex} type="text" />
                      </label>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#ffffff" fill="none">
                          <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </span>
                    </span>
                    {/*====  three dots ends  =====*/}

                    {/*==== actions starts  =====*/}
                    <ul className={`popupContainer backdrop-blur-[4px]  shadow-[0_0_15px_-1px_#000000b8] text-[0.9rem] absolute z-[1] top-[30px] right-0 p-1 cursor-pointer rounded-sm border-[0.4px]  ${PlayerInfoAndMore.whichArray === `players` && PlayerInfoAndMore.playerIndex === valIndex ? '' : 'hidden'}`}>

                      {/*==== editing li starts  ====*/}
                      <li onMouseDown={() => {
                        setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.edit, whichArray: `players`, playerName: val, editBtnClickBy: valIndex });
                        setTimeout(() => mainInput.current.focus(), 100);
                      }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 `}>
                        <span>edit...</span>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#ffffff" fill="none">
                            <path d="M10.5 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C8.12805 13.9629 11.2057 13.6118 14 14.4281" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M18.4332 13.8485C18.7685 13.4851 18.9362 13.3035 19.1143 13.1975C19.5442 12.9418 20.0736 12.9339 20.5107 13.1765C20.6918 13.2771 20.8646 13.4537 21.2103 13.8067C21.5559 14.1598 21.7287 14.3364 21.8272 14.5214C22.0647 14.9679 22.0569 15.5087 21.8066 15.9478C21.7029 16.1298 21.5251 16.3011 21.1694 16.6437L16.9378 20.7194C16.2638 21.3686 15.9268 21.6932 15.5056 21.8577C15.0845 22.0222 14.6214 22.0101 13.6954 21.9859L13.5694 21.9826C13.2875 21.9752 13.1466 21.9715 13.0646 21.8785C12.9827 21.7855 12.9939 21.6419 13.0162 21.3548L13.0284 21.1988C13.0914 20.3906 13.1228 19.9865 13.2807 19.6232C13.4385 19.2599 13.7107 18.965 14.2552 18.375L18.4332 13.8485Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </li>
                      {/*==== editing li ends  ====*/}

                      {/*==== deleting li starts  ====*/}
                      <li onMouseDown={() => {
                        setAllTypeplayersAndTeams({ type: reducerTypes.deletePlayer, payload: { details: { ...PlayerInfoAndMore } } }); setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: '', whichArray: `players`, playerIndex: null, currentInputBtn: formSubmitBtnState.add, editBtnClickBy: null })
                      }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150`}>
                        <span>delete</span>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#ffffff" fill="none">
                            <path d="M13 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C7.97679 14.053 10.8425 13.6575 13.5 14.2952" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M16 22L19 19M19 19L22 16M19 19L16 16M19 19L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </span>
                      </li>
                      {/*==== deleting li ends  ====*/}

                    </ul>
                    {/*====  actions ends   =====*/}

                  </li>
                ))}
              </ol>
          }
        </main>
      </div>
    </section >
  )
}

export default App