//Parse data from JSON POST and insert into MYSQL

const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = require('express')();
var http = require('http').Server(app);
app.use(bodyParser.json())

// Set up socket.io instance
var io = require('socket.io')(http);

// Now listen on the connection event for incoming sockets,
io.on('connection', function(socket){
  console.log('a user connected');
});

// Configure MySQL connection
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'test',
	password: 'test',
	database: 'testdatabaseat'
  })

//Establish MySQL connection
connection.connect(function(err) {
	if (err) 
		throw err
	else {
		console.log('Connected to MySQL');
		
       // Start the http when connection is ready
		http.listen(3000, function(){
		  console.log('listening on *:3000');
		});
	}
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/bets', function(req, res){
	//Response your bets
	res.json({ example: Date.now() })
});

app.post('/new/bet', function(req, res) {
	
	let beat = req.body; // Your data
	console.log(beat, 'New bet')
	// Your insert query
	var sql = `INSERT INTO bet (data) VALUES ('${beat.data}')`;
	//Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
	connection.query(sql, [], function(err,result) {
		if(err) {
			res.send('Error');
		}
		else {
			io.sockets.emit('new-bet');
			res.send('Success');
		}
	});
});