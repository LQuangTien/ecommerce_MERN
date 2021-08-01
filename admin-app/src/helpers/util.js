export const createCategoryOptions = (categories, options = []) => {
  for (let category of categories) {
    options.push({
      value: category._id,
      name: category.name,
      parentId: category.parentId,
      type: category.type,
    });
    if (category.children && category.children.length > 0) {
      createCategoryOptions(category.children, options);
    }
  }
  return options;
};
export const formatDate = (date) => {
  date = new Date(date);
  return (
    [date.getHours(), date.getMinutes()].join(":") +
    " " +
    [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/")
  );
};
