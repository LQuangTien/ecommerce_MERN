import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
function Category(props) {
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
    "Created At",
    "Updated At",
  ];
  const history = useHistory();
  const { categories } = useSelector((state) => state.categories);
  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableHeadCell: {
          contentWrapper: {
            justifyContent: "center",
          },
          toolButton: {
            marginLeft: "0",
          },
        },
        MUIDataTableBodyCell: {
          root: {
            textAlign: "center",
          },
        },
      },
    });

  const options = {
    filter: true,
    filterType: "multiselect",
    download: false,
    print: false,
    onRowClick: (rowData, rowMeta) => {
      history.push(`category/edit/${rowData[0]}`);
    },
    selectableRowsHideCheckboxes: true,
  };
  const data = categories.map((category) => [
    category._id,
    category.name,
    new Date(category.createdAt).toLocaleDateString(),
    new Date(category.updatedAt).toLocaleDateString(),
  ]);
  const renderProductsTable = () =>
    data && (
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"ACME Employee list"}
          data={data}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
    );
  const nagivateToAddPage = () => {
    history.push("/category/add");
  };
  return (
    <div>
      <Container>
        <Row>
          <Col md={12}>
            <div className="d-flex justify-content-between">
              <h3>Products</h3>
              <Button variant="primary" onClick={nagivateToAddPage}>
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

export default Category;
