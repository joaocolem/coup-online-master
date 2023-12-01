import React, { useState } from 'react';
import { captainIMG, contessaIMG, ambassadorIMG, assassinIMG, dukeIMG } from '../characters';

const imageMapping = {
  'captain': captainIMG,
  'contessa': contessaIMG,
  'ambassador': ambassadorIMG,
  'assassin': assassinIMG,
  'duke': dukeIMG,
};

const RevealedCards = ({ cards, players }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const grayscaleStyle = {
    filter: 'grayscale(100%)',
    transition: 'filter 0.5s ease-in-out',
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const getPlayerName = (index) => {
    return players[index];
  };

  const chunks = cards.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 3);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return (
    <div style={{ display: 'table', margin: 'auto' }}>
      {chunks.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'table-row' }}>
          {row.map((str, colIndex) => (
            <div
              key={colIndex}
              onMouseEnter={() => handleMouseEnter(rowIndex * 3 + colIndex)}
              onMouseLeave={handleMouseLeave}
              style={{ display: 'table-cell', padding: '5px' }}
            >
              <img
                src={imageMapping[str]}
                alt={str}
                style={{
                  width: '50px',
                  height: 'auto',
                  ...(hoveredIndex === rowIndex * 3 + colIndex ? {} : grayscaleStyle),
                }}
              />
              {hoveredIndex === rowIndex * 3 + colIndex && (
                <div style={{ position: 'absolute', top: '10', left: '10', backgroundColor: 'white', color: '' }}>
                  Player: {getPlayerName(rowIndex * 3 + colIndex)}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RevealedCards;
