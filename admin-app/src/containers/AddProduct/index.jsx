import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getProductById } from "../../actions/product.actions";
import { Controller, useFieldArray, useForm } from "react-hook-form";

function ProductDetail(props) {
  const param = useParams();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (param) {
  //     dispatch(getProductById(param));
  //   }
  // }, [dispatch, param]);
  const { product } = useSelector((state) => state.products);
  const { register, control, handleSubmit, reset } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "names",
  });
  const [fetchData, setFetchData] = useState({
    name: "Tien",
    names: [
      {
        name: "Bob",
        value: "Actually",
      },
      {
        name: "Jane",
        value: "Actually",
      },
    ],
  });
  useEffect(() => {
    reset(fetchData);
  }, [reset, fetchData]);

  const onSubmit = (data) => console.log(data);
  const addField = () => {
    setFetchData({
      ...fetchData,
      names: [...fetchData.names, { name: "An", value: "Vo" }],
    });
  };
  return (
    <div>
      <button onClick={addField}>Add field</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          <input {...register(`name`)} />
          {fields.map((item, index) => (
            <li key={item.id}>
              <input
                defaultValue={`${item.name}`}
                {...register(`names[${index}].name`)}
              />
            </li>
          ))}
        </ul>
        <input type="submit" />
      </form>
    </div>
  );
}

export default ProductDetail;
