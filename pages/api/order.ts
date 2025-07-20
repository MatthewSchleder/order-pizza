import type { NextApiRequest, NextApiResponse } from 'next'
import { Order, Customer, Item, Payment } from 'dominos';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()

    // Get CC info from body or env
    const cardNumber = process.env.CC_NUMBER
    const cardExp = process.env.CC_EXP
    const cardCVV = process.env.CC_CVV
    const billingZip = process.env.CC_ZIP

    if (!cardNumber || !cardExp || !cardCVV || !billingZip) {
        return res.status(400).json({ error: 'Missing credit card information' })
    }

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

        order.storeID = storeID;
        order.serviceMethod = serviceMethod;

        order.addItem(new Item({
            code: 'P12IPAZA',
            quantity: 1,
            options: { "X": { "1/1": "1" }, "C": { "1/1": "1" }, "Cp": { "1/1": "1" }, "P": { "1/1": "1" }, "S": { "1/1": "1" } },
        }))

        order.addItem(new Item({
            code: 'B8PCSCB',
            quantity: 1,
        }))

        order.addItem(new Item({
            code: 'MARINARA',
            quantity: 3,
        }))
        const coupon = { 'Code': '9227' };
        order.addCoupon(coupon)

        await order.validate();
        await order.price()

        const myCard = new Payment(
            {
                amount: order.amountsBreakdown.customer,
                number: cardNumber,
                expiration: cardExp,
                securityCode: cardCVV,
                postalCode: billingZip,
                tipAmount: 0
            }
        );

        order.payments.push(myCard);
        const result = await order.place();

        if (result.success) {
            res.status(200).json({ success: true })
        } else {
            res.status(400).json({ error: result.message || 'Payment failed' })
        }
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong'

        if (error instanceof Error) {
            errorMessage = error.message
        }

        console.error('API Error:', error)

        res.status(500).json({
            success: false,
            error: errorMessage,
        })
    }

}
