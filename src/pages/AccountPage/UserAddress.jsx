import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from 'primereact/checkbox';
import ProvinceSelection from "../../component/ProvinceSelection";

function UserAddress() {
    const [address, setAddress] = useState([]);
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.post(`${apiUrl}/me`, null, {
                    headers: { "auth-token": token }
                });
                setUser(res.data.data);
                setAddress(res.data.data.current_address);
            } catch (err) {
                console.error("Error fetching user data", err.response?.data || err.message);
            }
        };
        fetchUserData();
    }, [apiUrl]);

    return (
        <>
            <div className='bg-section-product w-full flex flex-column border-1 surface-border border-round mt-3 py-3 px-3 bg-white border-round-mb justify-content-center align-self-center'>
                <div className='flex justify-content-between'>
                    <h2 className="m-0 p-0 font-medium">ที่อยู่ของฉัน</h2>
                </div>
                <div className='flex justify-content-between align-items-start border-bottom-1 surface-border'>
                    <div>
                        <p>ชื่อ {user?.fristname} {user?.lastname}</p>
                        <p>เบอร์โทร {user?.tel || 'เบอร์โทรไม่ระบุ'}</p>
                        <p>ที่อยู่ {`${address?.address}, ${address?.subdistrict}, ${address?.district}, ${address?.province}, ${address?.postcode}`}</p>
                        {address?.isDefault ? (
                            <p className='w-fit px-1 border-1 border-round border-primary'>ค่าเริ่มต้น</p>
                        ) : (
                            ""
                        )}

                    </div>
                    {/* <div className='text-right'>
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
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default UserAddress
