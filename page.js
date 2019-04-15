canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 600;
context = canvas.getContext("2d");
context.font = "bold 50px sans-serif";
context.textAlign = "center";
context.strokeStyle = "white";

var body = document.getElementsByTagName("body")[0];

var generateButton = document.createElement("input");
generateButton.value = "Generate collage";
generateButton.id = "generate";
generateButton.type = "button";
body.appendChild(generateButton);

var saveButton = document.createElement("input");
saveButton.value = "Save";
saveButton.id = "save";
saveButton.type = "button";
body.appendChild(saveButton);
addGenerateListener();
genCollagePromise();
genQuotePromise();
executed = 1;
function addGenerateListener() {
  $("#generate").one("click", () => {
    collagePromise.then(() => quotePromise.then(() => drawCollage(drawQuote)));
  });
}

$("#save").click(() => {
  var link = document.createElement("a");
  link.download = "collage.png";
  link.href = canvas.toDataURL();
  link.click();
});

function genCollagePromise() {
  collagePromise = new Promise(resolve => {
    genCollage(resolve);
  });
}

function genQuotePromise() {
  quotePromise = new Promise(resolve => {
    genQuote(resolve);
  });
}

function genCollage(resolve) {
  let count = 0;
  let maxx = canvas.width;
  let maxy = canvas.height;
  let pics = [];
  for (let i = 0; i < 4; i++) {
    pics[i] = { img: new Image() };
    pics[i].img.crossOrigin = "anonymous";
  }
  let xline = Math.floor(maxx * (0.3 + 0.4 * Math.random()));
  let yline = Math.floor(maxy * (0.3 + 0.4 * Math.random()));
  pics[0].x = pics[0].y = pics[1].y = pics[2].x = 0;
  pics[0].szx = pics[1].x = pics[2].szx = pics[3].x = xline;
  pics[1].szx = pics[3].szx = maxx - xline;
  pics[0].szy = pics[2].y = pics[1].szy = pics[3].y = yline;
  pics[2].szy = pics[3].szy = maxy - yline;

  let context = canvas.getContext("2d");
  for (i = 0; i < 4; i++) {
    let pic = pics[i];
    pic.img.src =
      "https://source.unsplash.com/random/" +
      pic.szx +
      "x" +
      pic.szy +
      "?sig=" +
      Math.floor(Math.random() * 10000);

    pic.img.onload = () => {
      count++;
      if (count == 4) {
        resolve(pics);
      }
    };
  }
}

function genQuote(resolve) {
  $.getJSON(
    "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?"
  ).done(response => {
    resolve(response);
  });
}

function drawCollage(callback) {
  context = canvas.getContext("2d");
  collagePromise.then(pics => {
    for (i = 0; i < 4; i++) {
      let pic = pics[i];
      context.drawImage(pic.img, pic.x, pic.y);
    }
    genCollagePromise();
    if (callback) {
      callback();
    }
    executed = 1;
  });
}

function drawQuote() {
  let context = canvas.getContext("2d");
  let maxx = canvas.width;
  let maxy = canvas.height;
  let maxLineWidth = maxx * 0.8;
  quotePromise.then(result => {
    quoteText = result.quoteText;
    quoteAuthor = result.quoteAuthor;
    let words = quoteText.split(' ');
    console.log(words);
    let lines = [];
    let line = '';
    for (let i = 0; i < words.length; i++) {
      let newLine = line + words[i];
      let newLineWidth = context.measureText(newLine).width;
      if (newLineWidth > maxLineWidth) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = newLine + ' ';
      }
    }
    lines.push(line);
    console.log(lines);

    for (let i = 0; i < lines.length; i++) {
      let x = Math.floor(maxx / 2);
      let y =
        Math.floor(maxy / 2) +
        Math.floor(50 * lines.length * (i / (lines.length - 1) - 1 / 2));
      if (lines.length == 1) {
        y = Math.floor(maxy / 2);
      }
      console.log(i / (lines.length - 1) - 1 / 2);

      context.lineWidth = 3;
      context.strokeText(lines[i], x, y);
      context.lineWidth = 1;
      context.fillText(lines[i], x, y);
    }
    addGenerateListener();
    genQuotePromise();
  });
}
