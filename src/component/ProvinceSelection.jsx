import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";
import axios from "axios";

export default function ProvinceSelection({ addressFormData, setAddressFormData }) {
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [tambons, setTambons] = useState([]);

    useEffect(() => {
        axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json')
            .then(response => {
                setProvinces(response.data);
            });
    }, []);

    useEffect(() => {
        if (addressFormData.province) {
            setAddressFormData(prevData => ({ ...prevData, amphure: null, tambon: null, zipcode: '' }));
            axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json')
                .then(response => {
                    const filteredAmphures = response.data.filter(amphure => amphure.province_id === addressFormData.province.id);
                    setAmphures(filteredAmphures);
                });
        } else {
            setAmphures([]);
            setTambons([]);
        }
    }, [addressFormData.province]);

    useEffect(() => {
        if (addressFormData.amphure) {
            setAddressFormData(prevData => ({ ...prevData, tambon: null, zipcode: '' }));
            axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json')
                .then(response => {
                    const filteredTambons = response.data.filter(tambon => tambon.amphure_id === addressFormData.amphure.id);
                    setTambons(filteredTambons);
                });
        } else {
            setTambons([]);
        }
    }, [addressFormData.amphure]);

    const handleTambonChange = (e) => {
        const selectedTambon = e.value;
        setAddressFormData(prevData => ({
            ...prevData,
            tambon: selectedTambon,
            zipcode: selectedTambon ? selectedTambon.zip_code : ''
        }));
    };

    return (
        <>
            <div className="block md:flex justify-content-center gap-3">
                <FloatLabel className="w-full md:w-14rem">
                    <Dropdown
                        filter
                        inputId="dd-province"
                        value={addressFormData.province || null}
                        onChange={(e) => setAddressFormData(prevData => ({ ...prevData, province: e.value }))}
                        options={provinces}
                        optionLabel="name_th"
                        placeholder="Select a Province"
                        className="w-full"
                    />
                    <label htmlFor="dd-province">เลือกจังหวัด</label>
                </FloatLabel>
                <FloatLabel className="w-full md:w-14rem mt-3 md:mt-0">
                    <Dropdown
                        filter
                        inputId="dd-amphure"
                        value={addressFormData.amphure || null}
                        onChange={(e) => setAddressFormData(prevData => ({ ...prevData, amphure: e.value }))}
                        options={amphures}
                        optionLabel="name_th"
                        placeholder="Select an Amphure"
                        className="w-full"
                        disabled={!addressFormData.province}
                    />
                    <label htmlFor="dd-amphure">เลือกอำเภอ</label>
                </FloatLabel>
            </div>

            <div className="block md:flex justify-content-center gap-3">
                <FloatLabel className="w-full md:w-14rem md:mt-0">
                    <Dropdown
                        filter
                        inputId="dd-tambon"
                        value={addressFormData.tambon || null}
                        onChange={handleTambonChange}
                        options={tambons}
                        optionLabel="name_th"
                        placeholder="Select a Tambon"
                        className="w-full"
                        disabled={!addressFormData.amphure}
                    />
                    <label htmlFor="dd-tambon">เลือกตำบล</label>
                </FloatLabel>
                <FloatLabel className="w-full md:w-14rem mt-3 md:mt-0">
                    <InputText
                        className="w-full"
                        type="text"
                        value={addressFormData.zipcode || ''}
                        onChange={(e) => setAddressFormData(prevData => ({ ...prevData, zipcode: e.target.value }))}
                    />
                    <label htmlFor="dd-zipcode">รหัสไปรษณีย์</label>
                </FloatLabel>
            </div>
        </>
    );
}
