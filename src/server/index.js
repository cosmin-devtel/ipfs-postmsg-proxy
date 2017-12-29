import { expose } from 'postmsg-rpc'
import createBlock from './block'
import createConfig from './config'
import createDag from './dag'
import createFiles from './files'

export default (getIpfs, opts) => {
  return {
    id: expose('ipfs.id', () => getIpfs().id(), opts),
    version: expose('ipfs.version', () => getIpfs().version(), opts),
    block: createBlock(getIpfs, opts),
    config: createConfig(getIpfs, opts),
    dag: createDag(getIpfs, opts),
    dht: {
      put: expose('ipfs.dht.put', (...args) => getIpfs().dht.put(...args), opts),
      get: expose('ipfs.dht.get', (...args) => getIpfs().dht.get(...args), opts),
      findprovs: expose('ipfs.dht.findprovs', (...args) => getIpfs().dht.findprovs(...args), opts),
      findpeer: expose('ipfs.dht.findpeer', (...args) => getIpfs().dht.findpeer(...args), opts),
      provide: expose('ipfs.dht.provide', (...args) => getIpfs().dht.provide(...args), opts),
      query: expose('ipfs.dht.query', (...args) => getIpfs().dht.query(...args), opts)
    },
    files: createFiles(getIpfs, opts),
    key: {
      gen: expose('ipfs.key.gen', (...args) => getIpfs().key.gen(...args), opts),
      list: expose('ipfs.key.list', () => getIpfs().key.list(), opts),
      rename: expose('ipfs.key.rename', (...args) => getIpfs().key.rename(...args), opts),
      rm: expose('ipfs.key.rm', (...args) => getIpfs().key.rm(...args), opts)
    },
    object: {
      new: expose('ipfs.object.new', (...args) => getIpfs().object.new(...args), opts),
      put: expose('ipfs.object.put', (...args) => getIpfs().object.put(...args), opts),
      get: expose('ipfs.object.get', (...args) => getIpfs().object.get(...args), opts),
      data: expose('ipfs.object.data', (...args) => getIpfs().object.data(...args), opts),
      links: expose('ipfs.object.links', (...args) => getIpfs().object.links(...args), opts),
      stat: expose('ipfs.object.stat', (...args) => getIpfs().object.stat(...args), opts),
      patch: {
        addLink: expose('ipfs.object.patch.addLink', (...args) => getIpfs().object.patch.addLink(...args), opts),
        rmLink: expose('ipfs.object.patch.rmLink', (...args) => getIpfs().object.patch.rmLink(...args), opts),
        appendData: expose('ipfs.object.patch.appendData', (...args) => getIpfs().object.patch.appendData(...args), opts),
        setData: expose('ipfs.object.patch.setData', (...args) => getIpfs().object.patch.setData(...args), opts)
      }
    },
    pin: {
      add: expose('ipfs.pin.add', (...args) => getIpfs().pin.add(...args), opts),
      rm: expose('ipfs.pin.rm', (...args) => getIpfs().pin.rm(...args), opts),
      ls: expose('ipfs.pin.ls', (...args) => getIpfs().pin.ls(...args), opts)
    },
    pubsub: {
      publish: expose('ipfs.pubsub.publish', (...args) => getIpfs().pubsub.publish(...args), opts),
      peers: expose('ipfs.pubsub.peers', () => getIpfs().pubsub.peers(), opts),
      ls: expose('ipfs.pubsub.ls', (...args) => getIpfs().pubsub.ls(...args), opts)
    },
    swarm: {
      peers: expose('ipfs.swarm.peers', (...args) => getIpfs().swarm.peers(...args), opts),
      addrs: expose('ipfs.swarm.addrs', () => getIpfs().swarm.addrs(), opts),
      localAddrs: expose('ipfs.swarm.localAddrs', () => getIpfs().swarm.localAddrs(), opts),
      connect: expose('ipfs.swarm.connect', (...args) => getIpfs().swarm.connect(...args), opts),
      disconnect: expose('ipfs.swarm.disconnect', (...args) => getIpfs().swarm.disconnect(...args), opts)
    }
  }
}

export function closeProxyServer (obj) {
  Object.keys(obj).forEach((k) => {
    if (obj[k].close) {
      obj[k].close()
    } else {
      closeProxyServer(obj[k])
    }
  })
}
