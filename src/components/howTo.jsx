import { useContext } from "react";
import { mainContext } from "./context/context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


function HowTo() {
  const { PageHeading } = useContext(mainContext);

  useGSAP(() => {
    gsap.utils.toArray(".fade-up").forEach((element) => {
      gsap.fromTo(
        element,
        { y: 100 },
        {
          y: 0,
          duration: 0.8,
          ease: "back",
          scrollTrigger: {
            trigger: element,
            start: "top 105%",
            // markers:true,
            // toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <>
      <PageHeading heading={"how to"} />
      <div className="how-to-page pb-[6rem] sm:w-[80%] mx-auto p-3 mt-[1.375rem] max-sm:text-[0.95rem]">
        {/* what is random team maker starts */}
        <div className="relative rounded-2xl mb-4 bg-[#00000033] border border-1 border-[#696969c2] overflow-hidden fade-up backdrop-blur-[100px]">
          <div className="backdrop-blur-[100px] relative sm:p-8 p-5">
            <h2 className="text-[1.05em] leading-[100%] capitalize">
              1. what is random team maker ?
            </h2>
            <p className="p-3 text-[0.90em]">
              Random Team Maker is a quick, free and easy tool that creates random teams from a list of participants. Simply enter the names and choose the number of teams. It's ideal for games, tournaments, or group activities, ensuring fair team assignments in just a few clicks. This removes the need for manual team selection, which can take a lot of time and may seem unfair.
            </p>
          </div>
        </div>
        {/* what is random team maker ends */}

        {/*  How to Generate Random Team? starts */}
        <div className="relative rounded-2xl mb-4 bg-[#00000033] border border-1 border-[#696969c2] overflow-hidden fade-up backdrop-blur-[100px]">
          <div className="backdrop-blur-[100px] relative sm:p-8 p-5">
            <h2 className="text-[1.05em] leading-[100%] capitalize">
              2. How to Generate Random Team ?
            </h2>
            <div className="grid gap-8 p-3">
              <HowToExamples
                title={`1. Insert participants' names. (min-2)`}
                element={
                  <div className="anim-wrapper max-w-[300px] w-full">
                    <div className="relative bg-black w-full rounded-md inline-block  cursor-context-menu">
                      <input
                        type="text"
                        placeholder="Add player"
                        className="w-full text-[0.96em] bg-transparent px-3 py-2 rounded-md border border-1 border-[#696969d1] pr-[2.5rem] cursor-context-menu"
                        readOnly
                      />
                
                      {/* submit button starts  */}
                      <button className="absolute p-2 right-0 h-full border-l border-[--theme] cursor-context-menu">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[1.375rem] h-[1.375rem]"
                          viewBox="0 0 24 24"
                          color="var(--theme)"
                          fill="none"
                        >
                          <path
                            d="M12 8V16M16 12L8 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                      {/* submit button ends  */}
                    </div>
                  </div>
                }                
              />
              <hr className="border-[#5050507d]" />
              <HowToExamples
                title={`2. Type total teams you want. by default (2).`}
                element={
                  <div className="anim-wrapper max-w-[300px] w-full">
                    <div className="flex bg-black justify-between border border-1 rounded-md border-[#696969d1]  px-3 py-2 w-full cursor-context-menu text-[0.97em]">
                      <span className="capitalize">total teams</span>
                      <input
                        type="number"
                        name="totalTeamsInput"
                        id="totalTeamsInput"
                        value={"2"}
                        className="w-[2.5rem] bg-transparent leading-[normal] text-end focus:border-none text-lg font-medium cursor-context-menu"
                        readOnly
                      />
                    </div>
                  </div>
                }                
              />
              <hr className="border-[#5050507d]" />
              <HowToExamples
                title={`3. Set Project Title (Required).`}
                element={
                  <div className="anim-wrapper max-w-[300px] w-full">
                    <div className=" w-full cursor-context-menu text-[0.96em]">
                      <p className="text-[0.97em]">Project Title</p>
                      <input
                        type="text"
                        placeholder="Fifa team 2026"
                        className="w-full px-3 py-2 mt-[0.125rem] rounded-md border border-1 border-[#696969d1] bg-black cursor-context-menu"
                        readOnly
                      />
                    </div>
                  </div>
                }
                
              />
              <hr className="border-[#5050507d]" />
              <HowToExamples
                title={`4. Set Project Description (optional).`}
                element={
                  <div className="anim-wrapper max-w-[300px] w-full">
                    <div className="w-full cursor-context-menu text-[0.96em]">
                      <p className="text-[0.97em]">Project Description</p>
                      <input
                        placeholder="Description"
                        className="w-full bg-black px-3 py-2 mt-[0.125rem] rounded-md border border-1 border-[#696969d1] cursor-context-menu"
                        readOnly
                      />
                    </div>
                  </div>
                }
                
              />
              <hr className="border-[#5050507d]" />
              <HowToExamples
                title={`5. Click generate button to generate random teams.`}
                element={
                  <div className="anim-wrapper">
                    <button
                      className={`relative border border-1 text-[0.95rem] font-medium  rounded-[0.425rem] overflow-hidden [textShadow:1px_3px_0_black] cursor-context-menu`}
                      readOnly
                    >
                      <div className="gereratorBG absolute inset-0 z-0 bg-[linear-gradient(to_bottom,_black_77%,_var(--theme))]"></div>
                      <div className="backdrop-blur-[10px] flex gap-2 items-center px-4 py-2">
                        <span>Generate</span>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg"
                            className="w-[1.125rem] h-[1.125rem] drop-shadow-[1px_3px_0_black]"
                            viewBox="0 0 24 24"
                            color="var(--theme)"
                            fill="none"
                          >
                            <path
                              d="M14 12.6483L16.3708 10.2775C16.6636 9.98469 16.81 9.83827 16.8883 9.68032C17.0372 9.3798 17.0372 9.02696 16.8883 8.72644C16.81 8.56849 16.6636 8.42207 16.3708 8.12923C16.0779 7.83638 15.9315 7.68996 15.7736 7.61169C15.473 7.46277 15.1202 7.46277 14.8197 7.61169C14.6617 7.68996 14.5153 7.83638 14.2225 8.12923L11.8517 10.5M14 12.6483L5.77754 20.8708C5.4847 21.1636 5.33827 21.31 5.18032 21.3883C4.8798 21.5372 4.52696 21.5372 4.22644 21.3883C4.06849 21.31 3.92207 21.1636 3.62923 20.8708C3.33639 20.5779 3.18996 20.4315 3.11169 20.2736C2.96277 19.973 2.96277 19.6202 3.11169 19.3197C3.18996 19.1617 3.33639 19.0153 3.62923 18.7225L11.8517 10.5M14 12.6483L11.8517 10.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19.5 2.5L19.3895 2.79873C19.2445 3.19044 19.172 3.38629 19.0292 3.52917C18.8863 3.67204 18.6904 3.74452 18.2987 3.88946L18 4L18.2987 4.11054C18.6904 4.25548 18.8863 4.32796 19.0292 4.47083C19.172 4.61371 19.2445 4.80956 19.3895 5.20127L19.5 5.5L19.6105 5.20127C19.7555 4.80956 19.828 4.61371 19.9708 4.47083C20.1137 4.32796 20.3096 4.25548 20.7013 4.11054L21 4L20.7013 3.88946C20.3096 3.74452 20.1137 3.67204 19.9708 3.52917C19.828 3.38629 19.7555 3.19044 19.6105 2.79873L19.5 2.5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19.5 12.5L19.3895 12.7987C19.2445 13.1904 19.172 13.3863 19.0292 13.5292C18.8863 13.672 18.6904 13.7445 18.2987 13.8895L18 14L18.2987 14.1105C18.6904 14.2555 18.8863 14.328 19.0292 14.4708C19.172 14.6137 19.2445 14.8096 19.3895 15.2013L19.5 15.5L19.6105 15.2013C19.7555 14.8096 19.828 14.6137 19.9708 14.4708C20.1137 14.328 20.3096 14.2555 20.7013 14.1105L21 14L20.7013 13.8895C20.3096 13.7445 20.1137 13.672 19.9708 13.5292C19.828 13.3863 19.7555 13.1904 19.6105 12.7987L19.5 12.5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10.5 2.5L10.3895 2.79873C10.2445 3.19044 10.172 3.38629 10.0292 3.52917C9.88629 3.67204 9.69044 3.74452 9.29873 3.88946L9 4L9.29873 4.11054C9.69044 4.25548 9.88629 4.32796 10.0292 4.47083C10.172 4.61371 10.2445 4.80956 10.3895 5.20127L10.5 5.5L10.6105 5.20127C10.7555 4.80956 10.828 4.61371 10.9708 4.47083C11.1137 4.32796 11.3096 4.25548 11.7013 4.11054L12 4L11.7013 3.88946C11.3096 3.74452 11.1137 3.67204 10.9708 3.52917C10.828 3.38629 10.7555 3.19044 10.6105 2.79873L10.5 2.5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </button>
                  </div>
                }                
              />
              <hr className="border-[#5050507d]" />
            </div>
            <h2 className="text-[1.05em] leading-[100%] capitalize sm:mt-8 mt-5">
              Signs & Their Meanings
            </h2>
            <div className="grid gap-8 p-3">
              <HowToExamples
                title={<div className="sm:w-5/6">
                  <div className="mb-[10px]">
                    <span className="text-[1.025em] leading-[100%] capitalize">Sign : </span>
                    <span>Players Not Divided into Teams.</span>
                  </div>
                  <div className="mb-[10px]">
                    <span className="text-[1.025em] leading-[100%] capitalize">meaning : </span>
                    <span className="sm:text-center">This sign indicates that players are still in the initial phase and have not yet been divided into teams.</span>
                  </div>
                </div>}
                element={
                  <div className="anim-wrapper max-w-[300px] w-full">
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-[10px]">
                        <span className="inline-block leading-[100%] capitalize">example :</span>
                        <span className="inine-bloack">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m12 19.5l5-5m-5 5l-5-5m5 5V13m0-3.5c0-1.667-1-5-5-5" />
                          </svg>
                        </span>
                      </div>
                      <div className="flex justify-between w-full cursor-context-menu">
                        <span className="capitalize">total teams</span>
                        <input
                          type="number"
                          name="totalTeamsInput"
                          id="totalTeamsInput"
                          value={"2"}
                          className="w-[2.5rem] text-end bg-transparent focus:border-none text-lg font-medium line-through cursor-context-menu"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                }                
                 />
              <hr className="border-[#5050507d]" />
              <HowToExamples
                title={<div className="sm:w-5/6">
                  <div className="mb-[10px]">
                    <span className="text-[1.025em] leading-[100%] capitalize">Sign : </span>
                    <span>Teams Length Changed - Recalculation Needed.</span>
                  </div>
                  <div className="mb-[10px]">
                    <span className="text-[1.025em] leading-[100%] capitalize">meaning : </span>
                    <span className="sm:text-center"> This sign means that the teams need to be recalculated because the team size has changed.</span>
                  </div>
                </div>}
                element={
                  <div className="anim-wrapper">
                    <div className="flex items-center gap-2 mb-[10px]">
                      <span className="inline-block leading-[100%] capitalize">examples :</span>
                      <span className="inine-bloack"><svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m12 19.5l5-5m-5 5l-5-5m5 5V13m0-3.5c0-1.667-1-5-5-5" /></svg></span>
                    </div>
                    <div className="max-w-[300px] flex flex-col justify-center items-center gap-5">
                      <div className="topdiv sm:text-base text-sm w-full flex justify-between sm:gap-[1.5rem] gap-[1rem] px-4 py-3 overflow-hidden border-b border-t border-[#ffffff41] bg-[#141414] rounded-[4rem] cursor-context-menu">
                        <div className="whitespace-nowrap">
                          <span className="font-medium text-[--theme] mr-[2px]">
                            {2}{" "}
                          </span>
                          <span className="capitalize font-light text-[0.95em]">
                            current players
                          </span>
                        </div>
                        <div
                          className="whitespace-nowrap"
                        >
                          <span className={`font-medium fo text-[--theme] mr-[2px] line-through`}>
                            {2}{" "}
                          </span>
                          <span className={`capitalize font-light text-[0.95em] line-through`}>
                            total teams
                          </span>
                        </div>
                      </div>
                      {/* generate button starts */}
                      <button className={`relative flex gap-2 items-center px-4 py-2 bg-white border border-1 text-[0.95rem] rounded-[0.425rem] overflow-hidden text-[red] [textShadow:1px_2px_0_#bdbdbd] border-[red] font-semibold cursor-context-menu`}>
                        <span>
                          Recalculate Teams
                        </span>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg"
                            className={`w-[1.125rem] h-[1.125rem] drop-shadow-[1px_3px_0_#bdbdbd]`}
                            viewBox="0 0 24 24"
                            color={'red'}
                            fill="none"
                          >
                            <path
                              d="M14 12.6483L16.3708 10.2775C16.6636 9.98469 16.81 9.83827 16.8883 9.68032C17.0372 9.3798 17.0372 9.02696 16.8883 8.72644C16.81 8.56849 16.6636 8.42207 16.3708 8.12923C16.0779 7.83638 15.9315 7.68996 15.7736 7.61169C15.473 7.46277 15.1202 7.46277 14.8197 7.61169C14.6617 7.68996 14.5153 7.83638 14.2225 8.12923L11.8517 10.5M14 12.6483L5.77754 20.8708C5.4847 21.1636 5.33827 21.31 5.18032 21.3883C4.8798 21.5372 4.52696 21.5372 4.22644 21.3883C4.06849 21.31 3.92207 21.1636 3.62923 20.8708C3.33639 20.5779 3.18996 20.4315 3.11169 20.2736C2.96277 19.973 2.96277 19.6202 3.11169 19.3197C3.18996 19.1617 3.33639 19.0153 3.62923 18.7225L11.8517 10.5M14 12.6483L11.8517 10.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19.5 2.5L19.3895 2.79873C19.2445 3.19044 19.172 3.38629 19.0292 3.52917C18.8863 3.67204 18.6904 3.74452 18.2987 3.88946L18 4L18.2987 4.11054C18.6904 4.25548 18.8863 4.32796 19.0292 4.47083C19.172 4.61371 19.2445 4.80956 19.3895 5.20127L19.5 5.5L19.6105 5.20127C19.7555 4.80956 19.828 4.61371 19.9708 4.47083C20.1137 4.32796 20.3096 4.25548 20.7013 4.11054L21 4L20.7013 3.88946C20.3096 3.74452 20.1137 3.67204 19.9708 3.52917C19.828 3.38629 19.7555 3.19044 19.6105 2.79873L19.5 2.5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19.5 12.5L19.3895 12.7987C19.2445 13.1904 19.172 13.3863 19.0292 13.5292C18.8863 13.672 18.6904 13.7445 18.2987 13.8895L18 14L18.2987 14.1105C18.6904 14.2555 18.8863 14.328 19.0292 14.4708C19.172 14.6137 19.2445 14.8096 19.3895 15.2013L19.5 15.5L19.6105 15.2013C19.7555 14.8096 19.828 14.6137 19.9708 14.4708C20.1137 14.328 20.3096 14.2555 20.7013 14.1105L21 14L20.7013 13.8895C20.3096 13.7445 20.1137 13.672 19.9708 13.5292C19.828 13.3863 19.7555 13.1904 19.6105 12.7987L19.5 12.5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10.5 2.5L10.3895 2.79873C10.2445 3.19044 10.172 3.38629 10.0292 3.52917C9.88629 3.67204 9.69044 3.74452 9.29873 3.88946L9 4L9.29873 4.11054C9.69044 4.25548 9.88629 4.32796 10.0292 4.47083C10.172 4.61371 10.2445 4.80956 10.3895 5.20127L10.5 5.5L10.6105 5.20127C10.7555 4.80956 10.828 4.61371 10.9708 4.47083C11.1137 4.32796 11.3096 4.25548 11.7013 4.11054L12 4L11.7013 3.88946C11.3096 3.74452 11.1137 3.67204 10.9708 3.52917C10.828 3.38629 10.7555 3.19044 10.6105 2.79873L10.5 2.5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        {/* </div> */}
                      </button>
                    </div>
                  </div>
                } />
            </div>
          </div>
        </div>
        {/*  How to Generate Random Team? ends */}

        {/* save your Projects locally in the browser starts */}
        <div className="relative rounded-2xl mb-4 bg-[#00000033] border border-1 border-[#696969c2] overflow-hidden fade-up backdrop-blur-[100px]">
          <div className="backdrop-blur-[100px] relative sm:p-8 p-5">
            <h2 className="text-[1.05em] leading-[100%] capitalize">
              3. save your Projects locally in the browser.
            </h2>
            <div className="grid gap-8 p-3">
              <HowToExamples
                title={`1. Click this save icon to save your Projects in your browser's storage. So, you can still access the same data the next time when you visit again at the same browser .`}
                element={
                  <div className="anim-wrapper">
                  <button
                    className={` bg-[#0a0a0a] border border-1 border-[#303030] p-3 rounded-[50%] grid justify-center items-center cursor-default `}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="sm:w-[1.275rem] w-[1rem] drop-shadow-[0px_0px_3px_currentColor] h-[1rem] sm:h-[1.275rem] text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M11 2C7.22876 2 5.34315 2 4.17157 3.12874C3 4.25748 3 6.07416 3 9.70753V17.9808C3 20.2867 3 21.4396 3.77285 21.8523C5.26947 22.6514 8.0768 19.9852 9.41 19.1824C10.1832 18.7168 10.5698 18.484 11 18.484C11.4302 18.484 11.8168 18.7168 12.59 19.1824C13.9232 19.9852 16.7305 22.6514 18.2272 21.8523C19 21.4396 19 20.2867 19 17.9808V12.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.5 7.00005H10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M17 10L17 2M13 6H21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  </div>
                }
              />
              <hr className="border-[#5050507d]" />
              <HowToExamples
                title={`2. Click here in the navbar to see saved Projects.`}
                element={
                  <div className="anim-wrapper">
                  <div className="inline-block bg-[#141414] rounded-[0.75rem] text-[0.70rem] sm:text-[0.75rem] lg:text-[0.85rem] font-normal capitalize text-nowrap py-2 px-2">
                    <p className="flex justify-center drop-shadow-[2px_2px_0px_black]">
                      <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-[1.19rem] h-[1.19rem]"
                        color="inherit"
                        fill="none"
                      >
                        <path
                          d="M3 17.9808V12.7075C3 9.07416 3 7.25748 4.09835 6.12874C5.1967 5 6.96447 5 10.5 5C14.0355 5 15.8033 5 16.9017 6.12874C18 7.25748 18 9.07416 18 12.7075V17.9808C18 20.2867 18 21.4396 17.2755 21.8523C15.8724 22.6514 13.2405 19.9852 11.9906 19.1824C11.2657 18.7168 10.9033 18.484 10.5 18.484C10.0967 18.484 9.73425 18.7168 9.00938 19.1824C7.7595 19.9852 5.12763 22.6514 3.72454 21.8523C3 21.4396 3 20.2867 3 17.9808Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 2H11C15.714 2 18.0711 2 19.5355 3.46447C21 4.92893 21 7.28595 21 12V18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </p>
                    <p className="capitalize text-nowrap drop-shadow-[2px_2px_0px_black]">saved</p>
                  </div>
                  </div>
                }
              />
            </div>
          </div>
          {/* save team button ends  */}
        </div>
        {/* save your Projects locally in the browser ends */}

        {/* Why is this random team maker useful? starts  */}
        <div className="relative rounded-2xl mb-4 bg-[#00000033] border border-1 border-[#696969c2] overflow-hidden fade-up backdrop-blur-[100px]">
          <div className="backdrop-blur-[100px] relative sm:p-8 p-5">
            <h2 className="text-[1.05em] leading-[100%] capitalize">
              4. Why is this random team maker useful?.
            </h2>
            <p className="sm:text-[0.95em] text-[0.93em] py-2">
              Our efficient <span className="Bricolage font-normal">random team maker</span> simplifies group formation, saving
              you time and effort with just a few clicks.
            </p>
            <p className="sm:text-[0.92em] text-[0.90em] py-2">
              Use Cases for Our <span className="Bricolage font-normal">Random Team maker</span> :
            </p>
            <div className="p-1 sm:text-[0.9em] text-[0.88em]">
              {[
                "fair and random teams for sports tournaments.",
                "Create diverse and balanced teams for competitions or group activities.",
                "Form interactive learning groups for classrooms and workshops.",
                "Assign players to teams for card games, video games, or e-sports tournaments.",
                "Distribute participants randomly for contests, quizzes, or office challenges.",
                "Divide students into teams for school projects, debates, or study sessions.",
              ].map((para, ind) => (
                <div key={ind} className="p-1 flex gap-2">
                  <span className="flex-grow-0">
                    👉
                  </span>
                  <p>{para}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Why is this random team maker useful? ends  */}
      </div>
    </>
  );
}

export default HowTo;

function HowToExamples({ element, title }) {
  useGSAP(() => {


      gsap.utils.toArray(".example-elm > *").forEach((element) => {
        gsap.fromTo(
          element,
          { rotateX: "90deg" },
          {
            rotateX: "0deg",
            duration: 1.4,
            ease: "back",
            transformOrigin: "50% 100%",
            scrollTrigger: {
              trigger: element,
              start: "top 83%",
              // end: "top 83%",
              // scrub: 2,
              toggleActions: "play none none reverse",
              // markers: true
            },
          });
      })
  }, []);

  return (
    <div className="grid sm:grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] items-center gap-5">
      <div className="flex justify-start">
        <div className="text-[0.9em]">{title}</div>
      </div>
      <div className="example-elm flex justify-start">{element}</div>
    </div>
  );
}
