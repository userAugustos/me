import {Swiper, SwiperSlide} from "swiper/react";
import {Mousewheel, Pagination} from "swiper/modules";
import {Item, ProjectItem} from "@components/projectTracker/item/projectItem.tsx";
import './projectTracker.css'
import {useEffect, useState} from "react";

export function ProjectTracker() {
  const [itens, setItens] = useState<[Item]>([] as unknown as [Item])

  useEffect(() => {
    fetch('/projects.json').then(async res => await res.json()).then(data => setItens(data.itens))
  }, [])

  return (
    <div className="projects hide p-2 relative">
      <Swiper
        direction={"vertical"}
        mousewheel={true}
        modules={[Mousewheel, Pagination]}
        pagination={{
          clickable: true
        }}
        slidesPerView={1}
        speed={800}
        spaceBetween={80}
        className="projects-swiper"
      >
        {
          itens.length > 0 && itens.map(item => (
            <SwiperSlide key={item.id}>
              <ProjectItem item={item}/>
            </SwiperSlide>
          ))
        }
      </Swiper>
      <section className="me-coding">

        {/*<img src="" alt="Just a draw of me coding"/>*/}
      </section>
    </div>
  )
}
