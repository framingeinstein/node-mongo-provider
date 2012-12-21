var MongoProvider = require('./').MongoProvider;

var provider = new MongoProvider('localhost', 27017, 'index', 'test');
/*
provider.on("open", function (err, client) {
	console.log("Opened");
	provider.destroy(function (err, db) {
		console.log("Destroyed");
	})
});
*/


provider.on("open", function (err, client) {
	provider.destroy(function (err, client) {
		//test.equal(null, err);
		//test.equal(provider.getState(), "disconnected");
		console.log("Destroy: " + provider.getState());
		//test.done();
	});
});