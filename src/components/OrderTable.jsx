import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { DataGrid } from "@mui/x-data-grid";


import { updateSortedOrders } from "../util";

const EVENT_NAME = "ORDERUPDATE";

const cancelButtonStyles = {
    height: "38px", // Adjust this value as needed
    width: "90px",
  };

export function OrderTable({ exchange, product, user }) {
  const [orders, setOrders] = useState([]);
  const [pusher, setPusher] = useState(undefined);

  useEffect(() => {
    setPusher(
      new Pusher("122f17b065e8921fa6e0", {
        cluster: "us2",
      })
    );
  }, []);

  useEffect(() => {
    if (!pusher) return;

    (async () => {
      if (exchange === undefined) {
        console.log("Empty exchange so defaulting to Insta");
        exchange = "Insta";
      }
      if (product === undefined) {
        console.log("Empty product so defaulting to prod");
        product = "prod";
      }
      if (user === undefined) {
        user = "";
      }
      console.log("Requesting orders " + "https://api.instabid.io/orders?exchange=" +
      exchange +
      "&product=" +
      product +
      "&user=" +
      user);
      const res = await fetch(
        "https://api.instabid.io/orders?exchange=" +
          exchange +
          "&product=" +
          product +
          "&user=" +
          user
      );
      handleData(await res.json());

      const channel = pusher.subscribe(exchange + "@" + product);
      channel.bind(EVENT_NAME, handleData);

      return () => {
        channel.unbind(EVENT_NAME);
      };
    })();
  }, [pusher]);

  function handleData(data) {
    console.log("Instabidlib processing " + JSON.stringify(data));
    const updatedData = data.result.map((item) => ({
      ...item,
      id: `${item.exchange}-${item.product}-${item.side}-${item.timestamp}-${item.orderNumber}`,
      
    }));
    setOrders((prev) => [...prev, ...updatedData]);
  }
  
  
  

  function dateFormatter(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  function timeFormatter(timestamp) {
    const time = new Date(timestamp);
    return time.toLocaleTimeString();
  }

  function cancelOrderBtn(cell, row) {
    if (row.qtyLeft !== 0 && row.user === "julien@instabid.io") {
      return (
        <button className="btn btn-danger btn-sm" onClick={() => cancelOrder(row.orderNumber)}>
          Cancel
        </button>
      );
    }
    return "";
  }

  function cancelOrder(orderNumber) {
    console.log("Cancel order:", orderNumber);
    // Implement your cancel order logic here
  }


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const columns = [
    { field: "orderNumber", headerName: "#", width: 100, sortable: true },
    { field: "exchange", headerName: "Exchange", width: 100, sortable: true, filterable: true },
    { field: "product", headerName: "Product", width: 100, sortable: true, filterable: true },
    { field: "side", headerName: "Side", width: 100, sortable: true, filterable: true },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      sortable: true,
      valueGetter: (params) => dateFormatter(params.row.timestamp),
    },
    {
      field: "time",
      headerName: "Time",
      width: 150,
      sortable: true,
      valueGetter: (params) => timeFormatter(params.row.timestamp),
    },
    { field: "price", headerName: "Price", width: 100, sortable: true },
    { field: "qty", headerName: "Qty", width: 100, sortable: true },
    { field: "qtyLeft", headerName: "Qty Left", width: 100, sortable: true },
    { field: "user", headerName: "User", width: 100, sortable: true },
    {
      field: "cancel",
      headerName: "Cancel",
      width: 200,
      renderCell: (params) =>
        params.row.user === user && params.row.qtyLeft !== 0 ? (
            <button
              className="btn btn-primary btn-sm"
              type="submit"
              style={cancelButtonStyles}
            >
              Cancel
            </button>
        ) : (
          ""
        ),
    },
  ];

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div id="orders" className="order-table-container" style={{ height: 1000, width: "100%" }}>
        <div className="order-table-inner">
          <DataGrid
            rows={orders}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[50]}
            disableSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
  
}