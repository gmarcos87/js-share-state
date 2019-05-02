// In the shared-state of LibreMesh the nodes are found by means 
// of a scan wifi or analyzing the associated nodes.
// For our case we are going to create a record where the
// instances are registered after they are created.

const md5 = require('blueimp-md5');

const allNodes = new Map();

if (typeof window !== 'undefined') {
    window.allNodes = allNodes
}

const registerNode = function(node) { allNodes.set(node.author, node) }

function compare( a, b ) {
    if ( a[0] < b[0] ){
      return -1;
    }
    if ( a[0] > b[0] ){
      return 1;
    }
    return 0;
  }

const logStorageHash = function(node) {
    console.log('Storage hash: '+ md5(JSON.stringify([...node.storage].sort(compare))) + ' Hostname: ' +node.author)
} 

const syncAfterSend = function(node, data) { 
    if (data){
        node.merge(data)
    }
}

module.exports = {
    registerNode,
    logStorageHash,
    allNodes,
    syncAfterSend
};
