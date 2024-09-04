import React, { useState } from "react";
import { Carousel } from "primereact/carousel";

function BannerSlider() {
  const data = [
    {
      imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FMM_16_Crazy_Jumbo_Web_Banner_TH_b00302_01526f1368.png&w=1920&q=90'
    },
    {
      imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FUpdated17_Jul_Makro_FB_Challenge_1290x480_TH_0cb0869b3d.png&w=3840&q=90'
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

      <div className="relative block lg:hidden card mb-2">
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