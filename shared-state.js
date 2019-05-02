 function SharedState({author, storage}) {
		this.author = author;
		this.storage = new Map(storage || [])
		this.callHooks('afterCreate')
	}

	SharedState.__proto__.hooks = {
		afterCreate: [],
		afterSync: [],
		publish: []
	}

	SharedState.prototype.callHooks =function(hook) {
		SharedState.__proto__.hooks[hook].forEach((fun)=>{
			fun(this)
		})
	}

	SharedState.prototype.insert = function(key, data, timeout) {
		timeout = timeout || (Date.now() + (60*1000))
		this.storage.set(
			key,
			{
				author:this.author,
				timeout,
				data
			}
		)
		this.changed = true
	}

	SharedState.prototype.merge = function(stateSlice = new Map(), notifyInsert = true) {
		stateSlice.forEach((value, key) => {
			if(value.timeout < Date.now()) {
				console.log( "debug", "sharedState.merge got expired entry: " + key + " expired on: " + Date(value.timeout))
				this.changed = true
			}
			else {
				let lv = this.storage.get(key)
				if (!lv){
					this.storage.set(key,value)
				}
				else if (lv && lv.timeout < value.expire) {
					console.log( "debug", "Updating entry for: " + key + " older: " + Date(lv.timeout) + " newer: " + Date(value.timeout) )
					this.storage.set(key, value)
					notifyInsert = this.changed || notifyInsert
				}
			}
		})
	}

	SharedState.prototype.remove = function(key) { 
		if(this.storage.get(key)) {
			this.storage.delete(key)
		}
	}

	SharedState.prototype.sync = function(neighbors = []) {
		neighbors
			.map(name=> this.getNodeData(name))
			.map(neighborStorage => this.merge(neighborStorage))
	}

	module.exports = SharedState