import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductPage } from "../../../actions/product.actions";
import getParams from "../../../utils/getParams";
import { Carousel } from "react-responsive-carousel";
import "./style.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Card from "../../../components/UI/Card";
function Page(props) {
  const dispatch = useDispatch();
  const { page } = useSelector((state) => state.products);
  useEffect(() => {
    const params = getParams(props.location.search);
    dispatch(getProductPage(params));
  }, []);
  return (
    <div style={{ margin: "0 10px" }}>
      <h2>{page.title}</h2>
      <Carousel renderThumbs={() => {}}>
        {page.banners &&
          page.banners.map((banner, index) => (
            <a
              key={index}
              style={{ display: "block" }}
              href={banner.navigateTo}
            >
              <img src={banner.img} alt="" />
            </a>
          ))}
      </Carousel>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", margin:"10px 0"}}>
        {page.products &&
          page.products.map((product, index) => (
            <Card
              key={index}
              style={{
                width: "400px",
                height: "200px",
                margin: "0 5px",
              }}
            >
              <img src={product.img} alt="" style={{width: "100%", height: "100%", objectFit: "contain"}} />
            </Card>
          ))}
      </div>
    </div>
  );
}

export default Page;
