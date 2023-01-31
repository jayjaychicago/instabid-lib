import { updateSortedOrders } from '../src/util';

describe ("Utility functions", () => {
    describe('updateSortedOrders()', () => {
        it ('should zero out buys in sorted order after updating', () => {
            let initialBuys = [
                {
                    qty: 1,
                    price: 11
                },
                {
                    qty: 1,
                    price: 12
                }
            ];

            let buyOrder = [
                {
                    qty: 0,
                    price: 12
                },
                {
                    qty: 0,
                    price: 11
                }
            ];

            let updatedOrders = updateSortedOrders(initialBuys, buyOrder);
            expect(updatedOrders).toEqual([{
                qty: 0,
                price: 12
            }, {
                qty: 0,
                price: 11
            }])
        });

        it ('should add a new buy order to the table', () => {
            let initialBuys = [
                {
                    qty: 1,
                    price: 11
                },
                {
                    qty: 1,
                    price: 12
                }
            ];

            let buyOrder = [
                {
                    qty: 8,
                    price: 4
                }
            ];

            expect(updateSortedOrders(initialBuys, buyOrder)).toEqual([{
                qty: 1,
                price: 12
            }, {
                qty: 1,
                price: 11
            }, {
                qty: 8,
                price: 4
            }]);
        });
    });
});