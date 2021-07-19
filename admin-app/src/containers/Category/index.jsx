import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import {
  IoIosAdd,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosCheckbox,
  IoIosCheckboxOutline,
  IoIosHammer,
  IoIosTrash,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../../actions";
import { createCategoryOptions } from "../../helpers/util";
import AddModal from "./components/AddModal";
import DeleteModal from "./components/DeleteModal";
import UpdateModal from "./components/UpdateModal";
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
  const handleAddModalSubmit = () => {
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
  const handleUpdateModalSubmit = () => {
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

    dispatch(updateCategory(form));
    setUpdateModal(false);
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
    dispatch(deleteCategory(ids));
    setDeleteModal(false);
  };
  const categoriesList = createCategoryOptions(categoriesState.categories);
  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-between">
            <h3>Category</h3>
            <div>
              <Button variant="primary" onClick={handleShow} className="mr-2">
                <span>
                  <IoIosAdd /> Add
                </span>
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateModalOpen}
                className="mr-2"
              >
                <span>
                  <IoIosHammer />
                  Update
                </span>
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteModalOpen}
                className="mr-2"
              >
                <span>
                  <IoIosTrash /> Delete
                </span>
              </Button>
            </div>
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
      <AddModal
        title="Add category"
        show={show}
        handleClose={() => setShow(false)}
        onSubmit={handleAddModalSubmit}
        name={name}
        setName={setName}
        parentId={parentId}
        setParentId={setParentId}
        categories={categoriesList}
        handleImageChange={handleImageChange}
      />
      <UpdateModal
        title="Update category"
        size="lg"
        show={updateModal}
        handleClose={() => setUpdateModal(false)}
        onSubmit={handleUpdateModalSubmit}
        expandedArray={expandedArray}
        checkedArray={checkedArray}
        handleCategoryInput={handleCategoryInput}
        categories={categoriesList}
      />
      <DeleteModal
        title="Delete category"
        show={deleteModal}
        handleClose={handleDeleteModalClose}
        expandedArray={expandedArray}
        checkedArray={checkedArray}
        handleDeleteModalClose={handleDeleteModalClose}
        handleDeleteCategories={handleDeleteCategories}
      />
    </Container>
  );
}

Category.propTypes = {};

export default Category;
