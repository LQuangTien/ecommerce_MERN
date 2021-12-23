import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { getAll, getBySlug } from "../../actions";
import { generatePictureUrl } from "../../urlConfig";
import formatThousand from "../../utils/formatThousand";
import "./style.css";

function HomePage() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const [tabProducts, setTabProducts] = useState([]);
  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);
  useEffect(() => {
    if (products) {
      const a = [...products]
        .sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt))
        .slice(0, 8);
      setTabProducts(a);
    }
  }, [products]);
  const isNew = (date) => {
    // To set two dates to two variables
    const date1 = new Date(date);
    const date2 = new Date();

    // To calculate the time difference of two dates
    const Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log(Difference_In_Days);
    return Difference_In_Days < 7;
  };
  const renderTabItems = () => {
    const items = [
      {
        image:
          "https://res.cloudinary.com/quangtien/image/upload/v1632565661/ic-tab4_t5uh31.png",
        slug: "Mobile",
        color: "tab__item--black",
      },
      {
        image:
          "https://res.cloudinary.com/quangtien/image/upload/v1632565661/ic-tab4_t5uh31.png",
        slug: "Laptop",
        color: "tab__item--green",
      },
      {
        image:
          "https://res.cloudinary.com/quangtien/image/upload/v1632565661/ic-tab4_t5uh31.png",
        slug: "",
        color: "tab__item--yellow",
      },
      {
        image:
          "https://res.cloudinary.com/quangtien/image/upload/v1632565661/ic-tab4_t5uh31.png",
        slug: "",
        color: "tab__item--orange",
      },
      {
        image:
          "https://res.cloudinary.com/quangtien/image/upload/v1632565661/ic-tab4_t5uh31.png",
        slug: "",
        color: "tab__item--dark-blue",
      },
      {
        image:
          "https://res.cloudinary.com/quangtien/image/upload/v1632565661/ic-tab4_t5uh31.png",
        slug: "",
        color: "tab__item--blue",
      },
      {
        image:
          "https://res.cloudinary.com/quangtien/image/upload/v1632565661/ic-tab4_t5uh31.png",
        slug: "",
        color: "tab__item--pink",
      },
      {
        image:
          "https://res.cloudinary.com/quangtien/image/upload/v1632565661/ic-tab4_t5uh31.png",
        slug: "",
        color: "tab__item--purple",
      },
      {
        image:
          "https://res.cloudinary.com/quangtien/image/upload/v1632565661/ic-tab4_t5uh31.png",
        slug: "",
        color: "tab__item--gray",
      },
    ];
    return (
      <ul className="col lg-12 tab">
        {items.map((item, index) => (
          <li
            className={`tab__item flex-center ${item.color}`}
            onClick={() => {
              setTabProducts(
                [...products]
                  .filter((p) => p.category === item.slug)
                  .sort(
                    (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
                  )
                  .slice(0, 8)
              );
            }}
            key={index}
          >
            <img src={item.image} alt="" />
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className="grid wide">
      <div className="row mt-32">
        <div className="col lg-9">
          <Carousel autoPlay infiniteLoop showStatus={false} showThumbs={false}>
            <div>
              <img
                alt=""
                src="https://res.cloudinary.com/quangtien/image/upload/v1632563480/hinh1_xvtbxo.png"
              />
            </div>
            <div>
              <img
                alt=""
                src="https://res.cloudinary.com/quangtien/image/upload/v1632563480/hinh2_m5wtby.jpg"
              />
            </div>
          </Carousel>
        </div>
        <div className="col lg-3 advertisement">
          <div className="advertisement__wrapper">
            <div className="advertisement__effect"></div>
            <img
              className="advertisement__image"
              alt=""
              src="https://res.cloudinary.com/quangtien/image/upload/v1632563479/hinh3_vk3jzp.jpg"
            />
          </div>
          <div className="advertisement__wrapper">
            <div className="advertisement__effect"></div>
            <img
              className="advertisement__image"
              alt=""
              src="https://res.cloudinary.com/quangtien/image/upload/v1632563481/hinh4_ohqz6m.jpg"
            />
          </div>
        </div>
      </div>
      <div className="row mt-32 border-bottom">
        <div className="col lg-3">
          <div className="policy">
            <img
              src="https://res.cloudinary.com/quangtien/image/upload/v1632563970/policy4_mjhesj.png"
              alt=""
            />
            <p className="policy__content">Free delivery with $500</p>
          </div>
        </div>
        <div className="col lg-3">
          <div className="policy">
            <img
              src="https://res.cloudinary.com/quangtien/image/upload/v1632563958/policy5_oxhwme.png"
              alt=""
            />
            <p className="policy__content">100% Payment Secured</p>
          </div>
        </div>
        <div className="col lg-3">
          <div className="policy">
            <img
              src="https://res.cloudinary.com/quangtien/image/upload/v1632563941/policy6_nje7sg.png"
              alt=""
            />
            <p className="policy__content">24hours / 7days Support</p>
          </div>
        </div>
        <div className="col lg-3">
          <div className="policy">
            <img
              src="https://res.cloudinary.com/quangtien/image/upload/v1632563925/policy7_zczunq.png"
              alt=""
            />
            <p className="policy__content">Best Price Guaranteed</p>
          </div>
        </div>
      </div>
      <div className="row mt-32">{renderTabItems()}</div>

      <div className="row mt-32">
        {tabProducts.length > 0 &&
          tabProducts.map(
            (product, index) =>
              product.category === "Mobile" && (
                <div className="col lg-3 product__card" key={product._id}>
                  <Link to={"/product/" + product._id} className="">
                    <div className="product__badge">
                      {Number(product.sale) > 10 && (
                        <span className="product__badge-item product__badge-item--sale">
                          SALE {product.sale}%
                        </span>
                      )}
                      {isNew(product.createdAt) && (
                        <span className="product__badge-item product__badge-item--new">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="product__image">
                      <img
                        src={generatePictureUrl(product.productPictures[0])}
                        alt=""
                      />
                    </div>
                    <div className="product__info">
                      <div className="product__info-name">{product.name}</div>
                      <div className="product__info-price">
                        <span className="product__info-price--current">
                          ${formatThousand(product.price)}
                        </span>
                        <span className="product__info-price--old">
                          ${formatThousand(12000)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )
          )}
      </div>
      <div className="row mt-32">
        <div className="col lg-4 advertisement">
          <div className="advertisement__wrapper">
            <div className="advertisement__effect"></div>
            <img
              src="https://res.cloudinary.com/quangtien/image/upload/v1632580225/home3-banner3_or15sh.jpg"
              alt=""
              className="advertisement__image"
            />
          </div>
          <div className="advertisement__wrapper">
            <div className="advertisement__effect"></div>
            <img
              src="https://res.cloudinary.com/quangtien/image/upload/v1632580214/home3-banner4_uf0fux.jpg"
              alt=""
              className="advertisement__image"
            />
          </div>
        </div>
        <div className="col lg-8 advertisement">
          <div className="advertisement__wrapper">
            <div className="advertisement__effect"></div>
            <img
              src="https://res.cloudinary.com/quangtien/image/upload/v1632580206/home3-banner5_ppjglk.jpg"
              alt=""
              className="advertisement__image"
            />
          </div>
        </div>
      </div>
      <div className="row mt-32">
        <div className="col lg-12">
          <p className="homepage-title">Onsale Products</p>
        </div>
        {products &&
          [...products]
            .sort((p1, p2) => Number(p2.sale) - Number(p1.sale))
            .slice(0, 8)
            .map((product, index) => (
              <div className="col lg-3" key={product._id}>
                <Link to={"/product/" + product._id} className="small-product">
                  <div className="small-product__image">
                    <img
                      src={generatePictureUrl(product.productPictures[0])}
                      alt=""
                    />
                  </div>
                  <div className="small-product__info">
                    <div className="small-product__info-name">
                      {product.name}
                    </div>
                    <div className="small-product__info-price">
                      <span className="small-product__info-price--current">
                        ${formatThousand(product.price)}
                      </span>
                      <span className="small-product__info-price--old">
                        ${formatThousand(12000)}
                      </span>
                    </div>
                    <div className="small-product__rating">
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
      <div className="row mt-32">
        <div className="col lg-12">
          <p className="homepage-title">Affordable price products</p>
        </div>
        {products &&
          [...products]
            .sort((p1, p2) => Number(p1.price) - Number(p2.price))
            .slice(0, 8)
            .map((product, index) => (
              <div className="col lg-3" key={product._id}>
                <Link to={"/product/" + product._id} className="small-product">
                  <div className="small-product__image">
                    <img
                      src={generatePictureUrl(product.productPictures[0])}
                      alt=""
                    />
                  </div>
                  <div className="small-product__info">
                    <div className="small-product__info-name">
                      {product.name}
                    </div>
                    <div className="small-product__info-price">
                      <span className="small-product__info-price--current">
                        ${formatThousand(product.price)}
                      </span>
                      <span className="small-product__info-price--old">
                        ${formatThousand(12000)}
                      </span>
                    </div>
                    <div className="small-product__rating">
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
  );
}

export default HomePage;
