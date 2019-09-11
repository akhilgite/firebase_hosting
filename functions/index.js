const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const firebase = require('firebase');
const bodyParser = require('body-parser');

const app = express();
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine', 'hbs');

const firebaseConfig = {
    apiKey: "AIzaSyDSysyBTvWnfugAovLLeoVMd32AvCu0gs0",
    authDomain: "mayur-mogre.firebaseapp.com",
    databaseURL: "https://mayur-mogre.firebaseio.com",
    projectId: "mayur-mogre",
    storageBucket: "mayur-mogre.appspot.com",
    messagingSenderId: "586553524758",
    appId: "1:586553524758:web:d130350e1061212a"
};

app.use(bodyParser());
firebase.initializeApp(firebaseConfig);

app.get('/',(request, response)=>{
    response.send("Welcome");
});

app.get('/login',(request, response)=>{
    response.render('login');
});

app.post('/home',function (request, response){
    var email = request.body.email;
    var password = request.body.password;

    console.log("Email: "+email);
    console.log("Password: "+password);

    /*if(!email || !password){
        return console.log("email and password is required");
    }
    firebase.auth().signInWithEmailAndPassword(email,password).then(function(){
        response.sendFile(__dirname+"/home.html");
    }).catch(function(error){
            if(error){
                var errorCode = error.errorCode;
                var errorMessage = error.errorMessage;
                console.log("sign in error: ",error);
                response.send("Sign in error, try again");    
            }   
    });*/

    var userReference = firebase.database().ref("admin");

	//Attach an asynchronous callback to read the data
	userReference.once("value", 
			  function(snapshot) {
                   var user = snapshot.val();
                    if(user.username==email && user.password==password){

                        /*var starCountRef = firebase.database().ref('data/' + 'youtube');
                        starCountRef.once('value',function(snap) {
                            snap.forEach(function(item) {
                                var itemVal = item.val();
                                console.log(itemVal.link);
                            });
                        });*/

                        getLinks().then(links=>{
                            var temp = new Array();
                            links.forEach(function(item){
                                temp.push(item.link);
                            });

                            response.render('home',{temp});
                        });

                        //response.render('home');
                    }else{
                        response.send("Sign in error")
                    }
					
					//userReference.off("value");
			    }, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					response.send("The read failed: " + errorObject.code);
			    });
});

app.get('/submit',function (request, response){
    var link = request.query.link;
    console.log("Link: "+link);
    response.send("Data Submitted")
    firebase.database().ref('/data').child("youtube").push({link: link});
});

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

function getLinks(){
    var starCountRef = firebase.database().ref('data/' + 'youtube');
    var arr1 = new Array();
                        starCountRef.once('value',function(snap) {
                            snap.forEach(function(item) {
                                var itemVal = item.val();
                                arr1.push(itemVal.link);
                                //console.log(itemVal.link);
                            });
                        });
                        return starCountRef.once('value').then(snapshot=> snapshot.val());
}

exports.app = functions.https.onRequest(app);
