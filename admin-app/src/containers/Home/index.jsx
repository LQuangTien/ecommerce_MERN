import React from "react";
import "./style.css";
import { Container, Row, Col } from "react-bootstrap";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const chartOptions = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

const chartLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartData = {
  labels: chartLabels,
  datasets: [
    {
      label: "Dataset 1",
      data: [100, 101, 93, 124, 54, 98, 69, 87, 103, 96, 120, 93],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const pieData = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export const lineOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const lineLabels = [
  "19-11-2021",
  "20-11-2021",
  "21-11-2021",
  "23-11-2021",
  "24-11-2021",
  "25-11-2021",
  "26-11-2021",
];

const lineData = {
  labels: lineLabels,
  datasets: [
    {
      label: "Dataset 1",
      data: [1, 5, 9, 7, 2, 6, 10],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};
function Home(props) {
  /**
   * Tổng doanh thu, tổng số sản phẩm, tổng số đơn hàng
Biểu đồ 12 cột thể hiện doanh thu từng tháng
Biểu đồ tròn top 5 sản phẩm bán chạy
Biểu đồ tròn xem top 3 category đem lại doanh thu cao nhất
   */
  return (
    <Container>
      <Row className="mt-2">
        <Col sm="4">
          <div className="statistic__number">
            <Row className="d-flex align-items-center h-100">
              <Col sm="3">
                <div
                  className="statistic__number-icon"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <LocalAtmIcon />
                </div>
              </Col>
              <Col sm="9">
                <p className="m-0 text-uppercase font-weight-bold text-secondary statistic__number-title">
                  Total revenue
                </p>
                <p
                  className="m-0 statistic__number-value"
                  style={{ color: "var(--primary)" }}
                >
                  $10,000,000
                </p>
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm="4">
          <div className="statistic__number">
            <Row className="d-flex align-items-center h-100">
              <Col sm="3">
                <div
                  className="statistic__number-icon"
                  style={{ backgroundColor: "#00C6AB" }}
                >
                  <ShoppingBasketIcon />
                </div>
              </Col>
              <Col sm="9">
                <p className="m-0 text-uppercase font-weight-bold text-secondary statistic__number-title">
                  Total products
                </p>
                <p
                  className="m-0 statistic__number-value"
                  style={{ color: "#00C6AB" }}
                >
                  478 <span style={{ fontSize: "0.8rem" }}>PRODUCTS</span>
                </p>
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm="4">
          <div className="statistic__number">
            <Row className="d-flex align-items-center h-100">
              <Col sm="3">
                <div
                  className="statistic__number-icon"
                  style={{ backgroundColor: "#FDC60A" }}
                >
                  <ReceiptIcon />
                </div>
              </Col>
              <Col sm="9">
                <p className="m-0 text-uppercase font-weight-bold text-secondary statistic__number-title">
                  Total order
                </p>
                <p
                  className="m-0 statistic__number-value"
                  style={{ color: "#FDC60A" }}
                >
                  132 <span style={{ fontSize: "0.8rem" }}>ORDERS</span>
                </p>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col className="mt-3" sm="8">
          <div className="statistic__chart">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </Col>
        <Col sm="4">
          <Row>
            <Col sm="12" className="mt-3">
              <div className="statistic__chart" style={{ height: "210px" }}>
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </Col>
            <Col sm="12" className="mt-3">
              <div className="statistic__chart" style={{ height: "210px" }}>
                <Line options={lineOptions} data={lineData} />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

Home.propTypes = {};

export default Home;
