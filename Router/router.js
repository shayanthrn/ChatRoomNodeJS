const express = require('express');
const router = express.Router();
const url = require('url');
var mysql = require('mysql');

//connect to database server and create data base
router.get("/databaseconfig",function(req,res){
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: ""
        });
        
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected to Database Server");
            con.query("CREATE DATABASE mydb", function (err, result) {
                if (err) {
                    res.write("database already configured!");
                    res.end();
                };
                console.log("Database created");
                var con = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "mydb"
                });
                var sql = "CREATE TABLE chats (content VARCHAR(200), time DATETIME,username VARCHAR(30))";
                con.query(sql, function (err, result) {
                    if (err) {
                        res.write("database already configured!");
                        res.end();
                    };
                    console.log("Table Chats created");
                    res.end();
                });
            });
        });
})

//connect to database server and create data base and table



router.get('/',function(req,res){
    res.render('login.ejs');
    res.end();
})

router.post("/addmassage",function(req,res){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "mydb"
    });
    var sql = "INSERT INTO chats (content, time,username) VALUES ('"+req.body.content+"',NOW(),'"+req.cookies.username+"')";
    con.query(sql, function (err, result) {
        if(err) throw err;
        res.redirect('/chatroom');
    });
})

router.get("/getMassages",function(req,res){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "mydb"
    });
    var sql = "SELECT * FROM chats ORDER BY time ASC";
    con.query(sql, function (err, result) {
        res.json({data:result})
    });
})

router.get("/chatroom",function(req,res){
    res.render('index.ejs');
    res.end();
})

router.post("/login",function(req,res){
    res.cookie('username',req.body.username);
    res.redirect('chatroom');
})

router.get("/exit",function(req,res){
    res.clearCookie('username');
    res.redirect("/")
})

module.exports = router;