import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "../../components/UI/Card";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table } from "react-bootstrap";
import "./style.css";
import { getInitialData } from "../../actions/initialData.actions";
import { formatDate } from "../../helpers/util";
import { updateOrder } from "../../actions";
import { productConstants } from "../../actions/constants";

function Orders(props) {
  const auth = useSelector((state) => state.auth);
  const orderState = useSelector((state) => state.orders);
  const [orders, setOrders] = useState(orderState.orders);
  const [type, setType] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.authenticate) {
      setOrders(orderState.orders);
    }
  }, [orderState.orders]);
  const updateOrderStatus = (_id) => {
    if (type) {
      dispatch(updateOrder({ _id, type }));
    }
  };
  return (
    <div>
      {orders.map((order, index) => (
        <Card
          key={index}
          leftHeader={
            <div>
              <div>
                <div className="d-inline-block">
                  <strong className="mr-1">Customer:</strong>
                  <span className="mr-2">{order.address.name}</span>
                </div>
                <div className="d-inline-block">
                  <strong className="mr-1">Phone:</strong>
                  <span className="mr-2">{order.address.phone}</span>
                </div>
              </div>
              <div>
                <strong className="mr-1">Address:</strong>
                <span>{`${order.address.address}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`}</span>
              </div>
            </div>
          }
          rightHeader={
            <div>
              <strong className="mr-1">Order ID:</strong>
              <span>{order._id}</span>
            </div>
          }
        >
          <div className="product-container">
            <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr className="table-row--vertical-text">
                    <td>
                      <div>{index + 1}</div>
                    </td>
                    <td>
                      <div>{item.productId.name}</div>
                    </td>
                    <td>
                      <div>{item.paidPrice}</div>
                    </td>
                    <td>
                      <div>{item.quantity}</div>
                    </td>
                    {index === 0 && (
                      <td rowSpan={order.items.length}>
                        <div>{order.totalAmount}</div>
                      </td>
                    )}
                    {index === 0 && (
                      <td rowSpan={order.items.length}>
                        <div className="capitalize">{order.paymentOption}</div>
                      </td>
                    )}
                    {index === 0 && (
                      <td rowSpan={order.items.length}>
                        <div className="capitalize">{order.status}</div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="order-container">
            <div className="orderTrack">
              {order.process.map((item, index) => (
                <div
                  key={index}
                  className={
                    "orderStatus " + (item.isCompleted ? " isCompleted" : "")
                  }
                >
                  <div
                    className={"point" + (item.isCompleted ? " isCompleted" : "")}
                  ></div>
                  <div className="orderInfo">
                    <div className="status">{item.type}</div>
                    <div className="date">
                      {item.date ? formatDate(item.date) : "Not yet"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="payment-container">
              <div>
                <select
                  onChange={(e) => setType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select option</option>
                  {order.process.map(
                    (item, index) =>
                      !item.isCompleted && (
                        <option
                          key={index}
                          className="status"
                          value={item.type}
                        >
                          {item.type}
                        </option>
                      )
                  )}
                </select>
              </div>
              <div>
                <Button onClick={() => updateOrderStatus(order._id)}>
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Orders;
