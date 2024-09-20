import React from "react";
import { useNavigate } from "react-router-dom";
function Footer() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-column bg-white py-2">
      <div className="border-solid ml-5 align-self-start sm:align-self-center">
        <ul className="block md:flex gap-4 list-none mb-0 pl-0">
          <li className="cursor-pointer mb-2 md:mb-0" onClick={() => navigate("/PrivacyPage", { state: { activeTab: "privacyPolicyMembers" } })}>
            นโยบายความเป็นส่วนตัวสำหรับสมาชิก
          </li>
          <li className="cursor-pointer mb-2 md:mb-0" onClick={() => navigate("/PrivacyPage", { state: { activeTab: "privacyPolicyCustomers" } })}>
            นโยบายความเป็นส่วนตัวสำหรับลูกค้า
          </li>
          <li className="cursor-pointer mb-2 md:mb-0" onClick={() => navigate("/PrivacyPage", { state: { activeTab: "cookiePolicy" } })}>
            นโยบายเกี่ยวกับการใช้งาน Cookies
          </li>
          <li className="cursor-pointer mb-2 md:mb-0" onClick={() => navigate("/PrivacyPage", { state: { activeTab: "companyPolicy" } })}>
            นโยบายบริษัท
          </li>
          {/* <li className="cursor-pointer mb-2 md:mb-0" onClick={() => navigate("/PrivacyPage", { state: { activeTab: "pdpaLegalTeam" } })}>
            ทีมกฎหมาย PDPA Form
          </li> */}
          <li className="cursor-pointer mb-2 md:mb-0" onClick={() => navigate("/PrivacyPage", { state: { activeTab: "legalRightsPrivacy" } })}>
            ข้อกฎหมายและสิทธิส่วนบุคคล
          </li>
        </ul>
      </div>
      <div className="border-solid align-self-center"><p>© Copyright 2024. บริษัท ทศกัณฐ์ ดิจิตอล นิว เจนเนอเรชั่น จำกัด.</p></div>
    </div>
  );
}

export default Footer;
