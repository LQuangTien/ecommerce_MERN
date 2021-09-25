import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "../../actions";
import { generatePictureUrl } from "../../urlConfig";
import { Link } from "react-router-dom";
import "./style.css";
import formatThousand from "../../utils/formatThousand";
import Banner from "../../components/UI/Banner";
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
      <Banner slug={"Order history"} />
      <div className="grid wide history-table-wrapper">
        <p><strong>Here are the orders you've placed since your account was created.</strong></p>
        <table className="history-table">
          <thead className="history-table__heading">
            <tr className="history-table__heading-row">
              <th>Order reference</th>
              <th>Date</th>
              <th>Total price</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="history-table__body">
            {orders.map((order) => (
              <tr className="history-table__body-row">
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>${formatThousand(order.totalAmount)}</td>
                <td className="uppercase-first-letter">{order.paymentOption}</td>
                <td className="uppercase-first-letter">{order.status}</td>
                <td className="history-table-link"><Link to={`/account/order/${order._id}`}>View detail</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderPage;
