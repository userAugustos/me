import "./nav.css"
import {ThemeChanger} from "../themeChanger.tsx";

export const Nav = () => {

  const redirect = (event:   React.MouseEvent<HTMLElement, MouseEvent>) => {
    if(event.currentTarget.classList[0] === 'github'){
      window.open('https://www.github.com/userAugustos')
      return
    }
    window.open('https://www.linkedin.com/in/felipe-augustos/')
  }

  return (
    <nav className="flex relative">
      <section className="github flex" onClick={redirect}>
        <img src="/github.svg" alt="my github"/>
        userAugustos
      </section>
      <section className="linkedin flex" onClick={redirect}>
        <img src="/linkedin.svg" alt="my linkedin"/>
        Felipe Augustos
      </section>
      <section className="theme absolute">
        <ThemeChanger />
      </section>
    </nav>
  )
}
