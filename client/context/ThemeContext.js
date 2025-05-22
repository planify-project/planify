import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark
    ? { background: '#181A20', text: '#fff', card: '#23262F', primary: '#6C6FD1' }
    : { background: '#F4F6FC', text: '#222', card: '#fff', primary: '#6C6FD1' };

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);