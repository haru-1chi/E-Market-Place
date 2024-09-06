import Products from "../../component/Products";
import { useState, useRef, useEffect } from "react";
import { useCart } from '../../router/CartContext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Footer from "../../component/Footer";
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";

function ProductPage() {
  const [dataCarousel, setDataCarousel] = useState([]);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  //const product_token = import.meta.env.VITE_REACT_APP_PRODUCT_TOKEN;
  const shuffleArray = (array) => {
    return array.sort(() => 0.5 - Math.random());
  };

  const fetchData = () => {
    axios({
      method: "post",
      url: `${apiUrl}/products`
    })
      .then((response) => {
        const shuffledData = shuffleArray(response.data);
        setDataCarousel(shuffledData);
      })
      .catch((error) => {
        console.log(error);
        console.log(apiUrl);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const location = useLocation();
  const product = location.state?.product;
  const { addToCart } = useCart();

  const toast = useRef(null);
  const show = () => {
    toast.current.show({
      severity: 'success', summary: 'เพิ่มในตะกร้าแล้ว', life: 2000
    });
  };

  const data = [
    {
      imgURL: product.product_image
    },
    {
      imgURL: product.product_image
    },
    {
      imgURL: product.product_image
    },
  ]

  const responsiveOptions = [
    {
      breakpoint: "991px",
      numVisible: 3,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 2,
    },
  ];

  // const itemTemplate = (item) => {
  //   return <img src={WT} alt='' width={300} />
  // }

  // const thumbnailTemplate = (item) => {
  //   return <img src={WT} alt='' width={100} />
  // }

  const itemTemplate = (item) => {
    return <img src={item.imgURL} alt='' width={300} />
  }

  const thumbnailTemplate = (item) => {
    return <img src={item.imgURL} alt='' width={100} />
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <div className="m-3 flex justify-content-center flex-wrap">
        <div className="flex flex-column">
          <div className="lg:flex gap-4">
            <div className="md:w-full lg:w-30rem shadow-2 border-round-lg bg-white p-4 mb-3 lg:mb-0 flex justify-content-center">
              <img src={product.product_image} alt='' className="w-8 md:w-5 lg:w-12" />
            </div>
            <div className="md:w-full lg:w-30rem p-4 bg-white border-round-lg shadow-2 mb-3 lg:mb-0">
              <div className="border-bottom-1 surface-border">
                <h2 className="mt-0 font-semibold">{product.product_name}</h2>
                <div className="w-fit px-3 bg-primary border-round-md">
                  <h2 className="text-900">{Number(product.product_price).toLocaleString('en-US')} ฿</h2>
                </div>
                <p dangerouslySetInnerHTML={{ __html: product.product_detail }}></p>
              </div>
              <Button
                className="w-fit mt-3"
                icon="pi pi-plus"
                label="เพิ่มสินค้าในตะกร้า"
                onClick={() => {
                  addToCart(product)
                  show()
                }}
                rounded
              />
            </div>
          </div>
          <div className="flex align-items-center w-full p-2 bg-white border-round-lg shadow-2 mt-0 lg:mt-4">
            <div>
              <img src={product.product_image} alt='' width={100} height={100} className="border-circle" />
            </div>
            <div className="ml-3 w-full flex justify-content-between align-items-center">
              <div>
                <p className="m-0">ชื่อร้านค้า</p>
                <p className="m-0">จังหวัด</p>
                <p className="m-0">254 รายการสินค้า</p>
              </div>
              <div className="flex flex-column gap-2">
                <Link to="/ShopPage">
                  <Button label="ดูร้านค้า" className="p-0 px-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="mb-2 font-semibold">สินค้าอื่นๆ</h2>
          <Products data={dataCarousel} startIndex={0} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductPage;