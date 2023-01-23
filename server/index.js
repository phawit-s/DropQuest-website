const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');
const ssh = require('ssh2').Client;
app.use(cors());
const conn = new ssh();
conn.on('ready', function() {
    conn.forwardOut(
        '127.0.0.1',
        12345,
        '127.0.0.1',
        3306,
        function(err, stream) {
            if (err) throw err;
            const db = mysql.createConnection({
                user: "phawit2",
                password: "root",
                database: "dropquest",
                stream: stream
            });

            // set up your routes and middlewares here
            app.get('/users', function(req, res) {
                db.query("SELECT * FROM users;",(err, result)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send(result);
                    }
                })
            });

            // start the server
            const port = 3001;
            app.listen(port, function() {
                console.log(`Server listening on port ${port}`);
            });
        }
    );
}).connect({
    host: '161.246.49.33',
    port: 22,
    username: 'myadmin',
    password: '@egT!cRs0026'
});