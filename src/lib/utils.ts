'use strict'

import * as crypto from 'crypto'

export function getSignature(data: { [k: string]: any }, privateKey: string) {
  const content = Object.keys(data).filter((key) => {
    return key !== 'sign' && key !== 'player_id' && data[key] != null && data[key] !== ''
  }).sort().map((key) => {
    return data[key].toString()
  }).join('')
  return sign(content, privateKey)
}

export function sign(data: string, key: string) {
  return crypto.createSign('RSA-SHA1').update(data).sign(key, 'base64')
}

export function md5(data: string) {
  return crypto.createHash('md5').update(data).digest('hex')
}

export function verify(data: { [k: string]: any }, publicKey: string) {
  const content = Object.keys(data).filter((key) => {
    return key !== 'sign' && data[key] != null && data[key] !== ''
  }).sort().map((key) => {
    return key + '=' + data[key].toString()
  }).join('&')
  const verify = crypto.createVerify('RSA-SHA1')
  verify.update(content)
  return verify.verify(publicKey, data.sign)
}
