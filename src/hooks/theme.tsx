import {createContext, useContext, useEffect, useState} from "react";

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
    let currentTheme: string;

    if (localStorage.getItem("theme")) {
        currentTheme = localStorage.getItem("theme")! //can use this here, because if the item is null, will not pass by the if
    } else { // I think is a fair and simple use of else
        currentTheme = window.matchMedia("prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    }

    const [theme, setTheme] = useState<string>(currentTheme)

    useEffect(() => { // this I think is cool, a better solution than I see on some mediums
        document.documentElement.className = theme;
    }, [theme])

    const switchTheme = () => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem("theme", 'dark')
            return setTheme('dark')
        }
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem("theme", 'light')
        setTheme('light')
    }

    return (
        <ThemeContext.Provider value={{theme, switchTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}


