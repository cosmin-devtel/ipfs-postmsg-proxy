import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import toPull from 'stream-to-pull-stream'
import isStream from 'is-stream'
import buffer from 'pull-buffer'
import { preCall } from '../../fn-call'

export default function (opts) {
  const api = {
    add: callbackify.variadic(
      preCall(
        (...args) => {
          // TODO: handle progress
          if (args[1] && args[1].progress) {
            throw new Error('Not implemented')
          }

          // FIXME: implement streams properly
          return new Promise((resolve, reject) => {
            pull(
              pull.values(Array.isArray(args[0]) ? args[0] : [args[0]]),
              pull.map(normalizeContent),
              pull.asyncMap((file, cb) => {
                if (!file.content) return cb(null, file)

                // Buffer all the streaming data into memory
                pull(
                  file.content,
                  pull.collect((err, buffers) => {
                    if (err) return cb(err)
                    cb(null, Object.assign(file, { content: Buffer.concat(buffers) }))
                  })
                )
              }),
              pull.collect((err, files) => {
                if (err) return reject(err)
                args[0] = files.length === 1 ? files[0] : files
                resolve(args)
              })
            )
          })
        },
        caller('ipfs.files.add', opts)
      )
    ),
    // FIXME: implement streams properly
    addReadableStream () {
      return toStream(api.addPullStream(...arguments))
    },
    // FIXME: implement streams properly
    addPullStream: (...args) => pull(
      buffer(),
      pull.map((data) => data.map(normalizeContent)),
      pull.asyncMap((content, cb) => api.add.apply(api, [content].concat(args, cb))),
      pull.flatten()
    )
  }

  return api
}

function normalizeContent (data) {
  if (Buffer.isBuffer(data)) {
    data = { path: '', content: pull.values([data]) }
  }

  if (isStream.readable(data)) {
    data = { path: '', content: toPull.source(data) }
  }

  if (data && data.content && typeof data.content !== 'function') {
    if (Buffer.isBuffer(data.content)) {
      data.content = pull.values([data.content])
    }

    if (isStream.readable(data.content)) {
      data.content = toPull.source(data.content)
    }
  }

  return data
}
