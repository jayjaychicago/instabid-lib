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
    export function FillTable({ exchange, product, user, devModeApiKey, apiProxy, adminUser }) {
        const [fills, setFills] = useState([]);
        const [pusher, setPusher] = useState(undefined);
        const [currentChannel, setCurrentChannel] = useState(undefined);
        const [tableHeight, setTableHeight] = useState(300);
        const [buttonState, setButtonState] = useState(false);
        const [cancellingOrderNumber, setCancellingOrderNumber] = useState(null);

        if (typeof adminUser == "undefined") {adminUser = ""};

        
    
/*
            const rowHeight = 52; // Set the desired row height (default is 52px)
            const headerHeight = 52; // Set the desired header height (default is 52px)
            const maxHeight = 750; // Set the maximum height for the DataGrid
            
            const [windowWidth, setWindowWidth] = useState(window.innerWidth);
*/
            useEffect(() => {
                console.log('Orders state changed', fills);
            }, [fills]);
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
                if (fills === undefined) {
                    setTableHeight(300);
                } else {
                    setTableHeight(Math.max(Math.min(fills.length * rowHeight + headerHeight, maxHeight), minHeight));
                }
                    // This will run every time fills or WindowWith changes
            }, [fills, windowWidth]);
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
                    let apiProxyGetValue = `https://api.instabid.io/fills?exchange=${exchangeValue}&product=${productValue}`
                    console.log("API Proxy value seen " + apiProxy)
                    try { // TODO: ALLOW API PROXYING TOO
                        if ((apiProxy == undefined) || (apiProxy == "")) {
                            console.log("using default API proxy")                            
                        } else {
                            apiProxyGetValue = apiProxy + "?type=fillsGet&exchange=" + `${exchangeValue}&product=${productValue}`
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
                    if (!item.exchange || !item.product || !item.side || !item.timestamp || !item.fillNumber) {
                        console.error('Missing one or more required fields for id', { item, index });
                    }
                    const id = item.exchange && item.product && item.side && item.timestamp && item.fillNumber
                        ? `${item.exchange}-${item.product}-${item.side}-${item.fillNumber + ''}`
                        : `missing-id-${index}`;
                    
                    //console.log("NON-NULL ID", id);
            
                    return {
                        ...item,
                        id, 
                    };
                });
                console.log("here1");
                setFills(updatedData); // Replace old data

            }            

            function handlePusherData(data) {
                console.log("Instabidlib ORDER (AND CANCEL) TABLE processing via PUSHER " + JSON.stringify(data));
            
                if (data.side != "CANCEL") {
                    console.log("INCOMING NON-CANCEL DATA ", data);
                    const id = data.exchange && data.product && data.side && data.timestamp && data.fillNumber
                        ? `${data.exchange}-${data.product}-${data.side}-${data.fillNumber + ''}`
                        : `missing-id-${Date.now()}`;
                    
                    console.log("NON-NULL2 ID", id);
            
                    // Add the new fill to the top of the DataGrid
                    const newOrder = {
                        ...data,
                        id, 
                    };
                    console.log("Here2");
                    setFills((prev) => [newOrder, ...prev]);
                
                    // Update the existing fills based on the fills array
                    data.fills.forEach((fill) => {
                        console.log("Here 2a");
                        setFills((prev) =>
                            prev.map((fill) =>
                                fill.fillNumber === fill.fillNumber
                                    ? { ...fill, qtyLeft: fill.qtyLeft - parseInt(fill.qty) }
                                    : fill
                            )
                        );
                    });
                } else {
                    // Find the corresponding fill and update its qtyLeft property to 0
                    console.log("INCOMING CANCEL DATA ", data);
                    console.log("Here 3");
                    setFills((prevOrders) =>
                        prevOrders.map((fill) => {
                            if (!fill || !data) {
                                console.log('Undefined fill or data', { fill, data });
                                return;
                            } else {
                                // console.log('Order before:', fill, 'Data:', data);
                                //console.log('fill.fillNumber:', fill.fillNumber + ' VS data.fillNumber:'+ data.fillNumber,  fill.fillNumber === data.fillNumber);
                            }
                            if (fill.fillNumber == data.fillNumber) {
                                //console.log("YEAH! WE ARE REPLACING!!")
                                return { ...fill, qtyLeft: 0 }
                            }
                            else {
                                return fill;
                            }
 /*                           return fill.fillNumber === data.fillNumber
                                ? { ...fill, qtyLeft: 0 }
                                : fill; */
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


            const columns = [
                { field: "fillNumber", headerName: "#", width: 50, sortable: true },
                { field: "exchange", headerName: "Exchange", width: 100, sortable: true, filterable: true },
                { field: "product", headerName: "Product", width: 100, sortable: true, filterable: true },
                {
                field: "date",
                headerName: "Date",
                width: 100,
                sortable: true,
                //hide: windowWidth < 768,
                valueGetter: (params) => dateFormatter(params.row.timestamp),
                },
                {
                field: "time",
                headerName: "Time",
                width: 120,
                sortable: true,
                //hide: windowWidth < 768,
                valueGetter: (params) => timeFormatter(params.row.timestamp),
                },
                { field: "price", headerName: "Price", width: 50, sortable: true },
                { field: "qty", headerName: "Qty", width: 100, sortable: true },
                {
                field: "buyer",
                headerName: "Buyer",
                width: 200,
                sortable: true,
                //hide: windowWidth < 768,
                valueGetter: (params) => {
                    // if the user field matches the user prop passed in, return "Me"
                    console.log("Buyer from API is: " + params.row.buyer + " VS user " + user);
                    if(params.row.buyer === user) {
                        return 'Me';
                    } else {
                        // if not, return the nickname
                        return params.row.BuyerNickName;
                    }
                }
                },
                {
                    field: "seller",
                    headerName: "Seller",
                    width: 200,
                    sortable: true,
                    //hide: windowWidth < 768,
                    valueGetter: (params) => {
                        // if the user field matches the user prop passed in, return "Me"
                        if(params.row.seller === user) {
                            return 'Me';
                        } else {
                            // if not, return the nickname
                            return params.row.SellerNickName;
                        }
                    }
                },
                {
                field: "confirmation",
                headerName: "confirmation",
                width: 250,
                renderCell: (params) =>
                    (true) ? (
                    <button
                        className="btn btn-primary btn-sm"
                        type="submit"
                        
                        onClick={() => {console.log("Clicked!");
                          }}
                          
                        disabled={buttonState}
                    >
                        Confirmation
                    </button>
                    ) : (
                    ""
                    ),
                },
            ];

            return (
                <>
                <div className="fill-table-wrapper" >
                    <div id="fills" className="fill-table-container">
                        <DataGrid
                        rows={fills}
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