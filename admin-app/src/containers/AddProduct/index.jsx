import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../actions/category.actions";
import { useHistory } from "react-router-dom";
import ImageUploading from "react-images-uploading";
import "./style.css";
import { addProduct } from "../../actions/product.actions";
function AddProduct(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [category, setCategory] = useState();
  const [images, setImages] = useState([]);
  const maxNumber = 5;
  const { categories } = useSelector((state) => state.categories);
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(...imageList.map((img) => img.file), addUpdateIndex);
    setImages(imageList);
  };
  const { register, control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      name: "",
      regularPrice: "",
      sale: "",
      salePrice: "",
      quantity: "",
      description: "",
      productPictures: "",
      category: "",
    },
  });
  // categoryInfo,

  const { fields: categoryInfo } = useFieldArray({
    control,
    name: "categoryInfo",
  });

  const onSubmit = (data) => {
    const form = new FormData();
    Object.keys(data).forEach((key, index) => {
      if (!["category", "categoryInfo", "productPictures"].includes(key)) {
        form.append(key, data[key]);
      }
    });
    form.append("category", category.name);
    for (let field of data.categoryInfo) {
      form.append(
        "categoryInfo",
        JSON.stringify({ name: field.name, value: field.value })
      );
    }
    for (let pic of images) {
      form.append("productPictures", pic.file);
    }
    dispatch(addProduct(form));
    history.push("/products");
  };

  return (
    <Container>
      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Label className="form__title d-block">Product name:</Form.Label>
          <Form.Control
            className="form__input w-100"
            {...register(`name`)}
            placeholder="Category name"
          />
          <Row>
            <Col lg={4}>
              <Form.Label className="form__title d-block">
                Regular Price:
              </Form.Label>
              <Form.Control
                className="form__input w-100"
                {...register(`regularPrice`)}
                placeholder="0"
                onChange={(e) => {
                  const salePrice = getValues("salePrice");
                  const result = Math.round(
                    (1 - Number(salePrice) / Number(e.target.value)) * 100
                  );
                  setValue("sale", result.toString());
                }}
              />
            </Col>
            <Col lg={4}>
              <Form.Label className="form__title d-block">
                Sale Price:
              </Form.Label>
              <Form.Control
                className="form__input w-100"
                {...register(`salePrice`)}
                placeholder="0"
                onChange={(e) => {
                  const regularPrice = getValues("regularPrice");
                  const result = Math.round(
                    (1 - Number(e.target.value) / Number(regularPrice)) * 100
                  );
                  setValue("sale", result.toString());
                }}
              />
            </Col>
            <Col lg={4}>
              <Form.Label className="form__title d-block">Sale:</Form.Label>
              <InputGroup className="w-100">
                <FormControl
                  className="form__input w-75"
                  readOnly
                  {...register(`sale`)}
                  placeholder="0"
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Form.Label className="form__title d-block">Quantity:</Form.Label>
          <Form.Control
            className="form__input w-100"
            {...register(`quantity`)}
            placeholder="0"
          />
          <Form.Label className="form__title d-block">Description:</Form.Label>
          <Form.Control
            as="textarea"
            className="form__input w-100"
            {...register(`description`)}
            placeholder="Description"
          />
          <Form.Label className="form__title d-block">Category:</Form.Label>
          {categories.length > 0 && (
            <Form.Control
              as="select"
              value={(category && category.name) || -1}
              onChange={(e) => {
                const cate = categories.find(
                  (cate) => cate.name === e.target.value
                );
                setCategory(cate);
              }}
            >
              <option disabled value={-1} key={-1}>
                Open this select menu
              </option>
              {categories.map((cate) => (
                <option value={cate.name} key={cate._id}>
                  {cate.name}
                </option>
              ))}
            </Form.Control>
          )}
          {category &&
            category.filterField.map((field, index) => (
              <div>
                <Form.Label className="form__title d-block">
                  {field.name}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  hidden
                  value={field.name}
                  {...register(`categoryInfo.${index}.name`)}
                  placeholder="Description"
                />
                <Form.Control
                  as="select"
                  {...register(`categoryInfo.${index}.value`)}
                >
                  {field.value.map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </Form.Control>
              </div>
            ))}
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              // write your building UI
              <>
                <Form.Label className="form__title d-block">
                  Product's pictures:
                </Form.Label>
                <div className="product__images">
                  <Button
                    variant="outline-primary"
                    className="product__images--add"
                    style={isDragging ? { color: "red" } : null}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Click or Drop here
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="product__images--remove-all"
                    onClick={onImageRemoveAll}
                  >
                    Remove all images
                  </Button>
                  <div className="product__images-container">
                    {imageList.map((image, index) => (
                      <div key={index}>
                        <div className="product__images-image-wrapper">
                          <img
                            src={image.data_url}
                            alt=""
                            width="100"
                            className="product__images-image"
                            onClick={() => onImageRemove(index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </ImageUploading>
          <input type="submit" className="btn btn-success w-25 mt-3" />
        </Form>
      </div>
    </Container>
  );
}

export default AddProduct;
