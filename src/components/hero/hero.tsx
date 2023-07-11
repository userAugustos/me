import './hero.css'

export const Hero = () => {
  return (
    <div className="hero-container flex p-2">
      <section className="presentation">
        <h3>Oi, eu sou o</h3>
        <h1>Felipe Augustos</h1>
        <p>Apaixonado por <span>desenvolvimento de software & opensource</span> focado em desenvolver software de
          qualidade!</p>
      </section>
      <img src="/me_picrew.png" alt="Felipe Augustos" className="shade-out-effect"/>
    </div>
  )
}
