import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../actions";
import { IoIosArrowForward, IoIosStar, IoMdCart } from "react-icons/io";
import { BiRupee } from "react-icons/bi";
import { AiFillThunderbolt } from "react-icons/ai";
import { Button } from "../../components/UI/Common";
import "./style.css";
import { generatePictureUrl } from "../../urlConfig";
import { addToCart } from "../../actions/cart.actions";

/**
 * @author
 * @function ProductDetailsPage
 **/

const ProductDetailsPage = (props) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products);

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
    <div className="product-wraper">
    <div className="grid wide">
      <div className="row">
        <div className="col lg-5 md-5 sm-12">
          <div className="picture__main">
            <img src={generatePictureUrl(product.productDetails.productPictures[0].img)} alt="" />
          </div>
          <div className="picture__sub mt-16">
          {product.productDetails.productPictures.map((thumb, index) => (
              <img src={generatePictureUrl(thumb.img)} alt={thumb.img} />
          ))}
          </div>
          
        </div>
        <div className="col lg-7 md-7 sm-12">

        </div>
      </div>
    </div>

    </div>
    // <div className="productDescriptionContainer">
    //   <div className="flexRow">
    //     <div className="verticalImageStack">
    //       {product.productDetails.productPictures.map((thumb, index) => (
    //         <div className="thumbnail">
    //           <img src={generatePictureUrl(thumb.img)} alt={thumb.img} />
    //         </div>
    //       ))}
    //     </div>
    //     <div className="productDescContainer">
    //       <div className="productDescImgContainer">
    //         <img
    //           src={generatePictureUrl(
    //             product.productDetails.productPictures[0].img
    //           )}
    //           alt={`${product.productDetails.productPictures[0].img}`}
    //         />
    //       </div>

    //       {/* action buttons */}
    //       <div className="flexRow">
    //         <Button
    //           title="ADD TO CART"
    //           bgColor="#ff9f00"
    //           textColor="#ffffff"
    //           style={{
    //             marginRight: "5px",
    //           }}
    //           icon={<IoMdCart />}
    //           onClick={handleAddToCart}
    //         />
    //         <Button
    //           title="BUY NOW"
    //           bgColor="#fb641b"
    //           textColor="#ffffff"
    //           style={{
    //             marginLeft: "5px",
    //           }}
    //           icon={<AiFillThunderbolt />}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div>
    //     {/* home > category > subCategory > productName */}
    //     <div className="breed">
    //       <ul>
    //         <li>
    //           <a href="#">Home</a>
    //           <IoIosArrowForward />
    //         </li>
    //         <li>
    //           <a href="#">Mobiles</a>
    //           <IoIosArrowForward />
    //         </li>
    //         <li>
    //           <a href="#">Samsung</a>
    //           <IoIosArrowForward />
    //         </li>
    //         <li>
    //           <a href="#">{product.productDetails.name}</a>
    //         </li>
    //       </ul>
    //     </div>
    //     {/* product description */}
    //     <div className="productDetails">
    //       <p className="productTitle">{product.productDetails.name}</p>
    //       <div>
    //         <span className="ratingCount">
    //           4.3 <IoIosStar />
    //         </span>
    //         <span className="ratingNumbersReviews">
    //           72,234 Ratings & 8,140 Reviews
    //         </span>
    //       </div>
    //       <div className="extraOffer">
    //         Extra <BiRupee />
    //         4500 off{" "}
    //       </div>
    //       <div className="flexRow priceContainer">
    //         <span className="price">
    //           <BiRupee />
    //           {product.productDetails.price}
    //         </span>
    //         <span className="discount" style={{ margin: "0 10px" }}>
    //           22% off
    //         </span>
    //         {/* <span>i</span> */}
    //       </div>
    //       <div>
    //         <p
    //           style={{
    //             color: "#212121",
    //             fontSize: "14px",
    //             fontWeight: "600",
    //           }}
    //         >
    //           Available Offers
    //         </p>
    //         <p style={{ display: "flex" }}>
    //           <span
    //             style={{
    //               width: "100px",
    //               fontSize: "12px",
    //               color: "#878787",
    //               fontWeight: "600",
    //               marginRight: "20px",
    //             }}
    //           >
    //             Description
    //           </span>
    //           <span
    //             style={{
    //               fontSize: "12px",
    //               color: "#212121",
    //             }}
    //           >
    //             {product.productDetails.description}
    //           </span>
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
};

export default ProductDetailsPage;
