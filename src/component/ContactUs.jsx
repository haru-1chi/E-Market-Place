import React from "react";
import { Dialog } from "primereact/dialog";
import line_contact from '../assets/line_contact.jpg';

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
                <div className="flex justify-content-center">
                    <img src={line_contact} alt="ติดต่อผ่านไลน์" width={150} height={150} />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold my-2">ต้องการความช่วยเหลือ</h3>
                    <p className="my-2">คุณสามารถติดต่อเราผ่านทาง Line</p>
                </div>
            </Dialog>
        </>
    );
}

export default ContactUs;
