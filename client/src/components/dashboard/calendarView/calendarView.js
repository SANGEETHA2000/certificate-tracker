import React, { useEffect, useState, useMemo } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Page, Eventcalendar } from '@mobiscroll/react';

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
              color = 'yellow';
              expiringSoon = expiringSoon + 1;
            } else {
              color = 'green';
              expiringLater = expiringLater + 1;
            }
            return {
              title: item.domain,
              start: formattedExpiryDate,
              end: formattedExpiryDate,
              color: color,
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
        <div className='flex flex-row h-full w-full'>
            <Page className='w-3/4'>
                <Eventcalendar
                    theme="ios" 
                    themeVariant="light"
                    clickToCreate={false}
                    dragToCreate={false}
                    dragToMove={false}
                    dragToResize={false}
                    eventDelete={false}
                    data={events}
                    view={view}
                />
            </Page>
            <div className='w-1/4 flex flex-col p-7 items-center justify-center gap-5'>
                <div className='w-full p-4 bg-red-200 rounded-2xl'>
                    <span className='text-lg font-semibold text-red-700 flex justify-center'>Expiring Very Soon: {expiringVerySoon}</span>
                </div>
                <div className='w-full p-4 bg-yellow-200 rounded-2xl'>
                    <span className='text-lg font-semibold text-yellow-700 flex justify-center'>Expiring Soon: {expiringSoon}</span>
                </div>
                <div className='w-full p-4 bg-green-200 rounded-2xl'>
                    <span className='text-lg font-semibold text-green-700 flex justify-center'>Expiring Later: {expiringLater}</span>
                </div>
            </div>
        </div>
    )
}

export default CalendarView;