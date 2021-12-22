import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import ImageUploading from "react-images-uploading";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addProduct } from "../../actions/product.actions";
import "./style.css";

function AddProduct(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [category, setCategory] = useState();
  const [images, setImages] = useState([]);
  const maxNumber = 5;
  const { categories } = useSelector((state) => state.categories);
  const { isAdding } = useSelector((state) => state.products);
  const [cateError, setCateError] = useState("");

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const { fields: categoryInfo } = useFieldArray({
    control,
    name: "categoryInfo",
  });

  const onSubmit = (data) => {
    console.log(data);
    console.log(!category);
    if (!category) {
      setCateError("Error");
      return;
    }
    const form = new FormData();
    Object.keys(data).forEach((key, index) => {
      if (!["category", "categoryInfo", "productPictures"].includes(key)) {
        form.append(key, data[key]);
      }
    });
    form.append("category", category.name);
    for (let field of data.categoryInfo) {
      if (field.value !== "" && field.name !== "") {
        form.append(
          "categoryInfo",
          JSON.stringify({ name: field.name, value: field.value })
        );
      }
    }
    for (let pic of images) {
      form.append("productPictures", pic.file);
    }
    for (var pair of form.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    dispatch(addProduct(form)).then(() => {
      history.push("/products");
    });
  };

  return (
    <Container>
      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Label className="form__title d-block">Product name:</Form.Label>
          <Form.Control
            className="form__input w-100"
            {...register(`name`, { required: true })}
            placeholder="Category name"
          />
          {errors.name && (
            <span className="errorMessage">This field is required</span>
          )}
          <Row>
            <Col lg={4}>
              <Form.Label className="form__title d-block">
                Regular Price:
              </Form.Label>
              <Form.Control
                className="form__input w-100"
                {...register(`regularPrice`, { required: true })}
                placeholder="0"
                type="number"
                onChange={(e) => {
                  const salePrice = getValues("salePrice");
                  let result = Math.round(
                    (1 - Number(salePrice) / Number(e.target.value)) * 100
                  );
                  if (result < 0) result = 0;
                  setValue("sale", result.toString());
                }}
              />
              {errors.regularPrice && (
                <span className="errorMessage">This field is required</span>
              )}
            </Col>
            <Col lg={4}>
              <Form.Label className="form__title d-block">
                Sale Price:
              </Form.Label>
              <Form.Control
                className="form__input w-100"
                {...register(`salePrice`, { required: true })}
                placeholder="0"
                type="number"
                onChange={(e) => {
                  const regularPrice = getValues("regularPrice");
                  let result = Math.round(
                    (1 - Number(e.target.value) / Number(regularPrice)) * 100
                  );
                  if (result < 0) result = 0;
                  setValue("sale", result.toString());
                }}
              />
              {errors.salePrice && (
                <span className="errorMessage">This field is required</span>
              )}
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
            {...register(`quantity`, { required: true })}
            placeholder="0"
            type="number"
          />
          {errors.salePrice && (
            <span className="errorMessage">This field is required</span>
          )}
          <Form.Label className="form__title d-block">Description:</Form.Label>
          <Form.Control
            as="textarea"
            className="form__input w-100"
            {...register(`description`, { required: true })}
            placeholder="Description"
          />
          {errors.salePrice && (
            <span className="errorMessage">This field is required</span>
          )}
          <Form.Label className="form__title d-block">Category:</Form.Label>
          {categories.length > 0 && (
            <Form.Control
              as="select"
              value={(category && category.name) || -1}
              onChange={(e) => {
                if (category) {
                  const prevFieldCount =
                    category.filterField.length + category.normalField.length;
                  for (let i = 0; i < prevFieldCount; i++) {
                    setValue(`categoryInfo.${i}.name`, "");
                    setValue(`categoryInfo.${i}.value`, "");
                  }
                }

                const cate = categories.find(
                  (cate) => cate.name === e.target.value
                );
                for (let i = 0; i < cate.filterField.length; i++) {
                  setValue(`categoryInfo.${i}.name`, cate.filterField[i].name);
                }
                let j = 0;
                for (
                  let k = cate.filterField.length;
                  k < cate.filterField.length + cate.normalField.length;
                  k++
                ) {
                  setValue(`categoryInfo.${k}.name`, cate.normalField[j].name);
                  j++;
                }
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
          {!category && cateError && (
            <span className="errorMessage">This field is required</span>
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
                />
                <Form.Control
                  as="select"
                  defaultValue={""}
                  {...register(`categoryInfo.${index}.value`)}
                >
                  <option value={""} disabled>
                    Choose your option
                  </option>
                  {field.value.map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </Form.Control>
              </div>
            ))}

          {category &&
            category.normalField.map((field, index) => (
              <div>
                <Form.Label className="form__title d-block">
                  {field.name}
                </Form.Label>
                <Form.Control
                  hidden
                  value={field.name}
                  {...register(
                    `categoryInfo.${category.filterField.length + index}.name`
                  )}
                  placeholder="Description"
                />
                <Form.Control
                  className="form__input w-100"
                  {...register(
                    `categoryInfo.${category.filterField.length + index}.value`
                  )}
                  placeholder="Product infomation"
                />
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
          {/* <input type="submit" className="btn btn-success w-25 mt-3" /> */}
          <Button
            variant="success"
            className="mt-3 mr-2"
            type="submit"
            disabled={isAdding}
          >
            {isAdding && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default AddProduct;
