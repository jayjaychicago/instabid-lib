let updateSortedOrders = (initialState, orderRequests) => {
    console.log(initialState);
    console.log(orderRequests);
    let nextState = initialState
        .map((nextInitialOrder) => {
            let futureOrderIdx = orderRequests.findIndex((_order) => { return _order && _order.price === nextInitialOrder.price; });
            if (futureOrderIdx >= 0) {
                let futureOrder = {
                    qty: orderRequests[futureOrderIdx].qty,
                    price: orderRequests[futureOrderIdx].price
                }
                delete orderRequests[futureOrderIdx];
                return futureOrder;
            } else {
                return {
                    qty: nextInitialOrder.qty,
                    price: nextInitialOrder.price
                };
            }
        })
        .concat(orderRequests.filter((_order) => !initialState.find((_obj) => _obj.price === _order.price)))
    // let nextState = orderRequest
    // .map((order) => {
    // })
    .sort((a, b) => {
        return b.price - a.price;
    });

    return nextState;
};

export { updateSortedOrders };