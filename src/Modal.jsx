import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const MyModal = ({ children, trigger, collectionName, data }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  useEffect(() => {
    // // console.log(data.token_series_id);
  }, []);

  return (
    <div>
      {React.cloneElement(trigger, { onClick: toggle })}
      <Modal
        className="modal-xl"
        centered={true}
        isOpen={modal}
        style={{color: "white"}}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle} cssModule={{color: "white"}} style={{position: 'relative'}}>
          <div style={{ display: "-webkit-inline-box", alignItems: "center" }}>
            <h1 className="modal-title text-white" style={{ paddingRight: "2rem" }}>
              {collectionName}
            </h1>
          </div>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </Modal>
    </div>
  );
};

export default MyModal;
