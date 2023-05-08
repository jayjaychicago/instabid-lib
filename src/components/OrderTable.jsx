import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { DataGrid } from "@mui/x-data-grid";

import { updateSortedOrders } from "../util";

const EVENT_NAME = "ORDERUPDATE";

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
        exchange = "Insta";
      }
      if (product === undefined) {
        product = "prod";
      }
      if (user === undefined) {
        user = "";
      }
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
    let orderedData = data.result.sort((a, b) => b.timestamp - a.timestamp);
    setOrders((prev) => [...prev, ...orderedData]);
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
    { field: "orderNumber", headerName: "Order Number", width: 150, sortable: true },
    { field: "exchange", headerName: "Exchange", width: 150, sortable: true, filterable: true },
    { field: "product", headerName: "Product", width: 150, sortable: true, filterable: true },
    { field: "side", headerName: "Side", width: 120, sortable: true, filterable: true },
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
    { field: "price", headerName: "Price", width: 120, sortable: true },
    { field: "qty", headerName: "Qty", width: 120, sortable: true },
    { field: "qtyLeft", headerName: "Qty Left", width: 120, sortable: true },
    {
      field: "cancel",
      headerName: "Cancel",
      width: 150,
      renderCell: (params) =>
        params.row.user === "julien@instabid.io" && params.row.qtyLeft !== 0 ? (
          <button className="cancel-button">Cancel</button>
        ) : (
          ""
        ),
    },
  ];

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div id="orders" style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={orders}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        sortingOrder={['desc', 'asc']}
        sortModel={[
            {
            field: 'date',
            sort: 'desc',
            },
            {
            field: 'time',
            sort: 'desc',
            },
        ]}
        getRowId={(row) =>
            `${row.exchange}-${row.product}-${row.side}-${row.timestamp}-${row.orderNumber}`
        }
        />

      </div>
    </div>
  );
}