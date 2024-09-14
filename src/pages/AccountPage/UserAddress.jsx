import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from 'primereact/checkbox';
import ProvinceSelection from "../../component/ProvinceSelection";

function UserAddress() {
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [addressFormData, setAddressFormData] = useState({
        label: '',
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        customer_province: '',
        customer_amphure: '',
        customer_tambon: '',
        customer_zipcode: '',
        isDefault: false
    });
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            const userData = JSON.parse(storedUser);
            const userAddresses = userData.user_address || [];
            setAddresses(userAddresses);
        } else {
            console.error('No user data found in localStorage');
        }

    }, []);

    useEffect(() => {
        if (selectedAddressId) {
            const selectedAddress = addresses.find(address => address._id === selectedAddressId);
            if (selectedAddress) {
                setAddressFormData({
                    label: selectedAddress.label || '',
                    customer_name: selectedAddress.customer_name || '',
                    customer_phone: selectedAddress.customer_phone || '',
                    customer_address: selectedAddress.customer_address || '',
                    customer_province: selectedAddress.customer_province || '',
                    customer_amphure: selectedAddress.customer_amphure || '',
                    customer_tambon: selectedAddress.customer_tambon || '',
                    customer_zipcode: selectedAddress.customer_zipcode || '',
                    isDefault: selectedAddress.isDefault || false
                });
            }
        }
    }, [selectedAddressId, visible1]);

    const handleAddressInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setAddressFormData({
            ...addressFormData,
            [id]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);

            const formattedAddressFormData = {
                ...addressFormData,
                customer_province: addressFormData.customer_province ? addressFormData.customer_province.name_th : null,
                customer_amphure: addressFormData.customer_amphure ? addressFormData.customer_amphure.name_th : null,
                customer_tambon: addressFormData.customer_tambon ? addressFormData.customer_tambon.name_th : null,
            };

            if (selectedAddressId) {
                const updatedAddresses = addresses.map(address =>
                    address._id === selectedAddressId ? { ...address, ...formattedAddressFormData } : address
                );

                userData.user_address = updatedAddresses;
                localStorage.setItem('user', JSON.stringify(userData));

                setAddresses(updatedAddresses);
            } else {
                const newAddress = {
                    ...formattedAddressFormData,
                    _id: Date.now(),
                };

                const updatedAddresses = [...addresses, newAddress];
                userData.user_address = updatedAddresses;
                localStorage.setItem('user', JSON.stringify(userData));

                setAddresses(updatedAddresses);
                console.log(newAddress);
            }

            setVisible1(false);
            resetForm();
        } else {
            console.error('No user data found in localStorage');
        }
    };


    const handleDelete = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && selectedAddressId) {
            const userData = JSON.parse(storedUser);
            const updatedAddresses = addresses.filter(address => address._id !== selectedAddressId);

            userData.user_address = updatedAddresses;
            localStorage.setItem('user', JSON.stringify(userData));

            setAddresses(updatedAddresses);
            setVisible2(false);
        } else {
            console.error('No user data found or no address selected');
        }
    };

    const resetForm = () => {
        setAddressFormData({
            label: '',
            customer_name: '',
            customer_phone: '',
            customer_address: '',
            customer_province: '',
            customer_amphure: '',
            customer_tambon: '',
            customer_zipcode: '',
            isDefault: false
        });
    };

    return (
        <>
            <div className='bg-section-product w-full flex flex-column border-1 surface-border border-round mt-3 py-3 px-3 bg-white border-round-mb justify-content-center align-self-center'>
                <div className='flex justify-content-between'>
                    <h2 className="m-0 p-0 font-medium">ที่อยู่ของฉัน</h2>
                    <div>
                        <Button icon="pi pi-plus" label="เพิ่มที่อยู่ใหม่" onClick={() => setVisible1(true)} />
                    </div>
                </div>
                {addresses.length > 0 ? (
                    addresses.map((address) => (
                        <div key={address._id} className='flex justify-content-between align-items-start border-bottom-1 surface-border'>
                            <div>
                                <p>ชื่อ {address.customer_name}</p>
                                <p>เบอร์โทร {address.customer_phone || 'เบอร์โทรไม่ระบุ'}</p>
                                <p>ที่อยู่ {`${address.customer_address}, ${address.customer_tambon}, ${address.customer_amphure}, ${address.customer_province}, ${address.customer_zipcode}`}</p>
                                {address.isDefault ? (
                                    <p className='w-fit px-1 border-1 border-round border-primary'>ค่าเริ่มต้น</p>
                                ) : (
                                    ""
                                )}

                            </div>
                            <div className='text-right'>
                                <div className='flex gap-2 justify-content-end'>
                                    <p
                                        className='text-blue-500 cursor-pointer'
                                        onClick={() => {
                                            setVisible1(true);
                                            setSelectedAddressId(address._id);
                                        }}
                                    >
                                        แก้ไข
                                    </p>
                                    <p
                                        className='text-blue-500 cursor-pointer'
                                        onClick={() => {
                                            setVisible2(true);
                                            setSelectedAddressId(address._id);
                                        }}
                                    >
                                        ลบ
                                    </p>
                                </div>
                                {address.isDefault ? (
                                    <Button label='ตั้งเป็นค่าเริ่มต้น' outlined className='px-2 py-1 text-900 border-primary' disabled />
                                ) : (
                                    <Button label='ตั้งเป็นค่าเริ่มต้น' outlined className='px-2 py-1 text-900 border-primary' />
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>ไม่พบที่อยู่ กรุณาเพิ่มที่อยู่ใหม่</p>
                )}

            </div>

            <Dialog
                header={<h3 className="font-semibold m-0">ที่อยู่จัดส่ง</h3>}
                visible={visible1}
                style={{ width: "500px" }}
                onHide={() => setVisible1(false)}
                closable={false}
            >
                <div className='flex justify-content-start align-items-center pt-3'>
                    <label>ติดป้ายเป็น:</label>
                    <InputText id="label" value={addressFormData.label}
                        onChange={handleAddressInputChange}
                        className='ml-3 w-10rem p-2'
                        placeholder='บ้าน, ที่ทำงาน, อื่นๆ...'
                    />
                </div>

                <div className="flex flex-column gap-4 mt-4">
                    <div className='w-full block md:flex gap-3'>
                        <FloatLabel className='w-full'>
                            <InputText id="customer_name" value={addressFormData.customer_name}
                                onChange={handleAddressInputChange}
                                className='w-full'
                            />
                            <label htmlFor="customer_name">ชื่อ-นามสกุล</label>
                        </FloatLabel>
                        <FloatLabel className='w-full mt-4 md:mt-0'>
                            <InputText id="customer_phone" value={addressFormData.customer_phone}
                                onChange={handleAddressInputChange}
                                className='w-full'
                            />
                            <label htmlFor="customer_phone">หมายเลขโทรศัพท์</label>
                        </FloatLabel>
                    </div>

                    <InputText id="customer_address" value={addressFormData.customer_address} onChange={handleAddressInputChange} className="w-full" placeholder='บ้านเลขที่, ซอย, หมู่, ถนน' />
                    <ProvinceSelection
                        addressFormData={addressFormData}
                        setAddressFormData={setAddressFormData} />
                    <div>
                        <Checkbox
                            id="isDefault"
                            checked={addressFormData.isDefault}
                            onChange={handleAddressInputChange}
                            className="mt-2"
                        />
                        <label htmlFor='isDefault' className="ml-2">ตั้งเป็นที่อยู่เริ่มต้น</label>
                    </div>

                </div>
                <div className='flex justify-content-end gap-3 mt-4'>
                    <Button onClick={() => setVisible1(false)} label='ยกเลิก' text />
                    <Button onClick={handleSubmit} label='ยืนยัน' />
                </div>
            </Dialog>

            <Dialog
                header={<h3 className="font-semibold m-0">ต้องการลบที่อยู่นี้?</h3>}
                visible={visible2}
                style={{ width: "500px" }}
                onHide={() => setVisible2(false)}
                closable={false}
            >
                <div className='flex justify-content-end gap-3 mt-4'>
                    <Button onClick={() => setVisible2(false)} label='ยกเลิก' text />
                    <Button onClick={handleDelete} label='ลบ' />
                </div>
            </Dialog>
        </>
    )
}

export default UserAddress
