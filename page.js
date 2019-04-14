var body = document.getElementsByTagName("body");
canvasElement = document.createElement("canvas");
body.appendChild(canvasElement);

canvasElement.width = 1000;
canvasElement.height = 600;
var generateButton = document.createElement("generate");  
generateButton.innerHTML = "generate collage";
var saveButton = document.createElement("save");
saveButton.innerHTML = "save";   

body.appendChild(generateButton);
body.appendChild(saveButton);


drawCollage(canvasElement, drawQuote);

quotePromise = new Promise((resolve, reject) => {
  $.getJSON(
    "https://api.forismatic.com/api/1.0/?method=getQuote&lang=ru&format=jsonp&jsonp=?"
  )
    .done(response => {
      resolve(response);
    })
    .fail(err => {
      reject(err);
    });
});

async function drawQuote(canvasElement) {
  context = canvasElement.getContext("2d");
  context.font = "bold 50px sans-serif";
  context.textAlign = "center";
  context.strokeStyle = "white";

  let maxx = canvasElement.width;
  let maxy = canvasElement.height;
  context.textAlign = "center";
  let maxLineWidth = maxx * 0.8;
  quotePromise.then(
    result => {
      quoteText = result.quoteText;
      quoteAuthor = result.quoteAuthor;
      let words = quoteText.split(" ");
      console.log(words);
      let lines = [];
      let line = "";
      for (let i = 0; i < words.length; i++) {
        let newLine = line + words[i];
        let newLineWidth = context.measureText(newLine).width;
        if (newLineWidth > maxLineWidth) {
          lines.push(line);
          line = words[i] + " ";
        } else {
          line = newLine + " ";
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
    },
    err => {
      console.log(err);
    }
  );
}

async function drawCollage(canvasElement, callback) {
  let count = 0;
  let maxx = canvasElement.width;
  let maxy = canvasElement.height;
  let pics = [];
  for (let i = 0; i < 4; i++) {
    pics[i] = { img: new Image() };
  }
  let xline = Math.floor(maxx * (0.3 + 0.4 * Math.random()));
  let yline = Math.floor(maxy * (0.3 + 0.4 * Math.random()));
  pics[0].x = pics[0].y = pics[1].y = pics[2].x = 0;
  pics[0].szx = pics[1].x = pics[2].szx = pics[3].x = xline;
  pics[1].szx = pics[3].szx = maxx - xline;
  pics[0].szy = pics[2].y = pics[1].szy = pics[3].y = yline;
  pics[2].szy = pics[3].szy = maxy - yline;

  let context = canvasElement.getContext("2d");
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
      context.drawImage(pic.img, pic.x, pic.y);
      count++;
			if (count == 4) {
				
        callback(canvasElement);
        count = 0;
      }
    };
  }
}

// function wrapText(context, text, x, y, maxWidth, lineHeight) {
//   let words = text.split(" ");
//   let line = "";

//   for (let n = 0; n < words.length; n++) {
//     let testLine = line + words[n] + " ";
//     let testWidth = context.measureText(testLine).width;
//     if (testWidth > maxWidth) {
//       let lineWidth = context.measureText(line).width;
//       let indent = Math.floor((maxWidth - lineWidth) / 2);
//       context.fillText(line, x + indent, y);

//       line = words[n] + " ";
//       y += lineHeight;
//     } else {
//       line = testLine;
//     }
//   }

//   let lineWidth = context.measureText(line).width;
//   let indent = Math.floor((maxWidth - lineWidth) / 2);
//   context.fillText(line, x + indent, y);
// }

// // ctx.font = "30px Arial";
// // ctx.fillStyle = "black";
