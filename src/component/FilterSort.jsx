import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from 'primereact/sidebar';
import { RadioButton } from 'primereact/radiobutton';

function FilterSort({ onSortChange, visibleSort, setVisibleSort }) {
    const [selectedSort, setSelectedSort] = useState('default');

    const sortOptions = [
        { label: 'ความใกล้เคียง', value: 'default' },
        { label: 'ราคาต่ำไปสูง', value: 'lowToHigh' },
        { label: 'ราคาสูงไปต่ำ', value: 'highToLow' }
    ];

    const handleSortChange = (value) => {
        setSelectedSort(value);
        onSortChange(value);
    };

    return (
        <>
            <Sidebar
                visible={visibleSort}
                position="right"
                onHide={() => setVisibleSort(false)}
            >
                <div className="w-full px-3 pt-0 bg-white flex flex-column justify-content-between">

                    <div className="flex pt-0  justify-content-between">
                        <div className="flex align-items-center">
                            <i className="pi pi-sort-alt"></i>
                            <p className='ml-2 font-semibold text-l'>เรียงตาม</p>
                        </div>
                    </div>
                    {sortOptions.map((option) => (
                        <div className='py-2' key={option.value}>
                            <RadioButton
                                inputId={`sort-${option.value}`}
                                value={option.value}
                                name="sort"
                                checked={selectedSort === option.value}
                                onChange={(e) => handleSortChange(e.value)}
                            />
                            <label htmlFor={`sort-${option.value}`} className="ml-2">{option.label}</label>
                        </div>
                    ))}
                </div>
            </Sidebar>

            <Dropdown
                value={selectedSort}
                options={sortOptions}
                onChange={(e) => handleSortChange(e.value)}
                placeholder="Sort by Price"
                className='flex align-items-center h-fit'
            />
        </>
    );
}

export default FilterSort;