var express = require('express');
var app = express();
var restAPI = module.exports = {};
var Debug = require('./debug');
var FS = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',
	extended: true
}));
var path = require('path');
app.use(express.static(__dirname + '/'));
var mongoFunc = require('./mongoDBFunction');


//REST API
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/dummy.html'));
	// res.send('Hello World');
	Debug.log('from Express');
})

function convertBase64ToBuffer(data, type){ //convert base64 to buffer data for writing image
  var imgg = data.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
  var buffer = new Buffer (imgg, 'base64');
  FS.writeFile('./lib/files/test.' + type, buffer,  
    function() 
    {
      Debug.log('DEBUG WRITE TO FILE- feed:message: Saved to disk image attached by user: ./thumbnail/test.' + type);
    });
}

app.get('/api/image/:_id', function (req, res){
    //var id = red.body._id;
    var id = req.params._id; // grab data from route parameters, not from body
    
    mongoFunc.findImageByImageID(id, function(result){
      if(result == null){
        res.end();
      } else{
        Debug.log(result);
        res.send(result);

        //convertBase64ToBuffer(result.image, result.type);
        //can perform conversion at here
      }
    });

});

app.get('/api/image/findThumbnailImageId/:width/:height/:_id', mongoFunc.findThumbnailImageId);

app.post('/api/image/insert', mongoFunc.insertImageMongoDB);

app.delete('/api/image/delete', mongoFunc.deleteImage);

app.delete('/api/image/delete/:_id', mongoFunc.deleteOneImageByID);

app.listen(3000, function(){
	Debug.log('example app listening to port 3000');
});

/* for testing only 

app.get('/api/test?id', function (req, res){
  var tags = req.body;
  Debug.log(req.body);
  res.send("You entered" + tags);
});

http://res.cloudinary.com/demo/image/upload/w_400,h_400,c_crop,g_face,r_max/w_200/lady.jpg

//'https://res.cloudinary.com/bearbear/image/upload/c_scale,w_128
/v"+result.version+"/"+result.public_id+"."+result.format;'

cloudinary.image("lady.jpg", {transformation: [
  {width: 400, height: 400, gravity: "face", radius: "max", crop: "crop"},
  {width: 200}
  ]})
*/