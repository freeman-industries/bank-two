NodeList.prototype.forEach = Array.prototype.forEach;

var _bank = {};

_bank.formatDate = function(date_string){
  return date_string.replace("Mon", "Monday,").replace("Tue", "Tuesday,").replace("Wed", "Wednesday,").replace("Thu", "Thursday,").replace("Fri", "Friday,").replace("Sat", "Saturday,").replace("Sun", "Sunday,").replace("Jan", "January").replace("Feb", "February").replace("Mar", "March").replace("Apr", "April").replace("Jun", "June").replace("Jul", "July").replace("Aug", "August").replace("Sep", "September").replace("Oct", "October").replace("Nov", "November").replace("Dec", "December");
};


_bank.renderUserProfile = function(data){
  var user_profile = document.querySelector(".profile-info");

  user_profile.querySelector(".username").innerHTML = data.user;
  user_profile.querySelector("img").setAttribute("src", data.image);

  var follow_button = user_profile.querySelector("button");

  if(follow_button){
    follow_button.addEventListener("click", function(){
      _bank.alert("We're still working on following users.")
    });
  }

  user_profile.style.visibility = "visible";
}


_bank.makeTile = function(data){
  var tile = document.createElement("li");
  tile.className = "tile";

  var a = document.createElement("a");
  a.href = data.url;
  a.setAttribute("target", "_blank");
  a.innerHTML = data.url;

  tile.appendChild(a);

  if(data.name !== undefined){
    var meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = "<a href='/user/" + data.name + "'><img src='" + data.image + "'>" + data.name + "</a>";

    tile.appendChild(meta);
  }

  return tile;
}


_bank.alert = function(message){
  var alert = document.querySelector(".alert");

  if(alert){
    
  } else {
    var alert = document.createElement("div");
    alert.className = "alert";

    document.body.insertBefore(alert, document.querySelector("header").nextSibling);
  }

  alert.innerHTML = message + " <a href='#'>Send feedback</a>";
}


_bank.renderLinks = function(){
  var links_victim = window._links;
  var links_view = document.querySelector(".links-view");
  var dates = {};

  //wipe the links_view
  links_view.innerHTML = "";

  links_victim.forEach(function(tile){
    var date = new Date(tile.time * 1000);

    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);

    var midnight = date.getTime();

    if(dates[midnight] === undefined){
      dates[midnight] = [];
    }

    dates[midnight].push(tile);
  });

  for(date in dates){
    var section = document.createElement("section");

    var date_title = new Date(parseInt(date));

    section.innerHTML = "<h2>" + _bank.formatDate(date_title.toDateString()) + "</h2>";

    var tiles = document.createElement("div");
    tiles.className = "tiles";

    dates[date].forEach(function(tile){
      tiles.insertBefore(_bank.makeTile(tile), tiles.querySelector(".tile"));
    });

    section.appendChild(tiles);

    links_view.insertBefore(section, links_view.querySelector("section"));
  }

  links_view.style.visibility = "visible";
}

document.querySelector(".new-link").addEventListener("click", function(){
  var prompt = window.prompt("Type or paste your URL here...", "http://");


  var stringStartsWith = function(string, prefix) {
      return string.slice(0, prefix.length) == prefix;
  }


  if( stringStartsWith(prompt, "http://") || stringStartsWith(prompt, "https://") ){

    // now post a new XHR request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/links');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function(e) {

      if(!e.target.responseText){
        console.log("ERRO ERROR ERRORO");
        return;
      }

      var response = JSON.parse(e.target.responseText);

      window._links.push(response);

      _bank.renderLinks();

    };

    xhr.send("link=" + prompt + "&user=" + window.location.pathname.replace("/user/", "") );

  } else {
    _bank.alert("We only support http:// and https:// links for now.");
  }

});