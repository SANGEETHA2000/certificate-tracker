import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

function CalendarView( { calendarData } ) {

    const [events, setEvents] = useState([]);
    const [expiredAlready, setExpiredAlready ] = useState(0);
    const [expiringVerySoon, setExpiringVerySoon ] = useState(0);
    const [expiringSoon, setExpiringSoon ] = useState(0);
    const [expiringLater, setExpiringLater ] = useState(0);

    useEffect(() => {
        let expiredAlready = 0;
        let expiringVerySoon = 0;
        let expiringSoon = 0;
        let expiringLater = 0;
        const events = calendarData.map(item => {
            const currentDate = new Date();
            const expiryDate = new Date(item.expiryDate);
            const formattedExpiryDate = expiryDate.toISOString();
          
            let color = '';
            const timeDifference = expiryDate.getTime() - currentDate.getTime();
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          
            if (daysDifference < 0) {
                color = 'red';
                expiredAlready = expiredAlready + 1;
            } else if (daysDifference <= 5) {
                color = '#fb923c';
                expiringVerySoon = expiringVerySoon + 1;
            } else if (daysDifference <= 30) {
                color = '#facc15';
                expiringSoon = expiringSoon + 1;
            } else {
                color = 'green';
                expiringLater = expiringLater + 1;
            }
            return {
                title: item.domain,
                start: formattedExpiryDate,
                end: formattedExpiryDate,
                allDay: true,
                color: color
            };
        });
        setEvents(events);
        setExpiredAlready(expiredAlready);
        setExpiringVerySoon(expiringVerySoon);
        setExpiringSoon(expiringSoon);
        setExpiringLater(expiringLater);
    }, [calendarData]);

    return (
        <div className='flex flex-col-reverse lg:flex-row h-full w-full bg-gray-50 px-1 py-2 sm:p-3 lg:p-5 gap-5 justify-end'>
            <div className='h-3/5 sm:h-5/6 lg:h-full lg:w-3/4 border border-solid border-gray-300'>
                <FullCalendar
                    plugins={[ dayGridPlugin ]}
                    initialView="dayGridMonth"
                    headerToolbar= {{
                        left: 'prev,next',
                        center: 'title',
                        right: 'dayGridYear,dayGridMonth,dayGridWeek,dayGridDay'
                    }}
                    events={ events }
                />
            </div>
            <div className='h-1/5 sm:h-1/6 lg:h-full lg:w-1/4 sm:flex sm:flex-row lg:flex-col gap-2 sm:gap-4 xl:gap-6 sm:justify-center grid grid-rows-2 grid-flow-col'>
                <div className='bg-red-100 grid grid-rows-2 grid-flow-col p-1 sm:p-3 w-full'>
                    <span className='text-red-700 col-span-2 text-xs sm:text-sm md:text-base xl:text-lg font-semibold md:font-medium'>Already Expired</span>
                    <span className='text-red-700 text-xl sm:text-2xl xl:text-3xl font-bold flex items-center'>{expiredAlready}</span>
                    <div className='flex lg:row-span-2 items-end justify-end'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(252 165 165)" className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 xl:w-14 xl:h-14">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className='bg-orange-100 grid grid-rows-2 grid-flow-col p-1 sm:p-3 w-full'>
                    <span className='text-orange-700 col-span-2 text-xs sm:text-sm md:text-base xl:text-lg font-semibold md:font-medium'>In 5 days</span>
                    <span className='text-orange-700 text-xl sm:text-2xl xl:text-3xl font-bold flex items-center'>{expiringVerySoon}</span>
                    <div className='flex lg:row-span-2 items-end justify-end'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(253 186 116)" class="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 xl:w-14 xl:h-14">
                            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className='bg-yellow-100 grid grid-rows-2 grid-flow-col p-1 sm:p-3 w-full'>
                    <span className='text-yellow-700 col-span-2 text-xs sm:text-sm md:text-base xl:text-lg font-semibold md:font-medium'>In 30 days</span>
                    <span className='text-yellow-700 text-xl sm:text-2xl xl:text-3xl font-bold flex items-center'>{expiringSoon}</span>
                    <div className='flex lg:row-span-2 items-end justify-end'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(254 240 138)" class="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 xl:w-14 xl:h-14">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className='bg-green-100 grid grid-rows-2 grid-flow-col p-1 sm:p-3 w-full'>               
                    <span className='text-green-700 col-span-2 text-xs sm:text-sm md:text-base xl:text-lg font-semibold md:font-medium'>Expiring Later</span>
                    <span className='text-green-700 text-xl sm:text-2xl xl:text-3xl font-bold flex items-center'>{expiringLater}</span>
                    <div className='flex lg:row-span-2 items-end justify-end'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(134 239 172)" class="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 xl:w-14 xl:h-14">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarView;