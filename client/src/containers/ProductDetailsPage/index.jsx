import React, { useEffect } from "react";
import { IoChatbubblesOutline, IoStar } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { getByQuery, getProductById } from "../../actions";
import { addToCart } from "../../actions/cart.actions";
import Banner from "../../components/UI/Banner";
import Button from "../../components/UI/Button";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import "./style.css";

/**
 * @author
 * @function ProductDetailsPage
 **/

const ProductDetailsPage = (props) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(getByQuery({ brand: product.productDetails.brand }, 4));
  }, [dispatch, product.productDetails.brand]);
  const { products } = useSelector((state) => state.products);
  const { productId } = props.match.params;
  useEffect(() => {
    const params = {
      id: productId,
    };
    dispatch(getProductById(params));
  }, [dispatch, productId]);

  if (Object.keys(product.productDetails).length === 0) {
    return null;
  }

  const handleAddToCart = () => {
    const { _id, name, price } = product.productDetails;
    const img = product.productDetails.productPictures[0].img;
    dispatch(addToCart({ _id, name, price, img }));
  };
  return (
    <>
      <Banner slug={product.productDetails.category} />
      <div className="product-wraper">
        <div className="grid wide">
          <div className="row">
            <div className="col lg-5 md-5 sm-12">
              <Carousel
                autoPlay
                infiniteLoop
                showStatus={false}
                showThumbs={false}
              >
                {product.productDetails.productPictures.map((picture) => (
                  <div className="picture__main">
                    <img alt="" src={generatePictureUrl(picture)} />
                  </div>
                ))}
              </Carousel>
              <Button
                onClick={handleAddToCart}
                title="Add to cart"
                className="detail__btn mt-16"
              ></Button>
            </div>
            <div className="col lg-7 md-7 sm-12 detail">
              <h1 className="detail__name">{product.productDetails.name}</h1>
              <div className="detail__rating">
                <div className="detail__star">
                  <IoStar />
                  <IoStar />
                  <IoStar />
                  <IoStar />
                  <IoStar />
                </div>
                <div className="detail__review">
                  <IoChatbubblesOutline /> Reviews (1)
                </div>
              </div>
              <p className="detail__price">
                <span className="detail__price--current">
                  ${formatThousand(product.productDetails.price)}
                </span>
                <span className="detail__price--discount">(Save 20%)</span>
                <span className="detail__price--old">
                  ${formatThousand(12000)}
                </span>
              </p>
              <p className="detail__tax">Tax Excluded</p>
              <table className="detail__brand">
                <tbody>
                  <tr>
                    <th>Brand</th>
                    <td>{product.productDetails.category}</td>
                  </tr>
                  <tr>
                    <th>Stock:</th>
                    <td>{formatThousand(product.productDetails.quantity)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="system">
                <div>
                  <p className="system__title">
                    <strong>Description</strong>
                  </p>
                  <p className="detail__description">
                    {product.productDetails.description}
                  </p>
                </div>
                <p className="system__title">
                  <strong>Mobile system:</strong> {product.productDetails.name}
                </p>
                <table className="system__table">
                  <tbody>
                    <tr className="system__table-row">
                      <th>Insurance</th>
                      <td>{product.productDetails.insurance}</td>
                    </tr>
                    <tr className="system__table-row">
                      <th>Battery</th>
                      <td>{product.productDetails.battery}</td>
                    </tr>
                    <tr className="system__table-row">
                      <th>Chipset</th>
                      <td>{product.productDetails.chipset}</td>
                    </tr>
                    <tr className="system__table-row">
                      <th>Screen</th>
                      <td>{product.productDetails.screen}</td>
                    </tr>
                    <tr className="system__table-row">
                      <th>Screen Size</th>
                      <td>{product.productDetails.screenSize}</td>
                    </tr>
                    <tr className="system__table-row">
                      <th>Front Camera</th>
                      <td>{product.productDetails.frontCamera}</td>
                    </tr>
                    <tr className="system__table-row">
                      <th>Rear Camera</th>
                      <td>{product.productDetails.rearCamera}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <p className="col lg-12 product__additional-products-tittle">
              Similar products
            </p>
            {products &&
              Object.keys(products).map((key, index) => (
                <div className="product__card col lg-3" key={products[key]._id}>
                  <Link to={"/product/" + products[key]._id} className="">
                    <div className="product__image">
                      <img
                        src={generatePictureUrl(
                          products[key].productPictures[0]
                        )}
                        alt=""
                      />
                    </div>
                    <div className="product__info">
                      <div className="product__info-name">
                        {products[key].name}
                      </div>
                      <div className="product__info-price">
                        <span className="product__info-price--current">
                          ${formatThousand(products[key].price)}
                        </span>
                        <span className="product__info-price--old">
                          ${formatThousand(12000)}
                        </span>
                      </div>
                      <div className="product__rating">
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
