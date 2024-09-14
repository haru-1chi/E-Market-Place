import React, { useState } from "react";
import { Carousel } from "primereact/carousel";
import bannerSlide1 from '../assets/bannerSlide1.png';
import bannerSlide2 from '../assets/bannerSlide2.png';

function BannerSlider() {
  const data = [
    {
      imgURL: bannerSlide1
    },
    {
      imgURL: bannerSlide2
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0);
  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const onCarouselChange = (e) => {
    setCurrentIndex(e.page);
  };

  const productTemplateFull = (product) => {
    return (
      <div className="border-none surface-border text-center bg-red-500">
        <div className="lg:h-20rem">
          <img
            src={product.imgURL}
            className="w-full lg:w-fit lg:h-full"
          />
        </div>
      </div>
    );
  };

  const productTemplateFit = (product) => {
    return (
      <div className="border-none surface-border text-center">
        <div className="lg:h-20rem">
          <img
            src={product.imgURL}
            className="w-full lg:w-fit lg:h-full"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative hidden lg:block card">
        <div className="h-fit absolute top-0 right-0 mt-2 mr-7 bg-white-alpha-60 px-3 py-1 text-md border-round-2xl z-1">
          <p className="m-0 p-0 text-900">{currentIndex + 1}/{data.length}</p>
        </div>
        <Carousel
          value={data}
          numVisible={1}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          className="custom-carousel"
          circular
          autoplayInterval={3000}
          itemTemplate={productTemplateFull}
        />
      </div>

      <div className="relative block lg:hidden card">
        <div className="h-fit absolute top-0 right-0 mt-2 mr-2 bg-white-alpha-60 text-xs px-1 border-round-xl z-1">
          <p className="m-0 p-0 text-900">{currentIndex + 1}/{data.length}</p>
        </div>
        <Carousel
          value={data}
          numVisible={1}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          className="custom-carousel"
          showIndicators={false}
          showNavigators={false}
          circular
          autoplayInterval={3000}
          itemTemplate={productTemplateFit}
          onPageChange={onCarouselChange}
        />
      </div>
    </>
  );
}

export default BannerSlider;