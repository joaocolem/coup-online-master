// LanguageToggle.js

import React from 'react';
import { useUser } from './UserContext';
import Switch from 'react-switch';
import './LanguageToggleStyle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useUser();

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // Defina um valor alto para manter em primeiro plano
      }}
    >
      <span style={{ marginRight: '8px', color: language === 'en' ? '#e44d26' : '#4caf50' }}>
        {language === 'en' ? 'EN' : 'PT'}
      </span>
      <Switch
        checked={language === 'en'}
        onChange={toggleLanguage}
        onColor="#e44d26" 
        offColor="#4caf50" 
        onHandleColor="#fff"
        offHandleColor="#fff"
        handleDiameter={25}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={20}
        width={48}
      />
    </div>
  );
};

export default LanguageToggle;
