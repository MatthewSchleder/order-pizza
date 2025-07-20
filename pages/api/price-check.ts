import type { NextApiRequest, NextApiResponse } from 'next'
import { Order, Customer, Item } from 'dominos';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()

    try {
        const customer = new Customer({
            address: process.env.CUSTOMER_ADDRESS!,
            firstName: 'Matt',
            lastName: 'Schleder',
            phone: process.env.CUSTOMER_PHONE!,
            email: process.env.CUSTOMER_EMAIL!
        });


        const storeID = '8849'
        const serviceMethod = 'Carside'
        const order = new Order(customer);

        order.storeID=storeID;
        order.serviceMethod=serviceMethod;

        order.addItem(new Item({
            code: 'P12IPAZA',
            quantity: 1,
            options: { "X": { "1/1": "1"}, "C": {"1/1": "1"},"Cp": {"1/1": "1"},"P": {"1/1": "1"},"S": {"1/1": "1"} },
        }))

        order.addItem(new Item({
            code: 'B8PCSCB',
            quantity: 1,
        }))

        order.addItem(new Item({
            code: 'MARINARA',
            quantity: 3,
        }))
        const coupon={'Code':'9227'};
        order.addCoupon(coupon)

        await order.validate();
        await order.price()

        console.log('\n\nOrder\n\n');
        console.log(order)

        res.status(200).json({
            success: true,
            price: order.amountsBreakdown?.customer || 0,
            deliveryAddress: order.address,
        })
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}
