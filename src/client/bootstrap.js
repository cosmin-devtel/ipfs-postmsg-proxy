import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { postArrayOf } from '../serialization/utils/prepost-array-of'
import { preMultiaddrToJson, isMultiaddrJson, multiaddrFromJson } from '../serialization/multiaddr'

export default function (opts) {
  return {
    add: callbackify.variadic(
      pre(
        preMultiaddrToJson(0),
        post(
          caller('ipfs.bootstrap.add', opts),
          postArrayOf('Peers', isMultiaddrJson, multiaddrFromJson)
        )
      )
    )
  }
}
