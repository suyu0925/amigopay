export interface IOrder {
  outOrderNo: string
  playerId: string
  subject: string
  totalFee: number
  dealPrice: number
  deliverType: DeliverType
}

// '1'为网游类型
export type DeliverType = '1'
