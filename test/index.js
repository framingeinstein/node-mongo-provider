

var document = {field: 1, array: ["1", "2", "3"]};

module.exports = {
	'Destroy': function (test) {
		var MongoProvider = require('..').MongoProvider;
		var provider = new MongoProvider('localhost', 27017, 'index', 'test');
		provider.on("open", function (err, client) {
			provider.destroy(function (err, client) {
				test.equal(null, err);
				test.equal(provider.getState(), "disconnected");
				//console.log("Destroy: " + provider.getState());
				test.done();
			});
		});
	}
	,'Open': function (test) {
		var MongoProvider = require('..').MongoProvider;
		var provider = new MongoProvider('localhost', 27017, 'index', 'test');
		provider.on("open", function (err, client) {
			test.equal(null, err);
			test.equal(provider.getState(), "connected");
			provider.destroy(function (err, client) {
				//console.log("Open: " + provider.getState());
				test.done();
			});
		
		});
	}
	,'Save': function (test) {
		var MongoProvider = require('..').MongoProvider;
		var provider = new MongoProvider('localhost', 27017, 'index', 'test');
		provider.on("open", function (err, client) {
			provider.save(document, function (err, doc) {
				test.equal(null, err);
				//console.dir(doc);
				
				//provider.remove()
				provider.destroy(function (err, p) {
					//console.log("destroyed");
					//provider = new MongoProvider('localhost', 27017, 'index', 'test');
					//console.log("Save: " + provider.getState());
					test.done();
				});		
			});
		});
	}
	,'Find': function (test) {
		var MongoProvider = require('..').MongoProvider;
		var provider = new MongoProvider('localhost', 27017, 'index', 'test');
		provider.on("open", function (err, client) {
			provider.save(document, function (err, doc) {
				//console.dir(doc);
				provider.find(doc, {}, function (err, results) {
					test.equal(null, err);
					//console.dir(results);
					
					provider.destroy(function (err, p) {
						//console.log("Find " + provider.getState());
						test.done();
					});
				});
			});
		});
			
	}

};