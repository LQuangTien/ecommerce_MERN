import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Input from "../../components/UI/Input";
import { Container, Row, Col, Button } from "react-bootstrap";
import { addCategory } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../components/UI/Modal";
function Category(props) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState(null);
  const handleClose = () => {
    const form = new FormData();
    form.append("name", name);
    form.append("parentId", parentId);
    form.append("categoryImage", image);
    dispatch(addCategory(form));
    setName("");
    setParentId("");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();
  const categoriesState = useSelector((state) => state.categories);
  console.log({ a: categoriesState.categories });
  const renderCategories = (categories) => {
    return categories.map((category) => (
      <li key={category.name}>
        {category.name}
        <ul>
          {category.children.length > 0 && renderCategories(category.children)}
        </ul>
      </li>
    ));
  };
  const createCategoryOptions = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name });
      if (category.children.length > 0) {
        createCategoryOptions(category.children, options);
      }
    }
    return options;
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-between">
            <h3>Category</h3>
            <Button variant="primary" onClick={handleShow}>
              Add
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <ul>{renderCategories(categoriesState.categories)}</ul>
        </Col>
      </Row>
      <CustomModal
        title="Create new category"
        show={show}
        handleClose={handleClose}
      >
        <Input
          label="Name"
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="form-control"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option>Select category</option>
          {createCategoryOptions(categoriesState.categories).map((option) => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <input type="file" name="categoryImage" onChange={handleImageChange} />
      </CustomModal>
    </Container>
  );
}

Category.propTypes = {};

export default Category;
