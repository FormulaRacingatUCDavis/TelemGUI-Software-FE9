

setInterval(function(){
    const http = new XMLHttpRequest();
    // TODO: may want to only form another request if there are no pending requests
    const url = "http://localhost:8000/get_data";
    http.open("GET", url);
    http.send();
    http.onreadystatechange = function(){
        if(http.readyState == XMLHttpRequest.DONE)
        {
            console.log(http.responseText) // TODO: make this read useful stuff
        }
    }
}, 1000)