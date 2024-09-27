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

function Filter({ onFilterChange, products, visible, setVisible, initialFilters, categoriesLocation, providersLocation }) {
    const navigate = useNavigate();
    const { t } = useTranslation()
    const { filter, clearFilter, priceRange, all, stock, instock, product_category, promotion, onSale, show } = t("Filter")

    const generatePriceRanges = (products) => {
        const prices = products.map(product => product.product_price);
        const maxPrice = Math.max(...prices);
        const step = 500;
        const ranges = [{ key: 'allRange', value: 'ทั้งหมด' }];

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
        const uniqueProviders = [
            ...new Set(products.map(product => product.product_provider))
        ];

        const uniqueCategories = [
            ...new Set(products.map(product => product.product_category))
        ];

        const uniqueSubCategories = {};
        uniqueCategories.forEach(category => {
            uniqueSubCategories[category] = [
                ...new Set(
                    products
                        .filter(product => product.product_category === category)
                        .flatMap(product => product.product_subcategory)
                )
            ];
        });

        return {
            providerOptions: uniqueProviders.map(providerName => ({
                key: providerName,
                value: providerName === 'coop' ? 'สินค้าสหกรณ์' : providerName === 'normal' ? 'สินค้าทั่วไป' : providerName,
            })),
            categoryOptions: uniqueCategories.map(categoryName => ({
                key: categoryName,
                value: categoryName
            })),
            subcategoryOptions: uniqueSubCategories
        };
    };

    const priceRanges = generatePriceRanges(products);
    const { providerOptions, categoryOptions, subcategoryOptions } = generateFiltersFromData(products);
    const [filters, setFilters] = useState(initialFilters || {
        priceRanges: { key: 'allRange', value: `${all}` },
        selectedProviders: [],
        selectedCategories: [],
        selectedSubCategories: []
    });

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const clearFilters = () => {
        const clearedFilters = {
            priceRanges: { key: 'allRange', value: `${all}` },
            selectedProviders: [],
            selectedCategories: [],
            selectedSubCategories: []
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

        if (!checked && value === providersLocation) {
            navigate(location.pathname, { replace: true });
        }
    };

    const sectionLabels = {
        priceRanges: 'ช่วงราคา',
        selectedProviders: 'ประเภทสินค้า',
        selectedCategories: 'หมวดหมู่',

    };

    const [expandedSections, setExpandedSections] = useState({
        priceRanges: true,
        selectedProviders: true,
        selectedCategories: true,
    });

    const toggleSection = (section) => {
        setExpandedSections(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const [expandedCategories, setExpandedCategories] = useState({});

    const handleCheckboxCategoryChange = (key, value, checked) => {
        let updatedFilters;
        if (key === 'selectedCategories') {
            let updatedSubCategories = [...filters.selectedSubCategories];
            if (checked) {
                updatedSubCategories = [
                    ...new Set([
                        ...updatedSubCategories,
                        ...subcategoryOptions[value]
                    ])
                ];
            } else {
                updatedSubCategories = updatedSubCategories.filter(
                    (sub) => !subcategoryOptions[value].includes(sub)
                );
            }

            updatedFilters = {
                ...filters,
                [key]: checked
                    ? [...filters[key], value]
                    : filters[key].filter(item => item !== value),
                selectedSubCategories: updatedSubCategories
            };

        } else if (key === 'selectedSubCategories') {
            const updatedList = checked
                ? [...filters[key], value]
                : filters[key].filter(item => item !== value);

            const parentCategory = Object.keys(subcategoryOptions).find(category =>
                subcategoryOptions[category].includes(value)
            );

            const areAllSubCategoriesChecked = subcategoryOptions[parentCategory].every(sub =>
                updatedList.includes(sub)
            );

            updatedFilters = {
                ...filters,
                selectedCategories: areAllSubCategoriesChecked
                    ? [...filters.selectedCategories, parentCategory]
                    : filters.selectedCategories.filter(item => item !== parentCategory),
                [key]: updatedList
            };
        }
        if (!checked && value === categoriesLocation) {
            navigate(location.pathname, { replace: true });
        }
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prevState => ({
            ...prevState,
            [category]: !prevState[category]
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
                                <p className='cursor-pointer'><i className={`pi ${expanded ? 'pi-minus' : 'pi-plus'}`}></i></p>
                            </div>

                            {expanded && (
                                <div>
                                    {/* Render the appropriate options based on the section */}
                                    {section === 'priceRanges' ? (
                                        priceRanges.map((option) => (
                                            <div className="mb-2" key={option.key}>
                                                <RadioButton
                                                    inputId={option.key}
                                                    value={option}
                                                    name={section}
                                                    checked={filters[section].key === option.key}
                                                    onChange={(e) => handleFilterChange(section, e.value)}
                                                />
                                                <label htmlFor={option.key} className="ml-2">{option.value}</label>
                                            </div>
                                        ))
                                    ) : section === 'selectedProviders' ? (
                                        providerOptions.map((option) => (
                                            <div className="mb-2" key={option.key}>
                                                <Checkbox
                                                    inputId={option.key}
                                                    value={option.key}
                                                    onChange={(e) => handleCheckboxChange(section, option.key, e.target.checked)}
                                                    checked={filters[section].includes(option.key)}
                                                />
                                                <label htmlFor={option.key} className="ml-2">{option.value}</label>
                                            </div>
                                        ))
                                    ) : section === 'selectedCategories' ? (
                                        categoryOptions.map((category) => (
                                            <div key={category.key}>
                                                <div className="flex justify-content-between align-items-center">
                                                    <div className='flex align-items-center'>
                                                        <Checkbox
                                                            inputId={category.key}
                                                            value={category.key}
                                                            checked={filters.selectedCategories.includes(category.key)}
                                                            onChange={(e) => handleCheckboxCategoryChange('selectedCategories', category.key, e.target.checked)}
                                                        />
                                                        <label htmlFor={category.key} className="ml-2">{category.value}</label>
                                                    </div>

                                                    <p className='cursor-pointer' onClick={() => toggleCategory(category.key)}>
                                                        <i className={`pi ${expandedCategories[category.key] ? 'pi-minus' : 'pi-plus'}`}></i>
                                                    </p>
                                                </div>

                                                {expandedCategories[category.key] && (
                                                    <div className="mt-2 ml-4 align-items-center">
                                                        {subcategoryOptions[category.key].map((subcategory) => (
                                                            <div className="mb-2" key={subcategory}>
                                                                <Checkbox
                                                                    inputId={subcategory}
                                                                    value={subcategory}
                                                                    checked={filters.selectedSubCategories.includes(subcategory)}
                                                                    onChange={(e) => handleCheckboxCategoryChange('selectedSubCategories', subcategory, e.target.checked)}
                                                                />
                                                                <label htmlFor={subcategory} className="ml-2">{subcategory}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : null}
                                </div>
                            )}
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
                            <p>{sectionLabels[section]}</p>
                            <p className='cursor-pointer'><i className={`pi ${expanded ? 'pi-minus' : 'pi-plus'}`}></i></p>
                        </div>

                        {expanded && (
                            <div>
                                {/* Render the appropriate options based on the section */}
                                {section === 'priceRanges' ? (
                                    priceRanges.map((option) => (
                                        <div className="mb-2" key={option.key}>
                                            <RadioButton
                                                inputId={option.key}
                                                value={option}
                                                name={section}
                                                checked={filters[section].key === option.key}
                                                onChange={(e) => handleFilterChange(section, e.value)}
                                            />
                                            <label htmlFor={option.key} className="ml-2">{option.value}</label>
                                        </div>
                                    ))
                                ) : section === 'selectedProviders' ? (
                                    providerOptions.map((option) => (
                                        <div className="mb-2" key={option.key}>
                                            <Checkbox
                                                inputId={option.key}
                                                value={option.key}
                                                onChange={(e) => handleCheckboxChange(section, option.key, e.target.checked)}
                                                checked={filters[section].includes(option.key)}
                                            />
                                            <label htmlFor={option.key} className="ml-2">{option.value}</label>
                                        </div>
                                    ))
                                ) : section === 'selectedCategories' ? (
                                    categoryOptions.map((category) => (
                                        <div key={category.key}>
                                            <div className="flex justify-content-between align-items-center">
                                                <div className='flex align-items-center'>
                                                    <Checkbox
                                                        inputId={category.key}
                                                        value={category.key}
                                                        checked={filters.selectedCategories.includes(category.key)}
                                                        onChange={(e) => handleCheckboxCategoryChange('selectedCategories', category.key, e.target.checked)}
                                                    />
                                                    <label htmlFor={category.key} className="ml-2">{category.value}</label>
                                                </div>

                                                <p className='cursor-pointer' onClick={() => toggleCategory(category.key)}>
                                                    <i className={`pi ${expandedCategories[category.key] ? 'pi-minus' : 'pi-plus'}`}></i>
                                                </p>
                                            </div>

                                            {expandedCategories[category.key] && (
                                                <div className="mt-2 ml-4 align-items-center">
                                                    {subcategoryOptions[category.key].map((subcategory) => (
                                                        <div className="mb-2" key={subcategory}>
                                                            <Checkbox
                                                                inputId={subcategory}
                                                                value={subcategory}
                                                                checked={filters.selectedSubCategories.includes(subcategory)}
                                                                onChange={(e) => handleCheckboxCategoryChange('selectedSubCategories', subcategory, e.target.checked)}
                                                            />
                                                            <label htmlFor={subcategory} className="ml-2">{subcategory}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : null}
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Filter;