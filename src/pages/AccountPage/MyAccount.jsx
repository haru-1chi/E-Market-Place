import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from 'primereact/checkbox';
import UserAddress from './UserAddress';


function MyAccount() {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });


    const validateForm = () => {
        const { phone, email } = formData;

        if (!/^\d{10}$/.test(phone)) {
            return "เบอร์โทรศัพท์ต้องเป็นตัวเลข";
        }

        if (email && !/\S+@\S+\.\S+/.test(email)) {
            return "กรุณาป้อนอีเมลในรูปแบบที่ถูกต้อง";
        }

        return null;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = localStorage.getItem("user");
                setUser(JSON.parse(res));
            } catch (err) {
                console.error("Error fetching user data", err.response?.data || err.message);
            }
        };
        fetchUserData();
    }, []);

    // useEffect(() => {
    //     const fetchUserData = async () => {

    //         const token = localStorage.getItem("token");
    //         const user_id = localStorage.getItem("user_id");
    //         try {
    //             const res = await axios.get(`${apiUrl}/users/${user_id}`, {
    //                 headers: { "token": token },
    //             });
    //             setUser(res.data.data);
    //             setFormData({
    //                 name: res.data.data.name,
    //                 email: res.data.data.email,
    //                 phone: res.data.data.phone
    //             });
    //         } catch (err) {
    //             console.error("Error fetching user data", err.response?.data || err.message);
    //         }
    //     };
    //     fetchUserData();
    // }, [apiUrl]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleCancelEdit = () => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone
            });
        }
        setEditMode(false);
    };

    const handleUpdateProfile = async () => {
        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        try {
            const res = await axios.put(`${apiUrl}/users/${user_id}`, formData, {
                headers: { "token": token },
            });
            setUser(res.data.data);
            setEditMode(false);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
            console.error("Error updating user data", error.response?.data || err.message);
        }
    };

    return (
        <div className='mx-2 md:mx-0'>
            <h1 className="m-0 mb-2 p-0 font-semibold">บัญชีของฉัน</h1>
            <div>
                <div className='bg-section-product w-full flex flex-column border-1 surface-border border-round mt-4 py-3 px-3 bg-white border-round-mb justify-content-center align-self-center'>
                    <div className='flex justify-content-between'>
                        <h2 className="m-0 p-0 font-medium">ข้อมูลบัญชี</h2>
                        <div className='hidden'>
                            {editMode && (
                                <Button label="ยกเลิก" onClick={handleCancelEdit} className="text-500 p-0 m-0 mr-5" text />
                            )}
                            <Button label={editMode ? "บันทึกโปรไฟล์" : "แก้ไขโปรไฟล์"} onClick={editMode ? handleUpdateProfile : handleEditToggle} className="p-0 m-0" text />
                        </div>
                    </div>
                    <div className="card mt-3 flex flex-column gap-3 justify-content-center">
                        {errorMessage && <Message severity="error" text={errorMessage} />}
                        {user ? (
                            <div className='w-full'>
                                <div className='grid align-items-center border-bottom-1 surface-border'>
                                    <p className='col-3'>ชื่อ</p>
                                    <div className='col'>
                                        {editMode ? (
                                            <InputText name="name" value={formData.name} onChange={handleInputChange} />
                                        ) : (
                                            <p>{user.name}</p>
                                        )}
                                    </div>
                                </div>
                                <div className='grid align-items-center border-bottom-1 surface-border'>
                                    <p className='col-3'>อีเมล</p>
                                    <div className='col'>
                                        {editMode ? (
                                            <InputText name="email" value={formData.email} onChange={handleInputChange} keyfilter="email" />
                                        ) : (
                                            <p>{user.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div className='grid align-items-center'>
                                    <p className='col-3'>เบอร์โทรศัพท์</p>
                                    <div className='col'>
                                        {editMode ? (
                                            <InputText name="phone" value={formData.phone} onChange={handleInputChange} keyfilter="pint" />
                                        ) : (
                                            <p>{user.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <ProgressSpinner />
                            </>
                        )}
                    </div>
                </div>
                <UserAddress />
            </div>

        </div>
    )
}

export default MyAccount