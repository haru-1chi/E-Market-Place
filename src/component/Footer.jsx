import React from "react";
import { useNavigate } from "react-router-dom";
function Footer() {
  const navigate = useNavigate();
  return (
    <div className="footer-data-list bg-white py-2">
      <div className="border-solid">
        <ul className="mb-0">
          <li className="cursor-pointer" onClick={() => navigate("/HelpCenterPage", { state: { activeTab: "privacyPolicyMembers" } })}>
            นโยบายความเป็นส่วนตัวสำหรับสมาชิก
          </li>
          <li className="cursor-pointer" onClick={() => navigate("/HelpCenterPage", { state: { activeTab: "privacyPolicyCustomers" } })}>
            นโยบายความเป็นส่วนตัวสำหรับลูกค้า
          </li>
          <li className="cursor-pointer" onClick={() => navigate("/HelpCenterPage", { state: { activeTab: "cookiePolicy" } })}>
            นโยบายเกี่ยวกับการใช้งาน Cookies
          </li>
          <li className="cursor-pointer" onClick={() => navigate("/HelpCenterPage", { state: { activeTab: "companyPolicy" } })}>
            นโยบาย บริษัท
          </li>
          <li className="cursor-pointer" onClick={() => navigate("/HelpCenterPage", { state: { activeTab: "pdpaLegalTeam" } })}>
            ทีมกฎหมาย PDPA Form
          </li>
          <li className="cursor-pointer" onClick={() => navigate("/HelpCenterPage", { state: { activeTab: "legalRightsPrivacy" } })}>
            ข้อกฎหมายและสิทธิส่วนบุคคล
          </li>
        </ul>
      </div>
      <div className="border-solid"><p>© Copyright 2024. บริษัท ทศกัณฐ์ ดิจิตอล นิว เจเนเรชั่น จำกัด.</p></div>
    </div>
  );
}

export default Footer;
