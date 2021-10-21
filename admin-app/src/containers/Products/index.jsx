import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/UI/Input";
import CustomModal from "../../components/UI/Modal";
import PropTypes from "prop-types";
import { addProduct } from "../../actions/product.actions";
import "./style.css";
import { generatePictureUrl } from "../../urlConfig";
function Products(props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pictures, setPictures] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const categoriesState = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.products);
  const handleClose = () => {
    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    form.append("description", description);
    form.append("category", categoryId);
    form.append("quantity", quantity);
    for (let picture of pictures) {
      form.append("productPicture", picture);
    }
    dispatch(addProduct(form));
    setShow(false);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
  };
  const handleShow = () => setShow(true);
  const handleShowDetail = (product) => {
    setShowDetail(true);
    setProduct(product);
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
  const handlePictureChange = (e) => {
    setPictures([...pictures, e.target.files[0]]);
  };
  const renderDetailModal = () => {
    if (!product) return;
    return (
      <CustomModal
        title="Detailt"
        show={showDetail}
        handleClose={handleCloseDetail}
        size="lg"
      >
        <Row>
          <Col md={6}>
            <label className="font-weight-bold">Name</label>
            <p>{product.name}</p>
          </Col>
          <Col md={6}>
            <label className="font-weight-bold">Price</label>
            <p>{product.price}</p>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <label className="font-weight-bold">Quantity</label>
            <p>{product.quantity}</p>
          </Col>
          <Col md={6}>
            <label className="font-weight-bold">Category</label>
            <p>{product.category.name}</p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <label className="font-weight-bold">Description</label>
            <p className="text-justify">{product.description}</p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <label className="font-weight-bold">Pictures</label>
            <div className="d-flex">
              {product.productPictures.map((picture) => (
                <div className="pictureContainer">
                  <img src={generatePictureUrl(picture)} alt="" />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </CustomModal>
    );
  };
  const renderAddModal = () => (
    <CustomModal
      title="Create new product"
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
      <Input
        label="Quantity"
        placeholder="Quantity"
        type="text"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <Input
        label="Price"
        placeholder="Price"
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Input
        label="Description"
        placeholder="Description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="form-control"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option>Select category</option>
        {createCategoryOptions(categoriesState.categories).map((option) => (
          <option value={option.value} key={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      {pictures.length > 0
        ? pictures.map((picture, index) => (
            <div key={index}>{picture.name}</div>
          ))
        : null}
      <input type="file" name="productPicture" onChange={handlePictureChange} />
    </CustomModal>
  );
  const renderProductsTable = () => (
    <Table style={{ fontSize: 12 }} responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Category</th>
          {/* <th>Descriptions</th> */}
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr onClick={() => handleShowDetail(product)} key={product._id}>
            <td>{index + 1}</td>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.quantity}</td>
            <td>{product.category.name}</td>
            {/* <td>{product.description}</td> */}
          </tr>
        ))}
      </tbody>
    </Table>
  );
  return (
    <div>
      <Container>
        <Row>
          <Col md={12}>
            <div className="d-flex justify-content-between">
              <h3>Products</h3>
              <Button variant="primary" onClick={handleShow}>
                Add
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>{renderProductsTable()}</Col>
        </Row>
      </Container>
      {renderAddModal()}
      {renderDetailModal()}
    </div>
  );
}

Products.propTypes = {};

export default Products;
