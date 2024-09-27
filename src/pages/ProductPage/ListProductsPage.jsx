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
import CategoriesIcon from "../../component/CategoriesIcon";

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
  const providersLocation = location.state?.providerName ? location.state.providerName : [];
  const defaultFilters = {
    priceRanges: { key: 'allRange', value: 'All' },
    selectedProviders: [],
    selectedCategories: [],
    selectedSubCategories: []
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [sortOption, setSortOption] = useState('default');
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

  const filterProducts = (products, searchTerm, categoryName, providerName) => {
    return products.filter((product) => {
      if (searchTerm) {
        return product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      else if (categoryName) {
        return product.product_category.includes(categoryName);
      }
      else if (providerName) {
        return product.product_provider.includes(providerName);
      }
      return true;
    });
  };

  const sortProducts = (products, sortOption) => {
    if (sortOption === 'lowToHigh') {
      return [...products].sort((a, b) => a.product_price - b.product_price);
    } else if (sortOption === 'highToLow') {
      return [...products].sort((a, b) => b.product_price - a.product_price);
    }
    return products;
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = () => {

      const fetchedCategories = Object.keys(CategoriesIcon).map((categoryName, index) => ({
        key: index,
        name: categoryName,
        icon: CategoriesIcon[categoryName]
      }));

      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);



  const applyFilters = useCallback((filters) => {
    let filtered;

    if (searchTerm) {
      filtered = filteredData;
    } else {
      filtered = data;
    }

    if (filters.priceRanges.key !== 'allRange') {
      filtered = filtered.filter(product => product.product_price >= filters.priceRanges.min && product.product_price <= filters.priceRanges.max);
    }

    if (filters.selectedProviders.length > 0) {
      filtered = filtered.filter(product => filters.selectedProviders.includes(product.product_provider));
    }

    if (filters.selectedCategories.length > 0 || filters.selectedSubCategories.length > 0) {
      filtered = filtered.filter(product => {
        const categoryMatch = filters.selectedCategories.includes(product.product_category);
        const subcategoryMatch = product.product_subcategory.some(subcategory =>
          filters.selectedSubCategories.includes(subcategory)
        );
        return categoryMatch || subcategoryMatch;
      });
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
        const filtered = filterProducts(response.data.data, searchTerm, location.state?.categoryName, location.state?.providerName);
        // const filtered = filterProducts(response.data.data, searchTerm);
        setData(response.data.data);
        setFilteredData(filtered);
        setPaginatedData(filtered.slice(first, first + rows));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    // }, [apiProductUrl, searchTerm, location.state?.categoryName, location.state?.providerName, first, rows]);
  }, [apiProductUrl, searchTerm, first, rows]);

  useEffect(() => {
    const categoryName = location.state?.categoryName;
    const providerName = location.state?.providerName;
    const updatedFilters = {
      ...filters,
      selectedCategories: categoryName
        ? [...new Set([categoryName, ...filters.selectedCategories])]
        : filters.selectedCategories,
      selectedProviders: providerName
        ? [...new Set([providerName, ...filters.selectedProviders])]
        : filters.selectedProviders,
    };
    if (JSON.stringify(updatedFilters) !== JSON.stringify(filters)) {
      setFilters(updatedFilters);
    }
    applyFilters(updatedFilters);
  }, [location.state?.categoryName, location.state?.providerName, applyFilters, filters]);

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
      window.location.href = 'https://service.tossaguns.com/'
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
      sortedData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (activeTab === "topSales") {
      sortedData.sort((a, b) => a.product_stock - b.product_stock);
    } else if (activeTab === "price") {
      sortedData.sort((a, b) =>
        priceSortOrder === "asc"
          ? a.product_price - b.product_price
          : b.product_price - a.product_price
      );
    } else if (activeTab === "popular") {
      sortedData.sort((a, b) => b.product_stock - a.product_stock);
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
        <div className="flex justify-content-end mb-2 md:mb-0">
          {/* <div className="w-full flex justify-content-between align-items-center">
            <h1 className="font-semibold">รายการสินค้า</h1>
            <div className="hidden lg:block">
              <div className="flex gap-2">
                <p className="text-sm">เรียงตาม</p>
                <FilterSort onSortChange={handleSortChange} visibleSort={visibleSort}
                  setVisibleSort={setVisibleSort} />
              </div>
            </div>
          </div> */}
          <div className="lg:hidden flex">
            {/* <Button
              className="px-2"
              onClick={() => setVisibleSort(true)}
              label="เรียง" icon="pi pi-sort-alt"
              text
            /> */}
            <Button
              className="py-1 px-2"
              onClick={() => setVisible(true)}
              label="กรอง" icon="pi pi-sliders-h"
         
            />
          </div>

        </div>
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
                providersLocation={providersLocation}
              />
            )}
          </div>
          {loading ? (
            <div className="w-full flex justify-content-center align-items-center">
              <ProgressSpinner />
            </div>
          ) : (
            <>
              {paginatedData.length ? (
                <div className="w-full">
                  {/* {searchTerm && <h2 className="mt-0 font-semibold">ผลการค้นหา &quot;{searchTerm}&quot;</h2>} */}
                  {location.state?.categoryName && <h2 className="mt-0 text-xs">ผลการค้นหาตามหมวดหมู่ &quot;{location.state?.categoryName}&quot;</h2>}
                  <div className="product-list">
                    {sortData().map((product, index) => (
                      <div key={index} className="relative flex h-18rem sm:h-28rem">
                        <div className="w-full border-1 surface-border bg-white flex flex-column">
                          <Link to={`/List-Product/product/${product._id}`} state={{ product }}>
                            <div className="square-image">
                              <img
                                src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                alt={product.product_name}
                                className="w-12 border-1 surface-border"
                              />
                              <p className={`w-fit border-noround-top border-noround-right mt-2 px-2 border-round-md font-normal ${product.product_provider === 'coop' ? 'bg-green-600 text-white' : 'bg-primary-400 text-900'}`} style={{
                                position: "absolute",
                                top: "-0.5rem",
                                right: "0rem"
                              }}>{product.product_provider === 'coop' ? 'สินค้าสหกรณ์' : 'สินค้าทั่วไป'}</p>
                            </div>
                          </Link>
                          <div className="h-full p-2 flex flex-column justify-content-between">
                            <div>
                              <p className="m-0 p-0 text-xs font-normal text-right">คลัง : {product.product_stock}</p>
                              <h4 className="m-0 p-0 font-normal two-lines-ellipsis">{product.product_name}</h4>

                            </div>

                            <div className="flex align-items-center justify-content-between">
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
                  {/* {searchTerm && <h2 className="mt-0 font-semibold">ผลการค้นหา "{searchTerm}"</h2>} */}
                  {location.state?.categoryName && <h2 className="mt-0 text-xs">ผลการค้นหาตามหมวดหมู่ &quot;{location.state?.categoryName}&quot;</h2>}
                  <div className="w-full flex justify-content-center">
                    <div className="flex flex-column justify-content-center align-items-center">
                      <div className='flex justify-content-center'>
                        {/* <img src="https://www.makro.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpage-not-found.7cd1edd1.png&w=1920&q=75" alt="" className='w-16rem' /> */}
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
      <div className="card">
        <Paginator first={first} rows={rows} totalRecords={filteredData.length} onPageChange={onPageChange} template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
      </div>
      <Footer />
    </>
  );
}

export default ListProductsPage;