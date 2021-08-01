import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "../../actions";
import { generatePictureUrl } from "../../urlConfig";
import { Link } from "react-router-dom";
import "./style.css";
function OrderPage() {
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.authenticate) {
      dispatch(getOrder());
    }
  }, [auth.authenticate]);
  useEffect(() => {
    setOrders(user.orders);
  }, [user.orders]);
  return (
    <div>
      {orders.map((order) => (
        <div className="order-container">
          {order.items.map((item) => (
            <Link to={`/account/order/${order._id}`} className="orderCard">
              <div
                className="orderCard__img-container"
                style={{ width: "15%" }}
              >
                <img
                  src={generatePictureUrl(
                    item.productId.productPictures[0].img
                  )}
                  alt=""
                />
              </div>
              <div style={{ width: "40%" }}>
                <div>{item.productId.name}</div>
                <div>Category: {item.productId.category.name}</div>
              </div>
              <div style={{ width: "20%" }}>
                {item.paidPrice} * {item.quantity}
              </div>
              <div>
                <div>
                  <strong>Status:</strong> {order.status}
                </div>
                <div>Will deliver in 2 - 3 days </div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export default OrderPage;
