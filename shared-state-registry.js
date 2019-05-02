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

const logStorageHash = function(node) {
    console.log('Storage hash: '+ md5(JSON.stringify([...node.storage])) + ' Hostname: ' +node.author)
} 

module.exports = {
    registerNode,
    logStorageHash,
    allNodes
};
