var express = require('express');
var app = express();
var db = require('./db');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// sets port 8080 to default or unless otherwise specified in the environment
app.set('port', process.env.PORT || 8081);
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

app.get('/', function (req, res) {
    res.render('pages/home');
});

app.get('/customer', urlencodedParser, function (req, res, next) {

    res.render('pages/customer');
});

app.post('/auth', urlencodedParser, function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {
        var sql = "SELECT usertype FROM users WHERE email = ?";
        db.query(sql, email, function (err, rows) {

            if (rows.length > 0) {
                var usertype = rows[0].usertype;
                if (usertype === 'admin') {
                    db.query('SELECT * FROM usertype', function (err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render('pages/admin', {
                                title: 'Unsafe foods list',
                                data: rows
                            });
                        }
                    });
                } else {
                    res.render('pages/customer');
                }
            } else {
                res.send('Incorrect email or password');
                res.end();
            }

        });

    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

app.post('/admin', urlencodedParser, function (req, res, next) {
    var sql = "INSERT INTO `users`(`firstname`, `lastname`, `job`, `email`, `contactinfo`, `mailaddr`, `status`, `gender`, `department`, `usertype`) VALUES ('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.job + "','" + req.body.email + "','" + req.body.contactinfo + "','" + req.body.mailaddr + "','" + req.body.status + "','" + req.body.gender + "','" + req.body.department + "','" + req.body.user + "')";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log("data is inserted successfully!");
        }
    });
    res.render('pages/profile');
});

app.listen(app.get('port'), function () {
    console.log("App is listening on port 8081!");
});
