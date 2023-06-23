import { useThemeContext } from "@hooks/theme.tsx";
import { ThemeChanger } from "@components/themeChanger.tsx";

function Home() {
  const { theme } = useThemeContext();

  return (
    <section>
      <ThemeChanger />
    </section>
  );
}

export default Home;
