import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Input from "../../components/UI/Input";
import CustomModal from "../../components/UI/Modal";
import { createCategoryOptions } from "../../helpers/util";

function Pages() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const categoryState = useSelector((state) => state.categories);
  const [categoryId, setCategoryId] = useState("");
  useEffect(() => {
    setCategories(createCategoryOptions(categoryState.categories));
  }, [categoryState]);
  const handleClose = () => {
    setShow(false);
  };
  const handleBannerImages = (e) => {
    console.log(e);
  };
  const handleProductImages = (e) => {
    console.log(e);
  };
  const renderAddPage = () => {
    return (
      <CustomModal title="Add page" show={show} handleClose={handleClose}>
        <Row>
          <Col>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="form-control mb-3"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Col>
        </Row>
        <Row>
          <Col>
            <Input
              value={title}
              placeholder="Page title"
              onChange={(e) => setTitle(e.target.value)}
              className="form-control mb-3"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Input
              value={description}
              placeholder="Page description"
              onChange={(e) => setDescription(e.target.value)}
              className="form-control mb-3"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <input
              className="form-control mb-3"
              type="file"
              name="banner"
              onChange={handleBannerImages}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <input
              className="form-control mb-3"
              type="file"
              name="banner"
              onChange={handleProductImages}
            />
          </Col>
        </Row>
      </CustomModal>
    );
  };
  return (
    <div>
      <Button onClick={() => setShow(true)}>Add page</Button>
      {renderAddPage()}
    </div>
  );
}

export default Pages;
