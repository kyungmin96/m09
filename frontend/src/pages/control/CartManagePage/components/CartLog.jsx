import React from "react";
import "./CartLog.scss";

const CartLog = ({ selectedCart, logs }) => {
  if (!selectedCart) {
    return (
      <div className="cart-log">
        <h2>카트 로그</h2>
        <p>카트를 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="cart-log">
      <h2>카트 로그</h2>
      <p className="selected-cart">{selectedCart}</p>
      <ul className="log-list">
        {logs.map((log, index) => (
          <li key={index} className="log-item">
            <span className="log-date">{log.date}</span>
            <span className="log-time">{log.time}</span>
            <span className="log-manager">{log.manager}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartLog;
