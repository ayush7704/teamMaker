import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useReducer, useState, useEffect, useRef, useLayoutEffect, useContext } from 'react';
import { mainContext } from './context/context.js';

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
}

const alertMsgsWork = {
  saveTeamMsg: 'team saved or not msg',
  generateTeam: 'generate team',
  savedTeamChangesWork: 'saved Team Changes Work'
}

export const alertMsgs = {
  teamSaved: 'saved successfully',
  teamNotSaved: 'minimum 2 players required to save',
  notGenerated: 'minimum 2 players required',
  savedTeamNoChanges: 'no changes to save',
  savedTeamChangesSaved: 'changes saved successfully!',
  changesDiscard: 'changes removed successfully!',
  nothingToDiscard: 'nothing to discard',
  teamDeleted: 'worked removed successfully!'
}

const reducer = (oldobj, action) => {
  let worker;
  // for adding players 
  if (action.type === reducerTypes.initial) {
    return ({ ...action.oldobject })
  }
  if (action.type === reducerTypes.addPlayer) {
    worker = { ...oldobj, players: [...oldobj.players, action.payload.playerName] }

    // if teams has generated 
    if (worker.hasShuffled) {
      try {
        let flatArr = [];
        worker.teams.forEach((element, elmInd) => {
          let teamsArr = element.teamPlayers
          flatArr = flatArr.concat(teamsArr)
          // all teams teamPlayer values will be in flatArr 
        });
        if (flatArr.length < worker.players.length) {
          flatArr.push(worker.players[worker.players.length - 1])
          worker.players.map((element, elmInd) => {
            let startIndex = Math.floor((elmInd % worker.players.length) / worker.teams.length)
            worker.teams[(elmInd % worker.teams.length)].teamPlayers.splice(startIndex, 1, flatArr[elmInd])
          });
          worker.players = [...flatArr]
          return { ...worker }
        }
      } catch (error) {
        console.log(error)
      }
    }
    return { ...worker }
  }

  // for deleting players 
  else if (action.type === reducerTypes.deletePlayer) {
    worker = { ...oldobj }
    const split = action.payload.details.whichArray.split('.')
    let [team, teamInd] = split;
    // the teamIndex will be impty when teams has not divided and this functionality is done by hard-code
    let playerInd = Number(action.payload.details.playerIndex)

    teamInd ? worker?.[team][teamInd].teamPlayers.splice(playerInd, 1) : worker?.[team].splice(playerInd, 1)

    if (teamInd) {
      // for changing the real players array
      try {
        let flatArr = [];
        worker[team].forEach((element, elmInd) => {
          let a = element.teamPlayers
          flatArr = flatArr.concat(a)
        });
        worker.players = [...flatArr]
      } catch (error) {
        console.log(error)
      }
    }
    return { ...worker }
  }

  else if (action.type === reducerTypes.editPlayer) {
    worker = { ...oldobj }
    const split = action.payload.details.arrItemForEdit.split('.')
    let [team, teamInd] = split;
    // the teamInd will be impty when teams has not divided 
    let playerInd = Number(action.payload.details.editBtnClickBy)

    if (teamInd) {
      worker[team][teamInd].teamPlayers[playerInd] = action.payload.details.playerName
      // for changing the  real players array
      try {
        let flatArr = [];
        worker[team].forEach((element, elmInd) => {
          let a = element.teamPlayers
          flatArr = flatArr.concat(a)
        });
        worker.players = [...flatArr]
      } catch (error) {
        console.log(error)
      }
    } else { worker[team][playerInd] = action.payload.details.playerName }

    return { ...worker }
  }

  // after changing total teams 
  else if (action.type === reducerTypes.addTeamBlur) {
    worker = { ...oldobj }
    let newTotalTeams = Number(action.payload.newTotalTeams)
    // if input is '' or less than 2
    if (newTotalTeams <= 2) {
      worker.totalTeams = 2
      while (worker.teams.length !== 2) {
        if (worker.teams.length > worker.totalteams) {
          worker.teams.pop()
        } else {
          const name = `team${worker.teams.length + 1}`
          worker.teams.push({ teamName: name, teamPlayers: [] })
        }
      }
      return { ...worker }
    }

    // if input is equal or greater 3
    else if (action.payload.newTotalTeams >= 3) {
      worker = { ...oldobj }
      while (Number(worker.teams.length) !== newTotalTeams) {
        if (worker.teams.length > newTotalTeams) {
          worker.teams.pop()
        } else {
          const name = `team${worker.teams.length + 1}`
          worker.teams.push({ teamName: name, teamPlayers: [] })
        }
      }
      return { ...worker, totalTeams: newTotalTeams, finalTotalTeams: newTotalTeams }
    }

  }

  else if (action.type === reducerTypes.addTeam) {
    worker = { ...oldobj }
    let newTotalTeams = Number(action.payload.newTotalTeams)
    if (newTotalTeams < 0) {
      return { ...worker, finalTotalTeams: 2 }
    }
    else {
      // while teams are not equal to the current totalteams this loop will run
      while (Number(worker.teams.length) !== newTotalTeams) {
        if (worker.teams.length > newTotalTeams) {
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
    return { ...oldobj, teams: [...action.payload.newTeams], hasShuffled: true }
  }

  else if (action.type === reducerTypes.removeAll) {
    if (action.savedOpenedTeam) {
      const savedOpenedTeamObj = JSON.parse(JSON.stringify({ players: [], finalTotalTeams: 2, totalTeams: 2, teams: [{ teamName: 'team1', teamPlayers: [] }, { teamName: 'team2', teamPlayers: [] }], hasShuffled: false, title: 'Fifa team 2026', openedInGenerator: true, saved: true, savingTime: action.savedOpenedTeam.savingTime }))
      return savedOpenedTeamObj
    } else {
      return { players: [], finalTotalTeams: 2, totalTeams: 2, teams: [{ teamName: 'team1', teamPlayers: [] }, { teamName: 'team2', teamPlayers: [] }], hasShuffled: false, title: 'Fifa team 2026' }
    }
  }
  else if (action.type === reducerTypes.titleChange) {
    return { ...oldobj, title: action.newTitle }
  }
  else if (action.type === reducerTypes.handleSaved) {
    return { ...oldobj, saved: !oldobj.saved }
  }
  else { return { ...oldobj } }

}

export const savedTeamReducerActions = {
  onblur: 'onblur',
  onfocus: 'onfocus',
  saveChanges: 'saveChanges',
  discardChanges: 'discardChanges',
}

function App() {
  const mainInput = useRef(null)
  const titleInput = useRef(null)
  const { savedTeam, setsavedTeam, compareObjects, setmodalOpen, setalertMsgsState, popupAnim } = useContext(mainContext)
  const savedTeamOpened = structuredClone(savedTeam.find((savedteam) => { return savedteam.openedInGenerator }))
  const formSubmitBtnState = { add: 'add', edit: 'editing' }
  const [differentBtnStates, setdifferentBtnStates] = useState({ GeneratingTeam: false, needToGenerate: false, savedProcessing: false })
  const [allTypeplayersAndTeams, setAllTypeplayersAndTeams] = useReducer(reducer, { players: [], finalTotalTeams: 2, totalTeams: 2, teams: [{ teamName: 'team1', teamPlayers: [] }, { teamName: 'team2', teamPlayers: [] }], hasShuffled: false, saved: false, title: 'Fifa team 2026' })
  const [savedTeamChanges, setSavedTeamChanges] = useState({ popup: false })

  const [PlayerInfoAndMore, setPlayerInfoAndMore] = useState({ playerName: '', arrItemForEdit: 'players', whichArray: 'players', playerIndex: null, editBtnClickBy: null, currentInputBtn: formSubmitBtnState.add })

  useLayoutEffect(() => {
    const savedallTeamAndPlayers = JSON.parse(localStorage.getItem('allTeamAndPlayers'))
    const  savedsavedTeamOpened = JSON.parse(localStorage.getItem('savedTeamOpened'))
    // temporary solution of 
    //  main reducer object was not updating itself even after removing latest changes from saved work while we are on home page  
    // it had to navigate on other pages for updating value
    console.log(savedsavedTeamOpened)
    if (Boolean(savedsavedTeamOpened)) {
      const areEqual = compareObjects(JSON.parse(localStorage.getItem('allTeamAndPlayers')), JSON.parse(localStorage.getItem('savedTeamOpened')))
      if (areEqual) {
        setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: savedTeamOpened })
      }
    }
  }, [savedTeam])

  useEffect(() => {
    // while changing total team 
    if (allTypeplayersAndTeams.finalTotalTeams === allTypeplayersAndTeams.totalTeams && allTypeplayersAndTeams.hasShuffled) {
      setdifferentBtnStates({ ...differentBtnStates, needToGenerate: true })
    }
  }, [allTypeplayersAndTeams.finalTotalTeams, allTypeplayersAndTeams.totalTeams])

  function formSubmit(e) {
    e.preventDefault()
    if (PlayerInfoAndMore.currentInputBtn === formSubmitBtnState.edit) {// while editing       
      setAllTypeplayersAndTeams({ type: reducerTypes.editPlayer, payload: { details: { ...PlayerInfoAndMore } } });
    } else {
      setAllTypeplayersAndTeams({ type: reducerTypes.addPlayer, payload: { playerName: PlayerInfoAndMore.playerName } });
      mainInput.current.focus()
    }
    // making to default
    setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: '', arrItemForEdit: null, editBtnClickBy: null, whichArray: null, whichplayer: null, currentInputBtn: formSubmitBtnState.add })
  }

  function formReset() {
    setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.add, playerName: '', playerIndex: null, editBtnClickBy: null, whichArray: null })
  }

  const { contextSafe } = useGSAP();
  const generateTeamFunc = contextSafe(async () => {

    let worker = { ...allTypeplayersAndTeams }

    let uniqueRandomsArr = new Set([])

    await new Promise((resolve) => {
      gsap.fromTo('.cards', { rotateY: '0deg' }, { rotateY: '180deg',duration:1,ease:'back'});
      setTimeout(() => {
        resolve('dfd')
      }, 1000);
    })

    await new Promise(async (resolve) => {
      const promises = allTypeplayersAndTeams.players.map(async (element, index) => {
        // loop will run till player total length
        while (uniqueRandomsArr.size !== allTypeplayersAndTeams.players.length) {
          let random = Math.floor(Math.random() * allTypeplayersAndTeams.players.length)
          uniqueRandomsArr.add(random); // adding random value in  new set
        }
      });
      await Promise.all(promises);

      // making teams array empty 
      const teamsArrEmpty = allTypeplayersAndTeams.teams.map(async (team, teamIndex) => {
        worker.teams[teamIndex].teamPlayers = []
        return undefined
      })

      await Promise.all(teamsArrEmpty)


      const promises2 = allTypeplayersAndTeams.players.map(async (element, index) => {

        // this is dynamic start index calculator for splicing in all teams array 
        let startIndex = Math.floor((index % allTypeplayersAndTeams.players.length) / allTypeplayersAndTeams.teams.length)
        let teamIndex = (index % allTypeplayersAndTeams.teams.length) // whichteam
        let value = allTypeplayersAndTeams.players[Array.from(uniqueRandomsArr)[index]] // name
        worker.teams[teamIndex].teamPlayers.splice(startIndex, 1, value)

      });

      await Promise.all(promises2);

      // new object after shuffing 
      setAllTypeplayersAndTeams({ type: reducerTypes.teamShuffle, payload: { newTeams: [...worker.teams] } })
      resolve('done')

    })

    gsap.fromTo('.cards', { rotateY: '180deg' }, { rotateY: '360deg',duration:1,ease:'back' });  
    setdifferentBtnStates({ ...differentBtnStates, savedProcessing: false, GeneratingTeam: false, needToGenerate: false })  
  });


  useLayoutEffect(() => {
    const localStogeObj = JSON.parse(localStorage.getItem('allTeamAndPlayers'))
    let localSavedsaveTeam = JSON.parse(localStorage.getItem('savedTeamOpened'))
    if (localStogeObj) { // if there is anything in the localhost of allTeamAndPlayers

      if (savedTeamOpened) { // when there is saved team available 
        if (localSavedsaveTeam) {
          const areEqual = compareObjects(localSavedsaveTeam, JSON.parse(JSON.stringify(savedTeamOpened)));
          /*if there is new savedTeamOpened then areEqual  will be false means  allTeamAndPlayers will get values of savedTeamOpened and or on while localSavedsaveTeam and savedTeamOpened are equal user can easily navigate to other pages without loosing current changes till manual */
          if (areEqual) { // if the current object is same object in localStogeObj localhost then it will be applied  and user can freely navigate to other pages without loosing data
            setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: localStogeObj })
          } else {
            setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: savedTeamOpened })
          }
        }
        else { // if localSavedsaveTeam has nothing then the savedTeamOpened values will be set 
          setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: savedTeamOpened })
        }
      } else {
        if (localSavedsaveTeam && localStogeObj) {
          const areEqual = compareObjects(localStogeObj, localSavedsaveTeam);

          const localSavedsaveTeamExistOrnot = savedTeam.find((team) => { return team.openedInGenerator })
          if (areEqual) {
            if (localSavedsaveTeamExistOrnot) {

            }
            else {
              setAllTypeplayersAndTeams({ type: reducerTypes.initial, oldobject: localSavedsaveTeam })
            }
          }
          else {
            if (localSavedsaveTeamExistOrnot) {

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
      } catch (e) { console.log(e) }
      localStorage.setItem('savedTeamOpened', JSON.stringify(savedTeamOpened))
      try {
      } catch (e) { console.log(e) }
    }
  }, [savedTeamOpened])

  useLayoutEffect(() => {
    localStorage.setItem('allTeamAndPlayers', JSON.stringify(allTypeplayersAndTeams))
  }, [allTypeplayersAndTeams])

  const checkingFunction = contextSafe((msg = 'default') => {
    setTimeout(() => {    
      // change for debugging of savedbutton 
      setdifferentBtnStates({ ...differentBtnStates, savedProcessing: false,GeneratingTeam: false, needToGenerate: false, })
    }, 2000);
    // no changes to save
    if (msg === alertMsgs.savedTeamNoChanges) {
      setalertMsgsState(alertMsgs.savedTeamNoChanges); popupAnim()
    }
    // changes saved successfully 
    else if (msg === alertMsgs.savedTeamChangesSaved) {
      setalertMsgsState(alertMsgs.savedTeamChangesSaved); popupAnim()
    }

    // changes removed successfully
    if (msg === alertMsgs.changesDiscard) {
      setalertMsgsState(alertMsgs.changesDiscard); popupAnim()
    }
    // no changes to discard
    else if (msg === alertMsgs.nothingToDiscard) {
      setalertMsgsState(alertMsgs.nothingToDiscard); popupAnim()
    }

    if (allTypeplayersAndTeams.players.length < 2) {
      if (msg === alertMsgsWork.generateTeam) setalertMsgsState(alertMsgs.notGenerated);
      if (msg === alertMsgsWork.saveTeamMsg) setalertMsgsState(alertMsgs.teamNotSaved);
      popupAnim()
    } else {
      if (msg === alertMsgsWork.generateTeam) generateTeamFunc();
      if (msg === alertMsgsWork.saveTeamMsg) {
        setalertMsgsState(alertMsgs.teamSaved);
        handleSaved();
        popupAnim()
      }
    }
  })

  function handleSaved() {
    if (differentBtnStates.savedProcessing) return; // for preventing the request if is under process 
    setdifferentBtnStates(prevStates => ({ ...prevStates, savedProcessing: true }));

    setTimeout(() => {
      setdifferentBtnStates(prevStates => ({ ...prevStates, savedProcessing: false, }));
    }, 1900);

    // after working on continuesly 3,4 on bug of changing savedTeam array objects unknowly i figured it out that the 
    // [...] {...}  does not work that properly i thought it just make a copy of ground label and fails out when i comes to nesting and complexiness  so i found an alternatives of that where map and JSON methods also have some limitations but this structuredClone is better than other options . Aug/27/2024/2:19 pm.

    const newSavedWork = structuredClone(allTypeplayersAndTeams)
    newSavedWork.openedInGenerator = false;
    newSavedWork.saved = true;
    newSavedWork.savingTime = new Date();

    const updatedSavedTeam = structuredClone(savedTeam)

    updatedSavedTeam.push(newSavedWork)

    setsavedTeam(updatedSavedTeam);
  }


  function newTeam() {
    const resetOld = savedTeam.map((team) => { return { ...team, openedInGenerator: false } })
    if (savedTeamOpened) { // if there is savedTeamOpened 
      let localSavedsaveTeam = JSON.parse(localStorage.getItem('savedTeamOpened'))
      const areEqual = compareObjects(JSON.parse(JSON.stringify(allTypeplayersAndTeams)), localSavedsaveTeam);

      // checking if the current and opened obj is not equal the modal will open with if() else a new team will open with else{}
      if (!areEqual) {
        setmodalOpen(true)
      } else {
        localStorage.setItem('savedTeamOpened', JSON.stringify(false))
        localStorage.setItem('allTeamAndPlayers', JSON.stringify(false))

        // setting states to default values
        setdifferentBtnStates({ GeneratingTeam: false, needToGenerate: false, savedProcessing: false })
        setAllTypeplayersAndTeams({ type: reducerTypes.removeAll })

        // setting resetted obj 
        setsavedTeam([...resetOld])
      }
    }
    else {
      // setting states to default values
      setdifferentBtnStates({ GeneratingTeam: false, needToGenerate: false, savedProcessing: false })
      setAllTypeplayersAndTeams({ type: reducerTypes.removeAll })

      // setting resetted obj 
      setsavedTeam([...resetOld])
    }
  }

  const savedTeamFunc = ({ type }) => {
    const areEqual = compareObjects(allTypeplayersAndTeams, savedTeamOpened);
    switch (type) {
      case savedTeamReducerActions.onfocus:
        {
          setSavedTeamChanges((oldstate) => ({ ...oldstate, popup: true })) // popup visible 
        }
        break;
      case savedTeamReducerActions.onblur: {
        setSavedTeamChanges((oldstate) => ({ ...oldstate, popup: false })) // popup hidden
      };
        break;
      case savedTeamReducerActions.saveChanges:
        {
          // no changes to save 
          if (areEqual) {
            checkingFunction(alertMsgs.savedTeamNoChanges)
          }
          else {
            // structuredClone best way to copy nested arr , obj
            const currentTeam = structuredClone(allTypeplayersAndTeams)
            const copiedsavedTeam = structuredClone(savedTeam)

            const openedArrIndex = copiedsavedTeam.findIndex(savedteam => savedteam.openedInGenerator); // finding opened array index 

            copiedsavedTeam[openedArrIndex] = currentTeam // pushing current allTypeplayersAndTeams copy in copy of savedTeam 
            setsavedTeam(copiedsavedTeam); //setting  savedTeam with updated values
            checkingFunction(alertMsgs.savedTeamChangesSaved) // popup msg for changes saved
          }
        }
        break;
      case savedTeamReducerActions.discardChanges:
        {
          // if savedTeamOpened and current working obj is equal 
          if (areEqual) {
            checkingFunction(alertMsgs.nothingToDiscard);
          } else {
            checkingFunction(alertMsgs.changesDiscard);
          }
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
            <input type="number" name="totalTeamsInput" id="totalTeamsInput" value={allTypeplayersAndTeams.totalTeams} className='w-[2.5rem] text-end bg-transparent focus:outline-none text-lg font-medium' onChange={(e) => setAllTypeplayersAndTeams({ type: reducerTypes.addTeam, payload: { newTotalTeams: e.target.value } })} onBlur={(e) => { setAllTypeplayersAndTeams({ type: reducerTypes.addTeamBlur, payload: { newTotalTeams: e.target.value } }); }} />
          </label>
          {/* total teams label ends  */}

          {/* add title div starts  */}
          <div className='p-2'>
            <label htmlFor="titleForGenerationTeam" className='cursor-pointer block'>Title</label>
            <input ref={titleInput} value={allTypeplayersAndTeams.title} onChange={(e) => setAllTypeplayersAndTeams({ type: reducerTypes.titleChange, newTitle: e.target.value })} type="text" name="titleForGenerationTeam" id='titleForGenerationTeam' placeholder='Title' className='w-full bg-transparent px-3 py-2 mt-2 rounded-md outline outline-1 outline-[#ffffff41] focus:outline-[#4d4aff] backdrop-blur-[12px]' />
          </div>
          {/* add title div ends  */}

        </div>
        {/* details div ends  */}

        {/* form start  */}
        <form onSubmit={formSubmit} onReset={formReset} className='lg:max-w-[45%] sm:max-w-[75%] mx-auto px-2'>
          <div className='flex p-2 items-center gap-2'>
            {/* main input btn starts  */}
            <div className='relative flex-1 backdrop-blur-[12px]'>

              <input ref={mainInput} type="text" name="playerName" id="formInput" placeholder='Add player' className='w-full bg-transparent px-3 py-2  rounded-md outline outline-1 outline-[#ffffff41] focus:outline-[#4d4aff] pr-[2.5rem]' value={PlayerInfoAndMore.playerName} onChange={(e) => { setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerName: e.target.value }) }} required />

              {/* submit button starts  */}
              <button type="submit" className='absolute p-2 right-0 h-full border-l border-lime-400'>
                {
                  PlayerInfoAndMore.currentInputBtn === formSubmitBtnState.add ?
                    <svg className='w-[1.375rem] h-[1.375rem]' viewBox="0 0 24 24" color="#a3e635" fill="none">
                      <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    :
                    <svg className='w-[1.3125rem] h-[1.3125rem]' viewBox="0 0 24 24" color="#a3e635" fill="none">
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
                <svg className='w-[1.375rem] h-[1.375rem]' viewBox="0 0 24 24" color="#e50f0f" fill="none">
                  <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            }
            {/* reset button ends  */}
          </div>
        </form>
        {/* form ends  */}

        <section className='py-[1.5625rem]'>

          {/* generate & clear starts  */}
          <div className='flex justify-center my-4 text-center gap-2'>

            {/* generate button starts */}
            <button onClick={() => { setdifferentBtnStates({ ...differentBtnStates, GeneratingTeam: true }); setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.add, playerName: '', playerIndex: null, editBtnClickBy: null, whichArray: null }); checkingFunction(alertMsgsWork.generateTeam) }} className={`flex gap-2 items-center bg-[#ffff0004] outline-lime-50 text-[0.95rem] font-medium  outline-1 outline px-3 py-2 rounded-sm ${differentBtnStates.needToGenerate ? 'bg-[linear-gradient(to_bottom,_black_80%,rgb(163_230_53)_95%)]' : 'bg-[linear-gradient(to_bottom,_black_80%,rgb(163_230_53)_111%)]'} ${differentBtnStates.GeneratingTeam ? 'btnLoadTime' : ''} `} disabled={differentBtnStates.GeneratingTeam}>
              <span>{!differentBtnStates.needToGenerate ? 'Generate' : 'Recalculate Teams'}</span>
              <span>
                {differentBtnStates.GeneratingTeam ?
                  <svg className='w-[1.125rem] h-[1.125rem]' viewBox="0 0 24 24" color="#a3e635" fill="none">
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
                  <svg className='w-[1.125rem] h-[1.125rem]' viewBox="0 0 24 24" color="#a3e635" fill="none">
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
                  <svg className='w-[1rem] h-[1rem]' viewBox="0 0 24 24" color="#e00000" fill="none">
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
          {/* generate & clear ends  */}

          {/* change title starts  */}
          <div className={`relative flex justify-between items-center rounded-[4px] bg-[rgb(29_29_29_/_48%)] backdrop-blur-[3px] p-3 mt-7 mb-4 ${savedTeamOpened ? 'outline outline-[0.3px] outline-[#a06800]' : ''}`}>

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

            {/* edit title starts  */}
            <h1 className='flex-[0_1_65%] capitalize  rounded-sm sm:text-[1rem] text-[0.9rem] '>
              {allTypeplayersAndTeams.title !== '' ? allTypeplayersAndTeams.title : 'untitled'}
              <sup onClick={() => titleInput.current.focus()} className='ml-4 text-[0.82em] text-[#c4c4c4] cursor-pointer whitespace-nowrap'>(edit Title)</sup>
            </h1>
            {/* edit title ends  */}

            <div className='flex gap-3 items-center'>
              {/* save team button starts  */}
              <button onClick={() => { checkingFunction(alertMsgsWork.saveTeamMsg); }} className={`bg-[#0a0a0a] outline outline-1 outline-[#303030] p-3 rounded-[50%] grid justify-center items-center} ${differentBtnStates.savedProcessing ? 'btnLoadTime' : ''}`} disabled={differentBtnStates.savedProcessing}>
                {differentBtnStates.savedProcessing ?
                  <svg className='sm:w-[1.375rem] w-[1rem]  h-[1rem] sm:h-[1.375rem]' viewBox="0 0 24 24" color="#a3e635" fill="none">
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
                  <svg className='sm:w-[1.375rem] w-[1rem]  h-[1rem] sm:h-[1.375rem] text-white' viewBox="0 0 24 24" fill="none">
                    <path d="M11 2C7.22876 2 5.34315 2 4.17157 3.12874C3 4.25748 3 6.07416 3 9.70753V17.9808C3 20.2867 3 21.4396 3.77285 21.8523C5.26947 22.6514 8.0768 19.9852 9.41 19.1824C10.1832 18.7168 10.5698 18.484 11 18.484C11.4302 18.484 11.8168 18.7168 12.59 19.1824C13.9232 19.9852 16.7305 22.6514 18.2272 21.8523C19 21.4396 19 20.2867 19 17.9808V12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.5 7.00005H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M17 10L17 2M13 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
              </button>
              {/* save team button ends  */}

              {/* will visible on only saved team  */}
              {savedTeamOpened &&
                <button className={`relative p-[5px] rounded-[50%] hover:bg-[#000000] ${savedTeamChanges.popup ? 'bg-[#000000]' : ''}`}>
                  <svg className='w-[1.25rem] h-[1.25rem] text-white rotate-90' viewBox="0 0 24 24" fill="none">
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
                  <ul className={`bg-black w-max shadow-[0_0_0.9375rem_-1px_#000000b8] text-[0.8rem] absolute z-[1] top-[-1.875rem] right-full cursor-pointer rounded-[4px] border-[0.4px] overflow-hidden ${savedTeamChanges.popup ? 'border-[0.4px] border-[#a06800]' : 'hidden'}`}>

                    {/*==== save changes li starts  ====*/}
                    <li className={`flex gap-2 items-center justify-between capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#141414]`} onMouseDown={() => savedTeamFunc({ type: savedTeamReducerActions.saveChanges })}>
                      <span>save changes</span>
                    </li>
                    {/*==== save changes li ends  ====*/}

                    {/*==== discard li starts  ====*/}
                    <li className={`flex gap-2 items-center justify-between capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#141414]`} onMouseDown={() => savedTeamFunc({ type: savedTeamReducerActions.discardChanges })}>
                      <span>discard changes</span>
                    </li>
                    {/*==== discard li ends  ====*/}

                    <li className={`flex gap-2 items-center justify-between capitalize p-[0.6rem_1rem] transition-all duration-150 hover:bg-[#141414]`} onMouseDown={() => newTeam()}>
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
              <section className='flex flex-wrap gap-x-3 gap-y-7 py-5 text-[1.08rem]'>
                {allTypeplayersAndTeams.teams.map((team, teamValIndex) => (
                  <div key={teamValIndex} className={`md:flex-[1_0_12.5rem] sm:flex-[1_0_9.375rem] flex-[1_0_8.125rem]`}>
                    <h1 className='mb-4 text-center text-[1em] font-medium'>Team {(teamValIndex + 1)}</h1>
                    <ol className='cardsContainer flex flex-wrap justify-center gap-3 list-inside relative text-[0.9em]'>
                      {team.teamPlayers.map((val, valIndex) => (

                        <li key={`${team.teamName}-${valIndex}`} className={`cards md:flex-[0_0_12.5rem] sm:flex-[0_0_9.375rem] flex-[1_0_8.125rem] relative rounded-sm p-2 pt-3 text-wrap bg-[#0a0a0a] outline outline-1   ${PlayerInfoAndMore.arrItemForEdit === ('teams.' + teamValIndex) && PlayerInfoAndMore.editBtnClickBy === valIndex ? ' outline-[#4d4aff] outline-offset-2' : 'outline-[#303030]'}`}>
                          <span>{val}</span>

                          {/*== backface of card starts  ==*/}
                          <div className="back absolute inset-0 rounded-[inherit]"></div>

                          {/*== backface of card ends  ==*/}

                          {/*====  three dots starts  =====*/}
                          <span className='seeMore absolute rounded-[50%]  p-[2px] top-[0px] right-2'>
                            <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={`${team.teamName}-${valIndex}`}>
                              <input onFocus={() => {
                                setPlayerInfoAndMore({ ...PlayerInfoAndMore, whichArray: `teams.${teamValIndex}`, playerIndex: valIndex })
                              }} onBlur={() => { setPlayerInfoAndMore({ ...PlayerInfoAndMore, playerIndex: null }) }} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={`${team.teamName}-${valIndex}`} type="text" readOnly />
                            </label>
                            <span>
                              <svg className='w-[1.25rem] h-[1.25rem]' viewBox="0 0 24 24" color="#ffffff" fill="none">
                                <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                              </svg>
                            </span>
                          </span>
                          {/*====  three dots ends  =====*/}

                          {/*==== actions starts  =====*/}
                          <ul className={`popupContainer backdrop-blur-[4px]  shadow-[0_0_0.9375rem_-1px_#000000b8] text-[0.8em] absolute z-[1] top-[1.875rem] right-0 p-1 cursor-pointer rounded-sm border-[0.4px] ${PlayerInfoAndMore.whichArray === `teams.${teamValIndex}` && PlayerInfoAndMore.playerIndex === valIndex ? '' : 'hidden'} `}>

                            {/*==== editing li starts  ====*/}
                            <li onMouseDown={() => {
                              setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.edit, whichArray: `teams.${teamValIndex}`, arrItemForEdit: `teams.${teamValIndex}`, playerName: val, editBtnClickBy: valIndex });
                              setTimeout(() => mainInput.current.focus(), 100);
                            }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 hover:bg-[#262626] `}>
                              <span>edit...</span>
                              <span>
                                <svg className='w-[1rem] h-[1rem]' viewBox="0 0 24 24" color="#ffffff" fill="none">
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
                                <svg className='w-[1rem] h-[1rem]' viewBox="0 0 24 24" color="#ffffff" fill="none">
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
              <ol className='cardsContainer text-white list-inside flex flex-wrap justify-center gap-3 sm:py-5 mt-8 py-4'>
                {allTypeplayersAndTeams.players.map((val, valIndex) => (
                  <li key={val + valIndex + 'players'} className={`cards md:flex-[0_0_12.5rem] sm:flex-[0_0_9.375rem] flex-[1_0_8.125rem] relative rounded-sm p-2 pt-3 text-wrap bg-[#0a0a0a] outline-1 outline ${PlayerInfoAndMore.whichArray === ('players') && PlayerInfoAndMore.editBtnClickBy === valIndex ? ' outline-[#4d4aff] outline-offset-2' : 'outline-[#303030]'}`}>
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
                        <svg className='w-[1.25rem] h-[1.25rem]' viewBox="0 0 24 24" color="#ffffff" fill="none">
                          <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </span>
                    </span>
                    {/*====  three dots ends  =====*/}

                    {/*==== actions starts  =====*/}
                    <ul className={`popupContainer backdrop-blur-[4px]  shadow-[0_0_0.9375rem_-1px_#000000b8] text-[0.8rem] absolute z-[1] top-[1.875rem] right-0 p-1 cursor-pointer rounded-sm border-[0.4px]  ${PlayerInfoAndMore.whichArray === `players` && PlayerInfoAndMore.playerIndex === valIndex ? '' : 'hidden'}`}>

                      {/*==== editing li starts  ====*/}
                      <li onMouseDown={() => {
                        setPlayerInfoAndMore({ ...PlayerInfoAndMore, currentInputBtn: formSubmitBtnState.edit, whichArray: `players`, playerName: val, editBtnClickBy: valIndex, arrItemForEdit: `players` });
                        setTimeout(() => mainInput.current.focus(), 100);
                      }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 hover:bg-[#262626] `}>
                        <span>edit...</span>
                        <span>
                          <svg className='w-[1rem] h-[1rem]' viewBox="0 0 24 24" color="#ffffff" fill="none">
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
                          <svg className='w-[1rem] h-[1rem]' viewBox="0 0 24 24" color="#ffffff" fill="none">
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
    </main>
  )
}

export default App