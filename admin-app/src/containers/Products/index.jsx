import MUIDataTable from "mui-datatables";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import "./style.css";
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
    "Quantity sold",
    "Available",
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
    product.quantitySold,
    product.isAvailable ? "Yes" : "No",
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
