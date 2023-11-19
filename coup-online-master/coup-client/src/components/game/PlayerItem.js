// PlayerItem.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faUser } from '@fortawesome/free-solid-svg-icons';
import './PlayerItemStyles.css';

export default function PlayerItem({ player, position }) {
    const { top, left, color } = position;

    return (
        <div className="PlayerBoardItem" style={{ position: 'absolute', top, left, backgroundColor: player.color }}>
            <h2>{player.name}</h2>
            <div className="flex-container">
                <p className="coinn-info">
                    <FontAwesomeIcon icon={faCoins} /> {player.money}
                </p>
                <p className="influence-info">
                    <FontAwesomeIcon icon={faUser} /> {player.influences.length}
                </p>
            </div>
        </div>
    );
}
