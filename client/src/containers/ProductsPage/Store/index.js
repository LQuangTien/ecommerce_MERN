import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBySlug } from "../../../actions/product.actions";
import { generatePictureUrl } from "../../../urlConfig";
import "./style.css";

function Store(props) {
  const [priceRange, setPriceRange] = useState({
    under5k: 5000,
    under10k: 10000,
    under15k: 15000,
    under20k: 20000,
    under30k: 30000,
  });
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  useEffect(() => {
    const { match } = props;
    dispatch(getBySlug(match.params.slug));
  });
  return <div>
  {Object.keys(products.groupByPrice).map((key, index) => {
    return (
      <div className="card">
        <div className="cardHeader">
          <div>
            {props.match.params.slug} Mobile Under {priceRange[key]}
          </div>
          <button>View All</button>
        </div>
        <div style={{ display: "flex" }}>
          {products.groupByPrice[key].map((product) => (
            <div className="productContainer">
              <div className="productImageContainer">
                <img
                  src={generatePictureUrl(product.productPictures[0].img)}
                  alt=""
                />
              </div>
              <div className="productInfo">
                <div style={{ margin: "5px 0" }}>{product.name}</div>
                <div>
                  <span>4.3</span> <span>3890</span>
                  <div className="productPrice">{product.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  })}
</div>;
}

export default Store;
