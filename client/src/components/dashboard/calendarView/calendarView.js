import React, { useCallback, useEffect, useState, useMemo } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Page, Eventcalendar, getJson, Toast } from '@mobiscroll/react';

function CalendarView( { calendarData } ) {

    const [events, setEvents] = useState([]);
    const [isToastOpen, setToastOpen] = useState(false);
    const [toastText, setToastText] = useState();

    useEffect(() => {
        getJson('https://trial.mobiscroll.com/events/?vers=5', (events) => {
            console.log(events)
            setEvents(events);
        }, 'jsonp');
    }, []);
    
    const closeToast = useCallback(() => {
        setToastOpen(false);
    }, []); 
    
    const onEventClick = useCallback((event) => {
        setToastText(event.event.title);
        setToastOpen(true);
    }, []);
    
    const view = useMemo(() => {
        return {
            calendar: { labels: true }
        };
    }, []);

    return (
        <Page className='h-full w-full'>
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
                onEventClick={onEventClick}
            />
            <Toast 
                message={toastText}
                isOpen={isToastOpen}
                onClose={closeToast}
            />
        </Page>
    )
}

export default CalendarView;