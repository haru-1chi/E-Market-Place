import React from 'react'

function CancelOrder() {
    const reasonCancel = [
        { label: 'ต้องการเปลี่ยนรายการสินค้าในคำสั่งซื้อ' },
        { label: 'ต้องการเปลี่ยนวิธีการชำระเงิน' },
        { label: 'ต้องการเปลี่ยนวิธีการรับสินค้า' },
        { label: 'สินค้าที่ฉันต้องการบางรายการ หมด' },
        { label: 'ไม่ต้องการสินค้าเหล่านั้นแล้ว' },
        { label: 'อื่นๆ (โปรดระบุ)' }
    ];

    return (
        <div>
            <h2>คุณกำลังยกเลิกคำสั่งซื้อ?</h2>
            <p>เลือกสาเหตุการยกเลิกคำสั่งซื้อ</p>
            {reasonCancel.map((option) => (
                <div className='py-2' key={option.label}>
                    <RadioButton
                        inputId={`${option.label}`}
                        value={option.label}
                        name="sort"
                        checked={selectedSort === option.label}
                        onChange={(e) => handleSortChange(e.label)}
                    />
                    <label htmlFor={`${option.label}`} className="ml-2">{option.label}</label>
                </div>
            ))}
            <Button label="ยืนยันการยกเลิกคำสั่งซื้อ" />
        </div>
    )
}

export default CancelOrder