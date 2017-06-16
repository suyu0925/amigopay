'use strict'

import { IOrder } from './order'
import * as request from './request'

export { IOrder } from './order'

export interface IOption {
  apiKey: string
  privateKey: string
  publicKey?: string
  retUrl?: string
}

export async function createOrder(option: IOption, order: IOrder) {
  return await request.createOrder(order, option.apiKey, option.privateKey, option.retUrl)
}

export function parseCallback(option: IOption, data: object) {
  return request.parseCallback(data, option.publicKey)
}

export function feedback(done: boolean) {
  return request.feedback(done)
}
