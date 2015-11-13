//user page init
var init = function(){

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

  links_xhr.open("get", "/global");
  links_xhr.send();

};

init();

_bank.alert("Welcome to Bank 2. Posting links from the homepage doesn't work yet. Go to your profile at http://bank-two.elasticbeanstalk.com/user/XXXX to post. If you don't have an account, ask Nabil.")