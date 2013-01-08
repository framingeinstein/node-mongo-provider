mongo-provider - A simple wrapper for mongodb driver for NodeJS
====================

Installation
------------
You can install this through npm: npm install mongo-provider

You can also install via git by cloning: `git clone https://github.com/framingeinstein/node-mongo-provider.git /path/to/mongo-provider`

Usage
-----


var MongoProvider = require('mongo-provider').MongoProvider;
var myCollectionProvider = new MongoProvider('server', port, 'MyDatabase', 'MyCollection');

provider.on("open", function (err, client) {
	// Do something with client
	…
	
	// Don't forget to destroy the provider to cleanup and close the connection
	provider.destroy(function (err, client) {
		//Do something when destroyed
	});
});