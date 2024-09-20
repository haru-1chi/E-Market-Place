import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { useCart } from '../router/CartContext';
import { Toast } from 'primereact/toast';
import img_placeholder from '../assets/img_placeholder.png';

function Products({ data, startIndex }) {
    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const { addToCart } = useCart();
    const toast = useRef(null);
    const carouselRef = useRef(null);

    const showSuccessToast = () => {
        toast.current.show({
            severity: 'success', summary: 'เพิ่มในตะกร้าแล้ว', life: 2000
        });
    };

    const showWarningToast = () => {
        toast.current.show({
            severity: 'error', summary: 'เข้าสู่ระบบเพื่อเพิ่มสินค้าใส่ตะกร้า', life: 2000
        });
    };

    const addCart = (product) => {
        const token = localStorage.getItem("token");
        if (!token) {
            showWarningToast();
            window.location.href = 'https://service.tossaguns.com/'
        } else {
            addToCart(product)
            showSuccessToast();
        }
    };

    const productSubset = data.slice(startIndex, startIndex + 5);

    const productTemplate = (product) => {
        return product ? (
            <div className="carousel-product-item h-full border-1 surface-border mx-1 bg-white flex flex-column" style={{
                position: "relative", display: "inline-block",
                top: "0",
                right: "0",
            }}>
                <p className={`w-fit border-noround-top border-noround-right mt-2 px-2 border-round-md font-normal ${product.product_provider === 'coop' ? 'bg-green-600 text-white' : 'bg-primary-400 text-900'}`} style={{
                    position: "absolute",
                    top: "-0.5rem",
                    right: "0rem",
                    zIndex: "5"
                }}>{product.product_provider === 'coop' ? 'สินค้าสหกรณ์' : 'สินค้าทั่วไป'}</p>
                <div className="align-items-center justify-content-center">
                    <Link to={`/List-Product/product/${product._id}`} state={{ product }}>
                        <div className="carousel-square-image">
                            <img
                                src={`${product.product_image
                                    ? apiProductUrl + product.product_image
                                    : product.product_subimage1
                                        ? apiProductUrl + product.product_subimage1
                                        : product.product_subimage2
                                            ? apiProductUrl + product.product_subimage2
                                            : product.product_subimage3
                                                ? apiProductUrl + product.product_subimage3
                                                : img_placeholder}`}
                                alt={product.product_name}
                                className="w-12 border-1 surface-border"
                            />
                        </div>
                    </Link>
                </div>
                <div className="h-full flex flex-column justify-content-between pt-">
                    <h4 className="m-0 font-normal two-lines-ellipsis">
                        {product.product_name}
                    </h4>
                    <div className="flex align-items-center justify-content-between">
                        <div className="font-bold">฿{Number(product.product_price).toLocaleString("en-US")}</div>
                        <Button className="btn-plus-product" icon="pi pi-plus" onClick={() => addCart(product)} />
                    </div>
                </div>
            </div>
        ) : (
            ""
        );
    };

    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 5
        },
        {
            breakpoint: '1199px',
            numVisible: 5
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 2
        }
    ];

    return (
        <>
            <Toast ref={toast} position="top-center" />
            <div className="block md:hidden products-carousel-wrapper">
                <div className="products-carousel" ref={carouselRef}>
                    {data.map((product, index) => (
                        <div key={index} className="product-item">
                            {productTemplate(product)}
                        </div>
                    ))}
                </div>
            </div>

            <div className="hidden md:block">
                <Carousel
                    value={data}
                    numVisible={5}
                    numScroll={3}
                    showIndicators={false}

                    responsiveOptions={responsiveOptions}
                    itemTemplate={productTemplate} />
            </div>
        </>
    );
}

export default Products

