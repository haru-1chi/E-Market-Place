import React from "react";
import { Dialog } from "primereact/dialog";

function ContactUs({ visible, setVisible }) {
    return (
        <>
            <Dialog
                visible={visible}
                style={{ width: "auto" }}
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
            >
                <div className="text-center">
                    <h3 className="font-semibold mt-0">ต้องการความช่วยเหลือ</h3>
                    <p>คุณสามารถติดต่อเราผ่านทาง Line หรือทางโทรศัพท์</p>
                </div>
                <div className="hidden">
                    <div className="flex align-items-center border-bottom-1 surface-border mt-4">
                        <i className="pi pi-mobile mr-2"></i>
                        <p>เพิ่มเพื่อนทางไลน์ @MakroPRO</p>
                    </div>
                    <div className="flex align-items-center border-bottom-1 surface-border">
                        <i className="pi pi-phone mr-2"></i>
                        <p>โทรคุยกับเรา 1234 กด 5</p>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default ContactUs;
