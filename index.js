const SharedState = require('./shared-state')

// We are going to use two helpers who will help us for the cases of 
// uses of this test. A function that triggers after creating a SharedState
// instance and storing it in a global variable. And another that serves to
// obtain the sotorage of a certain node.
const {
	getNodeData,
	getNeighbors
} = require('./shared-state-simple-getter')

const {
	registerNode,
	allNodes,
	logStorageHash
} = require('./shared-state-registry');

SharedState.prototype.getNodeData = getNodeData;

SharedState.__proto__.hooks.afterCreate = [
	...SharedState.__proto__.hooks.afterCreate,
	registerNode
]

SharedState.__proto__.hooks.afterSync = [
	...SharedState.__proto__.hooks.afterSync,
	logStorageHash
]

// Loading fake data
const { fakeNodes } = require('./mockData/nodes')
fakeNodes.forEach(node => {
	new SharedState({
		author: node.hostname,
		storage: []
	})
});

// Srtart cron for sync
setInterval(function () {
	allNodes.forEach((host, hostname) => {
		debugger;
		let nodeNeighbors = getNeighbors(hostname);
		host.sync(nodeNeighbors);
	});
}, 10000);