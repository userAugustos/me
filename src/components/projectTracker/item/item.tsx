import './item.css'

export interface ItemRepository {
  id: number,
  description: string,
  stack: [{
    img: string,
    id: number,
    name: string
  }],
  title: string,
  font: string,
  projectLink: `https://www.${string}`
}

export const Item = ({item}: { item: ItemRepository }) => {
  return (
    <div className={`project-item flex p-2`}>
      <h3 style={{fontFamily: `${item.font}`}}>
        {item.title}
      </h3>
      <section className="stacks sm-hide">
        {
          item.stack.map((tec) => (
            <img src={tec.img} alt={tec.name} key={`stack_${tec.id}`} style={{animationDelay: `${tec.id * 100}ms`}}/>
          ))
        }
      </section>
      <section className="description">
        <p>{item.description}</p>
      </section>
      <a href={item.projectLink} target="_blank" className="project-link">
        Veja o Projeto
      </a>
    </div>
  )
}
