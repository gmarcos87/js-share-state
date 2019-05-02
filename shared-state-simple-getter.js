
// In the shared-state used in Libremesh the tool used to exchange states is a
// mixture of physical ipv6, wget and cgi-bin scripts.
// In this case we are going to simulate the exchange with a simpler dynamic.

const { allNodes} = require('./shared-state-registry');
const {fakeNodes } = require('./mockData/nodes')

const getNodeData = function(nodeName) {
    let remoteNode = allNodes.get(nodeName)
    console.log(`Synchronizing from ${this.author} to ${remoteNode.author}` )
    let acutalRemoteState = new Map(remoteNode.storage)
    remoteNode.callHooks('afterSync', this.storage)
    return acutalRemoteState;
}

const getNeighbors = function(hostname) {
    return fakeNodes.filter( x => x.hostname === hostname)[0].remotes
}

module.exports = { getNodeData, getNeighbors} ;
