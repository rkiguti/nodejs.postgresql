var pg = require("pg")
var express = require("express")
var bodyparser = require("body-parser")
var app = express()

app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  		next();
	});

var data;

var writeResults = function(req,res){
	console.log("Write Results");
	res.writeHead(200, {'Content-Type': 'text/plain',
						'Access-Control-Allow-Origin' : '*',
						'Access-Control-Allow-Headers': 'X-Requested-With, accept, content-type',
						'Access-Control-Allow-Methods': 'GET'});
	res.write(data);
	res.end();
};

var getRecords = function(req,res,callback){
	console.log("Get Records");
	var conString = "pg://postgres:postgres@localhost:5432/teste";
	var client = new pg.Client(conString);
	client.connect();

	var query = client.query('select id, nome from cliente');
		query.on("row", function (row, result) {
			result.addRow(row);
	});
	query.on("end", function (result) {
			client.end();
			data = JSON.stringify(result.rows, null, "    ");
			//console.log(data);
			callback(req,res);
	});
};

app.get('/',function(req,res){
	getRecords(req,res,writeResults);
})

var server = app.listen(5433,function(){
	var host = "localhost"
	var port = "5433"
});