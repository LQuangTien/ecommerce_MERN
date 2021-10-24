import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getProductById } from "../../actions/product.actions";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "./style.css";
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
    name: "categoryInfo",
  });
  const [fetchData, setFetchData] = useState({
    productPictures: [
      "DJien-thoai-Samsung-Galaxy-Note-20-Ultra-1634994377359.jpg",
      "DJien-thoai-Samsung-Galaxy-Note-20-Ultra-1634994377363.jpg",
      "DJien-thoai-Samsung-Galaxy-Note-20-Ultra-1634994377369.jpg",
    ],
    name: "Điện thoại Samsung Galaxy Note 20 Ultra Blue",
    categoryInfo: [
      {
        name: "insurance",
        value: "12 tháng",
      },
      {
        name: "screen",
        value: "Infinity-O Dynamic AMOLED 2X",
      },
      {
        name: "frontCamera",
        value: "10 MP",
      },
      {
        name: "rearCamera",
        value:
          "3 camera; Camera góc rộng: 12MP; Camera góc siêu rộng; 108MP; Ống kính Tele: 12MP",
      },
      {
        name: "chipset",
        value: "MediaTek Helio G80 8 nhân",
      },
      {
        name: "screenSize",
        value: '6.9 "',
      },
      {
        name: "battery",
        value: "4500 mAh",
      },
      {
        name: "brand",
        value: "Samsung",
      },
      {
        name: "color",
        value: "Blue",
      },
      {
        name: "ram",
        value: "8GB",
      },
      {
        name: "rom",
        value: "256GB",
      },
    ],
    regularPrice: "19990000",
    sale: "0%",
    salePrice: "19990000",
    quantity: "100",
    description:
      'Điện thoại Samsung Galaxy Note 20 Ultra được nhãn hàng nổi tiếng Samsung "trình làng" trong thời gian gần đây. Điểm đáng chú trong sự trở lại này là sản phẩm đã được tăng cường khả năng lưu trữ đến mức đáng kinh ngạc. Galaxy Note 20 Ultra đã được trang bị bộ nhớ "khủng" 256GB, tuy nhiên người dùng hoàn toàn có thể lưu trữ nhiều dữ liệu hơn thế với sự hỗ trợ của thẻ nhớ dung lượng cho phép lên đến 1TB!',
    category: "Mobile",
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
        <table className="order-detail__product-table">
          <tr>
            <th className="order-detail__product-table-heading">Name</th>
            <td>
              <input {...register(`name`)} />
            </td>
            <th className="order-detail__product-table-heading">Category</th>
            <td>
              <input {...register(`category`)} />
            </td>
          </tr>
          <tr>
            <th className="order-detail__product-table-heading">
              Regular Price
            </th>
            <td>
              <input {...register(`regularPrice`)} />
            </td>
            <th className="order-detail__product-table-heading">Sale Price</th>
            <td>
              <input {...register(`salePrice`)} />
            </td>
            <th className="order-detail__product-table-heading">Sale</th>
            <td>
              <input {...register(`sale`)} />
            </td>
          </tr>
          <tr>
            <th className="order-detail__product-table-heading">In stock</th>
            <td>
              <input {...register(`quantity`)} />
            </td>
            <th className="order-detail__product-table-heading">Sold</th>
            <td>
              <input {...register(`soldAmount`)} />
            </td>
          </tr>
          <tr>
            <th className="order-detail__product-table-heading">Description</th>
            <td>
              <input {...register(`description`)} />
            </td>
          </tr>
          {fields.map((item, index) => (
            <tr key={item.id}>
              <th className="order-detail__product-table-heading">
                <input {...register(`categoryInfo[${index}].name`)} />
              </th>
              <td colSpan="5">
                <input {...register(`categoryInfo[${index}].value`)} />
              </td>
            </tr>
          ))}
        </table>

        <input type="submit" />
      </form>
    </div>
  );
}

export default ProductDetail;
