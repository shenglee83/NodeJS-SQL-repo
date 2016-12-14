var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var http = require('http').Server(app);

//create connection to database
var connection = mysql.createConnection({
    host: 'localhost', //http://127.0.0.1:8081
    user: 'root',
    password: 'P@ssw0rd',
    database: 'productdb',
    multipleStatements: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//serving static file from directory "node_modules"
app.use(express.static(__dirname + '/node_modules'));


// viewed at http://localhost:8080
app.get('/', function(req, res) {
	console.log('Hello');
    res.sendFile(path.join(__dirname + '/index.html'));
});


//API for calling 'getProductDetail' store procedure
app.get("/product_procedure", function(req, res) {
    var data = {
        "error": 1,
        "product": ""
    };
    connection.query("CALL getProductDetail()", function(err, rows) {
        if (err) {
            throw err;
        } else {
            console.log("Data received from Db:\n");
            data["error"] = 0;
            data["product"] = rows;
            res.json(data);
        }

    });

});

//API for calling 'createReview' store procedure
app.post("/create_review", function(req, res) {
    var userID = req.body.userID;
    var productID = req.body.productID;
    var rating = req.body.rating;
    var comments = req.body.comments;

    var data = {
        "error": 1,
        "product": ""
    };
    console.log(userID);
    connection.query("CALL createReview('" + userID + "', '" + productID + "', '" + rating + "', '" + comments + "');", function(err, rows) {
        if (err) {
            console.log("In error" + userID);
            throw err;
        } else {

            console.log("Data received from Db:\n");
            console.log("UserID: " + userID);
            console.log(rows);
            data["error"] = 0;
            data["product"] = rows;
            res.json(data);
        }

    });

});

app.listen(8081, function(){
	console.log('example app listening to port 8081');
});
