import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { DataGrid } from "@mui/x-data-grid";

const EVENT_NAME = "ORDERUPDATE";

const cancelButtonStyles = {
    height: "38px",
    width: "90px",
};

export function OrderTable({ exchange, product, user }) {
    const [orders, setOrders] = useState([]);
    const [pusher, setPusher] = useState(undefined);
    const [currentChannel, setCurrentChannel] = useState(undefined);

        useEffect(() => {
            setPusher(
            new Pusher("122f17b065e8921fa6e0", {
                cluster: "us2",
            })
            );
            // This will run only once when the component mounts
        }, []);
        
        useEffect(() => {
            const minHeight = 300;
            if (orders === undefined) {
                setTableHeight(300);
            } else {
                setTableHeight(Math.max(Math.min(orders.length * rowHeight + headerHeight, maxHeight), minHeight));
            }
                // This will run every time orders or WindowWith changes
        }, [orders, windowWidth]);
        

        useEffect(() => {
            if (!pusher) return;
    
            (async () => {
                const exchangeValue = exchange || "Insta";
                const productValue = product || "prod";
                const userValue = user || "";
    
                try {
                    const res = await fetch(
                        `https://api.instabid.io/orders?exchange=${exchangeValue}&product=${productValue}&user=${userValue}`
                    );
    
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
    
                    handleData(await res.json());
                } catch (error) {
                    console.error('Fetch error:', error);
                }
    
                const newChannelName = `${exchangeValue}@${productValue}`;
    
                if (newChannelName !== currentChannel) {
                    if (currentChannel) {
                        const oldChannel = pusher.channel(currentChannel);
                        if (oldChannel) {
                            oldChannel.unbind(EVENT_NAME);
                            oldChannel.unsubscribe();
                        }
                    }
    
                    try {
                        const channel = pusher.subscribe(newChannelName);
                        channel.bind(EVENT_NAME, handlePusherData);
                        setCurrentChannel(newChannelName);
                    } catch (error) {
                        console.error('Pusher error:', error);
                    }
                }
            })();
        }, [exchange, product, user, pusher, currentChannel]);

        function handleData(data) {
            const updatedData = data.result.map((item) => ({
                ...item,
                id: `${item.exchange}-${item.product}-${item.side}-${item.timestamp}-${item.orderNumber}`,
            }));
    
            setOrders(updatedData); // Replace old data
        }
        
        function handlePusherData(data) {
            console.log("Instabidlib ORDER TABLE processing via PUSHER " + JSON.stringify(data));
        
            // Add the new order to the top of the DataGrid
            const newOrder = {
                ...data,
                id: `${data.exchange}-${data.product}-${data.side}-${data.timestamp}-${data.orderNumber}`,
            };
            setOrders((prev) => [newOrder, ...prev]);
        
            // Update the existing orders based on the fills array
            data.fills.forEach((fill) => {
                setOrders((prev) =>
                    prev.map((order) =>
                        order.orderNumber === fill.orderNumber
                            ? { ...order, qtyLeft: order.qtyLeft - parseInt(fill.qty) }
                            : order
                    )
                );
            });
        }
        
        
        

        function dateFormatter(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString();
        }

        function timeFormatter(timestamp) {
            const time = new Date(timestamp);
            return time.toLocaleTimeString();
        }

       

        function cancelOrder(orderNumber) {
            console.log("Cancel order:", orderNumber);
            // Implement your cancel order logic here
        }


        const columns = [
            { field: "orderNumber", headerName: "#", width: 50, sortable: true },
            { field: "exchange", headerName: "Exchange", width: 100, sortable: true, filterable: true },
            { field: "product", headerName: "Product", width: 100, sortable: true, filterable: true },
            { field: "side", headerName: "Side", width: 50, sortable: true, filterable: true },
            {
            field: "date",
            headerName: "Date",
            width: 100,
            sortable: true,
            valueGetter: (params) => dateFormatter(params.row.timestamp),
            },
            {
            field: "time",
            headerName: "Time",
            width: 120,
            sortable: true,
            valueGetter: (params) => timeFormatter(params.row.timestamp),
            },
            { field: "price", headerName: "Price", width: 50, sortable: true },
            { field: "qty", headerName: "Qty", width: 100, sortable: true },
            { field: "qtyLeft", headerName: "Qty Left", width: 50, sortable: true },
            {
            field: "user",
            headerName: "User",
            width: 200,
            sortable: true,
            },
            {
            field: "cancel",
            headerName: "Cancel",
            width: 250,
            renderCell: (params) =>
                params.row.user === user && params.row.qtyLeft !== 0 ? (
                <button
                    className="btn btn-danger btn-sm"
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
            <>
            <style>
                {`
                .order-table-container {
                    min-height: 301px
                    width: 90%; 
                    max-width: 95%;
                    overflow: auto;
                }
        
                `}
            </style>
            <div className="order-table-wrapper" style={{minHeight:"301px"}}>
                <div id="orders" className="order-table-container">
                    <DataGrid
                    rows={orders}
                    columns={columns}
                    pageSize={50}
                    rowsPerPageOptions={[50]}
                    disableSelectionOnClick
                    disableExtendRowFullWidth
                    />
                </div>
            </div>
            </>
        );
        
        }