$(document).ready(function() {
// load config file
var settings={}
    $.get("/assets/config.json", function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);

        if(status=="success"){
            settings =(data)
            console.log("Settings: " + settings.numberOfLevels )
            //show enabled menu


        }
        else{
            console.log("Error: loading Config File" + status)
        }
    });
});