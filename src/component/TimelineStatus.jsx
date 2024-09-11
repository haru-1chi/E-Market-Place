import React from 'react'
import { useCart } from '../router/CartContext';
import { Timeline } from 'primereact/timeline';
import { Button } from "primereact/button";
import { formatDate, formatLaosPhone } from '../utils/DateTimeFormat';

function TimelineStatus({ order, currentStatus, user }) {
    const { statusEvents } = useCart();

    const isCancelled = order?.statusdetail.some(status => status.status === statusEvents.Cancelled.value);

    const events = isCancelled
        ? [statusEvents.Cancelled]
        : [statusEvents.Packaged, statusEvents.Delivering, statusEvents.Received];

    const statusDetails = order?.statusdetail || [];

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
                {/* {item?.value === 'จัดส่งแล้ว' && order?.tracking && (
                    <p className='mt-0 mr-2 font-semibold'>
                        หมายเลขติดตามพัสดุ: {order.tracking}
                    </p>
                )} */}
                {isCompleted && statusDate && (
                    <p className='text-sm text-gray-500'>{formatDate(statusDate)} น.</p>
                )}
            </>
        );
    };

    return (
        <div className='bg-section-product flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb justify-content-center'>
            <div className='border-1 surface-border border-round p-4'>
                <h2 className="m-0 mb-0 p-0 font-semibold">Thank you for your order!</h2>
                <p className='mt-0 font-semibold'>หมายเลขคำสั่งซื้อ {order?.orderref}</p>
                <p>ได้รับคำสั่งซื้อของคุณแล้ว และเราจะเริ่มตรวจสอบเร็วๆ นี้...</p>
                <p className='mb-0 text-sm'>วันที่สั่งซื้อ {formatDate(order?.createdAt)} น.</p>
            </div>
            <div className="md:flex xl:flex lg:flex">
                <div className="w-full border-right-1 surface-border pl-3 mt-3">
                    <div className='flex justify-content-between'>
                        <p className='mt-0 font-semibold'>สถานะคำสั่งซื้อ</p>
                        <p className='mt-0 mr-2 text-sm font-thin'>หมายเลขติดตามพัสดุ: {order?.tracking ? order?.tracking : "รอผู้ขายระบุ"}</p>
                    </div>
                    <Timeline value={events} align="rigth" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
                </div>
                <div className="w-full flex flex-column pl-5">
                    <div className='mt-4 md:mt-7 border-top-1 md:border-none surface-border'>
                        <h3 className='mb-2 font-semibold'>ที่อยู่ Makro สาขาหนองคาย</h3>
                        <p className='m-0 p-0'>232 ม.12 พอใจ</p>
                        <p className='m-0 p-0'>เมืองหนองคาย หนองคาย 43000</p>
                    </div>

                    <div className='mt-3 md:mt-5'>
                        <h3 className='mb-2 font-semibold'>ข้อมูลการรับสินค้า</h3>
                        {user && (
                            <>
                                <p className='my-1 p-0'>ชื่อ {user.name}</p>
                                <p className='my-1 p-0'>เบอร์โทร {formatLaosPhone(user.phone)}</p>
                            </>
                        )}
                        {order?.shipping === 'courierDelivery' ? (
                            <p className='my-2 p-0 font-semibold'>จัดส่งโดยขนส่ง {order?.delivery} ไปยังสาขา {order?.deliveryBranch}</p>
                        ) : (
                            <p className='my-2 p-0 font-semibold'>รับสินค้าเองที่โกดังลาว</p>
                        )}
                    </div>
                </div>
            </div>
            {(order?.payment === 'บัญชีธนาคาร' && currentStatus?.key === 1) ? (
                <Button className="mt-3 w-fit align-self-center" label="ยกเลิกคำสั่งซื้อ" rounded />
            ) : null}
        </div>

    )
}

export default TimelineStatus