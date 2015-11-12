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
