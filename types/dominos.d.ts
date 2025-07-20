// dominos.d.ts

declare module 'dominos' {
  type ServiceMethod = 'Delivery' | 'Carryout' | 'Carside'

  export interface Address {
    Street: string
    City: string
    Region: string
    PostalCode: string
  }

  export class Customer {
    address: string | Address
    firstName: string
    lastName: string
    phone: string
    email: string

    constructor(customer: {
      address: string | Address
      firstName: string
      lastName: string
      phone: string
      email: string
    })
  }

  export class Item {
    code: string
    quantity?: number
    options?: Record<string, Record<string, string>>

    constructor(item: {
      code: string
      quantity?: number
      options?: Record<string, Record<string, string>>
    })
  }

  export class Payment {
    number: string
    expiration: string
    securityCode: string
    postalCode: string
    amount: number
    tipAmount?: number

    constructor(payment: {
      number: string
      expiration: string
      securityCode: string
      postalCode: string
      amount: number
      tipAmount?: number
    })
  }

  export class Order {
    customer: Customer
    storeID: string
    serviceMethod: ServiceMethod
    items: Item[]
    coupons: { Code: string }[]
    address: Address
    payments: Payment[]
    amountsBreakdown: {
      customer: number
      [key: string]: number
    }

    constructor(customer: Customer)

    addItem(item: Item): void
    addCoupon(coupon: { Code: string }): void
    validate(): Promise<void>
    price(): Promise<void>
    place(): Promise<{ success: boolean; message?: string }>
  }
}
