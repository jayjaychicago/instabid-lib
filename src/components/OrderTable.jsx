import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { DataGrid } from "@mui/x-data-grid";

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
    setOrders((prev) => [...prev, ...data.result]);
  }
  

  function dateFormatter(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  function timeFormatter(timestamp) {
    const time = new Date(timestamp);
    return time.toLocaleTimeString();
  }

  const columns = [
    { field: "orderNumber", headerName: "#", width: 150, sortable: true },
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
          columns={columns.map((col) => ({
            ...col,
            headerClassName: "font-weight-bold",
          }))}
          pageSize={20}
          rowsPerPageOptions={[20]}
          disableSelectionOnClick
          sortingOrder={['desc', 'asc']}
          sortModel={[
            {
              field: 'orderNumber',
              sort: 'desc',
            }
          ]}
          getRowId={(row) =>
            `${row.exchange}-${row.product}-${row.side}-${row.timestamp}-${row.orderNumber}`
          }
          components={{
            Pagination: () => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <DataGrid.Pagination />
              </div>
            ),
          }}
        />
      </div>
    </div>
  );

        }