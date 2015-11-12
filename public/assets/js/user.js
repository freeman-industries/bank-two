//user page init
var init = function(){

  var username = window.location.pathname.replace("/user/", "");

  var user_xhr = new XMLHttpRequest();
  user_xhr.addEventListener('load', function(){
    if(this.responseText){
      var data = JSON.parse(this.responseText);

      _bank.renderUserProfile(data);
    }
  });

  var links_xhr = new XMLHttpRequest();
  links_xhr.addEventListener('load', function(){
    if(this.responseText){
      window._links = [];

      var rows = JSON.parse(this.responseText);

      rows.forEach(function(row){
        window._links.push(row);
      });

      _bank.renderLinks();
    }
  });
  
  user_xhr.open("get", "/user?user=" + username, true);
  user_xhr.send();

  links_xhr.open("get", "/links?user=" + username, true);
  links_xhr.send();

};

init();
