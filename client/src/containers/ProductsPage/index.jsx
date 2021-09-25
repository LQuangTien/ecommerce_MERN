import React, { useEffect } from "react";
import { IoStar } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBySlug } from "../../actions";
import Banner from "../../components/UI/Banner";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import "./style.css";
function ProductPage(props) {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const slug = props.match.params.slug;
  // Thiếu render theo thanh search
  // url sẽ có dạng ?product=noi-dung-tim-kiem
  // kiem tra neu co ?product thi khong chay getBySlug
  // Ở server tạo thêm controller query theo thanh tìm kiếm

  useEffect(() => {
    dispatch(getBySlug(slug));
  }, [dispatch, slug]);
  return (
    <>
      <Banner slug={slug} />
      <div className="product">
        <div className="grid wide">
          <div className="row">
            <div className="col lg-3" style={{ textAlign: "right" }}>
              Filter
            </div>
            <div className="col lg-9">
              <div className="row">
                {Object.keys(products).map((key, index) => (
                  <div className="product__card col lg-3">
                    <Link to={"/product/" + products[key]._id} className="">
                      <div className="product__image">
                        <img
                          src={generatePictureUrl(
                            products[key].productPictures[0].img
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
        </div>
      </div>
    </>
  );
}

export default ProductPage;
