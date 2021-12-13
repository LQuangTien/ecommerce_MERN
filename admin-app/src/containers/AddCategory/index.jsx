import React from "react";
import { Button, Container } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCategory } from "../../actions/category.actions";
import { useHistory } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";
import "./style.css";
function AddCategory(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      normalField: [{ name: ""}],
      filterField: [{ name: "", value: "" }],
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
    dispatch(
      addCategory({
        ...data,
        filterField: mappedFilterField,
      })
    );
    history.push("/categories");
  };

  return (
    <Container>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="form__title d-block">Category name:</p>
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <div style={{ color: "red" }}>{message}</div>
            )}
          />
          <input
            className="form__input "
            {...register(`name`, { required: "This is required." })}
            placeholder="Category name"
          />
          <div className="mt-3">
            <p className="form__title">Additional infomation for product</p>
            <Button
              className="form__button"
              type="button"
              onClick={() => {
                normalAppend({ name: "" });
              }}
            >
              +
            </Button>
            <ul className="form__list">
              {normalField.map((item, index) => {
                return (
                  <li key={item.id} className="form__list-item">
                    <ErrorMessage
                      errors={errors}
                      name={`normalField.${index}.name`}
                      render={({ message }) => (
                        <div style={{ color: "red" }}>{message}</div>
                      )}
                    />
                    <input
                      className="form__input"
                      {...register(`normalField.${index}.name`, {
                        required: "This is required.",
                      })}
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
                    <div className="d-inline-block w-25 mr-2">
                      <ErrorMessage
                        errors={errors}
                        name={`filterField.${index}.name`}
                        render={({ message }) => (
                          <div style={{ color: "red" }}>{message}</div>
                        )}
                      />
                      <input
                        className="form__input w-100"
                        {...register(`filterField.${index}.name`, {
                          required: "This is required.",
                        })}
                        placeholder="Filter field"
                      />
                    </div>
                    <div className="d-inline-block w-25 mr-2">
                      <ErrorMessage
                        errors={errors}
                        name={`filterField.${index}.value`}
                        render={({ message }) => (
                          <div style={{ color: "red" }}>{message}</div>
                        )}
                      />
                      <input
                        className="form__input w-100"
                        {...register(`filterField.${index}.value`, {
                          required: "This is required.",
                        })}
                        placeholder="Filter value "
                      />
                    </div>
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
