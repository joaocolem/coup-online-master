// UserContext.js

import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ nickname: '' });
  const [language, setLanguage] = useState('pt'); // Adicione o estado do idioma

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser({ nickname: '' });
  };

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'pt' ? 'en' : 'pt'));
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, language, toggleLanguage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
