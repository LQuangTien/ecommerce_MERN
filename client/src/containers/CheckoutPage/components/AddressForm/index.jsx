import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, updateAddress } from "../../../../actions";
import { Button, Input } from "../../../../components/UI/Common";
import "../../style.css";
function AddressForm(props) {
  const { adr, handleUpdate } = props;
  const [name, setName] = useState(adr ? adr.name : "");
  const [phone, setPhone] = useState(adr ? adr.phone : "");
  const [address, setAddress] = useState(adr ? adr.address : "");
  const [ward, setWard] = useState(adr ? adr.ward : "");
  const [district, setDistrict] = useState(adr ? adr.district : "");
  const [city, setCity] = useState(adr ? adr.city : "");
  const [alternativePhone, setAlternativePhone] = useState(
    adr ? adr.alternativePhone : ""
  );
  const [type, setType] = useState(adr ? adr.type : "");
  const [_id, setId] = useState(adr ? adr._id : "");
  const [submitFlag, setSubmitFlag] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    if (handleUpdate) {
      console.log("aaaa")
      const addressInfo = {
        name,
        phone,
        address,
        ward,
        district,
        city,
        alternativePhone,
        type,
      };
      dispatch(addAddress(addressInfo));
      handleUpdate();
    }
  };
  const onSave = () => {
    if (handleUpdate) {
      const addressInfo = {
        _id,
        name,
        phone,
        address,
        ward,
        district,
        city,
        alternativePhone,
        type,
      };
      dispatch(updateAddress(addressInfo));
      handleUpdate();
    }
  };
  const renderForn = () => (
    <div
      style={{
        padding: "0 60px 20px 60px",
        boxSizing: "border-box",
        width: props.withoutHeader && "100%",
      }}
    >
      <div className="flexRow">
        <div className="inputContainer">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="flexRow">
        <div className="inputContainer">
          <Input
            label="10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <Input
            label="Alternative phone number"
            value={alternativePhone}
            onChange={(e) => setAlternativePhone(e.target.value)}
          />
        </div>
      </div>
      <div className="flexRow">
        <div className="inputContainer">
          <Input
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>
      <div className="flexRow">
        <div className="inputContainer">
          <Input
            label="Ward"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <Input
            label="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>
        <div className="inputContainer">
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label>Type: </label>
        <div className="flexRow">
          <div>
            <input
              type="radio"
              onChange={() => setType("home")}
              name="type"
              value="home"
            />
            <span>Home</span>
          </div>
          <div>
            <input
              type="radio"
              onChange={() => setType("work")}
              name="type"
              value="work"
            />
            <span>Work</span>
          </div>
        </div>
      </div>
      <div className="flexRow">
        <Button
          title={props.withoutHeader ? "SAVE" : "SAVE AND DELIVERY HERE"}
          onClick={props.withoutHeader ? onSave : onSubmit}
          style={{ margin: "20px 0", width: "250px" }}
        />
      </div>
    </div>
  );
  if (props.withoutHeader) {
    return renderForn();
  }
  return (
    <div className="checkoutStep" style={{ backgroundColor: "#f5faff" }}>
      <div
        onClick={props.onClick}
        className={`checkoutHeader active ${props.onClick && "cursor-pointer"}`}
      >
        <div>
          <span className="stepNumber">+</span>
          <span className="stepTitle">ADD NEW ADDRESS</span>
        </div>
      </div>
      {renderForn()}
    </div>
  );
}

export default AddressForm;
