
var express = require('express');
var http = require('http');
var path = require('path');
const fs = require('fs');
var app = express();
var bodyParser = require('body-parser');  
app.use(express.static(path.join(__dirname, 'src')));      
app.use(bodyParser.urlencoded({extended : true}));                                                             
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("X-CSE356", "6208440cdd38a66102186ab3");
    next();
});

var port = app.listen(8000);

function makejson(swinner,sgrid){
    var data = {
        'grid' : sgrid,
        'winner' : swinner,
    }
    
    return jsondata;
}



app.get('/ttt', function(req, res) {
    res.sendFile(__dirname + "/src/index.html")
})

app.post('/ttt/', function(req,res){
    let name = req.body.name;
    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth()+1;  // 월
    let date = today.getDate();  // 날짜
    
    // var str = {
    //     'name' : name,
    //     'year' : year,
    //     'month' : month,
    //     'date' : date,
    // };
    // var jsondata = JSON.stringify(str);
    res.send("<html>\n<head><script></script></head><body> Hello " + name + "," + year + "/" + month + "/" + date + "</body></html>");
})

app.post('/ttt/play', function(req,res){
    var arr = req.body.grid;
    var win = req.body.winner;
    const winnings = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    var i;
    var Turn;
    var x = 0;
    var o = 0;
    for(i = 0; i < 9; i++){
        if(arr[i] == 'X'){
            x++;
        }
        else if(arr[i] == 'O'){
            o++;
        }
    }
    if(x==0){
        Turn = 'X';
    }
    else if (x == o){
        Turn = 'X';
    }
    else{
        Turn = 'O';
    }
    while(true){
        if(Turn == 'O'){
            for(i = 0; i < 9; i++){
                if(arr[i] == " "){
                    arr[i] = 'O';
                    break;
                }
            }
        }
        for(i = 0; i < 9; i++){
            var j;
            var count = 0;
            for(j = 0; j < 3; j++){
                if(arr[winnings[j]] == Turn){
                    count++
                }
            }
            if(count == 3){
                win = Turn;

                res.json({
                    grid: arr,
                    winner: win,
                });
                return;
            }
        }
        if(Turn == 'O'){
            res.json({
                grid: arr,
                winner: win,
            });
            return;
        }
        else{
            Turn = 'O';
        }
    }

})

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html")
})


app.listen(port, function() {
    console.log('start! express server');})
