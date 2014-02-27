window.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('myCanvas');
  if (!canvas) {
    throw 'No <canvas> element found with id "myCanvas"';
  }
  var scriptTags = document.getElementsByTagName('script');
  var paperScriptCodeFound = false;
  for(var i=0; i<scriptTags.length; i++) {
    var script = scriptTags[i];
    if (script.type == 'text/paperscript') {
      paperScriptCodeFound = true;
    }
  }

   if (!paperScriptCodeFound) {
   throw 'No paper script code found. Did you add type="text/paperscript" to your <script> tag?';
  }

  if (typeof(paper) == 'undefined') {
   throw 'No paper.js library found. Have you added proper script tag?';
  }
})

window.onerror = function(error, url, lineNumber) {
  //From http://sketch.paperjs.org/assets/js/editor.js
  var columNumber = 0, match;
  if (match = error.match(/(.*)\s*\((\d*):(\d*)\)/)) { // Acorn
    error = match[1];
    lineNumber = Number(match[2]);
    columNumber = match[3];
  } else if (match = error.match(/(.*)Line (\d*):\s*(.*)/i)) { // Esprima
    error = match[1] + match[3];
    lineNumber = Number(match[2]);
  }

  //Find paper script tag line number + 2 (html line and doctype line)
  var html = document.body.parentNode.innerHTML;
  var lines = html.split('\n');
  lines.forEach(function(line, lineIndex) {
    if (line.indexOf('paperscript') > 0) {
      console.log(error, 'at Line', lineIndex + lineNumber + 2);
    }
  })
};