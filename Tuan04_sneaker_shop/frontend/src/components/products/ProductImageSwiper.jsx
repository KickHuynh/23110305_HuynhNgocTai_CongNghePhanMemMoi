import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { createPlaceholderImage } from '../../utils/shop';

function ProductImageSwiper({ images = [] }) {
  const normalizedImages = images.length > 0 ? images : [createPlaceholderImage('SneakerHub')];
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-100 to-slate-200">
        <Swiper
          onSwiper={setSwiperInstance}
          modules={[Navigation, Pagination]}
          navigation={normalizedImages.length > 1}
          pagination={normalizedImages.length > 1 ? { clickable: true } : false}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="aspect-square"
        >
          {normalizedImages.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`}>
              <div className="flex h-full items-center justify-center p-4 sm:p-8">
                <img
                  src={image}
                  alt={`Product view ${index + 1}`}
                  onError={(event) => {
                    event.currentTarget.src = createPlaceholderImage(`Sneaker ${index + 1}`);
                  }}
                  className="h-full w-full rounded-[24px] object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {normalizedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {normalizedImages.map((image, index) => (
            <button
              key={`${image}-thumb-${index}`}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                swiperInstance?.slideTo(index);
              }}
              className={`overflow-hidden rounded-2xl border bg-slate-100 p-2 transition ${
                activeIndex === index ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-slate-200'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onError={(event) => {
                  event.currentTarget.src = createPlaceholderImage(`Sneaker ${index + 1}`);
                }}
                className="aspect-square w-full rounded-xl object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageSwiper;
