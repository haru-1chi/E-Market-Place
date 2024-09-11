import React from 'react'
import Footer from '../../component/Footer'
import { Link, useLocation } from 'react-router-dom';
import { Button } from "primereact/button";
function NoPage() {
  return (
    <div className='m-4 flex flex-column justify-content-center align-self-center text-center'>
      <div className='flex justify-content-center'>
        <img src="https://www.makro.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpage-not-found.7cd1edd1.png&w=1920&q=75" alt="" className='w-20rem' />
      </div>
      <h3 className='m-0 p-0 font-semibold'>ขออภัย ไม่พบหน้าที่คุณต้องการ</h3>
      <p className='m-0 my-2'>หน้านี้อาจถูกย้ายหรือลบไปแล้ว กรุณาลองปุ่มด้านล่าง</p>
      <Link to="/"><Button
        className="w-8rem my-2"
        label="ไปหน้าหลัก"
        rounded
      /></Link>
      <Link to="/">
        <Button
          className="w-8rem mt-2"
          label="กลับ"
          rounded
          outlined
      />
      </Link>
    </div>
  )
}

export default NoPage