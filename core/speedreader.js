window.speedReaderGo = false;
(function() {
  var words = document.body.innerText.split(/\s+/);
  var wordCount = words.length;
  var doneWords = []
  var currentWordTime = 1000;
  var lastWordTimestamp = new Date().getTime();
  var baseSpeed = 120; // 6-char word time. Larger is slower.

  function chooseBestWidth(arr) {
    return Math.max(...arr.map((x) => x.length))
  }

  const styles = [
    "all: unset",
    "position: fixed",
    "right: 0; top: 0; z-index: 9999",
    "text-align: center",
    "padding: 5px;",
    "background-color: white; border: 2px solid black; border-radius: 5px;",
    "min-width: " + (chooseBestWidth(words) * 2.5) + "em",
    "opacity: 0.8"
  ];

  const textStyles = [
    "all: unset",
    "display: inline-block",
    "padding: 0 2px;",
    "text-decoration: none"
  ]

  const infoStyles = textStyles.concat([
    "font-size: 1.5em",
    "font-family: sans-serif",
    "color: #666",
  ]);

  const monoStyles = textStyles.concat([
    "font-size: 2.5em",
    "font-family: monospace",
    "color: black",
    "padding: 0.5em 0",
    "min-height: 1.5em"
  ]);

  const linkStyles = infoStyles.concat([
    "padding: 0 10px;",
    "color: black",
    "cursor: pointer!important; cursor: hand!important"
  ])

  function speedReaderToggle(e) {
    e.preventDefault();
    window.speedReaderGo = !window.speedReaderGo;
    updateTimings();
    updateStats();
    run();
  }

// done = [what, is, this, life, so, full, of, cares]  words =[ we, have, no, time, to, stop, and, stare]
// forward -> words[0..1]


  function speedReaderBack(e) {
    e.preventDefault();
    // take 1/10th of end of doneWords and put them at the start of words
    start_index = Math.max(0, doneWords.length - Math.floor(wordCount / 10));
    var newWords = doneWords.splice(start_index, doneWords.length);
    words = newWords.concat(words);
    updateTimings();
    updateStats();
  }

  function speedReaderForward(e) {
    e.preventDefault();
    // take 1/10th of start of words and put them at the end of doneWords
    var newDoneWords = words.splice(0, Math.min(Math.floor(wordCount / 10), words.length - 1));
    doneWords = doneWords.concat(newDoneWords);
    updateTimings();
    updateStats();
  }

  function speedReaderFaster(e) {
    e.preventDefault();
    baseSpeed -= 20;
    currentWordTime = baseSpeed * 3;
    updateTimings();
  }
  function speedReaderSlower(e) {
    e.preventDefault();
    baseSpeed += 20;
    currentWordTime = baseSpeed * 3;
    updateTimings();
  }

  document.body.innerHTML += "<div id='speedreader_9999_div' style='" + styles.join(";") + "'>" +
      "<div>" +
        "<span id='speedreader_9999_time_taken' style='" + infoStyles.join(";") + "'></span>" +
        "<a href='#' id='speedreader_9999_slower' style='" + linkStyles.join(";") + ";'>&#9194;</a>" +
        "<span id='speedreader_9999_speed' style='" + infoStyles.join(";") + "'></span>" +
        "<a href='#' id='speedreader_9999_faster' style='" + linkStyles.join(";") + ";'>&#9193;</a>" +
        "<span id='speedreader_9999_time_needed' style='" + infoStyles.join(";") + "'></span>" +
      "</div>" +
      "<p id='speedreader_9999_p' style='" + monoStyles.join(";") + "'>" + words.length + " words</p>" +
      "<div>" +
        "<span id='speedreader_9999_before' style='" + infoStyles.join(";") + "'></span>" +
        "<a href='#' id='speedreader_9999_back' style='" + linkStyles.join(";") + ";'>&#x21BA;</a>" +
        "<a href='#' id='speedreader_9999_toggle' style='" + linkStyles.join(";") + ";'>&#9658;</a>" +
        "<a href='#' id='speedreader_9999_forward' style='" + linkStyles.join(";") + ";transform-origin: 50% 50%;transform: rotateY(180deg);'>&#x21BA;</a>" +
        "<span id='speedreader_9999_after' style='" + infoStyles.join(";") + "'></span>" +
        "</div>" +
    "</div>";

  document.getElementById("speedreader_9999_toggle").addEventListener("click", speedReaderToggle);
  document.getElementById("speedreader_9999_back").addEventListener("click", speedReaderBack);
  document.getElementById("speedreader_9999_forward").addEventListener("click", speedReaderForward);
  document.getElementById("speedreader_9999_slower").addEventListener("click", speedReaderSlower);
  document.getElementById("speedreader_9999_faster").addEventListener("click", speedReaderFaster);

  function wordTime(word) {
    return word.length <= 6 ? baseSpeed : word.length * baseSpeed / 6;
  }

  function calcTime(arr) {
    var sum = 0;
    for(var i = 0; i < arr.length; i++) {
      sum += wordTime(arr[i]);
    }
    sum /= 1000;
    if(sum < 60) {
      return Math.floor(sum) + "s"
    } else {
      return Math.floor(sum / 60) + "m " + Math.floor(sum % 60) + "s"
    }
  }

  function updateTimings() {
    document.getElementById("speedreader_9999_speed").innerText = Math.round(10 * 1000 / baseSpeed) / 10 + " w/s";
    document.getElementById("speedreader_9999_time_taken").innerText = calcTime(doneWords);
    document.getElementById("speedreader_9999_time_needed").innerText = calcTime(words);
  }

  function updateStats() {
    document.getElementById("speedreader_9999_before").innerText = doneWords.length;
    document.getElementById("speedreader_9999_after").innerText = words.length;
  }

  function run() {
    requestAnimationFrame(function() {
      if(window.speedReaderGo) {
        if(new Date().getTime() - lastWordTimestamp > currentWordTime) {
          lastWordTimestamp = new Date().getTime();
          var word = words.shift()
          if(typeof word == "undefined") {
            window.speedReaderGo = false;
            document.getElementById("speedreader_9999_p").innerText = "[end]";
            return
          }
          doneWords.push(word);
          document.getElementById("speedreader_9999_p").innerText = word;
          updateStats();
          if(word.length > 8 || doneWords.length % Math.floor(wordCount / 10) == 0) {
            // Pricey op - so only do it infrequently or when we're allowing a bigger gap anyway
            updateTimings()
          }
          currentWordTime = wordTime(word);
        }
        requestAnimationFrame(arguments.callee);
      }
    })
  }
})()
