import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getProductById } from "../../actions/product.actions";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Container } from "react-bootstrap";
import Select from "react-select";
import { addCategory } from "../../actions";

function AddCategory(props) {
  const dispatch = useDispatch();
  const { register, control, handleSubmit, reset } = useForm({
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
    console.log({ ...data, filterField: mappedFilterField });
    // dispatch(addCategory(data));
  };

  return (
    <Container>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register(`name`)} />
          <h4>Normal field</h4>
          <button
            type="button"
            onClick={() => {
              normalAppend({ name: "", value: "" });
            }}
          >
            Add more info
          </button>
          {normalField.map((item, index) => {
            return (
              <li key={item.id}>
                <input
                  {...register(`normalField.${index}.name`)}
                  placeholder="Product info name"
                />
                <input
                  {...register(`normalField.${index}.value`)}
                  placeholder="Product info "
                />
                <button type="button" onClick={() => normalRemove(index)}>
                  Delete
                </button>
              </li>
            );
          })}
          <h4>Filter field</h4>
          <button
            type="button"
            onClick={() => {
              filterAppend({ name: "", value: "", type: "" });
            }}
          >
            Add more info
          </button>
          {filterField.map((item, index) => {
            return (
              <li key={item.id}>
                <input
                  {...register(`filterField.${index}.name`)}
                  placeholder="Product info name"
                />
                <input
                  {...register(`filterField.${index}.value`)}
                  placeholder="Product info "
                />
                <select {...register(`filterField.${index}.type`)}>
                  <option value="single">Single</option>
                  <option value="multiple">Multiple</option>
                </select>
                <button type="button" onClick={() => filterRemove(index)}>
                  Delete
                </button>
              </li>
            );
          })}
          <input type="submit" />
        </form>
      </div>
    </Container>
  );
}

export default AddCategory;
