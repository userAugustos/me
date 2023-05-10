import {createContext, useContext, useState} from "react";

interface ThemeContext {
    theme: string,
    switchTheme: () => void
}

const ThemeContext = createContext<ThemeContext>({
    theme: 'light',
    switchTheme: () => {
    }
})

export const useThemeContext = () => useContext(ThemeContext)

export function ThemeProvider({children}: { children: React.ReactNode }) {
    let initialTheme = localStorage.getItem("DINO_TV_THEME");

    const [theme, setTheme] = useState<string>(initialTheme ||= 'light')

    const switchTheme = () => {
        if (theme === 'light') {
            return setTheme('dark')
        }
        setTheme('light')
    }

    return (
        <ThemeContext.Provider value={{theme, switchTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}


