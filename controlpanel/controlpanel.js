
var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function() {
    var text = reader.result;
    localStorage.setItem('KillerCommentator.config',text)
  };
  reader.readAsText(input.files[0]);
};


