import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBySlug } from "../../../actions/product.actions";
import { generatePictureUrl } from "../../../urlConfig";
import { Link } from "react-router-dom";
import Card from "../../../components/UI/Card";
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
  }, []);
  return (
    <div>
      {Object.keys(products.groupByPrice).map((key, index) => {
        return (
          <Card
            leftHeader={
              <div>
                {props.match.params.slug} Mobile Under {priceRange[key]}
              </div>
            }
            rightHeader={<button>View All</button>}
            style={{ width: "calc(100% - 40px)", margin: "20px" }}
          >
            <div style={{ display: "flex" }}>
              {products.groupByPrice[key].map((product) => (
                <Link
                  to={`${props.match.params.slug}/${product._id}`}
                  className="productContainer"
                >
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
                </Link>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default Store;
