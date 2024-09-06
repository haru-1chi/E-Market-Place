import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CategoriesIcon from "../../component/CategoriesIcon";

function ShopCategries() {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post(`${apiUrl}/categories`);
                const dataWithImages = response.data.map((category) => ({
                    ...category,
                    imgURL: CategoriesIcon[category.name] || "default-image-url.png",
                }));

                setCategories(dataWithImages);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategorySelect = (categoryName) => {
        navigate("/ShopCategriesSelected", { state: { categoryName } });
    };

    return (
        <div className="shop-categories bg-white p-3">
            <div className="box-menu hover:surface-hover pb-3 ">
                <Link
                    to="/ShopCategriesSelected"
                    className="flex justify-content-between"
                >
                    <div className="flex align-items-center">
                        <img
                            src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FL1_Makro_House_Brand_4a70c6e25a.png&w=32&q=75"
                            alt="สินค้าทุกหมวดหมู่"
                            width={30}
                            height={30}
                        />
                        <span className="ml-3">สินค้าทุกหมวดหมู่</span>
                    </div>
                    <i className="pi pi-angle-right mr-2"></i>
                </Link>
            </div>
            {categories.map((Item) => (
                <div
                    className="box-menu py-3 hover:surface-hover"
                    onClick={() => handleCategorySelect(Item.name)}
                >
                    <Link
                        className="flex justify-content-between align-items-center"
                    >
                        <div className="flex align-items-center">
                            <img
                                src={Item.imgURL}
                                alt="Item.name"
                                width={30}
                                height={30}
                            />
                            <span className="ml-3">{Item.name}</span>
                        </div>
                        <i className="pi pi-angle-right mr-2"></i>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default ShopCategries
