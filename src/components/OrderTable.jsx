import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Pagination } from "@mui/lab";

const EVENT_NAME = "ORDERUPDATE";

export function OrderTable({ exchange, product, user }) {
    const [orders, setOrders] = useState([]);
    const [pusher, setPusher] = useState(undefined);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

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
        "https://api.instabid.io/order?exchange=" +
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

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div id="orders">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exchange</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Side</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Cancel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((order) => (
                  <TableRow key={order.orderNumber}>
                    <TableCell>{order.exchange}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.side}</TableCell>
                    <TableCell>{dateFormatter(order.timestamp)}</TableCell>
                    <TableCell>{timeFormatter(order.timestamp)}</TableCell>
                    <TableCell>${order.price}</TableCell>
                    <TableCell>{order.qty}</TableCell>
                    <TableCell>
                      {cancelOrderBtn("", order)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(orders.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          style={{ marginTop: "1rem" }}
        />
      </div>
    </div>
  );
}