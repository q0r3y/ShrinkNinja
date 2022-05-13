'use strict';

function resFormat(res, msg) {
  res.format({
    'text/plain': function () { // For curl usage
      res.send(msg);
    },
    'text/html': function () {
      res.send(buildResponsePage(msg));
    }
  });
}

function resError(err, res) {
  console.log(`[-] Error: `);
  console.log(err);
  res.status(409).json({
    status: 'err',
    error: `Only a ninja can stop a ninja.`
  });
}

function buildResponsePage(msg) {
  return `
    <!DOCTYPE html>
    <head>
    <title>ShrinkNinja</title>
    <meta name="viewport" content="width=device-width">
    </head>
    <style>
      body {
        font-family: monospace;
        margin:0;
        height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction: column;
      }
      #copy {
        color:black;
        text-align:center;
        font-size:2em;
        margin:0 0 0.5em 0;
      }
      #link {
        font-size:3em;
        overflow: scroll;
        overflow-x: hidden;
        overflow-y: auto;
        filter: invert(100%);
        text-align:center;
        word-break:break-all;
        max-width:80%;
        margin: 0.5em;
      }
      .l:active {
        transform:translateY(4px);
      }
      .a {
        animation:fadeOut ease 2s;
        animation-fill-mode:forwards;
      }
      @keyframes fadeOut {
        0% {
          opacity:1;
        }
        100% {
          opacity:0;
        }
      }
      @media only screen and (max-width: 600px) {
        #link {
          font-size: 4em;
        }
      }
    </style>
    <script>
      function copy(e) {
        navigator.clipboard.writeText(e.innerText);
        const $copy=document.getElementById('copy');
        $copy.style.filter='invert(100%)';
        const $clone=$copy.cloneNode(true);
        $copy.parentNode.replaceChild($clone,$copy);
        $clone.classList.add('a');
      }
      
      function getRandomNumber(limit) {
        return Math.floor(Math.random() * limit);
      }
      
      function getRandomColor() {
        const h = getRandomNumber(360);
        const s = getRandomNumber(100);
        const l = getRandomNumber(100);         
        return 'hsl('+h+'deg,'+s+'%,'+l+'%)';
      }
      
      function setBackgroundColor() {
        const background = document.getElementById('background');
        const copyText = document.getElementById('copy');
        const randomColor = getRandomColor();
        background.style.backgroundColor = randomColor;
        background.style.color = randomColor;
        copyText.style.color = randomColor;
      }

    </script>
    <body onload="setBackgroundColor()" id="background">
      <p id="link" onclick="copy(this)" class="l">${msg}</p>
      <p id="copy">Copied</p>
    </body>
  `
}

module.exports = {resFormat, resError}
