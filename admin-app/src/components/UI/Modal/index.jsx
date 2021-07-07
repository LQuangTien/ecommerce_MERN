import React from "react";
import { Button, Modal } from "react-bootstrap";
function CustomModal(props) {
  return (
    <div>
      <Modal size={props.size} show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body> {props.children}</Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button> */}
          <Button variant="primary" onClick={props.handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CustomModal;
