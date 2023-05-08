import React, { useState, useEffect } from "react";

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


export const InstaForm = ({ exchange, product, user, devModeApiKey, apiProxy, authUrl }) => {

  const [side, setSide] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [buttonState, setButtonState] = useState(false);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setButtonState(true);


    if (exchange == undefined) {
      exchange = "Insta";
    }
    if (product == undefined) {
      product = "prod";
    }
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
          setMessage("Some error occured");
        }
      } catch (err) {
        console.log(err);
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
          //setMessage("Done!");
        } else {
          setMessage("Some error occured");
        }
      } catch (err) {
        console.log(err);
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
              className="form-control"
              type="number"
              id="qty"
              value={qty}
              placeholder="Qty"
              autoComplete="new-password"
              style={{height: "40px"}}
              onChange={(e) => setQty(e.target.value)}
              onMouseDown={(e) => {
                // Prevent the user from changing the value with their mouse
                e.preventDefault();
              }}
            />
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
              className="form-control"
              type="number"
              id="price"
              value={price}
              placeholder="Price"
              autoComplete="new-password"
              style={{height: "40px"}}
              onChange={(e) => setPrice(e.target.value)}
              onMouseDown={(e) => {
                // Prevent the user from changing the value with their mouse
                e.preventDefault();
              }}
            />
          </div>
        </div>
  
        <div className="form-row" style={formRowStyles}>
          <div className="col">
            <div className="btn-group" role="group" data-toggle="buttons" style={buttonGroupStyles}>
              <input
                type="radio"
                className="btn-check"
                name="buySell"
                id="placeBidBuytest"
                value="B"
                autoComplete="new-password"
                onChange={(e) => setSide(e.target.value)}
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
              Trade
            </button>
          </div>
        </div>
  
        <div className="message">{message ? <p>{message}</p> : null}</div>
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
