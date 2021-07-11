import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Input from "../../components/UI/Input";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  addCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../components/UI/Modal";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import {
  IoIosCheckboxOutline,
  IoIosCheckbox,
  IoIosArrowForward,
  IoIosArrowDown,
} from "react-icons/io";
function Category(props) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState(null);
  //
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [checkedArray, setCheckedArray] = useState([]);
  const [expandedArray, setExpandedArray] = useState([]);
  //
  const [show, setShow] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  //
  const dispatch = useDispatch();
  const categoriesState = useSelector((state) => state.categories);
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
  const renderCategories = (categories) => {
    return categories.map((category) => {
      return {
        label: category.name,
        value: category._id,
        children:
          category.children &&
          category.children.length > 0 &&
          renderCategories(category.children),
      };
    });
  };
  const createCategoryOptions = (categories, options = []) => {
    for (let category of categories) {
      options.push({
        value: category._id,
        name: category.name,
        parentId: category.parentId,
      });
      if (category.children && category.children.length > 0) {
        createCategoryOptions(category.children, options);
      }
    }
    return options;
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleUpdateModalOpen = () => {
    getCheckedAndExpanded();
    setUpdateModal(true);
  };
  const getCheckedAndExpanded = () => {
    const categories = createCategoryOptions(categoriesState.categories);
    const checkedArray =
      checked.length > 0 &&
      checked.map((categoryId) => {
        return categories.find((category) => categoryId == category.value);
      });
    const expandedArray =
      expanded.length > 0 &&
      expanded.map((categoryId) => {
        return categories.find((category) => categoryId == category.value);
      });
    setCheckedArray(checkedArray);
    setExpandedArray(expandedArray);
  };
  const handleCategoryInput = (key, value, index, type) => {
    if (type === "checked") {
      const updatedCheckedArray = checkedArray.map((item, _index) =>
        index == index ? { ...item, [key]: value } : item
      );
      setCheckedArray(updatedCheckedArray);
    } else {
      const updatedExpandedArray = expandedArray.map((item, _index) =>
        index == index ? { ...item, [key]: value } : item
      );
      setExpandedArray(updatedExpandedArray);
    }
  };
  const handleUpdateModalClose = () => {
    const form = new FormData();
    if (expandedArray.length > 0) {
      expandedArray.forEach((item) => {
        form.append("_id", item.value);
        form.append("name", item.name);
        form.append("parentId", item.parentId || "");
        form.append("type", item.type);
      });
    }
    if (checkedArray.length > 0) {
      checkedArray.forEach((item) => {
        form.append("_id", item.value);
        form.append("name", item.name);
        form.append("parentId", item.parentId || "");
        form.append("type", item.type);
      });
    }

    dispatch(updateCategory(form)).then((result) => {
      if (result) dispatch(getAllCategory());
    });
    setUpdateModal(false);
  };
  const renderUpdateModal = () => (
    <CustomModal
      title="Update category"
      show={updateModal}
      handleClose={handleUpdateModalClose}
      size="lg"
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
                <option>Select category</option>
                {createCategoryOptions(categoriesState.categories).map(
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
                {createCategoryOptions(categoriesState.categories).map(
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
  const renderAddModal = () => (
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
  );
  const renderDeleteModal = () => {
    return (
      <CustomModal
        title="Delete category"
        show={deleteModal}
        handleClose={handleDeleteModalClose}
        buttons={[
          {
            label: "No",
            color: "primary",
            onClick: handleDeleteModalClose,
          },
          {
            label: "Yes",
            color: "danger",
            onClick: handleDeleteCategories,
          },
        ]}
      >
        Are yout sure ?<h5>Expanded</h5>
        {expandedArray.map((item, index) => (
          <p key={index}>{item.name}</p>
        ))}
        <h5>Checked</h5>
        {checkedArray.map((item, index) => (
          <p key={index}>{item.name}</p>
        ))}
      </CustomModal>
    );
  };
  const handleDeleteModalClose = () => {
    setDeleteModal(false);
  };
  const handleDeleteModalOpen = () => {
    getCheckedAndExpanded();
    setDeleteModal(true);
  };
  const handleDeleteCategories = () => {
    const ids = checkedArray.map((item) => ({ _id: item.value }));
    // const IdsOfExpanded = expandedArray.map((item) => ({ _id: item.value }));
    // const ids = IdsOfChecked.concat(IdsOfExpanded);
    dispatch(deleteCategory(ids)).then((result) => {
      if (result) dispatch(getAllCategory());
    });
    setDeleteModal(false);
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
          {/* <ul>{renderCategories(categoriesState.categories)}</ul> */}
          <ul>
            <CheckboxTree
              nodes={renderCategories(categoriesState.categories)}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => setChecked(checked)}
              onExpand={(expanded) => setExpanded(expanded)}
              icons={{
                check: <IoIosCheckbox />,
                uncheck: <IoIosCheckboxOutline />,
                halfCheck: <IoIosCheckboxOutline />,
                expandClose: <IoIosArrowForward />,
                expandOpen: <IoIosArrowDown />,
              }}
            />
          </ul>
        </Col>
      </Row>
      <Row>
        <Col>
          <button onClick={handleDeleteModalOpen}>Delete</button>
          <button onClick={handleUpdateModalOpen}>Update</button>
        </Col>
      </Row>

      {/* Edit */}
      {renderAddModal()}
      {renderUpdateModal()}
      {renderDeleteModal()}
    </Container>
  );
}

Category.propTypes = {};

export default Category;
