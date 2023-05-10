import {useThemeContext} from "../hooks/theme.tsx";

export function ThemeChanger() {
    const {switchTheme} = useThemeContext()
    const handleSwitchTheme = () => {
        switchTheme()
    }

    return (
        <button onClick={handleSwitchTheme}>
            Trocar Tema
        </button>
    )
}
