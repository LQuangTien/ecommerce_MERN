import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../actions";
import { IoIosArrowForward, IoIosStar, IoMdCart } from "react-icons/io";
import { BiRupee } from "react-icons/bi";
import { AiFillThunderbolt } from "react-icons/ai";
import Button from "../../components/UI/Button";
import "./style.css";
import { generatePictureUrl } from "../../urlConfig";
import { addToCart } from "../../actions/cart.actions";
import { IoStar, IoChatbubblesOutline } from "react-icons/io5";
import formatThousand from "../../utils/formatThousand";
import Banner from "../../components/UI/Banner";

/**
 * @author
 * @function ProductDetailsPage
 **/

const ProductDetailsPage = (props) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products);
  const slug = props.match.params.slug;

  useEffect(() => {
    const { productId } = props.match.params;
    const params = {
      id: productId,
    };
    dispatch(getProductById(params));
  }, []);

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
      <Banner slug={slug} />
      <div className="product-wraper">
        <div className="grid wide">
          <div className="row">
            <div className="col lg-5 md-5 sm-12">
              <div className="picture__main">
                <img
                  src={generatePictureUrl(
                    product.productDetails.productPictures[0].img
                  )}
                  alt=""
                />
              </div>
              <div className="picture__sub mt-16">
                {product.productDetails.productPictures.map((thumb, index) => (
                  <img src={generatePictureUrl(thumb.img)} alt={thumb.img} />
                ))}
              </div>
              <Button onClick={handleAddToCart} title="Add to cart" className="detail__btn mt-16"></Button>
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
              <p className="detail__tax" >Tax Excluded</p>
              <table className="detail__brand">
                <tbody>
                  <tr>
                    <th>Brand</th>
                    <td>{product.productDetails.category.name}</td>
                  </tr>
                  <tr>
                    <th>Stock:</th>
                    <td>{formatThousand(product.productDetails.quantity)}</td>
                  </tr>
                </tbody>
              </table>
              <p className="detail__description">
                {product.productDetails.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
