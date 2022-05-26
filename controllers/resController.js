'use strict';

function error(res, code, error) {
  res.status(code).json({
    status: 'error',
    error: error || `Only a ninja can stop a ninja.`
  });
}

function sendShortLink() {
  return (req, res) => {
    const short = res.locals['generatedLink']['shortUrl'];
    res.json({'shortUrl' : short});
  }
}

function sendWebPage() {
  return (req, res) => {
    res.send(webpage);
  }
}

const webpage =
  `
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
      svg {
        position: fixed;
        bottom: 1em;
        filter: invert(100%);
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
      @media only screen and (max-width: 1180px) {
       #copy {
         margin:0 0 2.5em 0;
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
        let shortLink = e.innerText;
        if (e.innerText.length <= 12)
            shortLink = 'https://'+e.innerText;
        navigator.clipboard.writeText(shortLink);
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
        const $copyText = document.getElementById('copy');
        const $background = document.getElementById('background');
        const $githubSvg = document.getElementById('githubSvg');
        const $randomColor = getRandomColor();
        $background.style.backgroundColor = $randomColor;
        $background.style.color = $randomColor;
        $copyText.style.color = $randomColor;
        $githubSvg.style.fill = $randomColor;
      }
      
      function transferToGithub() {
        window.location.href = 'https://github.com/q0r3y/ShrinkNinja';
      }
      
      async function requestCode() {
        const $linkText = document.getElementById('link');
        const paramUrl = window.location.href.slice(window.location.origin.length+1);
        if (paramUrl) {
          const longUrlJson = JSON.stringify({ 'paramUrl' : paramUrl });
          const newShortLink = await fetch('/shrink', {
            method: 'POST', body: longUrlJson,
            headers: {'Accept': 'application/json','Content-Type': 'application/json'}
          });
          newShortLink.json().then((data) => {
            $linkText.innerText = data.error || data.shortUrl || data.longUrl;
          });
        } else {
          $linkText.innerText = 'Man… ninjas are kind of cool… I just don’t know any personally.';
        }
      }
      
    </script>
    <body onload="setBackgroundColor(); requestCode();" id="background">
      <p id="link" onclick="copy(this)" class="l"></p>
      <p id="copy">Copied</p>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" onclick="transferToGithub()"
        \t width="2.5em" height="2.5em" viewBox="0 0 578.305 578.305"\t xml:space="preserve" class="l" id="githubSvg">
        <g>\t<g>\t\t<path d="M533.32,160.379c0.532-26.518-5.294-53.33-10.024-79.731c-1.628-9.088-4.927-17.87-8.177-26.487
        \t\t\tc-2.448-6.487-9.676-10.618-16.334-9.198c-4.309,0.918-8.183,1.812-11.94,3.048c-39.327,12.938-75.741,31.86-110.723,53.844
        \t\t\tc-4.7,2.95-11.536,4.015-17.21,3.599c-13.574-0.992-27.001-4.37-40.569-5.013c-33.58-1.591-67.093-0.569-100.368,5.251
        \t\t\tc-4.626,0.808-10.716,0.012-14.559-2.472C165.27,78.537,125.582,57.411,80.937,45.55c-6.702-1.781-13.599-0.838-15.294,1.824
        \t\t\tc-1.035,1.628-1.971,3.317-2.485,5.128c-4.823,16.946-10.539,33.807-13.342,51.114c-3.341,20.655-6.554,41.935-4.969,62.565
        \t\t\tc0.998,12.968-2.583,20.937-9.669,30.037C11.407,226.757,0.703,261.861,0.048,300.35c-0.563,32.919,3.794,65,13.819,96.47
        \t\t\tc15.355,48.219,45.006,84.406,89.652,107.95c36.708,19.357,76.708,26.818,117.639,28.256c36.892,1.292,73.856,0.196,110.79,0.404
        \t\t\tc37.021,0.208,73.532-3.091,108.948-14.633c35.447-11.549,66.121-30.184,89.922-59.486
        \t\t\tc34.376-42.326,45.079-92.186,47.276-144.965c1.684-40.361-6.542-78.329-30.178-111.347
        \t\t\tC538.332,189.603,532.959,178.097,533.32,160.379z M462.047,469.641c-15.876,13.728-35.288,20.227-55.16,24.976
        \t\t\tc-38.99,9.315-78.69,11.635-118.519,9.896c-39.37,1.707-78.287-0.747-116.592-9.762c-28.256-6.646-54.052-17.821-72.032-42.075
        \t\t\tc-28.611-38.599-35.924-112.057,11.353-152.148c12.056-10.221,25.502-16.708,41.39-17.717c17.534-1.12,35.074-3.305,52.595-3.097
        \t\t\tc44.199,0.526,88.378,2.724,132.571,3.054c20.184,0.146,40.509-4.56,60.545-3.348c18.207,1.102,37.351,4.455,53.875,11.781
        \t\t\tc27.546,12.215,42.374,36.983,46.854,65.992C505.597,400.326,496.796,439.586,462.047,469.641z"/>
        \t\t<ellipse cx="390.026" cy="385.552" rx="42.124" ry="56.298"/>
        \t\t<ellipse cx="189.028" cy="385.552" rx="42.13" ry="56.298"/>
        \t</g></g>
      </svg>
    </body>
  `

module.exports = { error, sendWebPage, sendShortLink}
