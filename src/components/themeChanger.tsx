import {useThemeContext} from "../hooks/theme.tsx";

export function ThemeChanger() {
    const {switchTheme} = useThemeContext()
    const handleSwitchTheme = () => {
        switchTheme()
    }

    return (
        <section className="flex">
            <label className="theme-switcher">
                <input type="checkbox" onChange={handleSwitchTheme} id="slider"/>
                <span className="slider round"></span>
            </label>
        </section>
    )
}
