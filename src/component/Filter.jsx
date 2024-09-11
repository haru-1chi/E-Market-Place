import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { Sidebar } from 'primereact/sidebar';
import { Button } from "primereact/button";
import axios from 'axios';
//
import { useTranslation } from "react-i18next";
//

function Filter({ onFilterChange, products, visible, setVisible, initialFilters, categoriesLocation }) {
    const navigate = useNavigate();
    const { t } = useTranslation()
    const { filter, clearFilter, priceRange, all, stock, instock, product_category, brand, promotion, onSale, show } = t("Filter")

    const generatePriceRanges = (products) => {
        const prices = products.map(product => product.product_price);
        const maxPrice = Math.max(...prices);
        const step = 500;
        const ranges = [{ key: 'allRange', value: 'ดูเพิ่มเติม' }];

        for (let i = 0; i <= maxPrice; i += step) {
            const min = i;
            const max = i + step;
            const hasData = products.some(product => product.product_price >= min && product.product_price < max);

            ranges.push({
                key: `${min}-${max}`,
                value: `${min} ฿ - ${max} ฿`,
                min: min,
                max: max,
                hasData: hasData
            });
        }

        for (let i = ranges.length - 2; i >= 1; i--) {
            if (!ranges[i].hasData) {
                ranges.splice(i, 1);
            } else {
                break;
            }
        }

        let lastRangeMax = 0;
        if (ranges.length > 1 && ranges[ranges.length - 2]) {
            lastRangeMax = ranges[ranges.length - 2].max || null;
        }

        ranges.pop();
        if (lastRangeMax !== null) {
            ranges.push({
                key: `${lastRangeMax}`,
                value: `${lastRangeMax} ฿+`,
                min: lastRangeMax,
                max: Infinity,
                hasData: true
            });
        }
        return ranges;
    };

    const generateFiltersFromData = (products) => {
        const uniqueCategories = [
            ...new Set(products.map(product => product.product_category))
        ];
        const uniqueBrands = [...new Set(products.map(item => item.product_brand))];

        return {
            categoryOptions: uniqueCategories.map(categoryName => ({
                key: categoryName,
                value: categoryName
            })),
            brandOptions: uniqueBrands.map(brand => ({
                key: brand,
                value: brand
            }))
        };
    };

    const priceRanges = generatePriceRanges(products);
    const { categoryOptions, brandOptions } = generateFiltersFromData(products);

    const [filters, setFilters] = useState(initialFilters || {
        priceRanges: { key: 'allRange', value: `${all}` },
        selectedCategories: [],
        selectedBrands: [],
    });

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const clearFilters = () => {
        const clearedFilters = {
            priceRanges: { key: 'allRange', value: `${all}` },
            selectedCategories: [],
            selectedBrands: [],
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
        navigate(location.pathname, { replace: true });
    };

    const handleFilterChange = (key, value) => {
        const updatedFilters = { ...filters, [key]: value };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const handleCheckboxChange = (key, value, checked) => {
        const updatedList = checked
            ? [...filters[key], value]
            : filters[key].filter(item => item !== value);
    
        const updatedFilters = { ...filters, [key]: updatedList };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
        
        if (!checked && value === categoriesLocation) {
            navigate(location.pathname, { replace: true });
        }
    };

    const sectionLabels = {
        priceRanges: `${priceRange}`,
        selectedCategories: `${product_category}`,
        selectedBrands: `${brand}`,
    };

    const [expandedSections, setExpandedSections] = useState({
        priceRanges: true,
        selectedCategories: true,
        selectedBrands: true,
    });

    const toggleSection = (section) => {
        setExpandedSections(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    return (
        <div className="lg:flex">
            <Sidebar
                visible={visible}
                position="right"
                onHide={() => setVisible(false)}
            >

                <div className="w-full px-3 bg-white flex flex-column justify-content-between">

                    <div className="flex justify-content-between">
                        <div className="flex align-items-center">
                            <i className="pi pi-sliders-h"></i>
                            <p className='ml-2 font-semibold text-l'>{filter}</p>
                        </div>
                    </div>
                    {Object.entries(expandedSections).map(([section, expanded]) => (
                        <div key={section}>
                            <div className="flex justify-content-between" onClick={() => toggleSection(section)}>
                                <p>{sectionLabels[section]}</p>
                                <p><i className={`pi ${expanded ? 'pi-minus' : 'pi-plus'}`}></i></p>
                            </div>
                            {expanded && (section === 'priceRanges' ? priceRanges : section === 'selectedCategories' ? categoryOptions : brandOptions).map((option) => (
                                <div className="mb-2" key={option.key}>
                                    {section === 'priceRanges' ? (
                                        <RadioButton
                                            inputId={option.key}
                                            value={option}
                                            name={section}
                                            checked={filters[section].key === option.key}
                                            onChange={(e) => handleFilterChange(section, e.value)}
                                        />
                                    ) : (
                                        <Checkbox
                                            inputId={option.key}
                                            value={option.key}
                                            onChange={(e) => handleCheckboxChange(section, option.key, e.target.checked)}
                                            checked={filters[section].includes(option.key)} />
                                    )}
                                    <label htmlFor={option.key} className="ml-2">{option.value}</label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="filter-card-group w-full bg-white flex flex-column">
                        <Button
                            className='p-3 mb-2'
                            onClick={clearFilters}
                            aria-label="Clear Filters"
                            label={clearFilter} icon="pi pi-refresh"
                            text />
                        <Button
                            className='mb-2'
                            onClick={() => setVisible(false)}
                            label={show}
                        />

                    </div>

                </div>
            </Sidebar>

            <div className="filter-card border-1 surface-border border-round py-2 px-3 bg-white flex flex-column justify-content-between">
                <div className="flex justify-content-between">
                    <div className="flex align-items-center">
                        <i className="pi pi-sliders-h"></i>
                        <p className='ml-2'>{filter}</p>
                    </div>
                    <Button
                        className='p-2'
                        onClick={clearFilters}
                        aria-label="Clear Filters"
                        label={clearFilter} icon="pi pi-refresh"
                        text />
                </div>
                {Object.entries(expandedSections).map(([section, expanded]) => (
                    <div key={section}>
                        <div className="flex justify-content-between" onClick={() => toggleSection(section)}>
                            <p>{sectionLabels[section] || section}</p>
                            <p><i className={`pi ${expanded ? 'pi-minus' : 'pi-plus'}`}></i></p>
                        </div>
                        {expanded && (section === 'priceRanges' ? priceRanges : section === 'selectedCategories' ? categoryOptions : brandOptions).map((option) => (
                            <div className="mb-2" key={option.key}>
                                {section === 'priceRanges' ? (
                                    <RadioButton
                                        inputId={option.key}
                                        value={option}
                                        checked={filters[section].key === option.key}
                                        onChange={(e) => handleFilterChange(section, e.value)}
                                    />
                                ) : (
                                    <Checkbox
                                        inputId={option.key}
                                        value={option.key}
                                        onChange={(e) => handleCheckboxChange(section, option.key, e.target.checked)}
                                        checked={filters[section].includes(option.key)} />
                                )}
                                <label htmlFor={option.key} className="ml-2">{option.value}</label>
                            </div>
                        ))}
                    </div>
                ))}

            </div>

        </div>
    );
}

export default Filter;