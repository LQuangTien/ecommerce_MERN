import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBySlug } from "../../actions";
import getParams from "../../utils/getParams";
import { IoStar } from "react-icons/io5";
import "./style.css";
import { generatePictureUrl } from "../../urlConfig";
import { Link } from "react-router-dom";
import formatThousand from "../../utils/formatThousand";
import Banner from "../../components/UI/Banner";
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
  }, [slug]);
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
                <div className="product__card col lg-2-4">
                  <Link to={`${slug}/${products[key]._id}`} className="">
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
                        <div className="product__info-price--current">
                          ${formatThousand(products[key].price)}
                        </div>
                        <div className="product__info-price--old">
                          ${formatThousand(12000)}
                        </div>
                      </div>
                    </div>
                    <div className="product__rating">
                      <IoStar />
                      <IoStar />
                      <IoStar />
                      <IoStar />
                      <IoStar />
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
