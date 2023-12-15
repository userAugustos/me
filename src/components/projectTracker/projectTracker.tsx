import {Swiper, SwiperSlide} from "swiper/react";
import {Mousewheel, Pagination} from "swiper/modules";
import {Item, ItemRepository} from "@components/projectTracker/item/item.tsx";
import './projectTracker.css'
import {useEffect, useState} from "react";

export function ProjectTracker() {
  const [itens, setItens] = useState<[ItemRepository]>([] as unknown as [ItemRepository])

  useEffect(() => {
    fetch('/projects.json').then(res => res.json()).then((data: { itens: [ItemRepository] }) => setItens(data.itens))
  }, [])

  return (
    <div className="projects p-2 relative">
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
              <Item item={item}/>
            </SwiperSlide>
          ))
        }
      </Swiper>
      <section className="me-coding shade-out-effect">
      </section>
    </div>
  )
}
