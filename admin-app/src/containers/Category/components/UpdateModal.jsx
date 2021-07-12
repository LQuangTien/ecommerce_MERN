import React from "react";
import { Row, Col } from "react-bootstrap";
import Input from "../../../components/UI/Input";
import CustomModal from "../../../components/UI/Modal";

function UpdateModal(props) {
  const {
    title,
    size,
    show,
    handleClose,
    expandedArray,
    checkedArray,
    handleCategoryInput,
    categories
  } = props;
  return (
    <CustomModal
      title={title}
      show={show}
      handleClose={handleClose}
      size={size}
    >
      <Row>
        <Col>
          <h6>Expanded</h6>
        </Col>
      </Row>
      {expandedArray.length > 0 &&
        expandedArray.map((item, index) => (
          <Row key={index}>
            <Col>
              <Input
                placeholder="Name"
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleCategoryInput("name", e.target.value, index, "expanded")
                }
              />
            </Col>
            <Col>
              <select
                className="form-control"
                value={item.parentId}
                onChange={(e) =>
                  handleCategoryInput(
                    "parentId",
                    e.target.value,
                    index,
                    "expanded"
                  )
                }
              >
                <option value="">Select category</option>
                {categories.map(
                  (option) => (
                    <option value={option.value} key={option.value}>
                      {option.name}
                    </option>
                  )
                )}
              </select>
            </Col>
            <Col>
              <select name="" className="form-control">
                <option value="">Select type</option>
                <option value="store">Store</option>
                <option value="product">Product</option>
                <option value="page">Page</option>
              </select>
            </Col>
          </Row>
        ))}
      <Row>
        <Col>
          <h6>Checked</h6>
        </Col>
      </Row>
      {checkedArray.length > 0 &&
        checkedArray.map((item, index) => (
          <Row key={index}>
            <Col>
              <Input
                placeholder="Name"
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleCategoryInput("name", e.target.value, index, "checked")
                }
              />
            </Col>
            <Col>
              <select
                className="form-control"
                value={item.parentId}
                onChange={(e) =>
                  handleCategoryInput(
                    "parentId",
                    e.target.value,
                    index,
                    "checked"
                  )
                }
              >
                <option>Select category</option>
                {categories.map(
                  (option) => (
                    <option value={option.value} key={option.value}>
                      {option.name}
                    </option>
                  )
                )}
              </select>
            </Col>
            <Col>
              <select name="" className="form-control">
                <option value="">Select type</option>
                <option value="store">Store</option>
                <option value="product">Product</option>
                <option value="page">Page</option>
              </select>
            </Col>
          </Row>
        ))}
    </CustomModal>
  );
}

export default UpdateModal;
