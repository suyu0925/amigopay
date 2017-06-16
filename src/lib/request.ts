'use strict'

import * as moment from 'moment'
import * as request from 'request'
import { DeliverType, IOrder } from './order'
import * as utils from './utils'

export interface IOrderRequest {
  api_key: string
  deal_price: string
  deliver_type: DeliverType
  expire_time?: string
  notify_url?: string
  out_order_no: string
  subject: string
  submit_time: string
  total_fee: string
  sign: string
  player_id: string
}

export interface ICreateOrderResponse {
  status: string
  description: string
  out_order_no?: string
  order_no?: string
  submit_time?: string
  api_key?: string
}

export const SuccessStatus = '200010000'
export const BadSignStatus = '400010027'

export interface ICallbackRequest {
  api_key: string
  close_time: string
  create_time: string
  deal_price: number
  out_order_no: string
  pay_channel: number
  submit_time: string
  user_id: string
  sign: string
}

function toOrderRequest(order: IOrder, apiKey: string, retUrl?: string) {
  const req: IOrderRequest = {
    api_key: apiKey,
    deal_price: order.dealPrice.toFixed(2),
    deliver_type: order.deliverType,
    notify_url: retUrl,
    out_order_no: order.outOrderNo,
    player_id: order.playerId,
    sign: null,
    subject: order.subject,
    submit_time: moment().format('YYYYMMDDHHmmss'),
    total_fee: order.totalFee.toFixed(2)
  }
  return req
}

export async function createOrder(order: IOrder, apiKey: string, privateKey: string, retUrl?: string) {
  return new Promise<ICreateOrderResponse>((resolve, reject) => {
    const req = toOrderRequest(order, apiKey)
    req.sign = utils.getSignature(req, privateKey)
    request({
      body: req,
      json: true,
      method: 'post',
      url: 'https://pay.gionee.com/order/create'
    }, (err, res, body: ICreateOrderResponse) => {
      if (err) {
        reject(err)
      } else if (res.statusCode !== 200) {
        reject(`wrong status code ${res.statusCode}`)
      } else {
        if (body.status !== SuccessStatus) {
          reject(new Error(body.description))
        } else {
          resolve(body)
        }
      }
    })
  })
}

export function parseCallback(data: object, publicKey: string) {
  const req = data as ICallbackRequest
  if (utils.verify(req, publicKey)) {
    return req
  } else {
    return null
  }
}

export function feedback(done: boolean) {
  return done ? 'success' : 'fail'
}
