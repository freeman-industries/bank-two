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
  a.innerHTML = (data.title !== "") ? data.title : data.url;

  console.log(data);

  tile.appendChild(a);

  var domain = document.createElement("a")
  domain.href = data.url;

  var hostname = domain.hostname;
  hostname = hostname.replace("www.", "");

  var span = document.createElement("span");
  span.className = "domain";
  span.innerHTML = hostname;

  tile.appendChild(span);

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

  alert.innerHTML = message + " <br><a href='https://twitter.com/intent/tweet?in_reply_to=665125802141483008' target='_blank'>Send feedback</a>";
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


var overlay = document.querySelector(".overlay");
var post_open_button = document.querySelector(".new-link");
var post_form = document.querySelector(".central .new-form");

document.querySelector(".new-link").addEventListener("click", function(){
  if(post_form.style.display == "block"){
    post_form.style.display = "none";
    overlay.style.display = "none";

    post_open_button.classList.remove("open");
  } else {
    post_form.style.display = "block";
    overlay.style.display = "block";

    post_form.querySelector("input").focus();

    post_open_button.classList.add("open");
  }
});

post_form.addEventListener("submit", function(e){
  e.preventDefault();

  var title = post_form.querySelector("[name=title]");
  var url = post_form.querySelector("[name=url]");

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

    post_form.style.display = "none";
    overlay.style.display = "none";

  };

  xhr.send( "title=" + encodeURIComponent(title.value) + "&link=" + encodeURIComponent(url.value) + "&user=" + encodeURIComponent(window.location.pathname.replace("/user/", "")) );



});