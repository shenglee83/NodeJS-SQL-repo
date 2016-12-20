var mongoDB = require('mongodb');
var mongoClient = mongoDB.MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongoUrl = 'mongodb://192.168.0.252:17017/imageDB'; //url for mongoDB connection
var exports = module.exports = {};
var Debug = require('./debug');
var gm = require('gm').subClass({imageMagick: true});

var dbInstance;
mongoClient.connect(mongoUrl,{
			db:{native_parser: true},
			server:{
				poolSize: 2000,
				auto_reconnect: true,
				reconnectTries: 2000,
				reconnectInterval: 1000,
				socketOptions:{
					noDelay:true,
					keepAlive: 0,
					connectTimeoutMS: 0,
					socketTimeoutMS: 0
				}
			}
		}, function(err, db) {
			if(err){
				Debug.log('mongoDB down');
				//module.exports.mdb = null;
			} else {
				//module.exports.mdb = db;
				Debug.log('connected to Mongodb server');
				dbInstance = db;
				exports.db = db;
			}
			
		});

exports.insertImageMongoDB = function(req, res) {

    function decodeBase64Image(dataString) 
    {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var type = "";

        if (matches.length !== 3) 
        {
            return new Error('Invalid input string');
        }

        var imageTypeRegularExpression = /\/(.*?)$/;

        type = matches[1].match(imageTypeRegularExpression);

        //type will be an array with values below. Exp:
        // [ '/jpg', 'jpg', index: 5, input: 'image/jpg' ]
        // we only want the file type, value in index '1'

        return type[1];
    }

    var imageType = decodeBase64Image(req.body.image);

	var jsonObj = {
		"who": req.body.who,
		"image": req.body.image,
        "type": imageType,
		"time": new Date()
	}

	Debug.log('insert image data to db');
	dbInstance.collection('catchUpImage').insertOne(jsonObj, 
		function(err, result){
		if(err){
			res.send('error: An error has occured');
			throw err;
		} else {
			
			if(result.insertedCount){
				
				res.send(jsonObj); // return back to http request caller
				Debug.log('data inserted');
				//return;
			} else {
				Debug.log('data insert failed');
				res.end();
				return;
			}
		}
	});
}

exports.findImage = function(req, res) {
	Debug.log(req.body);

	var obj = {"_id": new ObjectID(req.body._id)};
    
    dbInstance.collection('catchUpImage').find(obj).toArray(function(err, doc) {
        if (err) {
        	res.send('error: An error has occurred');
        	throw err;
        } else {
        	if(doc){
        		if(doc.length > 0) {
        			Debug.log('Data found');
        			res.send(doc[0]);
        		} else {
        			Debug.log('Data not found');
        			res.end(); //this will return to the http request caller
        			return;
        		}
        	}
        }
    });
}

exports.findThumbnailImageId = function(req, res) {
	Debug.log('Get thumbnail');
	Debug.log(req.params) //test for POSTMAN Client GET Method
	//Debug.log(req.query); 

	var obj = {"_id": new ObjectID(req.params._id)};
	//var obj = {"_id": new ObjectID(req.body._id)};

	dbInstance.collection('catchUpImage').find(obj).toArray(function(err, doc) {
        if (err) {
        	res.send('error: An error has occurred');
        	throw err;
        } else {
        	if(doc){
        		if(doc.length > 0) {
        			Debug.log('Data found');
        			res.send(doc[0].image); //return the base64 image string data
        		} else {
        			Debug.log('Data not found');
        			res.end(); //this will return to the http request caller
        			return;
        		}
        	}
        }
    });
}

// The delete function will trigger only when the user delete their account
exports.deleteImage = function(req, res) {
	//Debug.log('calling delete function');
	//Debug.log(req.body.who);
	var obj = {"who": req.body.who};

	dbInstance.collection('catchUpImage').remove(obj, function(err, result) {
        if (err) {
        	res.send('error: An error has occurred');
        	throw err;
        } else {
        	if(result){
        		//Debug.log(result.result);
        		if(result.result.n > 0) {
        			res.send(result.result);
        			Debug.log('Removed data');
        		} else {
        			Debug.log('No data to be removed');
        			res.end();
        		}
        	} else {
        		Debug.log('No data to be removed');
        		res.end();
        	}
        }
    });
}

//For testing only
//accept 'id' as parameter
exports.findImageByImageID = function(id, callback) {

	var obj = {"_id": new ObjectID(id)};
    var imgInstance = {
        "image": "",
        "type": ""
    };

    dbInstance.collection('catchUpImage').find(obj).toArray(function(err, doc) {
        if (err) {
        	res.send('error: An error has occurred');
        	throw err;
        } else {
        	if(doc){
        		if(doc.length > 0) {
        			Debug.log('Data found');
                    imgInstance.image = doc[0].image;
                    imgInstance.type = doc[0].type;

        			callback(imgInstance); // return image, type
        		} else {
        			Debug.log('Data not found');
        			callback(null); //this will return to the http request caller
        			return;
        		}
        	}
        }
    });
}

//TODO: Modify this function to delete only 1 image by the imageID
exports.deleteOneImageByID = function (req, res){
    var obj = {"_id": new ObjectID(req.body._id)};
    Debug.log(req.body);
    dbInstance.collection('catchUpImage').deleteOne(obj ,function(err, results) {
        if(err)
        {
            res.send('error: An error has occurred');
            throw err;
        }
        else
        {   Debug.log(results.deletedCount);
            if(results.deletedCount){
                res.send(results); //send '1' back to caller indicate success
                Debug.log('Removed data');
            }else{
                Debug.log('No data to be removed');
                res.end();
            }
        }
    });
}