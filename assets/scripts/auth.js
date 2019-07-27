// Initialize Firebase
var config = {
    apiKey: "AIzaSyBS6ED3MPTd7vVN5xO-4V8N6Tyee1Zd_p8",
    authDomain: "gtbc-zillopoly.firebaseapp.com",
    databaseURL: "https://gtbc-zillopoly.firebaseio.com",
    projectId: "gtbc-zillopoly",
    storageBucket: "gtbc-zillopoly.appspot.com",
    messagingSenderId: "213038611947"
};
firebase.initializeApp(config);

//firebase init vars
var database = firebase.database();
var auth = firebase.auth();

//firebase user stats and form vars

var userName;
var email;
var password;
var hasSignedUp;
var hasSignedIn;
var userWins;
var userLosses;
var userProperties;


// Form Divs

//  So everyone has this information, this is the setup I have at the moment for linking information from app.js to index.html. Let me know if there are any I'm missing:

//  • Login and Logout form:
//  `<div id="login"></div>`

//  • Leaderboard:
//  `<div id="leaderboard"></div>`

//  • Images of Home:
//  `<div id="images"></div>`

//  • No. of Beds and Baths:
//  `<div id="bedandbath"></div>`

//  • Enter Your Guess form:
//  `<div id="guess"></div>`

//  • Current Score:
//  `<div id="score"></div>`





// New User creation form submit

$("#submitBtn").on("click", function (event) {
    event.preventDefault();

    var userName = $("#userName-input").val().trim();
    var email = $("#userEmail-input").val().trim();
    var password = $("#userPw-input").val().trim();
    var hasSignedUp = true;

    console.log("User = " + userName);
    console.log("Email = " + email);
    console.log("User = " + password);

    database.ref().push({
        newUserCreated: userName,
        email: email,
        hasSignedUp: hasSignedUp

    });

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

});

//sign in to user account

$("#submitSignInBtn").on("click", function (event) {
    event.preventDefault();

    var userName = $("#userName-input").val().trim();
    var email = $("#userEmail-input").val().trim();
    var password = $("#userPw-input").val().trim();
    var hasSignedIn = true;



    console.log("User has Signed In! = " + userName);
    console.log("Email Sign In = " + email);
    console.log("User Password= " + password);


    database.ref("loggedin").push({  //adds logged in users to the logged in firebase folder
        newUserSignIn: userName,
        email: email,
        hasSignedIn: hasSignedIn

    });

});

// allows user to "log in" needs work with some type of modal to validate they have acutally been logged in
$("#userName-input").val("");

firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});
