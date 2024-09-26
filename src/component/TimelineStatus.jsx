import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useCart } from '../router/CartContext';
import { Timeline } from 'primereact/timeline';
import { Button } from "primereact/button";
import { formatDate } from '../utils/DateTimeFormat';

function TimelineStatus({ order, currentStatus, user }) {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const { statusEvents } = useCart();

    const [statusDetails, setStatusDetails] = useState([]);

    useEffect(() => {
        if (order?.statusdetail) {
            setStatusDetails(order.statusdetail);
        }
    }, [order?.statusdetail]);

    const isCancelled = order?.statusdetail.some(status => status.status === statusEvents.Cancelled.value);

    const events = isCancelled
        ? [statusEvents.Cancelled]
        : [statusEvents.Packaged, statusEvents.Delivering, statusEvents.Received];

    const isStatusCompleted = (event) => {
        return statusDetails.some(status => status.status === event);
    };

    const getStatusDate = (event) => {
        const status = statusDetails.find(status => status.status === event.value);
        return status?.date ? status.date : null;
    };

    const customizedMarker = (item) => {
        const isCompleted = isStatusCompleted(item.value);
        const isCancelledEvent = item.value === statusEvents.Cancelled.value;
        return (
            <div className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle shadow-1"
                style={{ backgroundColor: isCompleted ? (isCancelledEvent ? '#FF5252' : '#00bf26') : '#607D8B' }}>
                <i className={isCompleted ? (isCancelledEvent ? 'pi pi-times' : 'pi pi-check') : item.icon}></i>
            </div>
        );
    };

    const customizedContent = (item) => {
        const isCompleted = isStatusCompleted(item.value);
        const statusDate = getStatusDate(item);
        return (
            <>
                <p className='font-semibold'>{item?.value}</p>
                {isCompleted && statusDate && (
                    <p className='text-sm text-gray-500'>{formatDate(statusDate)} น.</p>
                )}
            </>
        );
    };

    const latestStatus = statusDetails
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.status || "Unknown Status";

        const handleReceived = async () => {
            try {
                if (!order || !order._id) {
                    console.error("Order ID is missing");
                    return;
                }
                console.log(`Order ID: ${order._id}`);
    
                const response = await axios.put(`${apiUrl}/orderproduct/receive/${order._id}`);
                if (response.status === 200 && response.data && response.data.status) {
                    console.log("Order received successfully:", response.data);
    
                    const updatedStatusDetail = [
                        ...statusDetails,
                        { status: statusEvents.Received.value, date: new Date().toISOString() }
                    ];
                    
                    setStatusDetails(updatedStatusDetail);
                } else {
                    console.log(response.data.message || "Failed to receive the order");
                }
            } catch (error) {
                console.error("Error while receiving the order:", error?.response?.data?.message || error.message);
            }
        };

    return (
        <div className='bg-section-product flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb justify-content-center'>
            <div className='border-round px-3 py-2 bg-primary-400'>
                <h3 className="m-0 p-0 font-semibold text-900">คำสั่งซื้อของคุณสำเร็จแล้ว</h3>
            </div>
            <div className="md:flex xl:flex lg:flex">
                <div className="w-full border-none md:border-right-1 surface-border pl-3 my-3">
                    <div className='flex justify-content-between'>
                        <p className='mt-0 font-semibold'>สถานะคำสั่งซื้อ</p>
                    </div>
                    <Timeline value={events} align="rigth" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
                </div>
                <div className="w-full flex flex-column pl-5 border-top-1 md:border-none surface-border">
                    <div className='md:mt-2'>
                        <h3 className='mb-2 font-semibold'>ที่อยู่สำหรับจัดส่ง</h3>
                        {order && (
                            <>
                                <p className='my-1 p-0'>ชื่อ {order?.customer_name}</p>
                                <p className='my-1 p-0'>เบอร์โทร {order?.customer_telephone}</p>
                                <p className='my-1 p-0'>ที่อยู่ {order?.customer_address} {order?.customer_tambon} {order?.customer_amphure} {order?.customer_province} {order?.customer_zipcode}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {(order?.payment === 'บัญชีธนาคาร' && currentStatus?.key === 1) ? (
                <Button className="mt-3 w-fit align-self-center" label="ยกเลิกคำสั่งซื้อ" rounded />
            ) : null}
            <div className='w-full flex justify-content-end'>
                {latestStatus === 'จัดส่งแล้ว' ? <Button label='ฉันได้รับสินค้าแล้ว' onClick={handleReceived} /> : ("")}
            </div>
        </div>

    )
}

export default TimelineStatus