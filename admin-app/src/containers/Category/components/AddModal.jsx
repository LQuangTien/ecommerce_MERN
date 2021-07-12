import React from "react";
import { Row, Col } from "react-bootstrap";
import Input from "../../../components/UI/Input";
import CustomModal from "../../../components/UI/Modal";

function AddModal(props) {
  const {
    title,
    show,
    handleClose,
    name,
    setName,
    parentId,
    setParentId,
    categories,
    handleImageChange,
  } = props;
  return (
    <CustomModal title={title} show={show} handleClose={handleClose}>
      <Row>
        <Col>
          <Input
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
        <Col>
          <select
            className="form-control"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option>Select category</option>
            {categories.map((option) => (
              <option value={option.value} key={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <Row>
        <Col>
          <input
            type="file"
            name="categoryImage"
            onChange={handleImageChange}
          />
        </Col>
      </Row>
    </CustomModal>
  );
}

export default AddModal;
