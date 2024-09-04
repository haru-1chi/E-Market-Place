import React, { useState } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { Button } from "primereact/button";

function SlipPayment() {
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [amount, setAmount] = useState(null);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };


    return (
        <>
            <div className='bg-section-product flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb justify-content-center'>
                <h2 className='p-0 m-0 mb-2 text-center'>แจ้งการชำระเงิน</h2>
                <div className="flex flex-column gap-3 justify-content-center align-self-center">
                    <div className="flex flex-column">
                        <label htmlFor="currency-la">ระบุจำนวนเงิน(กีบ)</label>
                        <InputNumber inputId="currency-la" value={amount} onValueChange={(e) => setAmount(e.value)} mode="currency" currency="LAK" locale="lo-LA" />
                    </div>
                    <div className="flex flex-column">
                        <label htmlFor="username">วันที่โอนเงิน</label>
                        <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" />
                    </div>
                    <div className="flex flex-column">
                        <label htmlFor="username">เวลาที่โอนเงิน</label>
                        <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly />
                    </div>

                    <FileUpload className="w-fit align-self-center" mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} auto chooseLabel="แนบสลิปโอนเงิน" />
                    <Button className="w-fit align-self-center" label="ยืนยันชำระเงิน" rounded />
                </div>
            </div>
        </>
    )

}

export default SlipPayment