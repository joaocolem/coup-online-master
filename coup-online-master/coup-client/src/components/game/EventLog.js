import React, { useEffect, useRef } from 'react';
import  LanguageStrings from '../utils/strings';

const EventLog = (props) => {
    const strings = LanguageStrings()
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [props.logs]);

    return (
        <div className="EventLogContainer">
            <p className="bold EventLogTitle">{strings.eventLog}</p>
            <div className="EventLogBody">
                {props.logs.map((x, index) => (
                    <p key={index} className={index === props.logs.length - 1 ? 'new' : ''}>
                        {x}
                    </p>
                ))}
                <div style={{ float: 'left', clear: 'both' }} ref={messagesEndRef}></div>
            </div>
        </div>
    );
};

export default EventLog;
