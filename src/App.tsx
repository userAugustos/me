import {useThemeContext} from "./hooks/theme.tsx";
import {ThemeChanger} from "./components/themeChanger.tsx";

function App() {

    const {theme} = useThemeContext()

    return (
        <section>
            Working on first deploy, testing icon
            usando o tema: {theme}
            <ThemeChanger/>
        </section>
    )
}

export default App
