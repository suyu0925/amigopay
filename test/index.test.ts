'use strict'

import * as dotenv from 'dotenv'
dotenv.config()

import * as debug from 'debug'
import * as fs from 'fs'
import { AmigoPay } from '../src/index'
import { IOrder } from '../src/lib/order'
import { createOrder } from '../src/lib/request'
import * as utils from '../src/lib/utils'

const apiKey = process.env.apiKey
let privateKey = process.env.privateKey
let publicKey = process.env.publicKey
const retUrl = process.env.retUrl

const log = debug('test:index')

const PrivateKeyHeader = '-----BEGIN PRIVATE KEY-----\n'
const PrivateKeyTail = '-----END PRIVATE KEY-----\n'
const PublicKeyHeader = '-----BEGIN PUBLIC KEY-----\n'
const PublicKeyTail = '-----END PUBLIC KEY-----\n'

describe('index', () => {
  let amigoPay: AmigoPay

  beforeAll(() => {
    if (privateKey.indexOf(PrivateKeyHeader) === -1) {
      privateKey = PrivateKeyHeader + privateKey + '\n' + PrivateKeyTail
    }

    if (publicKey) {
      if (publicKey.indexOf(PublicKeyHeader) === -1) {
        publicKey = PublicKeyHeader + publicKey + '\n' + PublicKeyTail
      }
    }

    amigoPay = new AmigoPay({
      apiKey,
      privateKey,
      publicKey,
      retUrl
    })
  })

  test('sign', () => {
    const signature = utils.sign('hello', privateKey)
  })

  test('createOrder', async () => {
    // tslint:disable:object-literal-sort-keys
    const order: IOrder = {
      outOrderNo: utils.md5('201706160000004'),
      playerId: 'amigo_player001',
      subject: 'testPaymobile',
      totalFee: 0.01,
      dealPrice: 0.01,
      deliverType: '1'
    }
    // tslint:enable:object-literal-sort-keys
    const body = await amigoPay.createOrder(order)
    log('createOrder: %j', body)
  })

  test('parseCallback', () => {
    const data = {
      api_key: 'DDFDAEC3DBF544DD99EB9F508B429905',
      close_time: '20131210154043',
      create_time: '20131210154015',
      deal_price: '0.01',
      out_order_no: '201311290000005',
      pay_channel: '100',
      sign: 'A1nItIRYJoKyfL35Evq1mgTd%2FhRLwxF2mMKijwXCqjz1PYR%2F7Wq8l0pQxSMAL%2B%2BHF5RF5i865u2JCI0xv7GX4mGMDbaZGe8Z9w\
BbfrYR5MjGDOmtHLWBM1WnKeyKSPXs1yIdPXNzSB4NEwjq1VFijh1FahDXJJUBexTBqamBzgE%3D',
      submit_time: '20131210154013',
      user_id: 'null'
    }
    const req = amigoPay.parseCallback(data)
    log('parseCallback: %j', req)
    expect(req).not.toBeNull()
  })
})
