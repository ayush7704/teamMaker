import { useReducer, useRef, useEffect, useState, } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function reducer(player, action) {
  const playersArr = [...player];
  if (action.type === 'add') {
    if (action.payload.playerInfoAndMore.addBtnValue === 'save') {
      playersArr[action.payload.playerInfoAndMore.playerIndex] = action.payload.playerInfoAndMore.name
      return [...playersArr]
    }
    else { return [...playersArr, action.payload.playerInfoAndMore.name] }
  }
  else if (action.type === 'delete') {
    playersArr.splice(action.payload.playerIndex, 1)
    return [...playersArr]
  }
  else if (action.type === 'delete all') {
    return []
  }
  else if (action.type === 'nochange') {
    let updatedPlayers = action.payload.updatedArr
    return [...updatedPlayers]
  }
  else { return [...playersArr] }
}
function App() {
  const notify = useRef(null)
  // const cursor = useRef(null)
  const topdivChild = useRef(null)
  const playerInput = useRef(null)
  const [player, setPlayer] = useReducer(reducer,{playerArr:[],team1:[],team2:[]})
  const [btnvalues, setbtnvalues] = useState({ add: 'add', edit: 'save' })
  const [playerInfoAndMore, setplayerInfoAndMore] = useState({ name: '', addBtnValue: btnvalues.add, playerIndex: null, editBtnClickBy: null })
  const [popup, setPopup] = useState(false)
  const [orders, setorders] = useState(() => { return Array.from(new Set([player.length])) })
  const [teamVisible, setteamVisible] = useState(false)

  useEffect(() => {
    const updatedOrderFunc = async () => {
      let promis = await new Promise((resolve, reject) => {
        let tempArr = new Set([])
        for (let x = 0; x < player.length; x++) {
          tempArr.add(x)
        }
        resolve(tempArr)
      })
      setorders(Array.from(promis))
    }
    updatedOrderFunc()
  }, [player.length])

  useEffect(() => {
    console.log(playerInfoAndMore)
  }, [playerInfoAndMore])
  const render = useRef(0)
  useEffect(() => {
    render.current = render.current + 1
    console.log(render.current)
    // console.log(Array.from(orders))
    console.log(orders)
    console.log(player)
    console.log(popup)
  })

  let { contextSafe } = useGSAP()
  let btnClick = contextSafe(() => {
    if (player.length < 4) {
      navigator.vibrate(70)
      gsap.fromTo(notify.current, { display: 'block', y: 20 }, { y: 0, duration: 0.3, ease: 'back' })
      setTimeout(() => {
        gsap.to(notify.current, { display: 'none' })
      }, 2000);
      return
    }
    let li = document.querySelectorAll('.cardsContainer > li')
    let nyeplayersarr = [...player]

    li.forEach((element, x) => {
      element.classList.toggle('rotated')

      if (x == (li.length - 1)) {
        let nyaarr = new Set([])
        let percent = Math.round(100 * (li.length / 100))

        for (let y = 0; y < orders.length; y++) {

          while (percent !== nyaarr.size) {
            let random = Math.floor(Math.random() * ((orders.length * 1) - 0)) + 0
            nyaarr.add(random)
          }

          nyeplayersarr[y] = player[Array.from(nyaarr)[y]]

          if (y === (orders.length - 1)) {

            setTimeout(() => {
              setPlayer({ type: 'nochange', payload: { updatedArr: [...nyeplayersarr] } })
              li.forEach((element, x) => {
                element.classList.toggle('rotated')
                console.log(li.length + ' ' + (x + 1))
                if (li.length === (x + 1)) {
                  setTimeout(() => {
                    setteamVisible(true)
                  }, 250);
                }
              })
            }, 1000);
          }

        };
      }
    })

  })


  function addPlayerForm(e) {
    e.preventDefault();
    setPlayer({ type: 'add', payload: { playerInfoAndMore } });
    setplayerInfoAndMore({ ...playerInfoAndMore, name: '', addBtnValue: btnvalues.add, playerIndex: null, editBtnClickBy: null })
    console.log(playerInfoAndMore.addBtnValue)
    console.log(playerInfoAndMore.addBtnValue !== btnvalues.edit)
    playerInfoAndMore.addBtnValue !== btnvalues.edit && playerInput.current.focus()
  }
  let time;
  let mousemove = contextSafe((e) => {
    clearTimeout(time)
    let x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) * 35
    let y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2) * 35
    // gsap.fromTo(topdivChild.current,{transform:'none'}, { transform: `rotateX(${-1 * y}deg) rotateY(${x}deg)` })
    try {
      topdivChild.current.style.transform = `rotateX(${-1 * y}deg) rotateY(${x}deg)`
    } catch (error) {

    }
    time = setTimeout(() => {
      try {
        topdivChild.current.style.transform = `rotateX(${0}deg) rotateY(${0}deg)`
      } catch (error) {

      }
      // gsap.to(topdivChild.current, { transform: `rotateX(${0}deg) rotateY(${0}deg)` ,duration:0.4})
    }, 1500);
  })
  window.addEventListener('mousemove', mousemove)
  return (

    <main className='min-h-[100vh] flex bg-[linear-gradient(to_right,_#ffffff_-20%,_#007dff)]'>

      {/* alert div starts */}
      <div ref={notify} className='fixed w-max z-10 hidden p-[6px] bottom-5 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg'>
        <h1 className='bg-black p-[6px_9px] rounded-md text-[red] font-medium text-lg capitalize'>add {4 - player.length} more {4 - player.length === 1 ? 'player' : 'players'} to generate team</h1>
      </div>
      {/* alert div ends */}

      <div className='relative w-full'>

        {/* the background of text starts */}
        <div className='absolute p-[12px_6px] content-between grid abso-text max-h-[100dvh] inset-0 uppercase text-[19vw] sm:text-[19vh] font-extrabold '>
          <div>
            <h1 className='leading-[100%]'><span>make</span></h1>
            <h1 className='leading-[100%]'><span>your</span></h1>
          </div>
          <div>
            <h1 className='leading-[100%] text-right'><span>random</span></h1>
            <h1 className='leading-[100%] text-right'><span>team</span></h1>
          </div>
        </div>
        {/* the background of text ends */}

        <div className='relative sm:w-[80%] h-full mx-auto p-[30px]'>

          {/* top sticky div starts  */}
          <div className="top-div sticky top-5 z-[3] flex justify-center text-white mt-6">
            <div ref={topdivChild} className="top-div-child relative shadow-[0_0_11px_0px_black] bg-[linear-gradient(45deg,_#0000ff73,_#ff00008f,_#ffff0047)] flex-[0_1_250px] flex justify-between items-center rounded-[13px] py-3 px-4 bg-blue-400 text-nowrap gap-5">

              {/* total player div starts  */}
              <div className='text-center p-2'>
                <h3 className='text-[0.94rem] text-[#e7e7e7]'>Total players</h3>
                <h2 className='text-[1.2rem] font-bold'>{player.length}</h2>
              </div>
              {/* total player div ends */}

              {/* total teams div starts */}
              <div className='text-center p-2'>
                <h3 className='text-[0.94rem] text-[#e7e7e7]'>Total teams</h3>
                <h3 className='text-[1.2rem] font-bold'>2</h3>
                {/* <input max={'3'} className='text-center max-w-5 bg-transparent outline-none text-[1.2rem] font-bold' type="number" onChange={(e) => { e.target.value = e.target.value }} value={2} readOnly /> */}

              </div>
              {/* total teams div ends */}

            </div>
          </div>
          {/* top sticky div ends  */}

          {/*===== form for players add & edit starts  =====*/}
          <form name='addPlayersForm' className='flex flex-wrap gap-3 mt-[34px] justify-center' onSubmit={addPlayerForm}>

            <div className='relative flex-[0_1_250px]'>
              {/*== main input starts  ==*/}
              <input ref={playerInput} value={playerInfoAndMore.name} onChange={(e) => setplayerInfoAndMore({ ...playerInfoAndMore, name: e.target.value, })} className='bg-[linear-gradient(45deg,_#0000ff73,_#ff00008f,_#ffff0047)] w-full backdrop-blur-[6px] outline-[0.4px] outline outline-offset-2 outline-[#ffffffa2] text-white px-3 pr-[37px] py-[0.4rem] rounded-md' type="text" name="PlayerName" placeholder='Player Name' id='PlayerName' required autoFocus={true} />
              {/*== main input ends  ==*/}

              {/* save button starts  */}
              <button type='submit' className='absolute right-0 h-full top-0 px-2'>
                <span>
                  {playerInfoAndMore.addBtnValue === btnvalues.add ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
                    <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="2" />

                  </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#009c00" fill="none">
                      <path d="M3 13.3333C3 13.3333 4.5 14 6.5 17C6.5 17 6.78485 16.5192 7.32133 15.7526M17 6C14.7085 7.14577 12.3119 9.55181 10.3879 11.8223" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 13.3333C8 13.3333 9.5 14 11.5 17C11.5 17 17 8.5 22 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                </span>
              </button>
              {/* save button ends  */}
            </div>

            {/* discard  button starts  */}
            {playerInfoAndMore.addBtnValue === btnvalues.edit &&
              <button onClick={() => { setplayerInfoAndMore({ ...playerInfoAndMore, name: '', addBtnValue: btnvalues.add, playerIndex: null, editBtnClickBy: null }) }} className='bg-[linear-gradient(to_bottom_right,red,black)] outline-[0.4px] outline outline-white px-3 capitalize rounded-md py-2 cursor-pointer text-black'>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" color="#ffffff" fill="none">
                    <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </button>
            }
            {/* discard  button ends  */}

          </form>
          {/*===== form for players add & edit ends  =====*/}

          <div className={`flex justify-center gap-3 my-5 ${player.length === 0 ? "hidden" : ""}`}>
            <button onMouseDown={() => { if (player.length >= 4) { setplayerInfoAndMore({ ...playerInfoAndMore, addBtnValue: btnvalues.add, name: '', playerIndex: null, editBtnClickBy: null }) } }} onClick={() => { btnClick() }} className='px-3 py-[0.3rem] capitalize text-white bg-[linear-gradient(45deg,_black,_rgb(64_188_38))]  rounded-md  block'> generate team </button>
            <button onClick={() => {
              setPlayer({ type: 'delete all' }); setplayerInfoAndMore({ ...playerInfoAndMore, addBtnValue: btnvalues.add, name: '', });
              setteamVisible(false)
            }} className={`px-3 bg-[linear-gradient(45deg,_black,_#ad1d1d)] py-[0.3rem] capitalize text-white rounded-md block `}>clear all </button>
          </div>

          {!teamVisible ?

            <div>
              {/*=== first container of players starts  ===*/}
              <ol className="cardsContainer text-black flex flex-wrap justify-center gap-3 list-inside">
                {
                  player.length > 0 ? player.map((val, valInde) => (
                    //===== player card starts 
                    // order-[${(orders[valInde])}]
                    // bg-[rgb(48_48_48)]
                    <li style={{ order: orders[valInde] }} className={`relative order-[${(orders[valInde])}] sm:flex-[0_0_200px] flex-[1_0_130px] pt-[0.85rem] p-2 rounded-md capitalize outline outline-[0.4px] ${playerInfoAndMore.editBtnClickBy === valInde ? "bg-[white] " : "bg-[linear-gradient(to_right,_#ffffff_,_#cbe5ff)]"} ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === valInde ? 'outline-[rgb(102_81_22_/_88%)]' : 'outline-[transparent]'} `} key={valInde}>

                      {/*== backface of card starts  ==*/}
                      <div className='back'></div>
                      {/*== backface of card ends  ==*/}
                      <span>{val}</span>

                      {/*====  three dots for more actions starts  =====*/}
                      {/*====  three dots starts  =====*/}
                      <span className='seeMore absolute rounded-[50%]  p-[2px] top-[0px] right-1'>
                        <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={'PlayerInpu' + valInde}>
                          <input onFocus={() => setPopup(val + valInde +'player')} onBlur={() => setPopup(false)} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={'PlayerInput' + valInde} type="text" />
                        </label>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
                            <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </span>
                      </span>
                      {/*====  three dots ends  =====*/}

                      {/*==== actions starts  =====*/}
                      <ul className={`popupContainer backdrop-blur-[4px]  shadow-[0_0_15px_-1px_#000000b8] text-[0.9rem] ${popup === val + valInde+'player' ? '' : 'hidden'}  absolute z-[1] top-[30px] right-0 bg-[linear-gradient(to_right,_#ffffff,_#cbe5ff)] p-1 cursor-pointer rounded-sm border-[0.4px] ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === valInde+'PlayerInput' ? 'border-[rgb(102_81_22_/_88%)]' : 'border-[rgb(152_202_255)]'} `}>

                        {/*==== editing li starts  ====*/}
                        <li onMouseDown={(e) => {
                          setTimeout(() => {
                            playerInput.current.focus();
                          }, 100); setplayerInfoAndMore({ ...playerInfoAndMore, name: val, addBtnValue: btnvalues.edit, playerIndex: valInde, editBtnClickBy: valInde }); console.log(val + ' clicked')
                        }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === valInde ? 'bg-[#60d0d5a1]' : 'hover:bg-[rgb(152_202_255)]'}`}>
                          <span>edit...</span>
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#000000" fill="none">
                              <path d="M10.5 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C8.12805 13.9629 11.2057 13.6118 14 14.4281" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                              <path d="M18.4332 13.8485C18.7685 13.4851 18.9362 13.3035 19.1143 13.1975C19.5442 12.9418 20.0736 12.9339 20.5107 13.1765C20.6918 13.2771 20.8646 13.4537 21.2103 13.8067C21.5559 14.1598 21.7287 14.3364 21.8272 14.5214C22.0647 14.9679 22.0569 15.5087 21.8066 15.9478C21.7029 16.1298 21.5251 16.3011 21.1694 16.6437L16.9378 20.7194C16.2638 21.3686 15.9268 21.6932 15.5056 21.8577C15.0845 22.0222 14.6214 22.0101 13.6954 21.9859L13.5694 21.9826C13.2875 21.9752 13.1466 21.9715 13.0646 21.8785C12.9827 21.7855 12.9939 21.6419 13.0162 21.3548L13.0284 21.1988C13.0914 20.3906 13.1228 19.9865 13.2807 19.6232C13.4385 19.2599 13.7107 18.965 14.2552 18.375L18.4332 13.8485Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </li>
                        {/*==== editing li ends  ====*/}

                        {/*==== deleting li starts  ====*/}
                        <li onMouseDown={(e) => { setplayerInfoAndMore({ ...playerInfoAndMore, name: '', addBtnValue: btnvalues.add, playerIndex: valInde, editBtnClickBy: null }); setPlayer({ type: 'delete', payload: { playerName: val, playerIndex: valInde } }); }} className={`flex gap-2 items-center justify-between capitalize p-2 hover:bg-[rgb(152_202_255)] transition-all duration-150`}>
                          <span>delete</span>
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#000000" fill="none">
                              <path d="M13 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C7.97679 14.053 10.8425 13.6575 13.5 14.2952" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                              <path d="M16 22L19 19M19 19L22 16M19 19L16 16M19 19L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </span>
                        </li>
                        {/*==== deleting li ends  ====*/}

                      </ul>
                      {/*====  actions ends   =====*/}
                      {/*====  three dots for more actions ends  =====*/}

                    </li>
                    //===== player card ends 
                  )) : ''
                }
              </ol>
              {/*=== first container of players ends  ===*/}

            </div>
            :
            <div className='grid gap-3 grid-cols-2 items-baseline'>
              <h1 className='text-lg text-center capitalize font-semibold'><span contentEditable={true}>team 1</span></h1>
              <h1 className='text-lg text-center capitalize font-semibold'><span contentEditable={true}>team 1</span></h1>
              {/* second container of players starts   */}
              <ol className="cardsContainer text-black grid grid-cols-1 gap-3 list-inside">
                {
                  player.length > 0 ? player.filter((val,valInde)=>valInde % 2 === 0 ).map((val, valInde) => (
                    //===== player card starts 
                    // order-[${(orders[valInde])}]
                    // bg-[rgb(48_48_48)]
                    <li style={{ order: orders[valInde] }} className={`relative order-[${(orders[valInde])}] sm:flex-[0_0_200px] flex-[1_0_130px] pt-[0.85rem] p-2 rounded-md capitalize outline outline-[0.4px] ${playerInfoAndMore.editBtnClickBy === valInde ? "bg-[white] " : "bg-[linear-gradient(to_right,_#ffffff_,_#cbe5ff)]"} ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === val+valInde+'inputTeam1' ? 'outline-[rgb(102_81_22_/_88%)]' : 'outline-[transparent]'} `} key={valInde}>

                      {/*== backface of card starts  ==*/}
                      <div className='back'></div>
                      {/*== backface of card ends  ==*/}
                      <span>{val}</span>

                      {/*====  three dots for more actions starts  =====*/}
                      {/*====  three dots starts  =====*/}
                      <span className='seeMore absolute rounded-[50%]  p-[2px] top-[0px] right-1'>
                        <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={'inputTeam1' + valInde}>
                          <input onFocus={() => setPopup(val + valInde +'team 1')} onBlur={() => setPopup(false)} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={'inputTeam1' + valInde} type="text" />
                        </label>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
                            <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </span>
                      </span>
                      {/*====  three dots ends  =====*/}

                      {/*==== actions starts  =====*/}
                      <ul className={`popupContainer backdrop-blur-[4px]  shadow-[0_0_15px_-1px_#000000b8] text-[0.9rem] ${popup === val + valInde+'team 1' ? '' : 'hidden'}  absolute z-[1] top-[30px] right-0 bg-[linear-gradient(to_right,_#ffffff,_#cbe5ff)] p-1 cursor-pointer rounded-sm border-[0.4px] ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === val+valInde+'inputTeam1' ? 'border-[rgb(102_81_22_/_88%)]' : 'border-[rgb(152_202_255)]'} `}>

                        {/*==== editing li starts  ====*/}
                        <li onMouseDown={(e) => {
                          setTimeout(() => {
                            playerInput.current.focus();
                          }, 100); setplayerInfoAndMore({ ...playerInfoAndMore, name: val, addBtnValue: btnvalues.edit, playerIndex: val+valInde+'inputTeam1', editBtnClickBy: val+valInde+'inputTeam1' }); console.log(val + ' clicked')
                        }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === val+valInde+'inputTeam1' ? 'bg-[#60d0d5a1]' : 'hover:bg-[rgb(152_202_255)]'}`}>
                          <span>edit...</span>
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#000000" fill="none">
                              <path d="M10.5 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C8.12805 13.9629 11.2057 13.6118 14 14.4281" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                              <path d="M18.4332 13.8485C18.7685 13.4851 18.9362 13.3035 19.1143 13.1975C19.5442 12.9418 20.0736 12.9339 20.5107 13.1765C20.6918 13.2771 20.8646 13.4537 21.2103 13.8067C21.5559 14.1598 21.7287 14.3364 21.8272 14.5214C22.0647 14.9679 22.0569 15.5087 21.8066 15.9478C21.7029 16.1298 21.5251 16.3011 21.1694 16.6437L16.9378 20.7194C16.2638 21.3686 15.9268 21.6932 15.5056 21.8577C15.0845 22.0222 14.6214 22.0101 13.6954 21.9859L13.5694 21.9826C13.2875 21.9752 13.1466 21.9715 13.0646 21.8785C12.9827 21.7855 12.9939 21.6419 13.0162 21.3548L13.0284 21.1988C13.0914 20.3906 13.1228 19.9865 13.2807 19.6232C13.4385 19.2599 13.7107 18.965 14.2552 18.375L18.4332 13.8485Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </li>
                        {/*==== editing li ends  ====*/}

                        {/*==== deleting li starts  ====*/}
                        <li onMouseDown={(e) => { setplayerInfoAndMore({ ...playerInfoAndMore, name: '', addBtnValue: btnvalues.add, playerIndex: val+valInde+'inputTeam1', editBtnClickBy: null }); setPlayer({ type: 'delete', payload: { playerName: val, playerIndex: val+valInde+'inputTeam1' } }); }} className={`flex gap-2 items-center justify-between capitalize p-2 hover:bg-[rgb(152_202_255)] transition-all duration-150`}>
                          <span>delete</span>
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#000000" fill="none">
                              <path d="M13 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C7.97679 14.053 10.8425 13.6575 13.5 14.2952" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                              <path d="M16 22L19 19M19 19L22 16M19 19L16 16M19 19L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </span>
                        </li>
                        {/*==== deleting li ends  ====*/}

                      </ul>
                      {/*====  actions ends   =====*/}
                      {/*====  three dots for more actions ends  =====*/}

                    </li>
                    //===== player card ends 
                  )) : ''
                }
              </ol>
              <ol className="cardsContainer text-black grid grid-cols-1 gap-3 list-inside">
                {
                  player.length > 0 ? player.filter((val,valInde)=>valInde % 2 !== 0 ).map((val, valInde) => (
                    //===== player card starts 
                    // order-[${(orders[valInde])}]
                    // bg-[rgb(48_48_48)]
                    <li style={{ order: orders[valInde] }} className={`relative order-[${(orders[valInde])}] sm:flex-[0_0_200px] flex-[1_0_130px] pt-[0.85rem] p-2 rounded-md capitalize outline outline-[0.4px] ${playerInfoAndMore.editBtnClickBy === val+valInde+'inputTeam2' ? "bg-[white] " : "bg-[linear-gradient(to_right,_#ffffff_,_#cbe5ff)]"} ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === val+valInde+'inputTeam2' ? 'outline-[rgb(102_81_22_/_88%)]' : 'outline-[transparent]'} `} key={valInde}>

                      {/*== backface of card starts  ==*/}
                      <div className='back'></div>
                      {/*== backface of card ends  ==*/}
                      <span>{val}</span>

                      {/*====  three dots for more actions starts  =====*/}
                      {/*====  three dots starts  =====*/}
                      <span className='seeMore absolute rounded-[50%]  p-[2px] top-[0px] right-1'>
                        <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={'inputTeam2' + valInde}>
                          <input onFocus={() => setPopup(val+valInde+'inputTeam2')} onBlur={() => setPopup(false)} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute' id={'inputTeam2' + valInde} type="text" />
                        </label>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
                            <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </span>
                      </span>
                      {/*====  three dots ends  =====*/}

                      {/*==== actions starts  =====*/}
                      <ul className={`popupContainer backdrop-blur-[4px]  shadow-[0_0_15px_-1px_#000000b8] text-[0.9rem] ${popup === val+valInde+'inputTeam2' ? '' : 'hidden'}  absolute z-[1] top-[30px] right-0 bg-[linear-gradient(to_right,_#ffffff,_#cbe5ff)] p-1 cursor-pointer rounded-sm border-[0.4px] ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === val+valInde+'inputTeam2' ? 'border-[rgb(102_81_22_/_88%)]' : 'border-[rgb(152_202_255)]'} `}>

                        {/*==== editing li starts  ====*/}
                        <li onMouseDown={(e) => {
                          setTimeout(() => {
                            playerInput.current.focus();
                          }, 100); setplayerInfoAndMore({ ...playerInfoAndMore, name: val, addBtnValue: btnvalues.edit, playerIndex: val+valInde+'inputTeam2', editBtnClickBy: val+valInde+'inputTeam2' }); console.log(val + ' clicked')
                        }} className={`flex gap-2 items-center justify-between capitalize p-2 transition-all duration-150 ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === val+valInde+'inputTeam2' ? 'bg-[#60d0d5a1]' : 'hover:bg-[rgb(152_202_255)]'}`}>
                          <span>edit...</span>
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#000000" fill="none">
                              <path d="M10.5 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C8.12805 13.9629 11.2057 13.6118 14 14.4281" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                              <path d="M18.4332 13.8485C18.7685 13.4851 18.9362 13.3035 19.1143 13.1975C19.5442 12.9418 20.0736 12.9339 20.5107 13.1765C20.6918 13.2771 20.8646 13.4537 21.2103 13.8067C21.5559 14.1598 21.7287 14.3364 21.8272 14.5214C22.0647 14.9679 22.0569 15.5087 21.8066 15.9478C21.7029 16.1298 21.5251 16.3011 21.1694 16.6437L16.9378 20.7194C16.2638 21.3686 15.9268 21.6932 15.5056 21.8577C15.0845 22.0222 14.6214 22.0101 13.6954 21.9859L13.5694 21.9826C13.2875 21.9752 13.1466 21.9715 13.0646 21.8785C12.9827 21.7855 12.9939 21.6419 13.0162 21.3548L13.0284 21.1988C13.0914 20.3906 13.1228 19.9865 13.2807 19.6232C13.4385 19.2599 13.7107 18.965 14.2552 18.375L18.4332 13.8485Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </li>
                        {/*==== editing li ends  ====*/}

                        {/*==== deleting li starts  ====*/}
                        <li onMouseDown={(e) => { setplayerInfoAndMore({ ...playerInfoAndMore, name: '', addBtnValue: btnvalues.add, playerIndex: val+valInde+'inputTeam2', editBtnClickBy: null }); setPlayer({ type: 'delete', payload: { playerName: val, playerIndex: val+valInde+'inputTeam2' } }); }} className={`flex gap-2 items-center justify-between capitalize p-2 hover:bg-[rgb(152_202_255)] transition-all duration-150`}>
                          <span>delete</span>
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#000000" fill="none">
                              <path d="M13 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C7.97679 14.053 10.8425 13.6575 13.5 14.2952" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="2" />
                              <path d="M16 22L19 19M19 19L22 16M19 19L16 16M19 19L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </span>
                        </li>
                        {/*==== deleting li ends  ====*/}

                      </ul>
                      {/*====  actions ends   =====*/}
                      {/*====  three dots for more actions ends  =====*/}

                    </li>
                    //===== player card ends 
                  )) : ''
                }
              </ol>
              {/* second container of players ends */}
            </div>
          }
        </div>

      </div>
    </main>
  )
}

export default App
