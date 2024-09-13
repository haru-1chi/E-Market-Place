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
        fullName: '',
        phoneNumber: '',
        addressLine: '',
        province: '',
        amphure: '',
        tambon: '',
        isDefault: false
    });
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    // useEffect(() => {
    //     axios.get('/api/addresses')
    //         .then(response => setAddresses(response.data))
    //         .catch(error => console.error(error));
    // }, []);

    useEffect(() => {
        if (selectedAddressId) {
            const selectedAddress = addresses.find(address => address.id === selectedAddressId);
            if (selectedAddress) {
                setAddressFormData({
                    label: selectedAddress.label || '',
                    fullName: selectedAddress.fullName || '',
                    phoneNumber: selectedAddress.phoneNumber || '',
                    addressLine: selectedAddress.addressLine || '',
                    province: selectedAddress.province || '',  // Ensure this is not undefined
                    amphure: selectedAddress.amphure || '',     // Ensure this is not undefined
                    tambon: selectedAddress.tambon || '',       // Ensure this is not undefined
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
        console.log(addressFormData)
        setVisible1(false);
        resetForm();
        // if (selectedAddressId) {
        //     // Update the existing address logic
        //     axios.put(`/api/addresses/${selectedAddressId}`, addressFormData)
        //         .then(response => {
        //             const updatedAddresses = addresses.map(address =>
        //                 address.id === selectedAddressId ? response.data : address
        //             );
        //             setAddresses(updatedAddresses);
        //             setVisible1(false);
        //         })
        //         .catch(error => console.error(error));
        // } else {
        //     // Create new address logic
        //     axios.post('/api/addresses', addressFormData)
        //         .then(response => {
        //             setAddresses([...addresses, response.data]);
        //             setVisible1(false);
        //         })
        //         .catch(error => console.error(error));
        // }
    };

    const handleDelete = () => {
        if (selectedAddressId) {
            axios.delete(`/api/addresses/${selectedAddressId}`)
                .then(() => {
                    setAddresses(addresses.filter(address => address.id !== selectedAddressId)); // Remove the deleted address from the list
                    setVisible2(false); // Close the delete confirmation modal
                })
                .catch(error => console.error(error));
        }
    };

    const resetForm = () => {
        setAddressFormData({
            label: '',
            fullName: '',
            phoneNumber: '',
            addressLine: '',
            province: null,
            amphure: null,
            tambon: null,
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
                <div className='flex justify-content-between align-items-start border-bottom-1 surface-border'>
                    <div>
                        <p>ชื่อ ซากุระโกะ ฟุบุกิ</p>
                        <p>เบอร์โทร 055 555 5555</p>
                        <p>ที่อยู่ สันติธรรม ชัยเหมี่ยง ประเทศไทย</p>
                        <p className='w-fit px-1 border-1 border-round border-primary'>ค่าเริ่มต้น</p>
                    </div>
                    <div className='text-right'>
                        <div className='flex gap-2 justify-content-end'>
                            <p className='text-blue-500 cursor-pointer'
                                onClick={() => {
                                    //  setSelectedAddressId(address.id);
                                    setVisible1(true);
                                }}
                            >แก้ไข</p>
                            <p className='text-blue-500 cursor-pointer'
                                onClick={() => {
                                    //  setSelectedAddressId(address.id);
                                    setVisible2(true);
                                }}
                            >ลบ</p>
                        </div>
                        <Button label='ตั้งเป็นค่าเริ่มต้น' outlined className='px-2 py-1 text-900 border-primary' />
                    </div>
                </div>
                {/* {addresses.map((address, index) => (
                    <div key={index} className='flex justify-content-between align-items-center border-bottom-1 surface-border'>
                        <div>
                            <p>{address.fullName}</p>
                            <p>เบอร์โทร {address.phoneNumber}</p>
                            <p>{address.addressLine}, {address.tambon}, {address.amphure}, {address.province}</p>
                            <p className={address.isDefault ? 'w-fit px-1 border-1 border-round border-primary' : ''}>{address.isDefault ? 'ค่าเริ่มต้น' : ''}</p>
                        </div>
                        <div className='text-right'>
                            <div className='flex gap-2 justify-content-end'>
                                <p className='text-blue-500' onClick={() => { setSelectedAddressId(address.id); setVisible1(true); }}>แก้ไข</p>
                                <p className='text-blue-500 cursor-pointer' onClick={() => { setSelectedAddressId(address.id); setVisible2(true); }}>ลบ</p>
                            </div>
                            <Button label='ตั้งเป็นค่าเริ่มต้น' outlined className='px-2 py-1 text-900 border-primary' />
                        </div>
                    </div>
                ))} */}
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
                            <InputText id="fullName" value={addressFormData.fullName}
                                onChange={handleAddressInputChange}
                                className='w-full'
                            />
                            <label htmlFor="fullName">ชื่อ-นามสกุล</label>
                        </FloatLabel>
                        <FloatLabel className='w-full mt-4 md:mt-0'>
                            <InputText id="phoneNumber" value={addressFormData.phoneNumber}
                                onChange={handleAddressInputChange}
                                className='w-full'
                            />
                            <label htmlFor="phoneNumber">หมายเลขโทรศัพท์</label>
                        </FloatLabel>
                    </div>

                    <InputText id="addressLine" value={addressFormData.addressLine} onChange={handleAddressInputChange} className="w-full" placeholder='บ้านเลขที่, ซอย, หมู่, ถนน' />
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
                    <Button onClick={handleSubmit} label='ลบ' />
                </div>
            </Dialog>
        </>
    )
}

export default UserAddress
