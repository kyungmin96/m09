import React, { useState } from "react";
import CartList from "./components/CartList";
import CartLog from "./components/CartLog";
import "./styles.scss";

const CartManagementPage = () => {
    const [selectedCart, setSelectedCart] = useState(null); // 선택된 카트를 관리
  
    // 더미 데이터
    const carts = [
      {
        id: "09목 9678",
        image: "@/shared/assets/images/cart-origin.png",
        // status: "이용중",
        // registrationDate: "2024.10.19",
        // battery: "67%",
        // lastManager: "김지호",
      },
      { id: "없음", image: null, status: "없음" },
      { id: "없음", image: null, status: "없음" },
      { id: "없음", image: null, status: "없음" },
      { id: "없음", image: null, status: "없음" },
      { id: "없음", image: null, status: "없음" },
    ];
  
    const logs = [
      { date: "2023.02.05", time: "PM 12:45", manager: "김민호" },
      { date: "2023.02.03", time: "AM 11:45 - PM 13:40", manager: "김호창" },
      { date: "2023.02.03", time: "AM 11:45 - PM 13:40", manager: "김호창" },
      { date: "2023.02.03", time: "AM 11:45 - PM 13:40", manager: "김호창" },
    ];
  
    return (
      <div className="cart-management-page">
        <h1>차량 상태 관리</h1>
        <div className="content">
          <div className="list">
            {/* 카트 목록 */}
            <CartList carts={carts} onSelectCart={setSelectedCart} selectedCart={selectedCart} />
          </div>
          <div className="log">
            {/* 카트 로그 */}
            <CartLog selectedCart={selectedCart} logs={logs} />
          </div>
        </div>
      </div>
    );
  };
  
  export default CartManagementPage;