(function() {
  var speedReaderGo = false;
  var words = document.body.innerText.split(/\s+/);
  var wordCount = words.length;
  var doneWords = []
  const styles = [
    "position: fixed",
    "right: 0; top: 0; z-index: 9999",
    "text-align: center",
    "padding: 5px; min-width: 15em;",
    "background-color: white; border: 2px solid black; border-radius: 5px;"
  ];

  const textStyles = [
    "font-size: 1.5em",
    "font-family: monospace",
    "display: inline-block",
    "color: black",
    "padding: 0 2px;"
  ];

  const linkStyles = textStyles.concat([
    "padding: 0 10px;"
  ])
  function speedReaderToggle(e) {
    e.preventDefault();
    speedReaderGo = !speedReaderGo;
  }
  function speedReaderBack(e) {
    e.preventDefault();
    // take 1/10th of end of doneWords and put them at the start of words
    var newWords = doneWords.splice(Math.floor(doneWords.length / 10), doneWords.length);
    words = newWords.concat(words);
  }
  function speedReaderForward(e) {
    e.preventDefault();
    // take 1/10th of start of words and put them at the end of doneWords
    var newDoneWords = words.splice(0, Math.floor(words.length / 10));
    doneWords = newDoneWords.concat(doneWords);
  }

  document.body.innerHTML += "<div id='speedreader_9999_div' style='" + styles.join(";") + "'>" +
      "<p id='speedreader_9999_p' style='" + textStyles.join(";") + "'>" + words.length + " words</p>" +
      "<div>" +
        "<span id='speedreader_9999_before'></span>" +
        "<a href='#' id='speedreader_9999_back' style='" + linkStyles.join(";") + ";'>&#x21BA;</a>" +
        "<a href='#' id='speedreader_9999_toggle' style='" + linkStyles.join(";") + ";'>&#9658;</a>" +
        "<a href='#' id='speedreader_9999_forward' style='" + linkStyles.join(";") + ";transform-origin: 50% 50%;transform: rotateY(180deg);'>&#x21BA;</a>" +
        "<span id='speedreader_9999_after'></span>" +
        "</div>" +
    "</div>";

  document.getElementById("speedreader_9999_toggle").addEventListener("click", speedReaderToggle);
  document.getElementById("speedreader_9999_back").addEventListener("click", speedReaderBack);
  document.getElementById("speedreader_9999_forward").addEventListener("click", speedReaderForward);
  setInterval(function() {
    if(speedReaderGo) {
      var word = words.shift()
      doneWords.push(word);
      document.getElementById("speedreader_9999_p").innerText = word;
    }
  }, 150)
})()
