import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Link, useLocation, useParams } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from "axios";
import img_placeholder from '../../assets/img_placeholder.png';
import Footer from "../../component/Footer";

function ShopCategriesSelected() {
    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const { partner_id } = useParams();
    const location = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('');
    const [priceSortOrder, setPriceSortOrder] = useState(null);

    const filterProducts = (products, categoryName) => {
        return products.filter((product) => {
            if (categoryName) {
                return product.product_category.includes(categoryName)
            }
            return products;
        });
    };

    const fetchData = () => {
        setLoading(true);
        axios({
            method: "get",
            url: `${apiProductUrl}/product/bypartner/${partner_id}`,
        })
            .then((response) => {
                const filtered = filterProducts(response.data.data, location.state?.categoryName);
                setData(filtered);

                setData(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                console.log(apiProductUrl);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [location.state?.categoryName, partner_id]);

    useEffect(() => {
        if (activeTab !== 'price') {
            setPriceSortOrder(null);
        }
    }, [activeTab]);

    const sortData = () => {
        let sortedData = [...data];
        if (activeTab === 'new') {
            sortedData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else if (activeTab === 'topSales') {
            sortedData.sort((a, b) => a.product_stock - b.product_stock);
        } else if (activeTab === 'price') {
            sortedData.sort((a, b) => priceSortOrder === 'asc'
                ? a.product_price - b.product_price
                : b.product_price - a.product_price);
        } else if (activeTab === 'popular') {
            sortedData.sort((a, b) => b.product_stock - a.product_stock);
        }
        return sortedData;
    };

    return (
        <div className="h-screen flex flex-column justify-content-between">
            <div>
            <ul className='section-sortbar bg-white flex justify-content-between list-none m-0 px-5 py-0 gap-5 border-bottom-1 surface-border'>
                <li className={`py-2 list-none cursor-pointer ${activeTab === 'popular' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                    onClick={() => setActiveTab('popular')}>
                    ยอดนิยม
                </li>
                <li className={`py-2 list-none cursor-pointer ${activeTab === 'new' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                    onClick={() => setActiveTab('new')}>
                    ใหม่
                </li>
                <li className={`py-2 list-none cursor-pointer ${activeTab === 'topSales' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                    onClick={() => setActiveTab('topSales')}>
                    สินค้าขายดี
                </li>
                <li className={`py-2 list-none cursor-pointer ${activeTab === 'price' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                    onClick={() => {
                        setActiveTab('price');
                        setPriceSortOrder((prevOrder) => prevOrder === 'asc' ? 'desc' : 'asc');
                    }}>
                    ราคา{" "}
                    <i className={`pi ${priceSortOrder === 'asc' ? 'pi-arrow-down' : priceSortOrder === 'desc' ? 'pi-arrow-up' : 'pi-sort-alt'}`} />
                </li>
            </ul>
            <div className="w-full p-3">
                {loading ? (
                    <div className="w-full flex justify-content-center align-items-center">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <>
                        {data.length ? (
                            <div className="w-full">
                                <div className="product-list">
                                    {data.map((product, index) => (
                                        <div key={index} className="relative flex h-18rem md:h-28rem">
                                            <div className="w-full border-1 surface-border bg-white flex flex-column">
                                                <Link to={`/List-Product/product/${product._id}`} state={{ product }}>
                                                    <div className="square-image">
                                                        <img
                                                            src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                                            alt={product.product_name}
                                                            className="w-12 border-1 surface-border"
                                                        />
                                                    </div>
                                                </Link>
                                                <div className="h-full px-2 flex flex-column justify-content-between">
                                                    <h4 className="m-0 p-0 font-normal two-lines-ellipsis">{product.product_name}</h4>
                                                    <div className="flex align-items-center justify-content-between mb-1">
                                                        <div className="font-bold">฿{Number(product.product_price).toLocaleString('en-US')}</div>
                                                        <Button
                                                            className='btn-plus-product'
                                                            icon="pi pi-plus"
                                                            onClick={() => addCart(product)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="w-full flex justify-content-center">
                                    <div className="flex flex-column justify-content-center align-items-center">
                                        <div className='flex justify-content-center'>
                                            <img src="https://www.makro.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpage-not-found.7cd1edd1.png&w=1920&q=75" alt="" className='w-16rem' />
                                        </div>
                                        <h2 className="font-semibold mt-0 mb-2">ขออภัย</h2>
                                        <p className="mt-0">ไม่พบข้อมูลจากการค้นหา</p>
                                        <Link to="/"><Button
                                            className="w-12rem mb-3"
                                            label="ค้นหาตามหมวดหมู่"
                                            rounded
                                        /></Link>
                                        <Link to="/">
                                            <Button
                                                className="w-12rem"
                                                label="ลองค้นหาด้วยคำอื่นๆ"
                                                rounded
                                                outlined
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            </div>
            <Footer />
        </div>
    )
}

export default ShopCategriesSelected
