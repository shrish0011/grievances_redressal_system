require('./models/db');

const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');

const grievanceController = require('./controllers/grievanceController.js');
//const userController = require('./controllers/userController.js');

var app = express();

//app.set('views',path.join(__dirname,'/views/'));
app.use(express.static('views'));
app.set('views',path.join(__dirname+'/views/'));
app.use(bodyparser.urlencoded({
    extended : true
}));
app.use(bodyparser.json());
app.set('view engine', 'ejs');




 


app.listen(3000,() =>{
    console.log('Express server started at port:3000');
})

//app.use('/searchRecord',grievanceController);
//app.use('/addGrievance',grievanceController);
//app.use('/searchGrievance',grievanceController);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/login.html");
});
//app.use('/login',userController);
app.use('/',grievanceController);


