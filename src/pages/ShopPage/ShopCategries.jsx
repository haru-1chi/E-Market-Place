import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CategoriesIcon from "../../component/CategoriesIcon";

function ShopCategries({partner_id}) {
    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const fetchData = () => {
        setLoading(true);
        axios({
            method: "get",
            url: `${apiProductUrl}/product/bypartner/${partner_id}`,
        })
            .then((response) => {
                const categoryData = generateFiltersFromData(response.data.data);
                setCategories(categoryData);
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
        if (partner_id) {
            fetchData();
        }
    }, [partner_id]);

    const generateFiltersFromData = (products) => {
        const uniqueCategories = [...new Set(products.map(product => product.product_category))];
        return uniqueCategories.map((categoryName, index) => ({
            key: index,
            name: categoryName,
        }));
    };

    const handleCategorySelect = (categoryName) => {
        navigate(`/ShopCategriesSelected/${partner_id}`, { state: { categoryName} });
    };

    return (
        <div className="shop-categories bg-white p-3">
            <div className="box-menu hover:surface-hover pb-3 ">
                <Link
                    to={`/ShopCategriesSelected/${partner_id}`}
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
            {categories.map((Item,index) => (
                <div
                    className="box-menu py-3 hover:surface-hover"
                    onClick={() => handleCategorySelect(Item.name)}
                    key={index}
                >
                    <Link
                        className="flex justify-content-between align-items-center"
                    >
                        <div className="flex align-items-center">
                            <img
                                src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FL1_Makro_House_Brand_4a70c6e25a.png&w=32&q=75"
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
