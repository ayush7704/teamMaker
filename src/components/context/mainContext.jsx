import React, {
  useRef,
  useState,
  useLayoutEffect,
  memo,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { mainContext } from "./context";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function ContextProvider({ children }) {
  const timeout = useRef(null);
  const [savedTeam, setsavedTeam] = useState([]);
  const [projectHasChangedModalOpen, setprojectHasChangedModalOpen] = useState(false);
  const [alertMsgsState, setalertMsgsState] = useState(
    "You need at least 2 players to generate a team."
  );

  const { contextSafe } = useGSAP();

  const clearNotification = () => {
    clearTimeout(timeout.current);
    gsap.to(".fixedmsg", { opacity: 0, duration: 0.4, display: "none" });
  };

  // Notification animation
  const popupAnim = contextSafe((time) => {
    clearTimeout(timeout.current); // removing old timeout

    gsap.fromTo(
      ".fixedmsg",
      { bottom: 0, opacity: 0.5, display: "none" },
      { bottom: 100, opacity: 1, display: "block", ease: "back", duration: 0.8 }
    );

    timeout.current = setTimeout(() => {
      gsap.to(".fixedmsg", { opacity: 0, duration: 0.4, display: "none" });
    }, time ?? 2500);
  });

  const compareObjects = useCallback((obj1, obj2) => {
    const entries1 = Object.entries(obj1);
    const entries2 = Object.entries(obj2);

    // if the lenth of entries is not equal
    if (entries1.length !== entries2.length) {
      return false;
    }

    // this for of loop code is not mine here thanks to blackbox ai it hepls me to this.
    // but comments are mine after understanding the working of this code .
    for (const [key, value] of entries1) {
      const value2 = obj2[key];

      if (typeof value === "object" && typeof value2 === "object") {
        // if the values are not equal it will means objects are equal
        if (!compareObjects(value, value2)) {
          return false;
        }
      } else if (value !== value2) {
        // for primitive values
        return false;
      }
    }

    return true;
  }, []);

  useLayoutEffect(() => {
    const local = localStorage.getItem("savedTeams");
    if (local) {
      setsavedTeam(JSON.parse(local));
    }
  }, []);

  useLayoutEffect(() => {
    localStorage.setItem("savedTeams", JSON.stringify(savedTeam));
  }, [savedTeam]);

  return (
    <mainContext.Provider
      value={{
        savedTeam,
        setsavedTeam,
        PageHeading,
        compareObjects,
        ProjectHasChangedModal,
        projectHasChangedModalOpen,
        setprojectHasChangedModalOpen,
        alertMsgsState,
        setalertMsgsState,
        Notification,
        popupAnim,
        clearNotification,
        alertMsgs,
        alertMsgsWork,
        alertMsgsTime,
        savedTeamReducerActions
      }}
    >
      {children}
    </mainContext.Provider>
  );
}
export default React.memo(ContextProvider);

const alertMsgsWork = {
  saveTeamMsg: "team saved or not msg",
  generateTeam: "generate team",
  savedTeamChangesWork: "saved Team Changes Work",
};

const alertMsgs = {
  teamSaved: "Your project was saved successfully!",
  teamNotSaved: "You need at least 2 players to save a project.",
  titleNotSaved: "The project requires a title",
  notGenerated: "You need at least 2 players to generate a team. ",
  savedTeamNoChanges: "There are no changes to save.",
  savedTeamChangesSaved: "Your changes were saved successfully!",
  changesDiscard: "Your changes were removed successfully!",
  nothingToDiscard: "There’s nothing to discard.",
  teamDeleted: "Your project was removed successfully!",
  errorMsg: "Something broke generate again !",
  teams_length_broken: "Teams length can't be bigger than total players length",
  removeAll: "removing all",
};

const alertMsgsTime = new Map([
  [alertMsgs.teamSaved, 3000],
  [alertMsgs.teamNotSaved, 4000],
  [alertMsgs.titleNotSaved, 2500],
  [alertMsgs.notGenerated, 4000],
  [alertMsgs.savedTeamNoChanges, 3000],
  [alertMsgs.savedTeamChangesSaved, 2500],
  [alertMsgs.changesDiscard, 3500],
  [alertMsgs.nothingToDiscard, 2500],
  [alertMsgs.teamDeleted, 3000],
  [alertMsgs.errorMsg, 3000],
  [alertMsgs.teams_length_broken, 5500],
  [alertMsgs.removeAll, 1500],
]);

const savedTeamReducerActions = {
  onblur: "onblur",
  onfocus: "onfocus",
  saveChanges: "saveChanges",
  discardChanges: "discardChanges",
};

let PageHeading = memo(({ heading }) => {
  const headingCompo = useRef(null);
  const { contextSafe } = useGSAP();
  let lastScrollTop = 0;
  const PageHeadingToggling = contextSafe(() => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll < lastScrollTop) {
      gsap.to(headingCompo.current, { top: "0.5rem", duration: 1, ease: "back" });
    } else if (currentScroll > lastScrollTop && currentScroll !== 0) {
      gsap.to(headingCompo.current, {
        top: "-5rem",
        duration: 0.7,
        ease: "back",
      });
    }
    lastScrollTop = currentScroll;
  });
  useEffect(() => {
    window.addEventListener('scroll', PageHeadingToggling)
    return () => {
      window.removeEventListener('scroll', PageHeadingToggling);
    };
  }, []);
  return (
    <div
      ref={headingCompo}
      className={`sticky top-2 z-[2] rounded-[4rem] lg:w-1/2 w-[--navbarWidth] mx-auto bg-[#141414] grid grid-cols-12 items-center sm:py-[0.6rem] py-[0.4rem] pl-2 pr-4 text-xl border-b border-t border-[#ffffff41]`}
    >
      {/* return btn  */}
      <button
        className={`capitalize col-[1/1] row-start-1 z-[1] inline-flex w-[2.1rem] h-[2.1rem] items-center justify-center cursor-pointer border-l border-r hover:border-t hover:border-b border-[#ffffff41] hover:shadow-[3px_0px_5px_-2px_black] rounded-full dark:text-white transition-all duration-300`}
        onClick={() => {
          window.history.back();
        }}
      >
        <span>
          <svg
            viewBox="0 0 24 24"
            className={`w-[1.3rem] h-[1.3rem] drop-shadow-[0px_0px_2px_currentColor]`}
            color="#ffffff"
            fill="none"
          >
            <path
              d="M4.80823 9.44118L6.77353 7.46899C8.18956 6.04799 8.74462 5.28357 9.51139 5.55381C10.4675 5.89077 10.1528 8.01692 10.1528 8.73471C11.6393 8.73471 13.1848 8.60259 14.6502 8.87787C19.4874 9.78664 21 13.7153 21 18C19.6309 17.0302 18.2632 15.997 16.6177 15.5476C14.5636 14.9865 12.2696 15.2542 10.1528 15.2542C10.1528 15.972 10.4675 18.0982 9.51139 18.4351C8.64251 18.7413 8.18956 17.9409 6.77353 16.5199L4.80823 14.5477C3.60275 13.338 3 12.7332 3 11.9945C3 11.2558 3.60275 10.6509 4.80823 9.44118Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <h3 className="capitalize sm:text-lg text-base col-span-full row-start-1 text-center font-medium">
        {heading}
      </h3>
    </div>
  );
});

const ProjectHasChangedModal = memo(() => {
  const modalContainer = useRef(null);
  const modal = useRef(null);
  const {
    savedTeam,
    setsavedTeam,
    projectHasChangedModalOpen,
    setprojectHasChangedModalOpen,
    setalertMsgsState,
    popupAnim,
  } = useContext(mainContext);

  const savedTeamOpened = structuredClone(
    savedTeam.find((savedteam) => {
      return savedteam.openedInGenerator;
    })
  );

  const savingFunc = ({ type }) => {
    // structuredClone best way to copy nested arr , obj
    const currentTeam = structuredClone(
      JSON.parse(localStorage.getItem("allTeamAndPlayers"))
    );
    const copiedsavedTeam = structuredClone(savedTeam);
    const openedArrIndex = copiedsavedTeam.findIndex(
      (savedteam) => savedteam.openedInGenerator
    ); // finding opened array index

    switch (type) {
      case savedTeamReducerActions.saveChanges:
        {
          if (currentTeam.title.trim().length < 1) { // while no title
            setalertMsgsState(alertMsgs.titleNotSaved);
            popupAnim(alertMsgsTime.get(alertMsgs.titleNotSaved));
          } else {
            copiedsavedTeam[openedArrIndex] = currentTeam; // pushing current allTypeplayersAndTeams copy in copy of savedTeam
            localStorage.setItem("savedTeamOpened", JSON.stringify(currentTeam)); //updating with latest changes
            setsavedTeam(copiedsavedTeam); //setting  savedTeam with updated values
            setalertMsgsState(alertMsgs.savedTeamChangesSaved); // popup msg for changes saved
            popupAnim(alertMsgsTime.get(alertMsgs.savedTeamChangesSaved));
          }
        }
        break;
      case savedTeamReducerActions.discardChanges:
        {
          localStorage.setItem("allTeamAndPlayers", JSON.stringify(savedTeamOpened));
          setalertMsgsState(alertMsgs.changesDiscard);
          copiedsavedTeam[openedArrIndex] = savedTeamOpened;
          setsavedTeam(copiedsavedTeam);
          popupAnim(alertMsgsTime.get(alertMsgs.changesDiscard));
        }
        break;
      default:
        break;
    }
  };

  useGSAP(() => {
    if (projectHasChangedModalOpen) {
      //while opening
      gsap.fromTo(
        modal.current,
        { scale: 0.8 },
        { scale: 1, duration: 0.3, ease: "back" }
      );
    }
  }, [projectHasChangedModalOpen]);

  const { contextSafe } = useGSAP();

  const backClickedHandle = contextSafe(() => {
    gsap.fromTo( modal.current,
      { scale: 1 ,opacity:1},
      { scale: 0.8, opacity:0,duration: 0.5, ease: "back" }
    );
    setTimeout(() => {
      setprojectHasChangedModalOpen(false);
    }, 50);
  });

  return (
    <div ref={modalContainer} onClick={backClickedHandle} className={`fixed inset-0 z-30 grid place-items-center backdrop-blur-[2px]`}>
      <div ref={modal} onClick={(e) => { e.stopPropagation(); }}
        className={`relative sm:max-w-[25rem] max-w-[16.875rem] text-[0.9rem] bg-black px-3 py-4 border border-1 border-[#303030] rounded-[0.35rem]`} >
        {/* ======= close btn starts ===== */}
        <button
          onClick={backClickedHandle}
          className="absolute top-4 right-3 transition-all duration-100 drop-shadow-[0px_0px_5px_white] hover:drop-shadow-[0px_0px_7px_white]">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
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

        <h3 className="capitalize text-lg px-[0.625rem]">save changes ?</h3>
        <div className="p-[0.625rem] w-[90%]">
          <p className="text-[#d1d1d1]">
            would you like to save current changes in
            <span className="whitespace-nowrap text-[0.98em] text-[#a06800]">
              {" "}
              {savedTeamOpened?.title.trim().length < 1 ? "current project" : savedTeamOpened?.title}{" "}
            </span>
            ?
          </p>
        </div>
        <div className="flex items-center text-end mt-[1.50rem] text-[0.9em]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              savingFunc({ type: savedTeamReducerActions.saveChanges });
              setprojectHasChangedModalOpen(false);
            }}
            className="capitalize flex-1 rounded-sm py-[0.45rem] px-2 transition duration-75 ease-out hover:bg-[#f49e0073] bg-[#a0680080] active:scale-[0.96] text-white">
            save
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              savingFunc({ type: savedTeamReducerActions.discardChanges });
              setprojectHasChangedModalOpen(false);
            }}
            className="capitalize flex-1 rounded-sm py-[0.45rem] px-2 transition duration-75 ease-out bg-[#1b1b1b70] text-[#a06800] hover:bg-[#1b1b1b] hover:text-[#ffa600] active:scale-[0.96] ml-2">
            discard
          </button>
        </div>
      </div>
    </div>
  );
})

const Notification = memo(() => {
  const { alertMsgsState, clearNotification } = useContext(mainContext);

  return (
    <>
      {/* notifcation div starts  */}
      <div className={`fixedmsg fixed z-40 hidden w-[85%] max-[21.875rem]:w-[80%] px-[0.9rem] md:max-w-[23.875rem] sm:max-w-[20.875rem] sm:text-[0.90rem] capitalize text-[0.80rem] text-center left-1/2 -translate-x-1/2 rounded-md p-2 border border-1 bg-black border-[gray] tracking-[0.1px]`}>
        <button onClick={() => { clearNotification(); }} className="absolute p-1 top-[-4px] right-[-4px] bg-black transition-all duration-100 rounded-[50%] border border-1 border-[#ffffffab]">
          <svg className="w-[0.75rem] h-[0.75rem]"
            viewBox="0 0 24 24"
            fill="none"><g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z" /></g>
          </svg>
        </button>
        {alertMsgsState}
      </div>
      {/* notifcation div ends  */}
    </>
  );
});
