// PlayerItem.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faUser } from '@fortawesome/free-solid-svg-icons';
import './PlayerItemStyles.css';

export default function PlayerItem({ player, position, isCurrentPlayer }) {
    const { top, left } = position;
    const [isBlinking, setBlinking] = useState(false);

    useEffect(() => {
       
        const blinkInterval = setInterval(() => {
            setBlinking((prevBlinking) => !prevBlinking);
        }, 500); 


        return () => clearInterval(blinkInterval);
    }, []); 

    const borderStyle = isCurrentPlayer
  ? isBlinking
    ? '2px solid blue'
    : '2px solid #ccc' 
  : '2px solid #ccc';

  const transitionStyle = {
    transition: 'border-color 0.5s ease-in-out', 
  };
  
  return (
    <div className={`PlayerBoardItem ${isCurrentPlayer ? 'current-player' : ''}`} style={{
      ...transitionStyle, 
      position: 'absolute',
      top,
      left,
      backgroundColor: player.color,
      border: borderStyle,
    }}>
            <h2>{player.name}</h2>
            <div className="flex-container">
                <p className="coin-info">
                    <FontAwesomeIcon icon={faCoins} /> {player.money}
                </p>
                <p className="influence-info">
                    <FontAwesomeIcon icon={faUser} /> {player.influences.length}
                </p>
            </div>
        </div>
    );
}
