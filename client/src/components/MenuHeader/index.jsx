import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from "../../actions";
import "./style.css";
function MenuHeader() {
  const categoryState = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCategory());
  }, []);
  const renderCategories = (categories) => {
    return categories.map((category) => (
      <li key={category.name}>
        {category.parentId ? (
          <a href={`${category.slug}?categoryId=${category._id}&type=${category.type}`}>{category.name}</a>
        ) : (
          <span>{category.name}</span>
        )}
        <ul>
          {category.children.length > 0 && renderCategories(category.children)}
        </ul>
      </li>
    ));
  };
  return (
    <div className="menuHeader">
      <ul>
        {categoryState.categories.length > 0 &&
          renderCategories(categoryState.categories)}
      </ul>
    </div>
  );
}

export default MenuHeader;
