const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use(express.static('website'));

const port = 3000;
const server = app.listen(port, listening);

function listening(){
    console.log('Port ' + port + ' is working!');
};

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", //write your password
  database: "" //write your database name
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/cust', retrieveCust);

function retrieveCust(request, response){
  con.query("SELECT * FROM customers_info", function (err, result, fields) {
    if (err) throw err;
     response.send(result);
  });
};

app.get('/trans', retrieveTrans);

function retrieveTrans(request, response){
  con.query("SELECT * FROM transfers", function (err, result, fields) {
    if (err) throw err;
     response.send(result);
  });
};

app.post('/updateCust', postCust);

function postCust(request, response){
  let sql = "UPDATE customers_info SET current_balance = " + request.body.balance + " WHERE id = " + request.body.id+";";
  con.query(sql, function(err, result, fields){
    if(err) 
    {
      console.log("hey"); throw err};
    response.send(result);
  })
};

app.post('/updateTransfer', postTransfers);

function postTransfers(request, response){
  let sql = `INSERT INTO transfers (id1, id2, transferred_amount, date_of_transfer) VALUES (${request.body.id_1}, ${request.body.id_2}, ${request.body.transferred_amount}, "${request.body.date_of_transfer}" )`
  con.query(sql, function(err, result, fields){
    if(err) 
    {
      console.log("hey"); throw err};
    response.send(result);
  })
};