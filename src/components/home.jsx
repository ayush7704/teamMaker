import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import React, { useReducer, useState, useEffect, useRef, useLayoutEffect, useContext } from 'react'
import { mainContext } from './context/context.js'
// import { useNavigate } from 'react-router-dom'
// import saved from './saved.jsx';

const reducerTypes = {
  initial: 'initial',
  addPlayer: 'addPlayer',
  editPlayer: 'editPlayer',
  deletePlayer: 'deletePlayer',
  addTeam: 'addTeam',
  addTeamBlur: 'addTeamBlur',
  teamShuffle: 'teamShuffle',
  removeAll: 'removeAll',
  titleChange: 'titleChange',
  handleSaved: 'handleSaved',
  openSaved: 'openSaved'
}

const alertMsgsWork = {
  saveTeamMsg: 'team saved or not msg',
  generateTeam: 'generate team',
  savedTeamChangesWork: 'saved Team Changes Work'
}

const alertMsgs = {
  teamSaved: 'saved successfully',
  teamNotSaved: 'minimum 2 players required to save',
  notGenerated: 'minimum 2 players required',
  savedTeamNoChanges: 'no changes to save',
  savedTeamChangesSaved: 'changes saved successfully!',
  changesDiscard: 'changes removed successfully!',
  nothingToDiscard: 'nothing to discard',
}

const reducer = (oldobj, action) => {
  let worker;
  // for adding players 
  if (action.type === reducerTypes.initial) {
    // alert()
    console.log({ ...action.oldobject })
    return ({ ...action.oldobject })
  }
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
          worker.players.map((element, elmInd) => {
            let startIndex = Math.floor((elmInd % worker.players.length) / worker.teams.length)
            worker.teams[(elmInd % worker.teams.length)].teamPlayers.splice(startIndex, 1, flatArr[elmInd])
            // worker.teams[(elmInd % worker.teams.length)].teamPlayers.splice(startIndex, 1, flatArr[elmInd])
          });
          console.log(worker)
          worker.players = [...flatArr]
          return { ...worker }
        }
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
    const split = action.payload.details.arrItemForEdit.split('.')
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
    console.log(action.savedOpenedTeam)
    if (action.savedOpenedTeam) {
      console.log(true)
      const savedOpenedTeamObj = JSON.parse(JSON.stringify({ players: [], finalTotalTeams: 2, totalTeams: 2, teams: [{ teamName: 'team1', teamPlayers: [] }, { teamName: 'team2', teamPlayers: [] }], hasShuffled: false, title: 'Fifa team 2026', openedInGenerator: true, saved: true, savingTime: action.savedOpenedTeam.savingTime }))
      console.log(savedOpenedTeamObj)
      return savedOpenedTeamObj
    } else {
      console.log(false)
      return { players: [], finalTotalTeams: 2, totalTeams: 2, teams: [{ teamName: 'team1', teamPlayers: [] }, { teamName: 'team2', teamPlayers: [] }], hasShuffled: false, title: 'Fifa team 2026' }
    }
  }
  else if (action.type === reducerTypes.titleChange) {
    console.log('aagyi.....')
    console.log({ ...oldobj })
    return { ...oldobj, title: action.newTitle }
  }
  else if (action.type === reducerTypes.handleSaved) {
    return { ...oldobj, saved: !oldobj.saved }
  }
  else if (action.type === reducerTypes.openSaved) {
    return { ...action.openSaveTeam }
  }
  else { return { ...oldobj } }
  // console.log(oldobj)
}

const savedTeamReducerActions =
{
  onblur: 'onblur',
  onfocus: 'onfocus',
  saveChanges: 'saveChanges',
  discardChanges: 'discardChanges',
}

function App() {
  const render = useRef(0)
  const mainInput = useRef(null)
  const titleInput = useRef(null)
  const anim = useRef(null)
  const notifyFixed = useRef(null)
  const timeout = useRef(null);
  const modal = useRef(null)
  const { savedTeam, setsavedTeam } = useContext(mainContext)
  const savedTeamOpened = structuredClone(savedTeam.find((savedteam) => { return savedteam.openedInGenerator }))
  const [alertMsgsState, setalertMsgsState] = useState('minimum 2 players required')
  const formSubmitBtnState = { add: 'add', edit: 'editing' }
  const [differentBtnStates, setdifferentBtnStates] = useState({ GeneratingTeam: false, needToGenerate: false, savedProcessing: false })
  const [allTypeplayersAndTeams, setAllTypeplayersAndTeams] = useReducer(reducer, { players: [], finalTotalTeams: 2, totalTeams: 2, teams: [{ teamName: 'team1', teamPlayers: [] }, { teamName: 'team2', teamPlayers: [] }], hasShuffled: false, saved: false, title: 'Fifa team 2026' })
  const [savedTeamChanges, setSavedTeamChanges] = useState({ popup: false })

  const [PlayerInfoAndMore, setPlayerInfoAndMore] = useState({ playerName: '', arrItemForEdit: 'players', whichArray: 'players', playerIndex: null, editBtnClickBy: null, currentInputBtn: formSubmitBtnState.add })

  useEffect(() => {
    render.current = render.current + 1
    console.log('render  ' + render.current)
    console.log(alertMsgsState)
    console.log(differentBtnStates)
    console.log(allTypeplayersAndTeams)
    console.log(savedTeam)
    console.log(PlayerInfoAndMore)
  })

  useEffect(() => {
    console.log('checking       ' + allTypeplayersAndTeams.totalTeams)
    // alert()
    if (allTypeplayersAndTeams.finalTotalTeams === allTypeplayersAndTeams.totalTeams && allTypeplayersAndTeams.hasShuffled) {
      console.log('allTypeplayersAndTeams.finalTotalTeams, allTypeplayersAndTeams.totalTeams')
      setdifferentBtnStates({ ...differentBtnStates, needToGenerate: true })
      // onClickGood()
    }
  }, [allTypeplayersAndTeams.finalTotalTeams, allTypeplayersAndTeams.totalTeams])

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
    setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: '', arrItemForEdit: null, editBtnClickBy: null, whichArray: null, whichplayer: null, currentInputBtn: formSubmitBtnState.add })
  }

  function formReset() {
    setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.add, playerName: '', playerIndex: null, editBtnClickBy: null, whichArray: null })
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
    setdifferentBtnStates({ ...differentBtnStates, savedProcessing: false, GeneratingTeam: false, needToGenerate: false })
    // return () => {
    //   anim.current.removeEventListener('click', onClickGood);
    // };

  });


  useLayoutEffect(() => {
    const localStogeObj = JSON.parse(localStorage.getItem('allTeamAndPlayers'))
    console.log(localStogeObj)
    if (localStogeObj) {
      console.log(localStogeObj)
      console.log(JSON.parse(localStorage.getItem('savedTeamOpened')))
      if (savedTeamOpened) {
        let localSavedsaveTeam = JSON.parse(localStorage.getItem('savedTeamOpened'))
        console.log(localSavedsaveTeam)
        console.log(JSON.parse(JSON.stringify(savedTeamOpened)))
        console.log(savedTeamOpened)
        if (localSavedsaveTeam) {
          const areEqual = compareObjects(localSavedsaveTeam, JSON.parse(JSON.stringify(savedTeamOpened)));
          /*if there is new savedTeamOpened then areEqual  will be false means  allTeamAndPlayers will get values of savedTeamOpened 
          and or on while localSavedsaveTeam and savedTeamOpened are equal user can easily navigate to other pages without loosing current changes till manual */
          if (areEqual) {           
              setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: localStogeObj })
          } else {
            console.log(false)
            setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: savedTeamOpened })
          }
        }
        else {
          console.log(false)
          setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: savedTeamOpened })
        }
      } else {
        let localSavedsaveTeam = JSON.parse(localStorage.getItem('savedTeamOpened'))
        console.log(localSavedsaveTeam)
        console.log(localStogeObj)
        if (localSavedsaveTeam && localStogeObj) {

          const areEqual = compareObjects(localStogeObj, localSavedsaveTeam);
          console.log(areEqual)
          console.log(savedTeam)
          console.log(localSavedsaveTeam)
          const localSavedsaveTeamExistOrnot = savedTeam.find((team) => { return team.openedInGenerator })
          console.log(localSavedsaveTeamExistOrnot)
          if (areEqual) {
            if (localSavedsaveTeamExistOrnot) {

            }
            else {
              console.log(savedTeamOpened)
              setAllTypeplayersAndTeams({ type: reducerTypes.removeAll, savedOpenedTeam: savedTeamOpened })
            }
          }
          else {
            console.log(localStogeObj)            
            if(localSavedsaveTeamExistOrnot){

            }
            setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: localStogeObj })
          }
        }
        else {          
          setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: localStogeObj })
        }
      }
    }
  }, [])

  useLayoutEffect(() => {
    // here i insure that savedTeamOpened is not undefined 
    if (savedTeamOpened) {
      try {
        console.log(JSON.parse(localStorage.getItem('savedTeamOpened')))
      } catch (e) { console.log(e) }
      localStorage.setItem('savedTeamOpened', JSON.stringify(savedTeamOpened))
      try {
        console.log(JSON.parse(localStorage.getItem('savedTeamOpened')))
      } catch (e) { console.log(e) }
    }
  }, [savedTeamOpened])

  useLayoutEffect(() => {
    console.log(allTypeplayersAndTeams)
    localStorage.setItem('allTeamAndPlayers', JSON.stringify(allTypeplayersAndTeams))
  }, [allTypeplayersAndTeams])

  const checkingFunction = contextSafe((msg = 'default') => {
    console.log(msg)

    function popupAnim() {
      clearTimeout(timeout.current)
      gsap.fromTo(notifyFixed.current, { y: 30, opacity: 0.5, display: 'none' }, { y: 0, opacity: 1, display: 'block', ease: 'back', duration: 0.5 })
      timeout.current = setTimeout(() => {
        gsap.to(notifyFixed.current, { opacity: 0, duration: 0.4, display: 'none' })
        setdifferentBtnStates({ ...differentBtnStates, GeneratingTeam: false, needToGenerate: false })
      }, 2000);
    }
    if (msg === alertMsgs.savedTeamNoChanges) {
      setalertMsgsState(alertMsgs.savedTeamNoChanges); popupAnim()
    }

    if (msg === alertMsgs.savedTeamChangesSaved) {
      setalertMsgsState(alertMsgs.savedTeamChangesSaved); popupAnim()
    }
    if (msg === alertMsgs.changesDiscard) {
      const areEqual = compareObjects(allTypeplayersAndTeams, savedTeamOpened);
      if (areEqual) {
        setalertMsgsState(alertMsgs.nothingToDiscard); popupAnim()
      } else {
        setalertMsgsState(alertMsgs.changesDiscard); popupAnim()
      }
    }

    if (allTypeplayersAndTeams.players.length < 2) {
      if (msg === alertMsgsWork.generateTeam) setalertMsgsState(alertMsgs.notGenerated);
      if (msg === alertMsgsWork.saveTeamMsg) setalertMsgsState(alertMsgs.teamNotSaved);
      popupAnim()
    } else {
      if (msg === alertMsgsWork.generateTeam) onClickGood();
      if (msg === alertMsgsWork.saveTeamMsg) {
        setalertMsgsState(alertMsgs.teamSaved);
        handleSaved();
        popupAnim()
      }
    }
  })

  function handleSaved() {
    if (differentBtnStates.savedProcessing) return;
    setdifferentBtnStates(prevStates => ({ ...prevStates, savedProcessing: true }));

    setTimeout(() => {
      setdifferentBtnStates(prevStates => ({ ...prevStates, savedProcessing: false, }));
    }, 1900);

    // after working on continuesly 3,4 on bug of changing savedTeam array objects unknowly i figured it out that the 
    // [...] {...}  does not work that properly i thought i just make a copy of ground label i fails out when i comes to nesting 
    // and complexiness  so i discover an alternatives of that where map and JSON methods also have some limitations but this structuredClone is better than other options . Aug/27/2024/2:19 pm 

    const newsaving = structuredClone(allTypeplayersAndTeams)
    newsaving.openedInGenerator = false;
    newsaving.saved = true;
    newsaving.savingTime = new Date();

    console.log({ ...allTypeplayersAndTeams })
    const newsavedTeam = structuredClone(savedTeam)
    console.log([...newsavedTeam])
    newsavedTeam.push(newsaving)
    console.log([...newsavedTeam])
    setsavedTeam(newsavedTeam);
  }

  function compareObjects(obj1, obj2) {
    const entries1 = Object.entries(obj1);
    const entries2 = Object.entries(obj2);

    if (entries1.length !== entries2.length) {
      return false;
    }


    // here  thanks to blackbox ai it hepls me to this.
    for (const [key, value] of entries1) {
      const value2 = obj2[key];

      if (typeof value === 'object' && typeof value2 === 'object') {
        if (!compareObjects(value, value2)) {
          return false;
        }
      } else if (value !== value2) {
        return false;
      }
    }

    return true;
  }
  function newTeam() {
    if (savedTeamOpened) {
      let localSavedsaveTeam = JSON.parse(localStorage.getItem('savedTeamOpened'))
      const areEqual = compareObjects(JSON.parse(JSON.stringify(allTypeplayersAndTeams)), localSavedsaveTeam);
      if (!areEqual) {
        modal.current.classList.remove('hidden')
      } else {
        localStorage.setItem('savedTeamOpened', JSON.stringify(false))
        localStorage.setItem('allTeamAndPlayers', JSON.stringify(false))
        console.log(localStorage.getItem('savedTeamOpened'))
        setdifferentBtnStates({ GeneratingTeam: false, needToGenerate: false, savedProcessing: false })
        setAllTypeplayersAndTeams({ type: reducerTypes.removeAll })
        const resetOld = savedTeam.map((team) => { return { ...team, openedInGenerator: false } })
        setsavedTeam([...resetOld])
      }
    }
    else {
      setdifferentBtnStates({ GeneratingTeam: false, needToGenerate: false, savedProcessing: false })
      setAllTypeplayersAndTeams({ type: reducerTypes.removeAll })
      const resetOld = savedTeam.map((team) => { return { ...team, openedInGenerator: false } })
      setsavedTeam([...resetOld])
    }
  }

  const savedTeamFunc = ({ type }) => {
    switch (type) {
      case savedTeamReducerActions.onfocus:
        {
          setSavedTeamChanges((oldstate) => ({ ...oldstate, popup: true }))
        }
        break;
      case savedTeamReducerActions.onblur: {
        setSavedTeamChanges((oldstate) => ({ ...oldstate, popup: false }))
      };
        break;
      case savedTeamReducerActions.saveChanges:
        {
          const areEqual = compareObjects(allTypeplayersAndTeams, savedTeamOpened);
          console.log(allTypeplayersAndTeams)
          console.log(savedTeamOpened)
          if (areEqual) {
            checkingFunction(alertMsgs.savedTeamNoChanges)
          }
          else {
            const currentTeam = structuredClone(allTypeplayersAndTeams)
            console.log(currentTeam)
            // const hasSavingTime = 'savingTime' in currentTeam
            // console.log(hasSavingTime)

            const newsavedTeam = structuredClone(savedTeam)
            const ind = newsavedTeam.findIndex((savedteam) => { return savedteam.openedInGenerator })
            // if (!hasSavingTime) {
            //   console.log(!hasSavingTime)
            //   currentTeam.savingTime = new Date()
            // }
            newsavedTeam[ind] = currentTeam
            setsavedTeam(newsavedTeam)
            checkingFunction(alertMsgs.savedTeamChangesSaved)
          }
        }
        break;
      case savedTeamReducerActions.discardChanges:
        {
          checkingFunction(alertMsgs.changesDiscard)
          setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: savedTeamOpened })
        }
        break;
      default:
        break;
    }
  }

  return (

    <main>
      <div className="wrapper sm:w-[75%] mx-auto p-3 pb-20">

        {/* details div starts  */}
        <div className="details lg:max-w-[45%] sm:max-w-[75%] mx-auto p-2">

          {/* current players div starts  */}
          <div className='flex justify-between p-2'>
            <span className='capitalize'>current players</span>
            <span className='capitalize text-lg font-medium'>{allTypeplayersAndTeams.players.length}</span>
          </div>
          {/* current players div ends  */}

          {/* total teams label starts  */}
          <label htmlFor='totalTeamsInput' className='flex justify-between p-2 cursor-pointer'>
            <span className='capitalize'>total teams</span>
            <input type="number" name="totalTeamsInput" id="totalTeamsInput" value={allTypeplayersAndTeams.totalTeams} className='w-[40px] text-end bg-transparent focus:outline-none text-lg font-medium' onChange={(e) => setAllTypeplayersAndTeams({ type: reducerTypes.addTeam, payload: { newTotalTeams: e.target.value } })} onBlur={(e) => { setAllTypeplayersAndTeams({ type: reducerTypes.addTeamBlur, payload: { newTotalTeams: e.target.value } }); }} />
          </label>
          {/* total teams label ends  */}

          {/* add title div starts  */}
          <div className='p-2'>
            <label htmlFor="titleForGenerationTeam" className='cursor-pointer block'>Title</label>
            <input ref={titleInput} value={allTypeplayersAndTeams.title} onChange={(e) => setAllTypeplayersAndTeams({ type: reducerTypes.titleChange, newTitle: e.target.value })} type="text" name="titleForGenerationTeam" id='titleForGenerationTeam' placeholder='Title' className='w-full bg-transparent px-3 py-2 mt-2 rounded-md outline outline-1 outline-[#ffffff41] focus:outline-[#4d4aff] backdrop-blur-[4px]' />
          </div>
          {/* add title div ends  */}

        </div>
        {/* details div ends  */}

        {/* form start  */}
        <form onSubmit={formSubmit} onReset={formReset} className='lg:max-w-[45%] sm:max-w-[75%] mx-auto px-2'>
          <div className='flex p-2 items-center gap-2'>
            {/* main input btn starts  */}
            <div className='relative flex-1 backdrop-blur-[4px]'>

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
              <button type="reset" value={'cancle'} className='p-2 border-[#414141] border border-1 rounded-[50%]'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" color="#e50f0f" fill="none">
                  <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            }
            {/* reset button ends  */}
          </div>
        </form>
        {/* form ends  */}

        <section className='py-[25px]'>
          <div className='flex justify-center my-4 text-center gap-2'>

            {/* generate button starts */}
            <button onClick={() => { setdifferentBtnStates({ ...differentBtnStates, GeneratingTeam: true }); setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.add, playerName: '', playerIndex: null, editBtnClickBy: null, whichArray: null }); checkingFunction(alertMsgsWork.generateTeam) }} ref={anim} className={`flex gap-2 items-center bg-[#ffff0004] outline-lime-50 text-[0.95rem] font-medium  outline-1 outline px-3 py-2 rounded-sm ${differentBtnStates.needToGenerate ? 'bg-[linear-gradient(to_bottom,_black_80%,rgb(163_230_53)_95%)]' : 'bg-[linear-gradient(to_bottom,_black_80%,rgb(163_230_53)_111%)]'} ${differentBtnStates.GeneratingTeam ? 'btnLoadTime' : ''} `} disabled={differentBtnStates.GeneratingTeam}>
              <span>{!differentBtnStates.needToGenerate ? 'Generate' : 'Recalculate Teams'}</span>
              <span>
                {differentBtnStates.GeneratingTeam ?
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#a3e635" fill="none">
                    <path d="M12 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M21 12L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 12L3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18.3635 5.63672L16.2422 7.75804" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7.75804 16.2422L5.63672 18.3635" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18.3635 18.3635L16.2422 16.2422" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7.75804 7.75804L5.63672 5.63672" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>

                  :
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#a3e635" fill="none">
                    <path d="M14 12.6483L16.3708 10.2775C16.6636 9.98469 16.81 9.83827 16.8883 9.68032C17.0372 9.3798 17.0372 9.02696 16.8883 8.72644C16.81 8.56849 16.6636 8.42207 16.3708 8.12923C16.0779 7.83638 15.9315 7.68996 15.7736 7.61169C15.473 7.46277 15.1202 7.46277 14.8197 7.61169C14.6617 7.68996 14.5153 7.83638 14.2225 8.12923L11.8517 10.5M14 12.6483L5.77754 20.8708C5.4847 21.1636 5.33827 21.31 5.18032 21.3883C4.8798 21.5372 4.52696 21.5372 4.22644 21.3883C4.06849 21.31 3.92207 21.1636 3.62923 20.8708C3.33639 20.5779 3.18996 20.4315 3.11169 20.2736C2.96277 19.973 2.96277 19.6202 3.11169 19.3197C3.18996 19.1617 3.33639 19.0153 3.62923 18.7225L11.8517 10.5M14 12.6483L11.8517 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19.5 2.5L19.3895 2.79873C19.2445 3.19044 19.172 3.38629 19.0292 3.52917C18.8863 3.67204 18.6904 3.74452 18.2987 3.88946L18 4L18.2987 4.11054C18.6904 4.25548 18.8863 4.32796 19.0292 4.47083C19.172 4.61371 19.2445 4.80956 19.3895 5.20127L19.5 5.5L19.6105 5.20127C19.7555 4.80956 19.828 4.61371 19.9708 4.47083C20.1137 4.32796 20.3096 4.25548 20.7013 4.11054L21 4L20.7013 3.88946C20.3096 3.74452 20.1137 3.67204 19.9708 3.52917C19.828 3.38629 19.7555 3.19044 19.6105 2.79873L19.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M19.5 12.5L19.3895 12.7987C19.2445 13.1904 19.172 13.3863 19.0292 13.5292C18.8863 13.672 18.6904 13.7445 18.2987 13.8895L18 14L18.2987 14.1105C18.6904 14.2555 18.8863 14.328 19.0292 14.4708C19.172 14.6137 19.2445 14.8096 19.3895 15.2013L19.5 15.5L19.6105 15.2013C19.7555 14.8096 19.828 14.6137 19.9708 14.4708C20.1137 14.328 20.3096 14.2555 20.7013 14.1105L21 14L20.7013 13.8895C20.3096 13.7445 20.1137 13.672 19.9708 13.5292C19.828 13.3863 19.7555 13.1904 19.6105 12.7987L19.5 12.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M10.5 2.5L10.3895 2.79873C10.2445 3.19044 10.172 3.38629 10.0292 3.52917C9.88629 3.67204 9.69044 3.74452 9.29873 3.88946L9 4L9.29873 4.11054C9.69044 4.25548 9.88629 4.32796 10.0292 4.47083C10.172 4.61371 10.2445 4.80956 10.3895 5.20127L10.5 5.5L10.6105 5.20127C10.7555 4.80956 10.828 4.61371 10.9708 4.47083C11.1137 4.32796 11.3096 4.25548 11.7013 4.11054L12 4L11.7013 3.88946C11.3096 3.74452 11.1137 3.67204 10.9708 3.52917C10.828 3.38629 10.7555 3.19044 10.6105 2.79873L10.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                }
              </span>
            </button>
            {/* generate button ends */}

            {
              allTypeplayersAndTeams.players.length > 0 &&
              // clear all button starts 
              <button onClick={() => { setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: '', arrItemForEdit: null, editBtnClickBy: null, whichArray: null, whichplayer: null, currentInputBtn: formSubmitBtnState.add }); setAllTypeplayersAndTeams({ type: reducerTypes.removeAll, savedOpenedTeam: savedTeamOpened }) }} className='flex gap-2 items-center bg-[linear-gradient(to_bottom,_black_80%,#a53a274f_95%)] outline-1 outline-lime-50 text-[0.95rem] font-medium outline px-3 py-2 rounded-sm'>
                <span>Clear all</span>
                <span>
                  <svg viewBox="0 0 24 24" width="16" height="16" color="#e00000" fill="none">
                    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              // clear all button ends 
            }
          </div>
          {/* change title starts  */}
          <div className={`relative flex justify-between items-center bg-[rgb(29_29_29_/_48%)] p-3 mt-7 mb-4 ${savedTeamOpened ? 'outline outline-[0.3px] outline-[#a06800]' : ''}`}>

            {/* make new team starts  */}
            <button onClick={() => { newTeam() }} className='flex items-center gap-1 absolute z-[1] -translate-y-1/2 left-0 px-3 py-1 top-0 rounded-full text-[0.7rem] bg-[#000000] outline outline-1 outline-[#ffffff3d]'>
              <span>New</span>
              <span className='inline-block'>
                <svg viewBox={`0 0 24 24`} className='text-[#ffffff] h-[0.7rem] w-[0.7rem]' fill="none">
                  <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="2" />
                </svg></span>
            </button>
            {/* make new team ends  */}

            <h1 className='flex-[0_1_65%] capitalize  rounded-sm sm:text-[1rem] text-[0.9rem]  backdrop-blur-[4px]'>
              {allTypeplayersAndTeams.title !== '' ? allTypeplayersAndTeams.title : 'untitled'}
              <sup onClick={() => titleInput.current.focus()} className='ml-4 text-[0.82em] text-[#c4c4c4] cursor-pointer whitespace-nowrap'>(edit Title)</sup>
            </h1>

            <div className='flex gap-3 items-center'>
              {/* save team button starts  */}
              <button onClick={() => { checkingFunction(alertMsgsWork.saveTeamMsg); }} className={`bg-[#0a0a0a] outline outline-1 outline-[#303030] p-3 rounded-[50%] grid justify-center items-center} ${differentBtnStates.savedProcessing ? 'btnLoadTime' : ''}`} disabled={differentBtnStates.savedProcessing}>
                {differentBtnStates.savedProcessing ?
                  <svg className='sm:w-[22px] w-[16px]  h-[16px] sm:h-[22px]' viewBox="0 0 24 24" color="#a3e635" fill="none">
                    <path d="M12 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M21 12L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 12L3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18.3635 5.63672L16.2422 7.75804" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7.75804 16.2422L5.63672 18.3635" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18.3635 18.3635L16.2422 16.2422" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7.75804 7.75804L5.63672 5.63672" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  :
                  <svg className='sm:w-[22px] w-[16px]  h-[16px] sm:h-[22px] fill-white' data-name="Layer 1" viewBox="0 0 91.5 122.88"> <path d="M62.42,0A29.08,29.08,0,1,1,33.34,29.08,29.08,29.08,0,0,1,62.42,0ZM3.18,19.65H24.73a38,38,0,0,0-1,6.36H6.35v86.75L37.11,86.12a3.19,3.19,0,0,1,4.18,0l31,26.69V66.68a39.26,39.26,0,0,0,6.35-2.27V119.7a3.17,3.17,0,0,1-5.42,2.24l-34-29.26-34,29.42a3.17,3.17,0,0,1-4.47-.33A3.11,3.11,0,0,1,0,119.7H0V22.83a3.18,3.18,0,0,1,3.18-3.18Zm55-2.79a4.1,4.1,0,0,1,.32-1.64l0-.06a4.33,4.33,0,0,1,3.9-2.59h0a4.23,4.23,0,0,1,1.63.32,4.3,4.3,0,0,1,1.39.93,4.15,4.15,0,0,1,.93,1.38l0,.07a4.23,4.23,0,0,1,.3,1.55v8.6h8.57a4.3,4.3,0,0,1,3,1.26,4.23,4.23,0,0,1,.92,1.38l0,.07a4.4,4.4,0,0,1,.31,1.49v.18a4.37,4.37,0,0,1-.32,1.55,4.45,4.45,0,0,1-.93,1.4,4.39,4.39,0,0,1-1.38.92l-.08,0a4.14,4.14,0,0,1-1.54.3H66.71v8.57a4.35,4.35,0,0,1-1.25,3l-.09.08a4.52,4.52,0,0,1-1.29.85l-.08,0a4.36,4.36,0,0,1-1.54.31h0a4.48,4.48,0,0,1-1.64-.32,4.3,4.3,0,0,1-1.39-.93,4.12,4.12,0,0,1-.92-1.38,4.3,4.3,0,0,1-.34-1.62V34H49.56a4.28,4.28,0,0,1-1.64-.32l-.07,0a4.32,4.32,0,0,1-2.25-2.28l0-.08a4.58,4.58,0,0,1-.3-1.54v0a4.39,4.39,0,0,1,.33-1.63,4.3,4.3,0,0,1,3.93-2.66h8.61V16.86Z" />
                  </svg>
                }
              </button>
              {/* save team button ends  */}

              {/* want to make visible on only saved team  */}
              {savedTeamOpened &&
                <button className='relative'>
                  <svg className='w-[20px] h-[20px] text-white rotate-90' viewBox="0 0 24 24" fill="none">
                    <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>

                  {/*====  three dots starts  =====*/}
                  <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={`savedTeamSeeMore`}>
                    <input onFocus={() => {
                      savedTeamFunc({ type: savedTeamReducerActions.onfocus })
                    }} onBlur={() => {
                      savedTeamFunc({ type: savedTeamReducerActions.onblur })

                    }} className={`inset-0 w-[100%] h-[100%] cursor-pointer absolute `} id={`savedTeamSeeMore`} type="text" readOnly />
                  </label>
                  {/*====  three dots ends  =====*/}

                  {/*==== actions starts  =====*/}
                  <ul className={`bg-black w-max shadow-[0_0_15px_-1px_#000000b8] text-[0.8rem] absolute z-[1] top-[-30px] right-full p-1 cursor-pointer rounded-sm border-[0.4px] ${savedTeamChanges.popup ? '' : 'hidden'}`}>

                    {/*==== save changes li starts  ====*/}
                    <li className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 hover:bg-[#262626]`} onMouseDown={() => savedTeamFunc({ type: savedTeamReducerActions.saveChanges })}>
                      <span>save changes</span>
                    </li>
                    {/*==== save changes li ends  ====*/}

                    {/*==== discard li starts  ====*/}
                    <li className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 hover:bg-[#262626]`} onMouseDown={() => savedTeamFunc({ type: savedTeamReducerActions.discardChanges })}>
                      <span>discard changes</span>
                    </li>
                    {/*==== discard li ends  ====*/}

                    <li className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 hover:bg-[#262626]`} onMouseDown={() => newTeam()}>
                      <span>remove from generator</span>
                    </li>
                  </ul>
                  {/*====  actions ends   =====*/}
                </button>
              }
            </div>
          </div>
          {/* change title ends  */}
          {
            allTypeplayersAndTeams.hasShuffled ?

              // devided teams sections starts
              <section className='flex flex-wrap gap-x-3 gap-y-7 py-5'>
                {allTypeplayersAndTeams.teams.map((team, teamValIndex) => (
                  <div key={teamValIndex} className={`md:flex-[1_0_200px] sm:flex-[1_0_150px] flex-[1_0_130px]`}>
                    <h1 className='mb-4 text-center text-[1.08rem] font-medium'>Team {(teamValIndex + 1)}</h1>
                    <ol className='cardsContainer flex flex-wrap justify-center gap-3 list-inside relative '>
                      {team.teamPlayers.map((val, valIndex) => (

                        <li key={`${team.teamName}-${valIndex}`} className={`cards md:flex-[0_0_200px] sm:flex-[0_0_150px] flex-[1_0_130px] relative rounded-sm p-2 pt-3 text-wrap bg-[#0a0a0a] outline outline-1   ${PlayerInfoAndMore.arrItemForEdit === ('teams.' + teamValIndex) && PlayerInfoAndMore.editBtnClickBy === valIndex ? ' outline-[#4d4aff] outline-offset-2' : 'outline-[#303030]'}`}>
                          <span>{val}</span>

                          {/*== backface of card starts  ==*/}
                          <div className="back  absolute inset-0 rounded-[inherit]"></div>

                          {/*== backface of card ends  ==*/}

                          {/*====  three dots starts  =====*/}
                          <span className='seeMore absolute rounded-[50%]  p-[2px] top-[0px] right-2'>
                            <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={`${team.teamName}-${valIndex}`}>
                              <input onFocus={() => {
                                setPlayerInfoAndMore({ ...PlayerInfoAndMore, whichArray: `teams.${teamValIndex}`, playerIndex: valIndex })
                              }} onBlur={() => {
                                setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerIndex: null })
                              }} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={`${team.teamName}-${valIndex}`} type="text" readOnly />
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
                          <ul className={`popupContainer backdrop-blur-[4px]  shadow-[0_0_15px_-1px_#000000b8] text-[0.8rem] absolute z-[1] top-[30px] right-0 p-1 cursor-pointer rounded-sm border-[0.4px] ${PlayerInfoAndMore.whichArray === `teams.${teamValIndex}` && PlayerInfoAndMore.playerIndex === valIndex ? '' : 'hidden'} `}>

                            {/*==== editing li starts  ====*/}
                            <li onMouseDown={() => {
                              setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.edit, whichArray: `teams.${teamValIndex}`, arrItemForEdit: `teams.${teamValIndex}`, playerName: val, editBtnClickBy: valIndex });
                              setTimeout(() => mainInput.current.focus(), 100);
                            }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 hover:bg-[#262626] `}>
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
                            }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 hover:bg-[#262626]`}>
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
              // devided teams sections ends
              :
              <ol className='cardsContainer text-white list-inside flex flex-wrap justify-center gap-3 sm:py-5 py-4'>
                {allTypeplayersAndTeams.players.map((val, valIndex) => (
                  <li key={val + valIndex + 'players'} className={`cards md:flex-[0_0_200px] sm:flex-[0_0_150px] flex-[1_0_130px] relative rounded-sm p-2 pt-3 text-wrap bg-[#0a0a0a] outline-1 outline ${PlayerInfoAndMore.whichArray === ('players') && PlayerInfoAndMore.editBtnClickBy === valIndex ? ' outline-[#4d4aff] outline-offset-2' : 'outline-[#303030]'}`}>
                    <span>{val}</span>

                    {/*== backface of card starts  ==*/}
                    <div className='back absolute inset-0 rounded-[inherit]'></div>
                    {/*== backface of card ends  ==*/}

                    {/*====  three dots starts  =====*/}
                    <span className='seeMore absolute rounded-[50%]  p-[2px] top-[0px] right-2'>
                      <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={'Players' + valIndex}>
                        <input onFocus={() => {
                          setPlayerInfoAndMore({ ...PlayerInfoAndMore, whichArray: `players`, playerIndex: valIndex })
                        }} onBlur={() => {
                          setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerIndex: null })
                        }} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={'Players' + valIndex} type="text" readOnly />
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
                    <ul className={`popupContainer backdrop-blur-[4px]  shadow-[0_0_15px_-1px_#000000b8] text-[0.8rem] absolute z-[1] top-[30px] right-0 p-1 cursor-pointer rounded-sm border-[0.4px]  ${PlayerInfoAndMore.whichArray === `players` && PlayerInfoAndMore.playerIndex === valIndex ? '' : 'hidden'}`}>

                      {/*==== editing li starts  ====*/}
                      <li onMouseDown={() => {
                        setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.edit, whichArray: `players`, playerName: val, editBtnClickBy: valIndex, arrItemForEdit: `players` });
                        setTimeout(() => mainInput.current.focus(), 100);
                      }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 hover:bg-[#262626] `}>
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
                      }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 hover:bg-[#262626]`}>
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
        </section>
      </div>

      {/* notifcation div starts  */}
      {/* ${alertMsgsState === alertMsgs.teamSaved || alertMsgsState === alertMsgs.savedTeamChangesSaved || alertMsgs.changesDiscard ? 'bg-[linear-gradient(to_bottom,_black_80%,rgb(163_230_53)_95%)] text-[#a3e635] outline-[#a3e635]' : 'bg-[linear-gradient(to_bottom,_black_80%,rgb(255_40_2)_102%)] text-[red] outline-[red]'} */}
      {/* ${alertMsgsState === alertMsgs.nothingToDiscard || alertMsgs.savedTeamNoChanges || alertMsgs.teamNotSaved ? 'bg-[linear-gradient(to_bottom,_black_80%,rgb(255_40_2)_102%)] text-[red] outline-[red]':'bg-[linear-gradient(to_bottom,_black_80%,rgb(163_230_53)_95%)] text-[#a3e635] outline-[#a3e635]'} */}
      <div ref={notifyFixed} className={`fixed hidden w-[80%] sm:max-w-[250px] capitalize text-[0.9rem] text-center top-4 left-1/2 -translate-x-1/2 rounded-sm z-20 p-2 outline outline-1 bg-black outline-[gray] `}>{alertMsgsState}</div>
      {/* notifcation div ends  */}

      <div ref={modal} className="fixed inset-0 z-20 grid place-items-center hidden">
        <div className={`sm:max-w-[400px] max-w-[270px] text-[0.9rem] bg-black px-3 py-4 outline outline-1 outline-[#ffffff54] rounded-sm`}>
          <h3 className='text-center capitalize text-lg'>save changes ?</h3>
          <div className='p-[10px]'>
            <p className='text-[#d1d1d1]'>
              would you like to save current changes in
              <span className='whitespace-nowrap'> {savedTeamOpened?.title} ?</span>
            </p>
          </div>
          <div className='text-end mt-1 text-[0.9em]'>
            <button onClick={() => { savedTeamFunc({ type: savedTeamReducerActions.saveChanges }); modal.current.classList.add('hidden'); }} className='capitalize rounded-sm py-1 px-2 bg-[#1364ffde] '>save</button>
            <button onClick={() => { savedTeamFunc({ type: savedTeamReducerActions.discardChanges }); modal.current.classList.add('hidden'); }} className='capitalize rounded-sm py-1 px-2 bg-[#e8252538]  ml-2'>discard</button>
          </div>
        </div>
      </div>

    </main>
  )
}

export default App