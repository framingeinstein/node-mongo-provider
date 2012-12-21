var MongoProvider = require('..').MongoProvider;

var document = {field: 1, array: ["1", "2", "3"]};

module.exports = {
	
	'Open': function (test) {
		var provider = new MongoProvider('localhost', 27017, 'index', 'test');
		provider.on("open", function (err, client) {
			test.equal(null, err);
			test.equal(provider.getState(), "connected");
			test.done();
		});
	}
	,'Destroy': function (test) {
		var provider = new MongoProvider('localhost', 27017, 'index', 'test');
		provider.destroy(function (err, client) {
			test.equal(null, err);
			test.equal(provider.getState(), "disconnected");
			test.done();
		});
	}
	,'Save': function (test) {
		var provider = new MongoProvider('localhost', 27017, 'index', 'test');
		provider.on("open", function (err, client) {
			provider.save(document, function (err, doc) {
				test.equal(null, err);
				//console.dir(doc);
				
				//provider.remove()
				provider.destroy(function (err, p) {
					//console.log("destroyed");
					//provider = new MongoProvider('localhost', 27017, 'index', 'test');
					test.done();
				});		
			});
		});
	}
	,'Find': function (test) {
			var provider = new MongoProvider('localhost', 27017, 'index', 'test');
			provider.on("open", function (err, client) {
				provider.save(document, function (err, doc) {
					//console.dir(doc);
					provider.find(doc, {}, function (err, results) {
						test.equal(null, err);
						//console.dir(results);
						test.done();
						provider.destroy(function (err, p) {
							//console.log("destroyed");
						});
					});
				});
			});
			
		}
};