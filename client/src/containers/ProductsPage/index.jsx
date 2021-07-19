import React from "react";
import getParams from "../../utils/getParams";
import Page from "./Page";
import Store from "./Store";
import "./style.css";
function ProductPage(props) {
  const rednderProductPage = () => {
    const { type } = getParams(props.location.search);
    let content = null;
    switch (type) {
      case "store":
        content = <Store {...props} />;
        break;
      case "page":
        content = <Page {...props} />;
        break;
      default:
        content = null;
        break;
    }
    return content;
  };
  return (
    <div>
      {rednderProductPage()}
    </div>
  );
}

export default ProductPage;
