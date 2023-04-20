import React, { useState } from "react";

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
    width: "120px"
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


export const InstaForm = ({ exchange, product, user, devModeApiKey, apiProxy }) => {
  const isAuthenticated = true;

  const [side, setSide] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [buttonState, setButtonState] = useState(false);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setButtonState(true);
    try {
      if (exchange == undefined) {
        exchange = "Insta";
      }
      if (product == undefined) {
        product = "prod";
      }
      if (user == undefined) {
        user = "julien";
      }
      if (devModeApiKey == undefined) {
        devModeApiKey = "undefined";
      }
      if ((apiProxy == undefined) || apiProxy == "") {
        apiProxy = "https://api.instabid.io/order";
        devModeApiKey = "not_needed"; // the whole point of an API proxy is to avoid publishing a key
      }

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
  };

  return isAuthenticated ? (
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
              autocomplete="off"
              onChange={(e) => setQty(e.target.value)}
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
              autocomplete="off"
              onChange={(e) => setPrice(e.target.value)}
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
                autoComplete="off"
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
                autoComplete="off"
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
          <div className="col">
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
    <div>
      This is where you put your authentication process or components
    </div>
  );
};
