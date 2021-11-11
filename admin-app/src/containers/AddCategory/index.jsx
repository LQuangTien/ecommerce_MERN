import React from "react";
import { Button, Container } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCategory } from "../../actions/category.actions";
import { useHistory } from "react-router-dom";
import "./style.css";
function AddCategory(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      normalField: [{ name: "", value: "" }],
      filterField: [{ name: "", value: "", type: "" }],
    },
  });
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
    const mappedNormalField = data.normalField.reduce((acc, cur) => {
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
    dispatch(
      addCategory({
        ...data,
        filterField: mappedFilterField,
        normalField: mappedNormalField,
      })
    );
    history.push("/categories");
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
                  <li key={item.id} className="form__list-item">
                    <input
                      className="form__input"
                      {...register(`normalField.${index}.name`)}
                      placeholder="Additional infomation for product"
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
                filterAppend({ name: "", value: "" });
              }}
            >
              +
            </Button>
            <ul className="form__list">
              {filterField.map((item, index) => {
                return (
                  <li key={item.id} className="form__list-item">
                    <input
                      className="form__input"
                      {...register(`filterField.${index}.name`)}
                      placeholder="Filter field"
                    />
                    <input
                      className="form__input"
                      {...register(`filterField.${index}.value`)}
                      placeholder="Filter value "
                    />
                    <Button
                      variant="outline-danger"
                      className="form__input--delete"
                      type="button"
                      onClick={() => filterRemove(index)}
                    >
                      X
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
          <input type="submit" className="btn btn-success w-25 mt-3" />
        </form>
      </div>
    </Container>
  );
}

export default AddCategory;
