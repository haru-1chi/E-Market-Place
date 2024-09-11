import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from '../../router/CartContext';
import Filter from "../../component/Filter";
import FilterSort from '../../component/FilterSort';
import Footer from "../../component/Footer";
import { Paginator } from 'primereact/paginator';
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import img_placeholder from '../../assets/img_placeholder.png';

function ListProductsPage() {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
  const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || ""; //search
  const { addToCart } = useCart();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);  //filter
  const [paginatedData, setPaginatedData] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(40);
  const [visible, setVisible] = useState(false);
  const [visibleSort, setVisibleSort] = useState(false);
  const toast = useRef(null);
  const categoriesLocation = location.state?.categoryName ? location.state.categoryName : [];
  const defaultFilters = {
    priceRanges: { key: 'allRange', value: 'All' },
    selectedCategories: [],
    selectedBrands: []
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [sortOption, setSortOption] = useState('default'); //sort
  const [activeTab, setActiveTab] = useState("");
  const [priceSortOrder, setPriceSortOrder] = useState(null);

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

  const filterProducts = (products, searchTerm, categoryName) => {
    return products.filter((product) => {
      if (searchTerm) {
        return product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (categoryName) {
        return product.product_category.includes(categoryName)
      }
      return products;
    });
  };

  const sortProducts = (products, sortOption) => {   //sort
    if (sortOption === 'lowToHigh') {
      return [...products].sort((a, b) => a.product_price - b.product_price);
    } else if (sortOption === 'highToLow') {
      return [...products].sort((a, b) => b.product_price - a.product_price);
    }
    return products;
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(`${apiUrl}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);



  const applyFilters = useCallback((filters) => {
    let filtered = data;

    if (filters.priceRanges.key !== 'allRange') {
      filtered = filtered.filter(product => product.product_price >= filters.priceRanges.min && product.product_price <= filters.priceRanges.max);
    }

    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(product => filters.selectedCategories.includes(product.product_category));
    }

    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter(product => filters.selectedBrands.includes(product.product_brand));
    }

    filtered = sortProducts(filtered, sortOption);

    setFilteredData(filtered);
    setPaginatedData(filtered.slice(first, first + rows));

  }, [data, sortOption, first, rows]);

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const handleSortChange = (sortOption) => {
    setSortOption(sortOption);
    applyFilters({ ...filters, sortOption });
  };

  const fetchData = () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${apiProductUrl}/product`
    })
      .then((response) => {
        const filtered = filterProducts(response.data.data, searchTerm, location.state?.categoryName);
        setData(filtered);
        setFilteredData(filtered);
        setPaginatedData(filtered.slice(first, first + rows));
      })
      .catch((error) => {
        console.log(error);
        console.log(apiUrl);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, location.state?.categoryName]);

  useEffect(() => {
    const categoryName = location.state?.categoryName;
    const updatedFilters = {
      ...filters,
      selectedCategories: categoryName ? [categoryName, ...(filters.selectedCategories)] : filters.selectedCategories,
    };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  }, [location.state?.categoryName, applyFilters, filters]);

  useEffect(() => {
    setPaginatedData(filteredData.slice(first, first + rows));
  }, [first, rows, filteredData]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
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

  useEffect(() => {
    if (activeTab !== "price") {
      setPriceSortOrder(null);
    }
  }, [activeTab]);

  const sortData = () => {
    let sortedData = [...paginatedData];
    if (activeTab === "new") {
      sortedData.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
    } else if (activeTab === "topSales") {
      sortedData.sort((a, b) => b.sales_count - a.sales_count);
    } else if (activeTab === "price") {
      sortedData.sort((a, b) =>
        priceSortOrder === "asc"
          ? a.product_price - b.product_price
          : b.product_price - a.product_price
      );
    } else if (activeTab === "popular") {
      sortedData.sort((a, b) => b.popularity_score - a.popularity_score);
    }
    return sortedData;
  };


  return (
    <>
      <Toast ref={toast} position="top-center" />
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
      <div className="p-3">
        {/* <div className="flex justify-content-between">
          <div className="w-full flex justify-content-between align-items-center">
            <h1 className="font-semibold">รายการสินค้า</h1>
            <div className="hidden lg:block">
              <div className="flex gap-2">
                <p className="text-sm">เรียงตาม</p>
                <FilterSort onSortChange={handleSortChange} visibleSort={visibleSort}
                  setVisibleSort={setVisibleSort} />
              </div>
            </div>
          </div>
          <div className="lg:hidden flex">
            <Button
              className="px-2"
              onClick={() => setVisibleSort(true)}
              label="เรียง" icon="pi pi-sort-alt"
              text
            />
            <Button
              className="px-2"
              onClick={() => setVisible(true)}
              label="กรอง" icon="pi pi-sliders-h"
              text
            />
          </div>

        </div> */}
        <div className="panel w-full flex">
          <div className="hidden lg:block mr-3">
            {data.length > 0 && (
              <Filter
                onFilterChange={handleFilterChange}
                products={data}
                visible={visible}
                setVisible={setVisible}
                initialFilters={filters}
                categoriesLocation={categoriesLocation}
              />
            )}
          </div>
          {loading ? (
            <div className="w-full flex justify-content-center align-items-center">
              <ProgressSpinner />
            </div>
          ) : (
            <>
              {data.length ? (
                <div className="w-full">
                  {/* {searchTerm && <h2 className="mt-0 font-semibold">ผลการค้นหา "{searchTerm}"</h2>}
                  {location.state?.categoryName && <h2 className="mt-0 font-semibold">ผลการค้นหาตามหมวดหมู่ "{location.state?.categoryName}"</h2>} */}
                  <div className="product-list">
                    {sortData().map((product, index) => (
                      <div key={index} className="relative flex h-18rem md:h-28rem">
                        <div className="w-full border-1 surface-border bg-white flex flex-column">
                          <Link to={`/List-Product/product/${product._id}`} state={{ product }}>
                            <div className="square-image">
                              <img
                                src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                alt={product.product_name}
                                className="w-12 border-1 surface-border"
                              /></div>
                          </Link>
                          <div className="h-full px-2 flex flex-column justify-content-between">
                            <h4 className="m-0 p-0 font-normal two-lines-ellipsis">{product.product_name}</h4>
                            <div className="flex align-items-center justify-content-between mb-1">
                              <div className="font-bold">{Number(product.product_price).toLocaleString('en-US')} ฿</div>
                              {/* <Button
                                className="btn-plus-product"
                                icon="pi pi-plus"
                                rounded
                                onClick={() => addCart(product)}
                              /> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  {searchTerm && <h2 className="mt-0 font-semibold">ผลการค้นหา "{searchTerm}"</h2>}
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
                        onClick="" /></Link>
                      <Link to="/">
                        <Button
                          className="w-12rem"
                          label="ลองค้นหาด้วยคำอื่นๆ"
                          rounded
                          outlined
                          onClick="" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="card">
        <Paginator first={first} rows={rows} totalRecords={filteredData.length} onPageChange={onPageChange} template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
      </div>
      <Footer />
    </>
  );
}

export default ListProductsPage;