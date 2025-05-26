import React, { useContext, useRef, useMemo, useState, useEffect, lazy, Suspense } from 'react'
import { mainContext } from '../context/context'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ayushimage from "./assets/dev.webp"
import Spider from "./assets/spider.svg";

const emogies = [
  (<svg xmlns="http://www.w3.org/2000/svg" className='md:w-8 w-[1.2rem] md:h-8 h-[1.2rem]' viewBox="0 0 36 36"><path fill="#55ACEE" d="m18 8l-7-8H0l14 17l11.521-4.75z" /><path fill="#3B88C3" d="m25 0l-7 8l5.39 7.312l1.227-1.489L36 0z" /><path fill="#FFAC33" d="M23.205 16.026c.08-.217.131-.448.131-.693a2 2 0 0 0-2-2h-6.667a2 2 0 0 0-2 2c0 .245.05.476.131.693c-3.258 1.826-5.464 5.307-5.464 9.307C7.335 31.224 12.111 36 18.002 36s10.667-4.776 10.667-10.667c0-4-2.206-7.481-5.464-9.307" /><path fill="#9E5200" d="M19.404 18.6h-1.721l-2.73 2.132a.53.53 0 0 0-.112.28v1.178c0 .186.15.354.337.354h1.795v8.414c0 .188.15.355.355.355h2.076c.186 0 .336-.168.336-.355V18.954c0-.186-.149-.354-.336-.354" /></svg>),
  (<svg xmlns="http://www.w3.org/2000/svg" className='md:w-8 w-[1.2rem] md:h-8 h-[1.2rem]' viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#DD2E44" /><circle cx="18" cy="18" r="13.5" fill="#FFF" /><circle cx="18" cy="18" r="10" fill="#DD2E44" /><circle cx="18" cy="18" r="6" fill="#FFF" /><circle cx="18" cy="18" r="3" fill="#DD2E44" /><path d="m18.24 18.282l13.144 11.754s-2.647 3.376-7.89 5.109L17.579 18.42z" opacity=".2" /><path fill="#FFAC33" d="M18.294 19a.994.994 0 0 1-.704-1.699l.563-.563a.995.995 0 0 1 1.408 1.407l-.564.563a1 1 0 0 1-.703.292" /><path fill="#55ACEE" d="M24.016 6.981c-.403 2.079 0 4.691 0 4.691l7.054-7.388c.291-1.454-.528-3.932-1.718-4.238s-4.079.803-5.336 6.935m5.003 5.003c-2.079.403-4.691 0-4.691 0l7.388-7.054c1.454-.291 3.932.528 4.238 1.718s-.803 4.079-6.935 5.336" /><path fill="#3A87C2" d="M32.798 4.485L21.176 17.587c-.362.362-1.673.882-2.51.046s-.419-2.08-.057-2.443L31.815 3.501s.676-.635 1.159-.152s-.176 1.136-.176 1.136" /></svg>),
  (<svg xmlns="http://www.w3.org/2000/svg" className='md:w-8 w-[1.2rem] md:h-8 h-[1.2rem]' viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#F4900C" /><path fill="#231F20" d="M36 17h-8.981c.188-5.506 1.943-9.295 4.784-10.546a18 18 0 0 0-1.428-1.504c-2.83 1.578-5.145 5.273-5.354 12.049H19V0h-2v17h-6.021c-.208-6.776-2.523-10.471-5.353-12.049a18 18 0 0 0-1.428 1.503C7.039 7.705 8.793 11.494 8.981 17H0v2h8.981c-.188 5.506-1.942 9.295-4.783 10.546c.445.531.926 1.027 1.428 1.504c2.831-1.578 5.145-5.273 5.353-12.05H17v17h2V19h6.021c.209 6.776 2.523 10.471 5.354 12.05c.502-.476.984-.973 1.428-1.504c-2.841-1.251-4.595-5.04-4.784-10.546H36z" /></svg>)
  , (<svg xmlns="http://www.w3.org/2000/svg" className='md:w-8 w-[1.2rem] md:h-8 h-[1.2rem]' viewBox="0 0 36 36"><path fill="#CCD6DD" d="m24 29l5-5L6 1H1v5z" /><path fill="#9AAAB4" d="M1 1v5l23 23l2.5-2.5z" /><path fill="#D99E82" d="M33.424 32.808c.284-.284.458-.626.531-.968l-5.242-6.195l-.701-.702c-.564-.564-1.57-.473-2.248.205l-.614.612c-.677.677-.768 1.683-.204 2.247l.741.741l6.15 5.205c.345-.072.688-.247.974-.532z" /><path fill="#BF6952" d="M33.424 32.808c.284-.284.458-.626.531-.968l-1.342-1.586l-.737 3.684c.331-.077.661-.243.935-.518zm-3.31-5.506l-.888 4.441l1.26 1.066l.82-4.1zm-1.401-1.657l-.701-.702a1.2 1.2 0 0 0-.326-.224l-.978 4.892l1.26 1.066l.957-4.783zm-2.401-.888a2 2 0 0 0-.548.392l-.614.611a2 2 0 0 0-.511.86c-.142.51-.046 1.035.307 1.387l.596.596zq0-.002 0 0" /><circle cx="33.25" cy="33.25" r="2.75" fill="#8A4633" /><path fill="#FFAC33" d="M29.626 22.324a1.033 1.033 0 0 1 0 1.462l-6.092 6.092a1.033 1.033 0 1 1-1.462-1.462l6.092-6.092a1.033 1.033 0 0 1 1.462 0" /><circle cx="22.072" cy="29.877" r="1.75" fill="#FFAC33" /><circle cx="29.626" cy="22.323" r="1.75" fill="#FFAC33" /><circle cx="22.072" cy="29.877" r="1" fill="#FFCC4D" /><circle cx="29.626" cy="22.323" r="1" fill="#FFCC4D" /><path fill="#FFAC33" d="M33.903 29.342a.76.76 0 0 1 0 1.078l-3.476 3.475a.762.762 0 1 1-1.078-1.078l3.476-3.475a.76.76 0 0 1 1.078 0" /><path fill="#CCD6DD" d="m12 29l-5-5L30 1h5v5z" /><path fill="#9AAAB4" d="M35 1v5L12 29l-2.5-2.5z" /><path fill="#D99E82" d="M2.576 32.808a1.95 1.95 0 0 1-.531-.968l5.242-6.195l.701-.702c.564-.564 1.57-.473 2.248.205l.613.612c.677.677.768 1.683.204 2.247l-.741.741l-6.15 5.205a1.95 1.95 0 0 1-.974-.532z" /><path fill="#BF6952" d="M2.576 32.808a1.95 1.95 0 0 1-.531-.968l1.342-1.586l.737 3.684a1.93 1.93 0 0 1-.935-.518zm3.31-5.506l.888 4.441l-1.26 1.066l-.82-4.1zm1.401-1.657l.701-.702a1.2 1.2 0 0 1 .326-.224l.978 4.892l-1.26 1.066l-.957-4.783zm2.401-.888c.195.095.382.225.548.392l.613.612c.254.254.425.554.511.86c.142.51.046 1.035-.307 1.387l-.596.596zq0-.002 0 0" /><circle cx="2.75" cy="33.25" r="2.75" fill="#8A4633" /><path fill="#FFAC33" d="M6.374 22.324a1.033 1.033 0 0 0 0 1.462l6.092 6.092a1.033 1.033 0 1 0 1.462-1.462l-6.092-6.092a1.033 1.033 0 0 0-1.462 0" /><circle cx="13.928" cy="29.877" r="1.75" fill="#FFAC33" /><circle cx="6.374" cy="22.323" r="1.75" fill="#FFAC33" /><circle cx="13.928" cy="29.877" r="1" fill="#FFCC4D" /><circle cx="6.374" cy="22.323" r="1" fill="#FFCC4D" /><path fill="#FFAC33" d="M2.097 29.342a.76.76 0 0 0 0 1.078l3.476 3.475a.762.762 0 1 0 1.078-1.078l-3.476-3.475a.76.76 0 0 0-1.078 0" /></svg>),
  (<svg xmlns="http://www.w3.org/2000/svg" className='md:w-8 w-[1.2rem] md:h-8 h-[1.2rem]' viewBox="0 0 36 36"><path fill="#E1E8ED" d="M34 6c-2-3-9-4-16-4S3 3 2 5C.093 8.814 1 25 1 26s5 1 5 1V14l1-2v23s3 1 11 1s11-1 11-1V12l1 2v13s5 0 5-1s1.365-16.452-1-20" /><path fill="#99AAB5" d="M7 27H6V14c0-1 1-2 1-2zm23 0h-1V12s1 1 1 2z" /><path fill="#66757F" d="m11.781 2l6.281 11.344L24 2L17.891.75z" /><path fill="#CCD6DD" d="M12 .625s2.25-.547 6-.547s6 .547 6 .547V3s-1.625-1-6-1s-6 1-6 1z" /><path fill="#99AAB5" d="M7 35S24.748 3.341 24.748 2.362c0-1-.748-1.737-.748-1.737L7 32z" /><path fill="#99AAB5" d="M17.818 14.722s-6.692-11.381-6.692-12.36c0-1 .874-1.737.874-1.737l6.761 12.573z" /><path fill="#292F33" d="M7 22s5 2 11 2s11-2 11-2v3s-4 2-11 2s-11-2-11-2z" /><path fill="#292F33" d="M21 24s-2-1-3-1s-3 1-3 1s-1 0-1 1s1 2 1 2s2 1 3 1s3-1 3-1s1-1 1-2s-1-1-1-1" /><path fill="#292F33" d="m12 33l3 1s1-5 3-7l-2-3s-3 4-4 9m12 0l-3 1s-1-5-3-7l2-3s3 4 4 9" /></svg>), (<svg xmlns="http://www.w3.org/2000/svg" className='md:w-8 w-[1.2rem] md:h-8 h-[1.2rem]' viewBox="0 0 36 36"><path fill="#66757F" d="M3.923 22.923a1 1 0 1 1-1.847-.769L6.693 9.616a1 1 0 1 1 1.846.769z" /><path fill="#66757F" d="M13.923 22.154a1 1 0 0 1-1.847.769L7.461 10.385a1 1 0 0 1 1.847-.769zm10.001.769a1.001 1.001 0 0 1-1.847-.769l4.616-12.539a1 1 0 0 1 1.846.77z" /><path fill="#66757F" d="M33.923 22.154a1 1 0 1 1-1.847.769l-4.615-12.538a1 1 0 1 1 1.846-.769z" /><path fill="#FFAC33" d="M14.857 22H1.143C.512 22 0 22.511 0 23.143c0 2.524 3.582 4.571 8 4.571s8-2.047 8-4.571c0-.632-.512-1.143-1.143-1.143M24 34H12a1 1 0 0 1-1-1c0-2.209 3.134-4 7-4s7 1.791 7 4a1 1 0 0 1-1 1m10.857-12H21.143c-.632 0-1.143.511-1.143 1.143c0 2.524 3.581 4.571 8 4.571s8-2.047 8-4.571c0-.632-.511-1.143-1.143-1.143" /><path fill="#FFAC33" d="M19 3a1 1 0 1 0-2 0v27a1 1 0 1 0 2 0z" /><circle cx="18" cy="4" r="2" fill="#FFAC33" /><circle cx="8" cy="10" r="2" fill="#FFAC33" /><circle cx="28" cy="10" r="2" fill="#FFAC33" /><path fill="#FFAC33" d="M28 10c0 1.104 0 0-10 0S8 11.104 8 10s3-4 10-4s10 2.896 10 4" /></svg>), (<svg xmlns="http://www.w3.org/2000/svg" className='md:w-8 w-[1.2rem] md:h-8 h-[1.2rem]' viewBox="0 0 36 36"><path fill="#A0041E" d="m1 17l8-7l16 1l1 16l-7 8s.001-5.999-6-12s-12-6-12-6" /><path fill="#FFAC33" d="M.973 35s-.036-7.979 2.985-11S15 21.187 15 21.187S14.999 29 11.999 32S.973 35 .973 35" /><circle cx="8.999" cy="27" r="4" fill="#FFCC4D" /><path fill="#55ACEE" d="M35.999 0s-10 0-22 10c-6 5-6 14-4 16s11 2 16-4c10-12 10-22 10-22" /><path d="M26.999 5a4 4 0 0 0-3.641 2.36A4 4 0 0 1 24.999 7a4 4 0 0 1 4 4c0 .586-.133 1.139-.359 1.64A3.99 3.99 0 0 0 30.999 9a4 4 0 0 0-4-4" /><path fill="#A0041E" d="M8 28s0-4 1-5s13.001-10.999 14-10s-9.001 13-10.001 14S8 28 8 28" /></svg>), (<svg xmlns="http://www.w3.org/2000/svg" className='md:w-8 w-[1.2rem] md:h-8 h-[1.2rem]' viewBox="0 0 36 36"><path fill="#F4900C" d="m33.629 16.565l-.092 1.608l-.041.814c-.02.265-.092.529-.142.794l-.285 1.598c-.153.519-.326 1.028-.499 1.547c-.743 2.025-1.791 4.029-3.246 5.698a23.5 23.5 0 0 1-5.006 4.396c-1.903 1.221-3.867 2.167-6.126 2.859l-.385.121l-.427-.142c-1.526-.499-2.798-1.099-4.101-1.832c-1.272-.722-2.503-1.536-3.612-2.524l-.835-.732l-.784-.794c-.529-.519-.987-1.109-1.455-1.689a20.5 20.5 0 0 1-2.3-3.826c-.611-1.353-1.109-2.768-1.404-4.213c-.071-.366-.183-.722-.224-1.089l-.132-1.089c-.071-.733-.193-1.435-.153-2.279c.061-1.618.56-3.175 1.313-4.508a14 14 0 0 1 2.849-3.48l3.46-3.053l-1.669 4.174c-.57 1.435-.845 3.134-.193 4.202c.315.529.885.814 1.587.824c.733 0 1.475-.203 1.872-.692c.407-.478.438-1.231.183-1.954c-.326-.753-.631-1.77-.59-2.696c0-.946.275-1.893.753-2.717c.488-.824 1.19-1.496 1.984-1.994l1.028-.641l-.285 1.19c-.295 1.221-.081 2.503.733 3.287c.804.784 2.076 1.058 3.103.794c1.028-.275 1.72-1.109 1.76-2.025c.081-.946-.417-2.015-1.058-3.002L16.932 0l3.887 1.628c1.089.448 2.167.956 3.185 1.669c1.007.712 2.004 1.608 2.686 2.788c.712 1.16 1.007 2.584.977 3.836c0 .315-.02.621-.041.926c-.041.305-.051.55-.122.936c-.122.682-.305 1.19-.458 1.709c-.315.997-.519 2.025-.295 2.564c.132.509 1.292.906 2.147.794c.916-.092 1.77-.733 2.371-1.577c.6-.855.916-1.923 1.079-2.981l.132-.834l.295.763c.549 1.383.864 2.859.854 4.344" /><path fill="#FFCC4D" d="M33.146 16.503c-.001-1.463.068-2.222-.507-3.52c-.393 3.824-3.228 5.144-5.792 4.23c-2.402-.857-.783-4.198-.664-5.793c.202-2.703-.01-5.796-5.919-8.369c2.455 3.903.284 6.327-1.993 6.475c-2.526.164-4.84-1.804-3.986-4.997c-2.765 1.693-2.846 4.543-1.993 6.386c.89 1.921-.036 3.518-2.206 3.695c-2.426.199-3.773-2.158-2.531-5.913c-2.151 2.104-3.676 4.837-3.449 7.805C5.142 30.035 17.841 33.93 17.841 33.93s15.319-3.757 15.305-17.427" /><path fill="#DD2E44" d="M30.935 19.489a7.234 7.234 0 0 0-7.233-7.234a7.22 7.22 0 0 0-5.878 3.027a7.22 7.22 0 0 0-5.877-3.027a7.234 7.234 0 0 0-7.234 7.234c0 .566.072 1.114.195 1.643c1.004 6.24 7.943 12.824 12.915 14.632c4.972-1.808 11.911-8.391 12.914-14.631a7 7 0 0 0 .198-1.644" /><path fill="#FFCC4D" d="M24.312 31.553s1.426-2.769 1.319-5.645c-.038-1.024-.327-2.019-.736-2.958c-.958-2.196-2.806-7.706 1.147-10.661c0 0-.755 1.269-.085 3.581c.265.915.761 1.741 1.35 2.49c1.36 1.732 4.219 6.501-.484 10.948zm-7.659 3.728s-1.581-1.515-2.421-3.652c-.299-.761-.406-1.58-.406-2.398c-.001-1.911-.409-6.529-4.242-7.427c0 0 .957.687 1.205 2.591c.098.753-.001 1.516-.192 2.251c-.441 1.701-.972 5.909 3.886 7.659z" /></svg>),
  (<svg xmlns="http://www.w3.org/2000/svg" className='md:w-8 w-[1.2rem] md:h-8 h-[1.2rem]' viewBox="0 0 36 36"><path fill="#DD2E44" d="M11.626 7.488a1.4 1.4 0 0 0-.268.395l-.008-.008L.134 33.141l.011.011c-.208.403.14 1.223.853 1.937c.713.713 1.533 1.061 1.936.853l.01.01L28.21 24.735l-.008-.009c.147-.07.282-.155.395-.269c1.562-1.562-.971-6.627-5.656-11.313c-4.687-4.686-9.752-7.218-11.315-5.656" /><path fill="#EA596E" d="M13 12L.416 32.506l-.282.635l.011.011c-.208.403.14 1.223.853 1.937c.232.232.473.408.709.557L17 17z" /><path fill="#A0041E" d="M23.012 13.066c4.67 4.672 7.263 9.652 5.789 11.124c-1.473 1.474-6.453-1.118-11.126-5.788c-4.671-4.672-7.263-9.654-5.79-11.127c1.474-1.473 6.454 1.119 11.127 5.791" /><path fill="#AA8DD8" d="M18.59 13.609a1 1 0 0 1-.734.215c-.868-.094-1.598-.396-2.109-.873c-.541-.505-.808-1.183-.735-1.862c.128-1.192 1.324-2.286 3.363-2.066c.793.085 1.147-.17 1.159-.292c.014-.121-.277-.446-1.07-.532c-.868-.094-1.598-.396-2.11-.873c-.541-.505-.809-1.183-.735-1.862c.13-1.192 1.325-2.286 3.362-2.065c.578.062.883-.057 1.012-.134c.103-.063.144-.123.148-.158c.012-.121-.275-.446-1.07-.532a1 1 0 0 1-.886-1.102a.997.997 0 0 1 1.101-.886c2.037.219 2.973 1.542 2.844 2.735c-.13 1.194-1.325 2.286-3.364 2.067c-.578-.063-.88.057-1.01.134c-.103.062-.145.123-.149.157c-.013.122.276.446 1.071.532c2.037.22 2.973 1.542 2.844 2.735s-1.324 2.286-3.362 2.065c-.578-.062-.882.058-1.012.134c-.104.064-.144.124-.148.158c-.013.121.276.446 1.07.532a1 1 0 0 1 .52 1.773" /><path fill="#77B255" d="M30.661 22.857c1.973-.557 3.334.323 3.658 1.478c.324 1.154-.378 2.615-2.35 3.17c-.77.216-1.001.584-.97.701c.034.118.425.312 1.193.095c1.972-.555 3.333.325 3.657 1.479c.326 1.155-.378 2.614-2.351 3.17c-.769.216-1.001.585-.967.702s.423.311 1.192.095a1 1 0 1 1 .54 1.925c-1.971.555-3.333-.323-3.659-1.479c-.324-1.154.379-2.613 2.353-3.169c.77-.217 1.001-.584.967-.702c-.032-.117-.422-.312-1.19-.096c-1.974.556-3.334-.322-3.659-1.479c-.325-1.154.378-2.613 2.351-3.17c.768-.215.999-.585.967-.701c-.034-.118-.423-.312-1.192-.096a1 1 0 1 1-.54-1.923" /><path fill="#AA8DD8" d="M23.001 20.16a1.001 1.001 0 0 1-.626-1.781c.218-.175 5.418-4.259 12.767-3.208a1 1 0 1 1-.283 1.979c-6.493-.922-11.187 2.754-11.233 2.791a1 1 0 0 1-.625.219" /><path fill="#77B255" d="M5.754 16a1 1 0 0 1-.958-1.287c1.133-3.773 2.16-9.794.898-11.364c-.141-.178-.354-.353-.842-.316c-.938.072-.849 2.051-.848 2.071a1 1 0 1 1-1.994.149c-.103-1.379.326-4.035 2.692-4.214c1.056-.08 1.933.287 2.552 1.057c2.371 2.951-.036 11.506-.542 13.192a1 1 0 0 1-.958.712" /><circle cx="25.5" cy="9.5" r="1.5" fill="#5C913B" /><circle cx="2" cy="18" r="2" fill="#9266CC" /><circle cx="32.5" cy="19.5" r="1.5" fill="#5C913B" /><circle cx="23.5" cy="31.5" r="1.5" fill="#5C913B" /><circle cx="28" cy="4" r="2" fill="#FFCC4D" /><circle cx="32.5" cy="8.5" r="1.5" fill="#FFCC4D" /><circle cx="29.5" cy="12.5" r="1.5" fill="#FFCC4D" /><circle cx="7.5" cy="23.5" r="1.5" fill="#FFCC4D" /></svg>)
]
const story = [
  {
    title: "Background",
    lines: [
      "Growing up, picking fair teams was always a challenge.",
      "Nobody wanted to be the captain, leading to constant debates.",
      "Our daily football games often started with arguments over team selection."
    ]
  },
  {
    title: "Inspiration",
    lines: [
      "I wanted a fair and hassle-free way to form teams.",
      "As a student developer, I saw this as a chance to improve my React skills.",
      "With just one React project before, I was eager for a bigger challenge."
    ]
  },
  {
    title: "Development Journey",
    lines: [
      "Worked on it for 8-9 months, balancing it with other projects.",
      "Refined the UI, UX, and functionality consistently over time.",
      "I refined my problem-solving, logic, and UI/UX skills through this journey.",
      "As my second React project, it pushed me to learn and improve."
    ]
  },  
  {
    title: "Key Features",
    lines: [
      "✅ Fair & Randomized Team Selection – No more debates!",
      "✅ Easy-to-Use – Simple and clear for everyone.",
      "✅ Developer Growth – A big milestone in my coding journey so far."
    ]
  },
  {
    title: "Outcome",
    lines: [
      "Transformed a common issue into a useful, real-world tool.",
      "Enhanced my React expertise and development approach.",
      "A project that started as a small idea became something I’m truly proud of."
    ]
  }
];


gsap.registerPlugin(ScrollTrigger);

function AboutUs() {
  const ayushLineThrough = useRef(null)
  const spider = useRef(null);
  const cubeRef = useRef(null);
  const [imgloaded, setimgloaded] = useState(false);

  useEffect(() => {
    if (imgloaded) {
      ScrollTrigger.refresh();
    }
  }, [imgloaded]);

  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, ease: "power1.inOut", yoyo: true, repeatDelay: 1, delay: 1 });
    tl.to(cubeRef.current, {
      rotationX: -25,
      rotationY: 25,
      rotationZ: 45,
      duration: 4,
    }).to(cubeRef.current, {
      rotationX: -385,
      duration: 4
    }).to(cubeRef.current, {
      rotationY: 385,
      duration: 4
    });
  }, []);

  useGSAP(() => {
    const screenSize = gsap.matchMedia();
    gsap.utils.toArray('.storyLines').forEach((el) => {
      gsap.fromTo(el, {
        opacity: 0, y: 10,
      }, {
        opacity: 1, y: 0, duration: 0.4, ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'center 90%',
          toggleActions: "play none none reverse"
        }
      })
    })

    gsap.utils.toArray('.storyHeading').forEach((el) => {
      gsap.fromTo(el, {
        color: 'white',
      }, {
        color: '#ffa600', duration: 0.8, ease: 'power3',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'bottom 90%',
          // markers:true,
          toggleActions: "play none none reverse"
        }
      }
      )
    })

    screenSize.add("(min-width: 641px)", () => {

      const tm = gsap.timeline({
        scrollTrigger: {
          trigger: ayushLineThrough.current,
          start: "bottom 90%",
          end: "center center",
          // markers: true,
          scrub: 1,
        },
      });

      tm.fromTo(
        ayushLineThrough.current,
        { width: "0%" },
        {
          width: "100%",
        },
        "same"
      );

      tm.fromTo(
        spider.current,
        { top: -100},
        { top: 0,ease:'back' },
        "same"
      );

    });

    screenSize.add("(max-width: 640px)", () => {
      const tm = gsap.timeline({
        scrollTrigger: {
          trigger: ayushLineThrough.current,
          start: "bottom 70%",
          end: "center center",
          // markers: true,
          scrub: 1,
        },
      });

      tm.fromTo(
        ayushLineThrough.current,
        { width: "0%" },
        {
          width: "100%",
        },
        "same"
      );

      tm.fromTo(
        spider.current,
        { top: -100},
        { top: 0,ease:'back'},
        "same"
      );
    });

    // thanks to gpt here
    ScrollTrigger.refresh();
    return () => screenSize.revert();
  }, [imgloaded])

  const { PageHeading } = useContext(mainContext)

  return (
    <section className='pb-[6rem]'>
      <PageHeading heading={'about'} />
      <div className="lg:min-h-[80vh] md:min-h-[50vh] grid sm:grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] items-center justify-items-center gap-x-5 gap-y-3 p-[3vw] max-md:mb-[2vw]">
        {/* cube start  */}
        <div className='w-full grid place-items-center lg:min-h-[250px] min-h-[9.375rem] pt-20 pb-16'>
          <div onClick={(e) => { e.stopPropagation() }} ref={cubeRef} className="gridCube relative lg:w-[11.25rem] lg:h-[11.25rem] md:w-[9.375rem] md:h-[9.375rem] w-[6.25rem] h-[6.25rem]">
            {Array(6).fill(null).map((_, val) => (
              <div key={val} onClick={(e) => { e.stopPropagation() }} className={`gridChilds gridChild${val + 1} absolute h-full w-full grid grid-cols-3 grid-rows-3 rounded-sm overflow-hidden bg-[#000000]
              ${val + 1 === 1 ? `lg:[transform:translateZ(5.625rem)_rotateY(360deg)] md:[transform:translateZ(4.6875rem)_rotateY(360deg)] [transform:translateZ(3.125rem)_rotateY(360deg)]` : ""} ${val + 1 === 2 ? "[transform:rotateY(-270deg)_translateX(50%)] origin-[top_right]" : ""} ${val + 1 === 3 ? "[transform:rotateY(270deg)_translateX(-50%)] origin-[center_left]" : ""} ${val + 1 === 4 ? "[transform:rotateX(90deg)_translateY(-50%)] origin-[top_center]" : ""} ${val + 1 === 5 ? "[transform:rotateX(-90deg)_translateY(50%)] origin-[bottom_center]" : ""} ${val + 1 === 6 ? `lg:[transform:translateZ(-5.625rem)_rotateY(180deg)] md:[transform:translateZ(-4.6875rem)_rotateY(180deg)] [transform:translateZ(-3.125rem)_rotateY(180deg)]` : ""}`}>
                {
                  Array(9).fill(null).map((_, val) => (
                    <div onClick={(e) => { e.stopPropagation() }} key={val} className='grid place-items-center border hover:bg-[#141414] transition duration-200 ease-in-out border-[#FFFFFF]'>
                      {emogies[val]}
                    </div>
                  ))
                }
              </div>
            ))}
          </div>
        </div>
        {/* cube ends  */}
        {/* text starts  */}
        <div className='flex sm:order-[-1] flex-col text-[8vw] sm:text-[7vh] md:text-[8vh] lg:text-[9vh] xl:text-[10vh]   Bricolage font-semibold'>
          <h1 className='text-center leading-[120%]'>The</h1>
          <h1 className='text-center leading-[120%]'>Random Team</h1>
          <h1 className='text-center leading-[120%]'>Maker</h1>
        </div>
        {/* text ends  */}
      </div>

      <div className='Bricolage font-semibold grid grid-cols-[100%] p-[3vw]'>
        <div className='flex flex-col text-[8vw] sm:text-[7vh] md:text-[8vh] lg:text-[9vh] xl:text-[10vh]'>
          <div className='max-lg:text-center leading-[noraml]'>Design & Developed by
            <div className='relative inline-block text-[--theme]' href="https://ayushnagar.netlify.app" target='_blank'>&nbsp;Ayush Nagar
              <h3 ref={ayushLineThrough} className='absolute w-full ml-2 sm:h-[5px] h-[4px] bg-[--theme] top-1/2 -translate-y-1/2'></h3></div>
          </div>
          <div className='max-lg:text-center'>
            <a className='text-[--theme] inline-flex flex-wrap gap-4 max-lg:justify-center align-middle overflow-hidden pb-2' href="https://ayushnagar.netlify.app" target='_blank'>
              <span className='self-center'>
                <img src={Spider} ref={spider} className='relative drop-shadow-[2px_4px_2px_black] lg:w-20 lg:h-20 md:w-16 md:h-16 h-12 w-12' alt="web" />
                {/* <SpiderIcon/> */}
              </span>
              <span className='[text-shadow:2px_4px_2px_black]'> Ayush Nagar</span>
            </a>
          </div>
        </div>
      </div>


      {/* photo & story starts  */}
      <div className='flex flex-wrap gap-8 p-[3vw] max-sm:text-[1rem] sm:text-[1.1rem] md:text-[1.2rem]'>
        <div className='max-lg:flex-[1_1_100%] lg:sticky lg:top-[3vh] lg:self-baseline grid place-items-center'>
          <img onLoad={() => setimgloaded(true)} src={ayushimage} alt="lazy photo of developer" className='ayush 2xl:max-w-96 lg:max-w-80 sm:max-w-72 max-w-56 aspect-square drop-shadow-[5px_7px_7px_black]' />
        </div>
        <div className='flex-1 max-lg:flex-[1_1_100%] px-2'>
          <h2 className="text-[1.05em] font-extralight mb-4">The Story Behind Random Team Maker</h2>
          {
            story.map((section, index) => (
              <section key={index} className="mb-6">
                <h2 className="text-[0.98em] mb-2 font-medium Bricolage storyHeading">{section.title}</h2>
                <ul className="text-[0.90em] list-disc px-5 space-y-1">
                  {section.lines.map((line, index) => (
                    <li key={index} className='storyLines'>{line}</li>
                  ))}
                </ul>
              </section>
            ))
          }
        </div>
      </div>
      {/* photo & story ends  */}
    </section>
  )
}

export default AboutUs

