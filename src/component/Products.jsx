import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { useCart } from '../router/CartContext';
import { Toast } from 'primereact/toast';
function Products({ data, startIndex }) {

    // const data = [
    //     {
    //         id : '1',
    //         imgURL : 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fimages.mango-prod.siammakro.cloud%2FSOURCE%2F074fc00deace464ba94af3b81fe4ec78&w=384&q=75',
    //         name : 'product',
    //         price : '999.00'
    //     },
    //     {
    //         id : '2',
    //         imgURL : 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fimages.mango-prod.siammakro.cloud%2FSOURCE%2F074fc00deace464ba94af3b81fe4ec78&w=384&q=75',
    //         name : 'product',
    //         price : '999.00'
    //     },
    //     {
    //         id : '3',
    //         imgURL : 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fimages.mango-prod.siammakro.cloud%2FSOURCE%2F074fc00deace464ba94af3b81fe4ec78&w=384&q=75',
    //         name : 'product',
    //         price : '999.00'
    //     },
    //     {
    //         id : '4',
    //         imgURL : 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fimages.mango-prod.siammakro.cloud%2FSOURCE%2F074fc00deace464ba94af3b81fe4ec78&w=384&q=75',
    //         name : 'product',
    //         price : '999.00'
    //     }
    //     ,
    //     {
    //         id : '4',
    //         imgURL : 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fimages.mango-prod.siammakro.cloud%2FSOURCE%2F074fc00deace464ba94af3b81fe4ec78&w=384&q=75',
    //         name : 'product',
    //         price : '999.00'
    //     }
    // ];
    const { addToCart } = useCart();
    const toast = useRef(null);
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
            navigate("/LoginPage");
        } else {
            addToCart(product)
            showSuccessToast();
        }
    };
    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 5,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 4,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 2,
            numScroll: 1
        }
    ];
    const productSubset = data.slice(startIndex, startIndex + 5);

    const productTemplate = (product) => {
        return (
            product ? (
                <div className="carousel-product-items border-1 surface-border m-2 py-3 px-3 bg-white border-round-md flex flex-column justify-content-between">
                    <div className="flex align-items-center justify-content-center">
                        <Link to={`/List-Product/product/${product.product_id}`} state={{ product }}>
                            <img
                                src={product.product_image}
                                alt={product.product_name}
                                className="w-12" />
                        </Link>
                    </div>
                    <div>
                        <h4 className="m-0 pb-1 border-bottom-1 surface-border">{product.product_name}</h4>
                        <div className="bg-product flex align-items-center justify-content-between p-2 mt-2">
                            <div className='font-bold'>{Number(product.product_price).toLocaleString('en-US')} ฿</div>
                            <Button
                                className='btn-plus-product'
                                icon="pi pi-plus"
                                rounded
                                onClick={() => addCart(product)}
                            />
                        </div>
                    </div>
                </div>
            ) : ("")
        );
    };

    return (
        <div className="card p-1">
            <Toast ref={toast} position="top-center" />
            <Carousel
                value={productSubset}
                numVisible={5}
                numScroll={5}
                responsiveOptions={responsiveOptions}
                showIndicators={false}
                showNavigators={false}
                itemTemplate={productTemplate} />
        </div>
    )
}

export default Products