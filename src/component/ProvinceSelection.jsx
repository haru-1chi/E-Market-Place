import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";
import axios from "axios";

export default function ProvinceSelection({ addressFormData, setAddressFormData, validationErrors }) {
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [tambons, setTambons] = useState([]);

    useEffect(() => {
        axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json')
            .then(response => {
                setProvinces(response.data);
                if (addressFormData.customer_province) {
                    const selectedProvince = response.data.find(province => province.name_th === addressFormData.customer_province);
                    setAddressFormData(prevData => ({ ...prevData, customer_province: selectedProvince }));
                }
            });
    }, []);

    useEffect(() => {
        if (addressFormData.customer_province && typeof addressFormData.customer_province === 'object') {
            axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json')
                .then(response => {
                    const filteredAmphures = response.data.filter(amphure => amphure.province_id === addressFormData.customer_province.id);
                    setAmphures(filteredAmphures);

                    if (typeof addressFormData.customer_amphure === 'string') {
                        const selectedAmphure = filteredAmphures.find(amphure => amphure.name_th === addressFormData.customer_amphure);
                        if (selectedAmphure) {
                            setAddressFormData(prevData => ({
                                ...prevData,
                                customer_amphure: selectedAmphure
                            }));
                        }
                    }
                });
        } else {
            setAmphures([]);
            setTambons([]);
        }
    }, [addressFormData.customer_province]);


    useEffect(() => {
        if (addressFormData.customer_amphure && typeof addressFormData.customer_amphure === 'object') {
            axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json')
                .then(response => {
                    const filteredTambons = response.data.filter(tambon => tambon.amphure_id === addressFormData.customer_amphure.id);
                    setTambons(filteredTambons);

                    if (typeof addressFormData.customer_tambon === 'string') {
                        const selectedTambon = filteredTambons.find(tambon => tambon.name_th === addressFormData.customer_tambon);
                        if (selectedTambon) {
                            setAddressFormData(prevData => ({
                                ...prevData,
                                customer_tambon: selectedTambon
                            }));
                        }
                    }
                });
        } else {
            setTambons([]);
        }
    }, [addressFormData.customer_amphure]);

    const handleTambonChange = (e) => {
        const selectedTambon = e.value;
        setAddressFormData(prevData => ({
            ...prevData,
            customer_tambon: selectedTambon,
            customer_zipcode: selectedTambon ? selectedTambon.zip_code : ''
        }));
    };

    return (
        <>
            <div className="block md:flex justify-content-center gap-3">
                <FloatLabel className="w-full md:w-14rem">
                    <Dropdown
                        filter
                        inputId="dd-province"
                        value={addressFormData.customer_province || null}
                        onChange={(e) => setAddressFormData(prevData => ({ ...prevData, customer_province: e.value }))}
                        options={provinces}
                        optionLabel="name_th"
                        placeholder="Select a Province"
                        className="w-full"
                    />
                    <label htmlFor="dd-province">เลือกจังหวัด</label>
                    {validationErrors.customer_province && <small className="p-error">{validationErrors.customer_province}</small>}
                </FloatLabel>

                <FloatLabel className="w-full md:w-14rem mt-3 md:mt-0">
                    <Dropdown
                        filter
                        inputId="dd-amphure"
                        value={addressFormData.customer_amphure || null}
                        onChange={(e) => setAddressFormData(prevData => ({ ...prevData, customer_amphure: e.value }))}
                        options={amphures}
                        optionLabel="name_th"
                        placeholder="Select an Amphure"
                        className="w-full"
                        disabled={!addressFormData.customer_province}
                    />
                    <label htmlFor="dd-amphure">เลือกอำเภอ</label>
                    {validationErrors.customer_amphure && <small className="p-error">{validationErrors.customer_amphure}</small>}
                </FloatLabel>

            </div>

            <div className="block md:flex justify-content-center gap-3">
                <FloatLabel className="w-full md:w-14rem md:mt-0">
                    <Dropdown
                        filter
                        inputId="dd-tambon"
                        value={addressFormData.customer_tambon || null}
                        onChange={handleTambonChange}
                        options={tambons}
                        optionLabel="name_th"
                        placeholder="Select a Tambon"
                        className="w-full"
                        disabled={!addressFormData.customer_amphure}
                    />
                    <label htmlFor="dd-tambon">เลือกตำบล</label>
                    {validationErrors.customer_tambon && <small className="p-error">{validationErrors.customer_tambon}</small>}
                </FloatLabel>

                <FloatLabel className="w-full md:w-14rem mt-3 md:mt-0">
                    <InputText
                        className="w-full"
                        type="text"
                        value={addressFormData.customer_zipcode || ''}
                        onChange={(e) => setAddressFormData(prevData => ({ ...prevData, customer_zipcode: e.target.value }))}
                    />
                    <label htmlFor="dd-zipcode">รหัสไปรษณีย์</label>
                    {validationErrors.customer_zipcode && <small className="p-error">{validationErrors.customer_zipcode}</small>}
                </FloatLabel>

            </div>
        </>
    );
}
