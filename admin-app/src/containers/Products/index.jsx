import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/UI/Input";
import CustomModal from "../../components/UI/Modal";
import PropTypes from "prop-types";
import { addProduct } from "../../actions/product.actions";
import "./style.css";
import { generatePictureUrl } from "../../urlConfig";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router";
function Products(props) {
  const history = useHistory();
  const { products } = useSelector((state) => state.products);
  const columns = [
    {
      name: "id",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    "Name",
    "Regular Price",
    "Price",
    "Sale",
    "Quantity",
    "Sold Amount",
  ];
  const options = {
    filter: true,
    filterType: "multiselect",
    download: false,
    print: false,
    onRowClick: (rowData, rowMeta) => {
      history.push(`product/${rowData[0]}`);
    },
    selectableRowsHideCheckboxes: true,
  };
  const data = products.map((product) => [
    product._id,
    product.name,
    product.regularPrice,
    product.salePrice,
    product.sale,
    product.quantity,
    product.soldAmount || 0,
  ]);
  const renderProductsTable = () =>
    data && (
      <MUIDataTable
        title={"ACME Employee list"}
        data={data}
        columns={columns}
        options={options}
      />
    );
  return (
    <div>
      <Container>
        <Row>
          <Col md={12}>
            <div className="d-flex justify-content-between">
              <h3>Products</h3>
              <Button
                variant="primary"
                onClick={() => {
                  history.push("/product/add");
                }}
              >
                Add
              </Button>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12}>{renderProductsTable()}</Col>
        </Row>
      </Container>
      {/* {renderAddModal()}
      {renderDetailModal()} */}
    </div>
  );
}

export default Products;
