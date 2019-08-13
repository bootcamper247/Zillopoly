
$(document).ready(function () {
    $("input[data-type='number']").keyup(function (event) {
        // skip for arrow keys
        if (event.which >= 37 && event.which <= 40) {
            event.preventDefault();
        }
        var $this = $(this);
        var num = $this.val().replace(/,/gi, "");
        var num2 = num.split(/(?=(?:\d{3})+$)/).join(",");
        
        // the following line has been simplified. Revision history contains original.
        $this.val(num2);
    });
});


var arrZpid = ["55044002","60950466", "14825681",  "14615831","14658221"];

var homesInfo = [];
var resp=0;
var goodProp=0;


var homesInfo = [];
    var homesInfoPromise = [];
    var obj = {};
    var timer = ''
    var imgArr = [];
    // constructing a queryURL variable we will use instead of the literal string inside of the ajax method
    var zwsid = "X1-ZWz181f7ao8w7f_7oq0o";
    var cors = "https://cors-anywhere.herokuapp.com/";
    var houseIndex = 0;
    var winTotal = 0;


$(document).ready(function () {


getProp(0);

    //Write to another array
function getProp(i){

        var imgArr = [];

        var queryURL = cors + "www.zillow.com/webservice/GetUpdatedPropertyDetails.htm?zws-id=" + zwsid + "&zpid=" + arrZpid[i];
        var gotVal = false;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            resp++;

            var jsonResponse = xmlToJson(response);


            // check for 3+ images else move to next property

            if (jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].message.code["#text"] == "0" && jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.images.count["#text"] > 0) {

                var homePrice = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.price["#text"];

                homeBedrooms = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bedrooms["#text"];

                homeBathrooms = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bathrooms["#text"];


                for (j = 0; j < 1; j++) {
                    homeImage = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.images.image.url[j]["#text"];
                    imgArr[j] = homeImage;
                }


                obj = { homePrice: homePrice, images: imgArr, homeBedrooms: homeBedrooms, homeBathrooms: homeBathrooms };
                homesInfo.push(obj);
 
                goodProp++;

            }
            // console.log("Waiting.. Processed  " + resp + " out of " + arrZpid.length);

            //if (resp == arrZpid.length)     //i have last response
            if (goodProp >= 5)     //i have at least 5 properties
            {
                //at this point we have processed all 
                // console.log("Queried properties = "+ arrZpid.length);
                // console.log("Good properties avail="+homesInfo.length);
                // for(x= 0; x <homesInfo.length; x++){
                //     console.log("Good property (" + x + ") "+ homesInfo[x].images[0]);
                // }

                loadProperty();

            }else
            {
                i++;
                getProp(i);
            }
        });
    }



        // Changes XML to JSON
        function xmlToJson(xml) {

            // Create the return object
            var obj = {};

            if (xml.nodeType == 1) { // element
                // do attributes
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                }
            } else if (xml.nodeType == 3) { // text
                obj = xml.nodeValue;
            }

            // do children
            if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof (obj[nodeName]) == "undefined") {
                        obj[nodeName] = xmlToJson(item);
                    } else {
                        if (typeof (obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(xmlToJson(item));
                    }
                }
            }
            return obj;

        };

        //game code

        $(".submit-answer").on("click", function (event) {
            event.preventDefault();
            bid();
            
        });
        

        houseIndex = 0;
        clock = 9999999999999;
        wins = 0;
        losses = 0;



    });
    


    //user must place bid withing certain amt of time
    function countdown() {
        clock--;
        if (clock <= 0) {
            timesUp();
        }
    }

    function loadProperty() {
        // console.log(homesInfo);
        timer = setInterval(countdown, 1000);
        for (var i = 0; i < homesInfo.length; i++) {
            //append pics to image div(Will working on slider)
            //append bed and bath info to respective div
            $("#images").html("<img id='imagefromzillow' src='" + homesInfo[houseIndex].images[0] + "'/>")

            $("#bedandbath").html("<p id='smaller'>Bedrooms: " + homesInfo[houseIndex].homeBedrooms + " | Baths: " + homesInfo[houseIndex].homeBathrooms + "</p >");
            
            $("#win-number").html("<p class='large'>Homes won: <br>" + wins + ")/10</p>");

            $("#guess-price").val('');
        }


    }

    function nextProperty() {
        
        loadProperty();
         $("#progress").html(houseIndex + 1); 
        // console.log("House index: ",houseIndex);
    }

    function timesUp() {
        clearInterval(timer);
        if (houseIndex == 6) {
            setTimeout(results, 0);
        } else {
            setTimeout(nextProperty, 0);
        }
    }
    //show final leaderboard
    //show how many properties won by user
    function results() {
        clearInterval(timer);
        
        $("#score").html("<p>Final Results!</p>");
        $("#score").append("<p>You won a total of " + wins + " homes!</p>");
        reset();

    }
    //take players bid
    function bid() {
        difference()
        minBid = ((homesInfo[houseIndex].homePrice) - 100000)


        maxBid = ((homesInfo[houseIndex].homePrice) + 100000)

        currentBid = $("#guess-price").val().split(",").join("");
        // console.log(currentBid);

        if (currentBid == null || currentBid == 0) {
            confirm("Please enter a valid price.");
        } else if (guessDifference <= 100000) {
            wonBid()
            
        }
        else {
            lostBid()
        }

    }

    function difference() {
        currentBid = $("#guess-price").val().split(",").join("");
        guessDifference = ((homesInfo[houseIndex].homePrice) - currentBid)
        if (guessDifference >= 0) {
            guessDifference = (((homesInfo[houseIndex].homePrice) - currentBid) * 1)
        }
        else {
            guessDifference = (((homesInfo[houseIndex].homePrice) - currentBid) * -1)
        }
    }


    function wonBid() {
        difference()
        clearInterval(timer);
        wins++;
        houseIndex++;
        $("#score").html("<p>Winner! <br> You were only off by $" + guessDifference + " </p>")
        guessDifference = 0;
        $("#guess-price").val("");
        finalSubmit()
        // console.log(houseIndex);

    }


    function finalSubmit() {
        // console.log(wins);
        // console.log(losses);
        var winTotal = wins+losses
        // console.log(winTotal);
        $("#bids").html("Bids won: " + wins + " | " + "Bids Lost: " + losses);
        if (winTotal === 5) {
            winMessage()
        }        
        else {
            nextProperty()
        }
    }


    function lostBid() {
        difference()
        clearInterval(timer);
        losses++;
        houseIndex++;
        var winTotal = wins+losses;
        $("#score").html("<p>Sorry! Try again. <br> Off by $" + guessDifference + "</p>")
        guessDifference = 0;
        $("#guess-price").val("");
        finalSubmit()
        if (winTotal == 5) {
            winMessage()
            $(".imagesbanner").html("MORE INFO ")
            $("#hideAfter").html("<br><br><p>Created by:</p>" + "<ul><li>Anjali Aujla</li><li>Taylor Reese</li><li>Tuere Thomas</li><li>Will Woods</li></ul>" + "<p>Find the code for this project on <a href='https://wwoods1016.github.io/Zillopoly' target:'#'>Github</a>.</p>");
        } else {
            nextProperty()
        }
        
    }

    function reset() {
        houseIndex = 0;
        clock = 0;
        wins = 0;
        losses = 0;

    }

$(document).ready(function () {
    $("#btnLogin").click(function () {
        $("#btnLogin").hide();
        $("#btnLogout").show();
        var initalEntry = document.getElementById("nameInput").value;
        $("#initials").html("<p style='text-transform: uppercase;'>Welcome back, " + initalEntry + ".</p>")
        $(".hideme").html("<br><p >Welcome back,</p><p style='text-transform: uppercase;'>" + initalEntry + "</p>" + "<p>The rules are simple. Place a bid on these homes from Zillow.com. Win the bid if your guess is within $100,000.</p>");
       

        return false;
    });
});

function winMessage(){
    if (wins <= 1) {
        $("#bids").html("Dang... " + wins + " bids won this time. ")
        $("#hideAfter").html("<br><br><p>Created by:</p>" + "<ul><li>Anjali Aujla</li><li>Taylor Reese</li><li>Tuere Thomas</li><li>Will Woods</li></ul>" + "<p>Find the code for this project on <a href='https://wwoods1016.github.io/Zillopoly' target:'#'>Github</a>.</p>");
    } else if (wins >1 && wins <= 4) {
        $("#bids").html("Pretty good! " + wins + " out of 5. ")
        $("#hideAfter").html("<br><br><p>Created by:</p>" + "<ul><li>Anjali Aujla</li><li>Taylor Reese</li><li>Tuere Thomas</li><li>Will Woods</li></ul>" + "<p>Find the code for this project on <a href='https://wwoods1016.github.io/Zillopoly' target:'#'>Github</a>.</p>");
    } else {
        $("#bids").html("Perfect 5 out of 5. ")
        $("#hideAfter").html("<br><br><p>Created by:</p>" + "<ul><li>Anjali Aujla</li><li>Taylor Reese</li><li>Tuere Thomas</li><li>Will Woods</li></ul>" + "<p>Find the code for this project on <a href='https://wwoods1016.github.io/Zillopoly' target:'#'>Github</a>.</p>");

    }
    
}
