export interface Item {
  id: number,
  description: string,
  stack: [{
    img: string,
    id: number,
    name: string
  }],
  title: string,
  projectLink: `https://www.${string}`
}

export const ProjectItem = ({item}: { item: Item }) => {
  return (
    <div className={`project-item relative flex`}>
      <h3>
        {item.title}
      </h3>
      {
        item.stack.map((tec) => (
          <img src={tec.img} alt={tec.name} key={tec.id}/>
        ))
      }
      <section className="description">
        <p>{item.description}</p>
      </section>
      <a href={item.projectLink} className="project-link">
        Veja o Projeto
      </a>
    </div>
  )
}
