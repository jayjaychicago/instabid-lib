    import React, { useState, useEffect } from "react";
    import Pusher from "pusher-js";
    import { DataGrid } from "@mui/x-data-grid";
    import Spinner from 'react-bootstrap/Spinner';


    const EVENT_NAME = "ORDERUPDATE";

    /*
    const cancelButtonStyles = {
        height: "38px",
        width: "90px",
    };
*/
    export function OrderTable2({ exchange, product, user, devModeApiKey, apiProxy, adminUser }) {
        const [orders, setOrders] = useState([]);
        const [pusher, setPusher] = useState(undefined);
        const [currentChannel, setCurrentChannel] = useState(undefined);
        const [tableHeight, setTableHeight] = useState(300);
        const [buttonState, setButtonState] = useState(false);
        const [cancellingOrderNumber, setCancellingOrderNumber] = useState(null);

        if (typeof adminUser == "undefined") {adminUser = ""};

        const handleSubmit = async (orderNumber, exchange, user, devModeApiKey, apiProxy) => {
        console.log("Cancel has been called for OrderNumber " + orderNumber + " exchange: " + exchange + " user: " + user + " devModeApiKey: " + devModeApiKey + " apiProxy: " + apiProxy);
        
        setButtonState(true);
    
        if ((apiProxy == undefined) || apiProxy == "") {
            let apiProxyValue = "https://api.instabid.io/cancel";    
            try {
            let body = {
                exchange: exchange,
                orderNumber: orderNumber,
                user: user,
                apiKey: devModeApiKey,
            };
    
            let res = await fetch(apiProxyValue, {
                method: "POST",
                body: JSON.stringify(body),
            });
            let resJson = await res.json();
            //console.log("received back", JSON.stringify(resJson));
            //console.log(res.status);
            console.log("Returned call", res);
            console.log("Returned object: ", resJson);
            if (res.status === 200) {
                //setSide("");
                setButtonState(false);
                setCancellingOrderNumber(null);
                //setMessage("Done!");
            } else {
                alert("Some error occured");
                setButtonState(false);
                setCancellingOrderNumber(null);
            }
            } catch (err) {
            alert(err);
            setButtonState(false);
            setCancellingOrderNumber(null);
            }
        } else {
            // we're using a proxy to hide the private key
            // so we'll use get methods locally instead that will in turn pass the POST to the server
            let apiProxyValue = apiProxy + "?type=cancel&exchange=" + exchange + "&orderNumber=" + orderNumber + "&user=" + user
            try {
            let res2 = await fetch(apiProxyValue, {
                method: "GET"
            });
            let resJson = await res2.json();
            console.log("Returned call", res2);
            console.log("Returned object: ", resJson)
            if (res2.status === 200) {
                //setSide("");
                setButtonState(false);
                setButtonState(false);
                setCancellingOrderNumber(null);
                //setMessage("Done!");
            } else {
                alert("Some error occured");
                setButtonState(false);
                setCancellingOrderNumber(null);
            }
            } catch (err) {
            alert(err);
            setButtonState(false);
            setCancellingOrderNumber(null);
            }
        }
        };
    
/*
            const rowHeight = 52; // Set the desired row height (default is 52px)
            const headerHeight = 52; // Set the desired header height (default is 52px)
            const maxHeight = 750; // Set the maximum height for the DataGrid
            
            const [windowWidth, setWindowWidth] = useState(window.innerWidth);
*/
            useEffect(() => {
                console.log('Orders state changed', orders);
            }, [orders]);
/*
            useEffect(() => {
                const handleResize = () => setWindowWidth(window.innerWidth);
                window.addEventListener('resize', handleResize);
            
                return () => {
                window.removeEventListener('resize', handleResize);
                };
            }, []);
*/
            useEffect(() => {
                setPusher(
                new Pusher("122f17b065e8921fa6e0", {
                    cluster: "us2",
                })
                );
                // This will run only once when the component mounts
            }, []);
  /*          
            useEffect(() => {
                const minHeight = 300;
                if (orders === undefined) {
                    setTableHeight(300);
                } else {
                    setTableHeight(Math.max(Math.min(orders.length * rowHeight + headerHeight, maxHeight), minHeight));
                }
                    // This will run every time orders or WindowWith changes
            }, [orders, windowWidth]);
    */        

            useEffect(() => {
                console.log("UseEffect to call the API");
                console.log("Exchange: ",exchange);
                console.log("Product: ", product);
                console.log("User: ", user);
                console.log("CurrentChannel: ", currentChannel);
                //if (!currentChannel) return;
                //if (typeof currentChannel == undefined) return;
                if (!pusher) return;
        
                (async () => {
                    const exchangeValue = exchange;
                    const productValue = product;
                    const userValue = user || "";
                    let apiProxyGetValue = `https://api.instabid.io/orders?exchange=${exchangeValue}&product=${productValue}`
                    console.log("API Proxy value seen " + apiProxy)
                    try { // TODO: ALLOW API PROXYING TOO
                        if ((apiProxy == undefined) || (apiProxy == "")) {
                            console.log("using default API proxy")                            
                        } else {
                            apiProxyGetValue = apiProxy + "?type=orderGet&exchange=" + `${exchangeValue}&product=${productValue}`
                        }

                        const res = await fetch(apiProxyGetValue);
        
                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }
                        let ress = await res.json();
                        //console.log('ORDER TABLE GET API CALL returned ', JSON.stringify(ress.result));
                        if (ress.result.length > 0) {handleData(ress)};
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
            }, [exchange, product, user, pusher]);

            function handleData(data) {
                //console.log("BOUM " + data.result.length, data)

                
                const updatedData = data.result.map((item, index) => {
                    if (!item.exchange || !item.product || !item.side || !item.timestamp || !item.orderNumber) {
                        console.error('Missing one or more required fields for id', { item, index });
                    }
                    const id = item.exchange && item.product && item.side && item.timestamp && item.orderNumber
                        ? `${item.exchange}-${item.product}-${item.side}-${item.orderNumber + ''}`
                        : `missing-id-${index}`;
                    
                    //console.log("NON-NULL ID", id);
            
                    return {
                        ...item,
                        id, 
                    };
                });
                console.log("here1");
                setOrders(updatedData); // Replace old data

            }            

            function handlePusherData(data) {
                console.log("Instabidlib ORDER (AND CANCEL) TABLE processing via PUSHER " + JSON.stringify(data));
            
                if (data.side != "CANCEL") {
                    console.log("INCOMING NON-CANCEL DATA ", data);
                    const id = data.exchange && data.product && data.side && data.timestamp && data.orderNumber
                        ? `${data.exchange}-${data.product}-${data.side}-${data.orderNumber + ''}`
                        : `missing-id-${Date.now()}`;
                    
                    console.log("NON-NULL2 ID", id);
            
                    // Add the new order to the top of the DataGrid
                    const newOrder = {
                        ...data,
                        id, 
                    };
                    console.log("Here2");
                    setOrders((prev) => [newOrder, ...prev]);
                
                    // Update the existing orders based on the fills array
                    data.fills.forEach((fill) => {
                        console.log("Here 2a");
                        setOrders((prev) =>
                            prev.map((order) =>
                                order.orderNumber === fill.orderNumber
                                    ? { ...order, qtyLeft: order.qtyLeft - parseInt(fill.qty) }
                                    : order
                            )
                        );
                    });
                } else {
                    // Find the corresponding order and update its qtyLeft property to 0
                    console.log("INCOMING CANCEL DATA ", data);
                    console.log("Here 3");
                    setOrders((prevOrders) =>
                        prevOrders.map((order) => {
                            if (!order || !data) {
                                console.log('Undefined order or data', { order, data });
                                return;
                            } else {
                                // console.log('Order before:', order, 'Data:', data);
                                //console.log('order.orderNumber:', order.orderNumber + ' VS data.orderNumber:'+ data.orderNumber,  order.orderNumber === data.orderNumber);
                            }
                            if (order.orderNumber == data.orderNumber) {
                                //console.log("YEAH! WE ARE REPLACING!!")
                                return { ...order, qtyLeft: 0 }
                            }
                            else {
                                return order;
                            }
 /*                           return order.orderNumber === data.orderNumber
                                ? { ...order, qtyLeft: 0 }
                                : order; */
                        })
                    );
                   
                }
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
                { field: "orderNumber", headerName: "#", width: 50, sortable: true },
                { field: "exchange", headerName: "Exchange", width: 100, sortable: true, filterable: true },
                { field: "product", headerName: "Product", width: 100, sortable: true, filterable: true },
                { field: "side", headerName: "Side", width: 50, sortable: true, filterable: true },
                {
                field: "date",
                headerName: "Date",
                width: 100,
                sortable: true,
                hide: windowWidth < 768,
                valueGetter: (params) => dateFormatter(params.row.timestamp),
                },
                {
                field: "time",
                headerName: "Time",
                width: 120,
                sortable: true,
                hide: windowWidth < 768,
                valueGetter: (params) => timeFormatter(params.row.timestamp),
                },
                { field: "price", headerName: "Price", width: 50, sortable: true },
                { field: "qty", headerName: "Qty", width: 100, sortable: true },
                { field: "qtyLeft", headerName: "Qty Left", width: 100, sortable: true },
                {
                field: "user",
                headerName: "User",
                width: 200,
                sortable: true,
                hide: windowWidth < 768,
                valueGetter: (params) => {
                    // if the user field matches the user prop passed in, return "Me"
                    if(params.row.user === user) {
                        return 'Me';
                    } else {
                        // if not, return the nickname
                        return params.row.nickName;
                    }
                }
                },
                {
                field: "cancel",
                headerName: "Cancel",
                width: 250,
                renderCell: (params) =>
                    (((adminUser.toUpperCase() == "TRUE" || adminUser.toUpperCase() == "YES") && params.row.qtyLeft !== 0) || (params.row.user === user && params.row.qtyLeft !== 0)) ? (
                    <button
                        className="btn btn-primary btn-sm"
                        type="submit"
                        
                        onClick={() => {
                            setCancellingOrderNumber(params.row.orderNumber);
                            handleSubmit(
                              params.row.orderNumber, 
                              params.row.exchange, 
                              user, 
                              devModeApiKey, 
                              apiProxy
                            )
                          }}
                          
                        disabled={buttonState}
                    >
                        {cancellingOrderNumber === params.row.orderNumber ? (
        <Spinner animation="border" role="status" size="sm" />
      ) : (
        "Cancel"
      )}
                    </button>
                    ) : (
                    ""
                    ),
                },
            ];

            return (
                <>
                <div className="order-table-wrapper" >
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