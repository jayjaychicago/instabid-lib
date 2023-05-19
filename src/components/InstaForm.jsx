  import { isNumber } from "@mui/x-data-grid/internals";
  import React, { useState, useEffect } from "react";
  import {Alert, Spinner} from 'react-bootstrap';

  const formStyles = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "600px",
      margin: "0 auto",
    };
    
    const formRowStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1rem",
      width: "100%",
      maxWidth: "400px",
    };
    
    const inputGroupPrependStyles = {
      backgroundColor: "#e9ecef",
      color: "#495057",
      borderTopLeftRadius: ".25rem",
      borderBottomLeftRadius: ".25rem",
      padding: ".5rem .75rem",
      borderRight: "1px solid #ced4da",
    };

    const labelStyles = {
      color: "black"
    };

    const tradeButtonStyles = {
      height: "38px", // Adjust this value as needed
      width: "90px",
    };

    const buttonGroupStyles = {
      width: "130px", // Adjust this value as needed
    };

    const customRadioButtonStylesBuy = {
      borderTopLeftRadius: ".25rem",
      borderBottomLeftRadius: ".25rem",
    };
    
    const customRadioButtonLabelStylesBuy = {
      borderTopLeftRadius: ".25rem",
      borderBottomLeftRadius: ".25rem",
    };

    const customRadioButtonStylesSell = {
      borderTopRightRadius: ".25rem",
      borderBottomRightRadius: ".25rem",
    };
    
    const customRadioButtonLabelStylesSell = {
      borderTopRightRadius: ".25rem",
      borderBottomRightRadius: ".25rem",
    };


  export const InstaForm = ({ exchange, product, user, devModeApiKey, apiProxy, authUrl, selectedOrder }) => {

    const [side, setSide] = useState(selectedOrder?.side || "");
    const [qty, setQty] = useState(selectedOrder?.qty || "");
    const [price, setPrice] = useState(selectedOrder?.price || "");
    const [message, setMessage] = useState({ text: "", type: "primary" });
    const [qtyIsValid, setQtyIsValid] = useState(true);
    const [priceIsValid, setPriceIsValid] = useState(true);
    const [sideIsValid, setSideIsValid] = useState(true);
    const [buttonState, setButtonState] = useState(false);


    function isNumericWithMaxTwoDecimals(value) {
      const regex = /^\d+(\.\d{1,2})?$/;
      return regex.test(value);
    }
    
    function isInteger(value) {
      // Using a regular expression
      const regex = /^\d+$/;
      return regex.test(value);
    }
    

    useEffect(() => {
      if (selectedOrder) {
        setSide(null);
        setQty(selectedOrder.qty);
        setPrice(selectedOrder.price);
      }
    }, [selectedOrder]);



    let handleSubmit = async (e) => {
      e.preventDefault();
      setButtonState(true);

//      setQty(qty.toString().replace(/[^0-9.,]/g, ''));
//      setPrice(price.toString().replace(/[^0-9.,]/g, ''));

      let getOut = false;

      if (side != "B" && side != "S") {
        setMessage({ text: "Choose Buy or Sell", type: "danger" });
        setSideIsValid(false);
        getOut = true;
      } else {
        setSideIsValid(true);
      }
      if (!isInteger(qty)) {
  //      setMessage({ text: "Enter a valid Qty", type: "danger" });
        setQtyIsValid(false);
        getOut = true;
      } else {
        setQtyIsValid(true);
      }
      if (!isNumericWithMaxTwoDecimals(price)) {
    //    setMessage({ text: "Enter a valid Price", type: "danger" });
        setPriceIsValid(false);
        getOut = true;
      } else {
        setPriceIsValid(true);
      }
      
      if (getOut) {
        setButtonState(false);
        return;}

      if (user == undefined) {
        user = "undefined";
      }
      if (devModeApiKey == undefined) {
        devModeApiKey = "undefined";
      }
      if ((apiProxy == undefined) || apiProxy == "") {
        apiProxy = "https://api.instabid.io/order";    
        try {
          let body = {
            exchange: exchange,
            product: product,
            side: side,
            qty: qty,
            price: price,
            user: user,
            apiKey: devModeApiKey,
          };

          let res = await fetch(apiProxy, {
            method: "POST",
            body: JSON.stringify(body),
          });
          let resJson = await res.json();
          //console.log("received back", JSON.stringify(resJson));
          //console.log(res.status);
          if (res.status === 200) {
            //setSide("");
            setButtonState(false);
            setQty("");
            setPrice("");
            //setMessage("Done!");
          } else {
            setMessage({ text: "An error occurred", type: "danger" });
            setButtonState(false);
          }
        } catch (err) {
          console.log(err);
          setMessage({ text: "An error happened", type: "danger" });
          setButtonState(false);
        }
      } else {
        // we're using a proxy to hide the private key
        // so we'll use get methods locally instead that will in turn pass the POST to the server
        try {
          let res2 = await fetch(apiProxy + "?type=orderPost&exchange=" + exchange + "&product=" + product + "&side=" + side + "&qty=" + qty + "&price=" + price + "&user=" + user, {
            method: "GET"
          });
          let resJson = await res2.json();
          if (res2.status === 200) {
            //setSide("");
            setButtonState(false);
            setQty("");
            setPrice("");
            setSide(null);
            setMessage({ text: side + " " + qty + " @ " + price +  " executed successfully!", type: "success" });
          } else {
            setMessage({ text: "An error occurred", type: "danger" });
            setButtonState(false);
          }
        } catch (err) {
          console.log(err);
          setMessage({ text: "An error happened", type: "danger" });
          setButtonState(false);
        }
      }
    };

    return ((authUrl == undefined || user != "undefined") ? (
      <div className="InstaForm" style={formStyles}>
        <form className="insta-form" onSubmit={handleSubmit}>
          <div className="form-row" style={formRowStyles}>
            <div className="input-group">
              <div className="input-group-prepend" style={inputGroupPrependStyles}>
                <label htmlFor="qty" className="m-0" style={labelStyles}>
                  Qty
                </label>
              </div>
              <input
                className={`form-control ${qtyIsValid ? "" : "is-invalid"}`}
                type="number"
                id="qty"
                value={qty}
                placeholder="Qty"
                autoComplete="off"
                style={{height: "40px"}}
                onChange={(e) => setQty(e.target.value)}
                onWheel={(e) => {
                  // Prevent mouse wheel from changing the value
                  e.target.blur();
                }}
              />
              {qtyIsValid ? null : <div class="invalid-feedback">Please provide a valid Qty.</div>}
            </div>
          </div>
    
          <div className="form-row" style={formRowStyles}>
            <div className="input-group">
              <div className="input-group-prepend" style={inputGroupPrependStyles}>
                <label htmlFor="price" className="m-0" style={labelStyles}>
                  Price
                </label>
              </div>
              <input
                className={`form-control ${priceIsValid ? "" : "is-invalid"}`}
                type="number"
                id="price"
                value={price}
                placeholder="Price"
                autoComplete="off"
                style={{height: "40px"}}
                onChange={(e) => setPrice(e.target.value)}
                onWheel={(e) => {
                  // Prevent mouse wheel from changing the value
                  e.target.blur();
                }}
                
              />
              {priceIsValid ? null : <div class="invalid-feedback">Please provide a valid Price.</div>}

            </div>
          </div>
    
          <div className="form-row" style={formRowStyles}>
            <div className="col">
              <div className={`btn-group ${sideIsValid ? "" : "is-invalid"}`} role="group" data-toggle="buttons" style={buttonGroupStyles}>
                <input
                  type="radio"
                  className="btn-check"
                  name="buySell"
                  id="placeBidBuytest"
                  value="B"
                  autoComplete="new-password"
                  onChange={(e) => setSide(e.target.value)}
                  checked={side == 'B'}
                />

                <label
                  className="btn btn-outline-secondary"
                  htmlFor="placeBidBuytest"
                  style={{ ...customRadioButtonStylesBuy, ...customRadioButtonLabelStylesBuy }}
                >
                  Buy
                </label>
    
                <input
                  type="radio"
                  className="btn-check"
                  name="buySell"
                  id="placeBidSelltest"
                  value="S"
                  autoComplete="new-password"
                  onChange={(e) => setSide(e.target.value)}
                  checked={side == 'S'}
                />
                

                <label
    className="btn btn-outline-secondary"
    htmlFor="placeBidSelltest"
    style={{ ...customRadioButtonStylesSell, ...customRadioButtonLabelStylesSell }}
  >
    Sell
  </label>
              </div>
            </div>
            <div className="col text-end">
              <button
                disabled={buttonState}
                className="btn btn-primary btn-sm"
                type="submit"
                style={tradeButtonStyles}
              >
                {buttonState ? (
      <Spinner 
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    ) : (
      "Trade"
    )}
              </button>
            </div>
          </div>
          {message.text ? 
            <Alert 
              variant={message.type} 
              onClose={() => setMessage({ text: "", type: "primary" })} 
              dismissible
              style={{ textAlign: "center" }}
            >
              {message.text}
            </Alert> 
            : null}
          
        </form>
      </div>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <a href={authUrl} style={{ textDecoration: 'none' }}>
          <button
            disabled={buttonState}
            className="btn btn-primary btn-sm"
            onClick={() => window.location.href = authUrl}
          >
            Login to trade
          </button>
        </a>
      </div>
    ));
  };
