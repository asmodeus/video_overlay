    function doReq() { 
        makeRequest('videoCommentCreator.json'); 
    }

    var httpRequest,
    parsed;
    function makeRequest(url) {
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
          httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
          try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
          } 
          catch (e) {
            try {
              httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } 
            catch (e) {}
          }
        }

        if (!httpRequest) {
          alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
          }
          httpRequest.onreadystatechange = function(){
              if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    parsed = JSON.parse(httpRequest.response);
                } else {
                  alert('There was a problem with the request.');
                }
              }              
          };
          httpRequest.open('GET', url);
          httpRequest.send();
    }

    setTimeout(function(){
        doReq();
    },1000);

    setTimeout(function(){
        console.log(parsed);
        parsed.init
    },1500);

