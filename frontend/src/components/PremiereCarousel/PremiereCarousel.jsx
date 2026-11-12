import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/a11y'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useWindowSize } from '../../hooks/useWindowSize.js'
import { columnsForWidth } from '../../utils/columnsForWidth.js'
import { formatReleaseDate } from '../../utils/formatReleaseDate.js'
import './PremiereCarousel.css'

// Spanish texts that Swiper's A11y module gives to the arrows, dots and slides.
const A11Y_TEXTS = {
  containerMessage: 'Carrusel de próximos estrenos',
  containerRoleDescriptionMessage: 'carrusel',
  itemRoleDescriptionMessage: 'diapositiva',
  prevSlideMessage: 'Estreno anterior',
  nextSlideMessage: 'Estreno siguiente',
  firstSlideMessage: 'Este es el primer estreno',
  lastSlideMessage: 'Este es el último estreno',
  paginationBulletMessage: 'Ir al estreno {{index}}',
  slideLabelMessage: '{{index}} de {{slidesLength}}',
}

// Presentational carousel: receives the premieres (app model) and shows one slide each.
// How many slides fit at once depends on the window width, like the billboard grid.
function PremiereCarousel({ premieres }) {
  const { width } = useWindowSize()
  const slidesPerView = columnsForWidth(width)

  return (
    <Swiper
      className="premiere-carousel"
      modules={[Navigation, Pagination, Keyboard, A11y]}
      slidesPerView={slidesPerView}
      spaceBetween={24}
      navigation
      pagination={{ clickable: true }}
      keyboard={{ enabled: true }}
      a11y={A11Y_TEXTS}
      watchOverflow
    >
      {premieres.map(({ id, title, image, releaseDate }) => (
        <SwiperSlide key={id} className="premiere-carousel__slide">
          <img
            className="premiere-carousel__poster"
            src={image}
            alt={`Póster de ${title}`}
            width="300"
            height="450"
            loading="lazy"
          />
          <div className="premiere-carousel__body">
            <h3 className="premiere-carousel__title">{title}</h3>
            {releaseDate && (
              <p className="premiere-carousel__date text-sm">
                Estreno: <time dateTime={releaseDate}>{formatReleaseDate(releaseDate)}</time>
              </p>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default PremiereCarousel
