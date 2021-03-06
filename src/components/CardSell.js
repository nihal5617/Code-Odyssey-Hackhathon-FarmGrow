import { hover } from "@testing-library/user-event/dist/hover";
import React, { useState } from "react";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  useToast,
} from "@chakra-ui/react";
import { db } from "../utils/init-firebase";
import { useAuth } from "../contexts/AuthContext";

const CardSell = (props) => {
  const [sellquantity, setSellquantity] = useState(0);

  const { id, uid, quantity } = props;
  const [newAddress, setNewAddress] = useState(props.address);

  const toast = useToast();

  const handleSell = async () => {
    try {
      // const productsCollectionRef = collection(db, 'products');
      const productDoc = doc(db, "products", id);
      const newField = {
        quantity: parseInt(quantity) + parseInt(sellquantity),
      };
      await updateDoc(productDoc, newField);
      console.log("Sold Succesfully");
    } catch (error) {
      console.log(error);
    }

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("user_id", "==", uid));
      const querySnapshot = await getDocs(q);
      const userID = querySnapshot.docs[0].id;
      console.log(userID);
      const userDoc = doc(db, "users", userID);
      if (props.address !== newAddress) {
        const newField = { address: newAddress };
        await updateDoc(userDoc, newField);
        console.log("Address Updated Succesfully");
      }
      try {
        const points = querySnapshot.docs[0].data().points;
        const newField = {
          points: parseInt(points) + parseInt(sellquantity * props.points),
        };
        await updateDoc(userDoc, newField);
        console.log(
          "Points Updated Succesfully by " + sellquantity * props.points
        );
        toast({
          description: "Sold Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }

    document
      .getElementById("exampleModal" + props.id)
      .classList.remove("show", "d-block");
    document
      .querySelectorAll(".modal-backdrop")
      .forEach((el) => el.classList.remove("modal-backdrop"));
  };

  return (
    <>
      <div className="card">
        <div className="content" style={{ color: "black" }}>
          <img
            src={"/images/" + props.image + ".jpg"}
            alt="Missing"
            width="200px"
            height="120px"
            style={{ minHeight: "125px", objectFit: "fill" }}
          />
          <h2 style={{ paddingTop: "20px" }}>{props.name}</h2>
          <p>Points: {props.points}</p>
          <p style={{ lineHeight: 1, color: "gray", fontSize: "13px" }}>
            {props.desc}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-info"
          data-bs-toggle="modal"
          data-bs-target={"#exampleModal" + props.id}
          style={{ width: "80%", background: "#1572A1", color: "#9AD0EC" }}
        >
          Sell
        </button>
      </div>
      <div
        className="modal fade"
        id={"exampleModal" + props.id}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ color: "black" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {props.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label for="recipient-name" className="col-form-label">
                    Quantity (Kgs):
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="recipient-name"
                    required
                    onChange={(e) => setSellquantity(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label for="message-text" className="col-form-label">
                    Address :
                  </label>
                  <textarea
                    className="form-control"
                    id="message-text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSell}
              >
                Sell Waste
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardSell;
