var util = require('util');

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var document = {field: 1, array: ["1", "2", "3"]};
var database = "index";
var collection = "test";
var db = new Db(database, new Server('localhost', 27017, {auto_reconnect: true}), {safe:false});

db.open(function(err, client){
	if( err ) throw err;
	db.collection(collection, function(error, collection) {
	    if( error ) throw err;
	    else {
			collection.save(document, function(err, doc) {
				console.dir(doc);
				collection.find(document).sort({}).toArray(function(error, results) {
					if( error ) throw error;
					else {
						console.dir(results);
						db.close(function (err, client) {
							console.log("closed");
						});
					}
				});
			
			
			});
		}
	});
	//self.db.setProfilingLevel(2);
});