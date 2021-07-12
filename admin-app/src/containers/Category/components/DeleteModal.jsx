import React from "react";
import CustomModal from "../../../components/UI/Modal";

function DeleteModal(props) {
  const {
    title,
    show,
    handleClose,
    expandedArray,
    checkedArray,
    handleDeleteModalClose,
    handleDeleteCategories,
  } = props;
  return (
    <CustomModal
      title={title}
      show={show}
      handleClose={handleClose}
      buttons={[
        {
          label: "No",
          color: "primary",
          onClick: handleDeleteModalClose,
        },
        {
          label: "Yes",
          color: "danger",
          onClick: handleDeleteCategories,
        },
      ]}
    >
      Are yout sure ?<h5>Expanded</h5>
      {expandedArray.length > 0 &&
        expandedArray.map((item, index) => <p key={index}>{item.name}</p>)}
      <h5>Checked</h5>
      {checkedArray.length > 0 &&
        checkedArray.map((item, index) => <p key={index}>{item.name}</p>)}
    </CustomModal>
  );
}

export default DeleteModal;
