#!/usr/bin/env node
var express = require('express');
var http = require('http');
var path = require('path');
const fs = require('fs');
var amqp = require('amqplib/callback_api');
var app = express();
var bodyParser = require('body-parser');  
app.use(express.static(path.join(__dirname, 'src')));      
app.use(bodyParser.urlencoded({extended : true}));                                                             
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("X-CSE356", "61fb26da9b7df3308e06dbac");
    next();
});
const exchange = "hw3";
var port = app.listen(80);


app.post('/listen',function(req,res){
    let keys = req.body.keys;
    
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
        throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            
            
            channel.assertExchange(exchange, 'direct', {
                durable: false
            });
            
            channel.assertQueue('',{exclusive: true}, function(error2, q){
                if(error2){
                    throw error2;
                }
                for (const x of keys) {
                    console.log(x);
                    channel.bindQueue(q.queue, exchange, x);
                }
                channel.consume(q.queue, function(msg){
                    var jsonmsg = JSON.parse(msg.content);
                    console.log(jsonmsg);
                    if(!res.headersSent) res.json(jsonmsg);


                });
            });

            
        });
    });
    
});
    


app.post('/speak',function(req,res){
    var key = req.body.key;
    var message = req.body.msg; 
    console.log(key + " " + message);
    var msg = {
        'key' : key,
        'msg' : message,
    }
    var str = JSON.stringify(msg);
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
        throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertExchange(exchange, 'direct', {
                durable: false
            });
            
            channel.publish(exchange,key,Buffer.from(str));
            res.end();
        });
    });
});



app.listen(port, function() {
    console.log('start! express server');
});
