import React, { useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

function CalendarView( { calendarData } ) {

    const [events, setEvents] = useState([]);
    const [expiringVerySoon, setExpiringVerySoon ] = useState(0);
    const [expiringSoon, setExpiringSoon ] = useState(0);
    const [expiringLater, setExpiringLater ] = useState(0);

    useEffect(() => {
        console.log("in calendar view")
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
          
            if (daysDifference <= 5) {
              color = 'red';
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
        setExpiringVerySoon(expiringVerySoon);
        setExpiringSoon(expiringSoon);
        setExpiringLater(expiringLater);
    }, [calendarData]);
    
    const view = useMemo(() => {
        return {
            calendar: { labels: true }
        };
    }, []);

    return (
        <div className='flex flex-col h-full w-full px-3 pb-3'>
            <div className='basis-1/12 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-10 md:gap-16 lg:gap-20 py-2 sm:py-0'>
                <div className='py-1 px-3 bg-red-200 rounded-2xl'>
                    <span className='text-md lg:text-lg font-semibold text-red-700 flex justify-center'>Expiring Very Soon: {expiringVerySoon}</span>
                </div>
                <div className='py-1 px-3 bg-yellow-200 rounded-2xl'>
                    <span className='text-md lg:text-lg font-semibold text-yellow-700 flex justify-center'>Expiring Soon: {expiringSoon}</span>
                </div>
                <div className='py-1 px-3 bg-green-200 rounded-2xl'>
                    <span className='text-md lg:text-lg font-semibold text-green-700 flex justify-center'>Expiring Later: {expiringLater}</span>
                </div>
            </div>
            <div className='basis-11/12 border border-solid border-slate-100'>
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
        </div>
    )
}

export default CalendarView;