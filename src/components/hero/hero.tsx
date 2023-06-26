import './hero.css'
export const Hero = () => {
  return(
    <div className="hero-container flex">
      <section className="presentation">
        <h3>Oi, eu sou o</h3>
        <h1>Felipe</h1>
        <p>Apaixonado por <span>desenvolvimento de software & opensource</span> focado em desenvolver software de qualidade!</p>
      </section>
      <section className="me"></section>
    </div>
  )
}
