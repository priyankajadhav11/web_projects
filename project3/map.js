// Put your zillow.com API key here
var zwsid = "X1-ZWz18z6mc21onf_1fz14";

var request = new XMLHttpRequest();
var value,address;
var map,historyAd="";
var markerList = [];
var geocoder , infowindow,marker;
function initialize () {
	geocoder = new google.maps.Geocoder();
	infowindow = new google.maps.InfoWindow;
	marker = new google.maps.Marker({
          map: null
        });
}
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 32.75, lng: -97.13},
          zoom: 17
        });
      
		document.getElementById('clear').addEventListener('click', function() {
          clearAddress(geocoder, map);
        });
		
		google.maps.event.addListener(map, 'click', function(event) {
			clearAddress(geocoder, map);
			geocoder.geocode({
				'latLng': event.latLng
				}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
			address=results[0].formatted_address;
			sendRequest();
			}
			}
				});
	});
      }
	  

function displayResult () {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
		if(value)
		{
          findAddress(geocoder, map, infowindow,value);
		}
		else {
            alert('Price is not available for the house');
          }
    }
}

function sendRequest () {
    request.onreadystatechange = displayResult;
	if(document.getElementById("address").value)
	{
    address = document.getElementById("address").value;
	}
    var splitAddress= address.split(",");
	var street=splitAddress[0];
	var city = splitAddress[1];
    var state = splitAddress[2];
    var sz = state.split(" ");
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+street.trim()+"&citystatezip="+city.trim()+"+"+sz[0].trim()+"+"+sz[1].trim());
    request.withCredentials = "true";
    request.send(null);
}

	  function findAddress(geocoder, resultsMap,infowindow,amount) {
        clearMarker();		
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
             marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
			markerList.push(marker);
			  infowindow.setContent(results[0].formatted_address+", $"+amount);
			  historyAd +=results[0].formatted_address+", $"+amount+"\n";
			  document.getElementById("history").value = historyAd;
              infowindow.open(map, marker);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
	  function clearAddress(geocoder, resultsMap) {
	   document.getElementById("searchAddress").reset();
      }
	  
      function clearMarker() {
        for (var i = 0; i < markerList.length; i++) {
          markerList[i].setMap(null);
        }
		  markerList.length=0
      }