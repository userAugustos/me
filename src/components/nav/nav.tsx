import "./nav.css"
import {ThemeChanger} from "../themeChanger.tsx";

export const Nav = () => {

  // const redirect = () => {
  //   window.mo
  // }

  return (
    <nav className="flex relative">
      <section className="github flex">
        <img src="/github.svg" alt="my github"/>
        userAugustos
      </section>
      <section className="linkedin flex">
        <img src="/linkedin.svg" alt="my linkedin"/>
        Felipe Augustos
      </section>
      <section className="theme absolute">
        <ThemeChanger />
      </section>
    </nav>
  )
}
