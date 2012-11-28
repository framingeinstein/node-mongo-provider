var util = require('util');

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var EventEmitter = require('events').EventEmitter;

var Provider = function(host, port, database, collection) {
	EventEmitter.call(this);
	var self = this;
	self.db = new Db(database, new Server(host, port, {auto_reconnect: true}, {}));
	self.db.open(function(err, results){
		if( err ) self.emit("error", err);
		self.emit("connect", results);
	});
	self.collection = collection;
};

util.inherits(Provider, EventEmitter);

Provider.prototype.getCollection= function(callback) {
  this.db.collection(this.collection, function(error, collection) {
    if( error ) callback(error);
    else callback(null, collection);
  });
};

Provider.prototype.findAll = function(order, callback) {
	if(typeof order == "Function") {
		callback = order;
		order = {};
	}
	//console.log("Hello");
	this.getCollection(function(error, collection) {
      //console.log("Retrieved Collection");
	  if( error ) callback(error);
      else {
        collection.find().toArray(function(error, results) {
		  //console.log("Documents Retrieved");
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


Provider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error);
      else {
        collection.findOne({_id: collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

Provider.prototype.findWithOptions = function(document, options, callback) {
	//console.log(document);
	if(typeof options == "Function") {
		callback = options;
		options = {};
	}
	if (!options)
		options = {};	

	this.getCollection(function(error, collection) {
      if( error ) callback(error);
      else {
        collection.find(document, options).toArray(function(error, results) {
          if( error ) callback(error)
          else {
			callback(null, results);
		  }
        });
      }
    });
};

Provider.prototype.find = function(document, order, callback) {
	//console.log(order);
	if(typeof order == "Function") {
		//console.log("Setting Callback to order");
		callback = order;
		order = {};
	}
	if (!order)
		order = {};	

	this.getCollection(function(error, collection) {
      if( error ) callback(error);
      else {
        collection.find(document).sort(order).toArray(function(error, results) {
          if( error ) callback(error)
          else {
			callback(null, results);
		  }
        });
      }
    });
};

Provider.prototype.save = function(document, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error);
      else {
        //if( typeof(it.length)=="undefined")
          //documents = [documents];

          collection.save(document, function() {
          callback(null, document);
        });
      }
    });
};

Provider.prototype.count = function(document, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error);
      else {
        //if( typeof(it.length)=="undefined")
          //documents = [documents];

          	collection.count(document, function(err, results) {
          		if( error ) callback(error);
				else
					callback(null, results);
        	});
      }
    });
};

Provider.prototype.mapReduce = function(m, r, options, callback) {
    this.getCollection(function(error, collection) {
		if( error ) callback(error);
		else {
			collection.mapReduce(m, r, options, function(err, results, stats) {
				callback(err, results, stats);
			});
		}
	});
};

Provider.prototype.destroy = function (callback) {

		this.db.close(function (err, results) {
			if (err) throw err;
			console.log("Connection Closed");
			//return;
		});		

};

exports.MongoProvider = Provider;