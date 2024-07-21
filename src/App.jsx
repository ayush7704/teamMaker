import { useReducer, useRef, useEffect, useState } from 'react'
function reducer(player, action) {
  const playersArr = [...player];
  if (action.type === 'add') {
    if (action.payload.playerInfoAndMore.addBtnValue === 'save edit') {
      playersArr[action.payload.playerInfoAndMore.playerIndex] = action.payload.playerInfoAndMore.name
      return [...playersArr]
    }
    else { return [...playersArr, action.payload.playerInfoAndMore.name] }
  }
  else if (action.type === 'delete') {
    playersArr.splice(action.payload.playerIndex, 1)
    return [...playersArr]
  }
  else { return [...playersArr] }
}
function App() {
  const playerInput = useRef(null)
  const [player, setPlayer] = useReducer(reducer, [])
  const [btnvalues, setbtnvalues] = useState({ add: 'add', edit: 'save edit' })
  const [playerInfoAndMore, setplayerInfoAndMore] = useState({ name: '', addBtnValue: btnvalues.add, playerIndex: null, editBtnClickBy: null })
  const [popup, setPopup] = useState(false)
  const render = useRef(0)
  useEffect(() => {
    render.current = render.current + 1
    console.log(render.current)
  })

  function addPlayerForm(e) {
    e.preventDefault();
    setPlayer({ type: 'add', payload: { playerInfoAndMore } }); setplayerInfoAndMore({ ...playerInfoAndMore, name: '', addBtnValue: btnvalues.add, playerIndex: null, editBtnClickBy: null })
    playerInput.current.focus()
  }
  return (
    <main className='min-h-dvh bg-black'>
      <div className='sm:w-[80%] mx-auto p-[30px]'>
        <form name='addPlayersForm' className='flex flex-wrap gap-3 mb-6 justify-center' onSubmit={addPlayerForm}>

          <input ref={playerInput} value={playerInfoAndMore.name} onChange={(e) => setplayerInfoAndMore({ ...playerInfoAndMore, name: e.target.value, })} className='px-3 py-1 rounded-md outline-none' type="text" name="PlayerName" placeholder='Player Name' id='PlayerName' required autoFocus={true} />

          <div className='flex gap-2'>
            <input className='px-3 capitalize rounded-md py-1 cursor-pointer bg-white text-black' type="submit" value={playerInfoAndMore.addBtnValue} />
            {playerInfoAndMore.addBtnValue === btnvalues.edit &&
              <input onClick={() => { setplayerInfoAndMore({ ...playerInfoAndMore, name: '', addBtnValue: btnvalues.add, playerIndex: null, editBtnClickBy: null }) }} className='px-3 capitalize rounded-md py-1 cursor-pointer bg-white text-black' type="reset" value='cancel edit' />
            }
          </div>
        </form>
        <ol className='text-white flex justify-center flex-wrap gap-3 list-inside'>
          {
            player.length > 0 ? player.map((val, valInde) => (
              <li className={`relative sm:flex-[0_0_200px] flex-[1_0_130px] pt-3 p-2 rounded-md capitalize ${playerInfoAndMore.editBtnClickBy === valInde ? "bg-[#1e1e1e]" : "bg-zinc-600"}`} key={valInde}>
                {/* <span className='text-wrap'>{val}</span> */}
                {val}
                <span className='seeMore absolute rounded-[50%]  p-[2px] top-[0px] right-1'>
                  <label className='inset-0 w-[100%] h-[100%] opacity-0 absolute' htmlFor={'input' + valInde}>
                    <input onFocus={() => { setPopup(val + valInde); console.log('focus') }} onBlur={() => {
                      setPopup(false); console.log('blureed'); setTimeout(() => {
                        playerInput.current.focus();
                      }, 100);
                    }} className='inset-0 w-[100%] h-[100%] cursor-pointer absolute focus:bg-red-500' id={'input' + valInde} type="text" />
                  </label>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#ffffff" fill="none">
                      <path d="M21 12C21 11.1716 20.3284 10.5 19.5 10.5C18.6716 10.5 18 11.1716 18 12C18 12.8284 18.6716 13.5 19.5 13.5C20.3284 13.5 21 12.8284 21 12Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M6 12C6 11.1716 5.32843 10.5 4.5 10.5C3.67157 10.5 3 11.1716 3 12C3 12.8284 3.67157 13.5 4.5 13.5C5.32843 13.5 6 12.8284 6 12Z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </span>
                {/* ${popup === val+valInde ? '':'hidden'} */}

                <ul className={`${popup === val + valInde ? '' : 'hidden'} absolute z-[1] top-[30px] right-0 bg-[rgb(26_26_26)] p-1 cursor-pointer rounded-sm`}>
                  <li onMouseDown={(e) => { playerInput.current.focus(); setplayerInfoAndMore({ ...playerInfoAndMore, name: val, addBtnValue: btnvalues.edit, playerIndex: valInde, editBtnClickBy: valInde }); console.log(val + ' clicked') }} className={` capitalize p-2 transition-all duration-150 ${playerInfoAndMore.addBtnValue === btnvalues.edit && playerInfoAndMore.editBtnClickBy === valInde ? 'hover:bg-[#1e1e1e]' : 'hover:bg-zinc-600'}`}>edit</li>
                  <li onMouseDown={(e) => { playerInput.current.focus(); setplayerInfoAndMore({ ...playerInfoAndMore, name: '', addBtnValue: btnvalues.add, playerIndex: valInde, editBtnClickBy: null }); setPlayer({ type: 'delete', payload: { playerName: val, playerIndex: valInde } }); }} className={` capitalize p-2 hover:bg-zinc-600 transition-all duration-150`}>delete</li>
                </ul>
              </li>
            )) : <h1>Add player names</h1>
          }
        </ol>
      </div>
    </main>
  )
}

export default App
