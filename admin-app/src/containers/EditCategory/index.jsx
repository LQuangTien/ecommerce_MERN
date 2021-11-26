import React, { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import {
  deleteCategory,
  editCategory,
  getCategory,
} from "../../actions/category.actions";
import "./style.css";

function EditCategory(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const { register, control, handleSubmit, reset } = useForm();
  const { category } = useSelector((state) => state.categories);
  useEffect(() => {
    dispatch(getCategory(id));
  }, [dispatch, id]);
  useEffect(() => {
    if (category && Object.keys(category).length > 0) {
      const mapperFilterField = category.filterField.reduce((result, field) => {
        const fields = field.value.map((value, index) => ({
          ...field,
          value,
        }));
        return [...result, ...fields];
      }, []);
      reset({ ...category, filterField: mapperFilterField });
    }
  }, [reset, category]);
  const {
    fields: normalField,
    append: normalAppend,
    remove: normalRemove,
  } = useFieldArray({ control, name: "normalField" });
  const {
    fields: filterField,
    append: filterAppend,
    remove: filterRemove,
  } = useFieldArray({ control, name: "filterField" });
  const onSubmit = (data) => {
    const mappedFilterField = data.filterField.reduce((acc, cur) => {
      const index = acc.findIndex((field) => field.name === cur.name);
      if (index < 0) {
        acc.push({
          ...cur,
          value: [cur.value],
        });
        return acc;
      }
      acc[index].value.push(cur.value);
      return acc;
    }, []);
    dispatch(editCategory({ id, ...data, filterField: mappedFilterField }));
  };
  const onDelete = () => {
    history.push("/categories");
    dispatch(deleteCategory(id));
  };
  return (
    <Container>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="form__title d-block">Category name:</p>
          <input
            className="form__input "
            {...register(`name`)}
            placeholder="Category name"
          />
          <div className="mt-3">
            <p className="form__title">Additional infomation for product</p>
            <Button
              className="form__button"
              type="button"
              onClick={() => {
                normalAppend({ name: "", value: "" });
              }}
            >
              +
            </Button>
            <ul className="form__list">
              {normalField.map((item, index) => {
                return (
                  <li key={item.id}>
                    <input
                      className="form__input"
                      {...register(`normalField.${index}.name`)}
                      placeholder="Product info name"
                    />
                    <Button
                      variant="outline-danger"
                      className="form__input--delete"
                      type="button"
                      onClick={() => normalRemove(index)}
                    >
                      X
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-3">
            <p className="form__title">Filterable Infomation </p>
            <Button
              className="form__button"
              type="button"
              onClick={() => {
                filterAppend({ name: "", value: "", type: "" });
              }}
            >
              +
            </Button>
            <ul className="form__list">
              {filterField.map((item, index) => {
                return (
                  <li key={`${item.id}_${item.value}`}>
                    <input
                      className="form__input"
                      {...register(`filterField.${index}.name`)}
                      placeholder="Product info name"
                    />
                    <input
                      className="form__input"
                      {...register(`filterField.${index}.value`)}
                      placeholder="Product info "
                    />
                    <Button
                      variant="outline-danger"
                      className="form__input--delete"
                      type="button"
                      onClick={() => {
                        filterRemove(index);
                      }}
                    >
                      X
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
          <Button variant="success" className="mt-3 mr-2" type="submit">
            Submit
          </Button>
          <Button variant="danger" className="mt-3 mr-2" onClick={onDelete}>
            Delete this category
          </Button>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => {
              history.push("/categories");
            }}
          >
            Back
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default EditCategory;
