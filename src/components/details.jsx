import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useState, useRef, memo, useLayoutEffect } from 'react'


const Details = memo(({ modalDetails, setmodalDetails, openedInGenerator }) => {
    const detailsModalContainer = useRef(null)
    const detailsModal = useRef(null)
    const detailsModalMain = useRef(null)
    const description = modalDetails?.Details?.description || "";
    let no_players = !modalDetails?.Details?.players?.length > 0
    const { contextSafe } = useGSAP();
  
    const [clarify, setClarify] = useState({
        need_to_recalculate: false,
        players_devided: false
    });    

    useLayoutEffect(() => {
        const newClarify = {
            need_to_recalculate: modalDetails.Details?.hasShuffled
                ? !(modalDetails.Details?.finalTotalTeams === modalDetails.Details?.teams.length &&
                    modalDetails.Details?.totalTeams === modalDetails.Details?.teams.length)
                : false,
            players_devided: modalDetails.Details?.hasShuffled ? true : false
        };
        // was hanging while popping over so took help of chatgpt 
        // ✅ Only update if values actually changed (prevent unnecessary re-renders)
        setClarify(prevClarify =>
            JSON.stringify(prevClarify) !== JSON.stringify(newClarify) ? newClarify : prevClarify
        );
    }, [modalDetails]);

    useGSAP(() => {               
        document.body.style.overflow = "hidden";
        // gsap.set(detailsModalMain.current, { scrollTop: 0 });
    
        return () => {
            document.body.style.overflow = "";
        };
    }, [modalDetails.opened]);
    

    const closingDetailsModal = contextSafe(() => {
        setmodalDetails({ Details: null, opened: false });
        document.body.style.overflow = "";        
    });

    return (
        <section onClick={() => { closingDetailsModal() }} ref={detailsModalContainer} className={`fixed detailmodaContainer z-[26] p-4 backdrop-blur-[2px] inset-0 mx-auto`}>

            <div ref={detailsModal} onClick={(e) => { e.stopPropagation(); }} className={`relative h-full overflow-hidden text-[0.99em] py-10 sm:pt-[3em] pt-[2.8em] sm:px-4 px-[0.4rem] bg-[#000000] sm:w-5/6 lg:w-[75%] rounded-2xl mx-auto border border-1 ${modalDetails?.Details?.openedInGenerator === true ? 'border-[--lightTheme]' : 'border-[#303030]'}`}>
                {/* ======= close btn starts ===== */}
                <button
                    onClick={() => { closingDetailsModal() }}
                    className="absolute top-2 right-2 sm:p-[0.5em] p-[0.4em] transition-all duration-100 drop-shadow-[0px_0px_5px_white] hover:drop-shadow-[0px_0px_7px_white] border border-1 border-[#ffffff41] hover:border-t hover:border-b rounded-[50%]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="sm:w-[1.1em] sm:h-[1.rem] w-[1em] h-[1em]" viewBox="0 0 24 24" fill="none">
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
                            <span className="font-medium text-[--theme] mr-[2px]">
                                {modalDetails?.Details?.players.length}{" "}
                            </span>
                            <span className="capitalize font-light text-[0.95em]">
                                current players
                            </span>
                        </div>
                        <div
                            className="whitespace-nowrap"
                        >
                            <span className={`font-medium fo text-[--theme] mr-[2px] ${!modalDetails?.Details?.hasShuffled ? "line-through" : ""} `}>
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
                                    <button onClick={() => {openedInGenerator({ time: modalDetails.Details?.savingTime }) }} className={`flex bg-black items-center gap-1 p-[0.2rem_1.3rem] font-medium border-b border-t rounded-[2rem] ${modalDetails?.Details?.openedInGenerator ? "border-[--lightTheme] hover:border-[#8d5b00] shadow-[0_0_9px_-2px_var(--lightTheme)] hover:shadow-[0_0_9px_-4px_var(--lightTheme)]" : "border-[#ffffff41] hover:border-[#202020] shadow-[0_0_9px_-2px_#ffffff41] hover:shadow-[0_0_9px_-4px_#ffffff41]"}`}>open <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 24 24"><path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2zM14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3z" /></svg></button>
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
                                                                <li key={index} className='md:flex-[0_0_12.5rem] sm:flex-[0_1_12.075rem] flex-[1_0_8.125rem] relative rounded-[0.25rem] p-2 text-wrap border border-1 border-[#ffffff41] backdrop-blur-[100px] transition-all duration-100 ease-in'>{name}</li>
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
                                                    <li key={index} className='md:flex-[0_0_12.5rem] sm:flex-[0_1_12.075rem] flex-[1_1_8.125rem] relative rounded-[0.25rem] p-2 text-wrap border border-1 border-[#ffffff41] backdrop-blur-[100px] transition-all duration-100 ease-in'>{name}</li>
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

export default Details