import { categoryConstants } from "../actions/constants";

const initState = {
  categories: [],
  loading: false,
  error: null,
};
// const updateNewCategories = (categories, newCategory, newCategories = []) => {
//   if (newCategory.parentId == undefined) {
//     return [
//       ...categories,
//       {
//         _id: newCategory._id,
//         name: newCategory.name,
//         slug: newCategory.slug,
//         children: [],
//       },
//     ];
//   }
//   for (let category of categories) {
//     if (category._id + "" === newCategory.parentId + "") {
//       newCategories.push({
//         ...category,
//         children:
//           category.children && category.children.length > 0
//             ? updateNewCategories(
//                 [
//                   ...category.children,
//                   {
//                     _id: newCategory._id,
//                     name: newCategory.name,
//                     slug: newCategory.slug,
//                     parentId: newCategory.parentId,
//                     children: newCategory.children,
//                   },
//                 ],
//                 newCategory
//               )
//             : [],
//       });
//     } else {
//       newCategories.push({
//         ...category,
//         children: category.children
//           ? updateNewCategories(category.children, newCategory)
//           : [],
//       });
//     }
//   }
//   return newCategories;
// };
const categoryReducer = (state = initState, action) => {
  switch (action.type) {
    case categoryConstants.GET_ALL_CATEGORY_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case categoryConstants.GET_ALL_CATEGORY_SUCCESS:
      state = {
        ...state,
        loading: false,
        categories: action.payload.categories,
      };
      break;
    case categoryConstants.GET_ALL_CATEGORY_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    default:
      state = {
        ...state,
      };
  }
  return state;
};
export default categoryReducer;
