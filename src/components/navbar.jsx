import { NavLink, useLocation } from 'react-router-dom'


function navbar() {  
    let location = useLocation()
    return (
        // <nav className='flex bg-[#141414] sticky rounded-[4rem] overflow-hidden items-center  bottom-2 mx-auto z-[25] w-max'>
        <nav className='flex bg-[#141414] fixed left-1/2 -translate-x-1/2 rounded-[4rem] overflow-hidden items-center  bottom-2 mx-auto z-[25] w-max'>
            {
                [
                    {
                        name: 'home', svg: (<svg viewBox="0 0 24 24" className='w-[1.19rem] h-[1.19rem]' color="inherit" fill="none">
                            <path d="M3.16405 11.3497L4 11.5587L4.45686 16.1005C4.715 18.6668 4.84407 19.9499 5.701 20.7249C6.55793 21.5 7.84753 21.5 10.4267 21.5H13.5733C16.1525 21.5 17.4421 21.5 18.299 20.7249C19.1559 19.9499 19.285 18.6668 19.5431 16.1005L20 11.5587L20.836 11.3497C21.5201 11.1787 22 10.564 22 9.85882C22 9.35735 21.7553 8.88742 21.3445 8.59985L13.1469 2.86154C12.4583 2.37949 11.5417 2.37949 10.8531 2.86154L2.65549 8.59985C2.24467 8.88742 2 9.35735 2 9.85882C2 10.564 2.47993 11.1787 3.16405 11.3497Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="14.5" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>)
                    }, {
                        name: 'how-to', svg: (<svg viewBox="0 0 24 24" className='w-[1.19rem] h-[1.19rem]' color="inherit" fill="none">
                            <path d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M10.5 9.53846C10.5 8.68879 11.1716 8 12 8C12.8284 8 13.5 8.68879 13.5 9.53846C13.5 9.84473 13.4127 10.1301 13.2623 10.3698C12.8141 11.0844 12 11.7657 12 12.6154V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12 15H12.009" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>)

                    }].map((elm, ind) => (

                        <NavLink key={elm.name + ind} to={elm.name === 'home' ? '/' : elm.name} className={`${elm.name === 'home' && location.pathname === '/' ? 'text-[#ffa600]' : ''} ${elm.name === (location.pathname).replace(/%20/g, ' ').slice(1) ? 'text-[#ffa600]' : ''} hover:text-[#ffa600] pageLinks text-[0.70rem] sm:text-[0.75rem] lg:text-[0.85rem] font-normal  transition-all duration-[200ms] capitalize px-4 text-nowrap py-2`}>
                            <p className='text-center grid justify-center'>
                                <span>
                                    {elm.svg}
                                </span>
                            </p>
                            <p className='capitalize text-nowrap tracking-[0.6px]'>{elm.name}</p>
                        </NavLink>
                    ))
            }
            {/* translate-y-[-30%] */}
            < div className='w-[3.125rem] h-[3.125rem] grid items-center justify-center'>
                <div className="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            {
                [
                    {
                        name: 'saved', svg: (<span><svg viewBox="0 0 24 24" className='w-[1.19rem] h-[1.19rem]' color="inherit" fill="none">
                            <path d="M3 17.9808V12.7075C3 9.07416 3 7.25748 4.09835 6.12874C5.1967 5 6.96447 5 10.5 5C14.0355 5 15.8033 5 16.9017 6.12874C18 7.25748 18 9.07416 18 12.7075V17.9808C18 20.2867 18 21.4396 17.2755 21.8523C15.8724 22.6514 13.2405 19.9852 11.9906 19.1824C11.2657 18.7168 10.9033 18.484 10.5 18.484C10.0967 18.484 9.73425 18.7168 9.00938 19.1824C7.7595 19.9852 5.12763 22.6514 3.72454 21.8523C3 21.4396 3 20.2867 3 17.9808Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 2H11C15.714 2 18.0711 2 19.5355 3.46447C21 4.92893 21 7.28595 21 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></span>)
                    },
                    {
                        name: 'about', svg: (<svg color='inherit' viewBox="-0.5 -0.5 64 64" id="User-Group--Streamline-Font-Awesome" className='w-[1.19rem] h-[1.19rem]'><path d="M9.891000000000002 19.152c0 -9.505499062500002 10.28999671875 -15.446428593750001 18.522000000000002 -10.693679062500001 3.820487343750001 2.20575796875 6.174 6.282163125000001 6.174 10.693679062500001 0 9.505499062500002 -10.28999671875 15.446428593750001 -18.522000000000002 10.693679062500001 -3.820487343750001 -2.20575796875 -6.174 -6.282163125000001 -6.174 -10.693679062500001ZM0.6300000000000001 53.330878125000005c0 -9.502171875000002 7.69820625 -17.200378125000004 17.200378125000004 -17.200378125000004h8.817243750000001c9.502171875000002 0 17.200378125000004 7.69820625 17.200378125000004 17.200378125000004 0 1.5820875 -1.2830343750000002 2.8651218750000007 -2.8651218750000007 2.8651218750000007H3.4951218750000006c-1.5820875 0 -2.8651218750000007 -1.2830343750000002 -2.8651218750000007 -2.8651218750000007Zm58.77840937500001 2.8651218750000007H46.105368750000004c0.5209312500000001 -0.90680625 0.8296312500000002 -1.958315625 0.8296312500000002 -3.087v-0.77175c0 -5.855653125000001 -2.614303125 -11.1132 -6.73351875 -14.643956250000002 0.231525 -0.009646875000000001 0.453403125 -0.019293750000000002 0.6849281250000001 -0.019293750000000002h5.923181250000001c8.595365625000001 0 15.560409375000003 6.96504375 15.560409375000003 15.560409375000003 0 1.6399687500000002 -1.33126875 2.9615906250000004 -2.9615906250000004 2.9615906250000004ZM42.304500000000004 31.500000000000004c-2.99053125 0 -5.69165625 -1.2155062500000002 -7.649971875 -3.1738218750000002 1.9004343750000003 -2.5660687500000003 3.0194718750000002 -5.739890625000001 3.0194718750000002 -9.174178125000001 0 -2.5853625 -0.6366937500000001 -5.0260218750000005 -1.7653781250000002 -7.167628125 1.7943187500000004 -1.3119750000000001 4.003453125000001 -2.093371875 6.395878125000001 -2.093371875 5.971415625000001 0 10.8045 4.833084375 10.8045 10.8045S48.27591562500001 31.500000000000004 42.304500000000004 31.500000000000004Z" fill='none' strokeWidth="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" ></path></svg>)
                    }
                ].map((elm, ind) => (

                    <NavLink key={elm.name + ind} to={elm.name === 'home' ? '/' : elm.name} className={`${elm.name === 'home' && location.pathname === '/' ? 'text-[#ffa600]' : ''} ${elm.name === (location.pathname).replace(/%20/g, ' ').slice(1) ? 'text-[#ffa600]' : ''} hover:text-[#ffa600] pageLinks text-[0.70rem] sm:text-[0.75rem] lg:text-[0.85rem] font-normal  transition-all duration-[200ms] capitalize px-4 text-nowrap py-2`}>
                        <p className='text-center grid justify-center'>
                            <span>
                                {elm.svg}
                            </span>
                        </p>
                        <p className='capitalize text-nowrap tracking-[0.6px]'>{elm.name}</p>
                    </NavLink>
                ))

            }
        </nav>
    )
}

export default navbar