import React from "react";
import CartOrigin from "@/shared/assets/images/cart-origin.png";
import CartEmpty from "@/shared/assets/images/cart-empty.png";
import "./CartList.scss";

const CartList = ({ carts, onSelectCart, selectedCart }) => {
  return (
    <div className="cart-list">
      {carts.map((cart) => (
        <div
          key={cart.id}
          className={`cart-item ${selectedCart === cart.id ? "active" : ""}`}
          onClick={() => onSelectCart(cart.id)}
        >
          {/* 이미지 또는 플레이스홀더 */}
          <div className="cart-image">
            {cart.image ? (
              <img src={CartOrigin} alt={`${cart.id} 이미지`} />
            ) : (
              <div className="placeholder">
                <img
                  src={CartEmpty} /* 플레이스홀더 이미지 경로 */
                  alt="카트 없음"
                />
              </div>
            )}
          </div>

          {/* 카트 정보 */}
          <div className="cart-info">
            <p className="cart-id">{cart.id}</p>
            {cart.status === "이용중" && (
              <>
                <p>카트 등록일: {cart.registrationDate}</p>
                <p>배터리: {cart.battery}</p>
                <p>마지막 담당자: {cart.lastManager}</p>
                <button className="check-log-button">카트 로그 확인</button>
              </>
            )}
          </div>

          {/* 상태 표시 */}
          {cart.status === "이용중" && (
            <span className="status in-use">이용중</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CartList;
