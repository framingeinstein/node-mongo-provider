var util = require('util');

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var EventEmitter = require('events').EventEmitter;

var state = 'disconnected';

var Provider = function(host, port, database, collection) {
	EventEmitter.call(this);
	var self = this;
	this.client = new Db(database, new Server(host, port, {auto_reconnect: true}), {safe:false});
	
	this.client.open(function(err, db){
		if( err ) self.emit("open", err, null);
		state = self.client.state;
		self.emit("open", null, db);
		//console.log(db.state);
		//console.log("Open");
		//self.db.setProfilingLevel(2);
	});
	this.collection = collection;
	
};

util.inherits(Provider, EventEmitter);

Provider.prototype.getState = function () {
	return state;
}


Provider.prototype.getCollection= function(callback) {
  this.client.collection(this.collection, function(error, collection) {
    if( error ) callback(error);
    else callback(null, collection);
  });
};

Provider.prototype.findAll = function(order, callback) {
	if(typeof order == "function") {
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
          if( error ) callback(error);
          else callback(null, result);
        });
      }
    });
};

Provider.prototype.findWithOptions = function(document, options, callback) {
	//console.log(document);
	if(typeof options == "function") {
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
	if(typeof order == "function") {
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
		var self = this;
		self.client.close(function (err, db) {
			if (err) callback(err, null);
			//console.log("Connection Closed");
			//console.dir();
			state = self.client.state;
			callback(null, db);
			//return;
		});		

};



exports.MongoProvider = Provider;