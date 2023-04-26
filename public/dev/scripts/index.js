function copy(e) {
  let shortLink = e.innerText;
  if (e.innerText.length <= 12) shortLink = 'https://' + e.innerText;
  navigator.clipboard.writeText(shortLink);
  const $copy = document.getElementById('copy');
  $copy.style.filter = 'invert(100%)';
  const $clone = $copy.cloneNode(true);
  $copy.parentNode.replaceChild($clone, $copy);
  $clone.classList.add('a');
}

function getRandomNumber(limit) {
  return Math.floor(Math.random() * limit);
}

function getRandomColor() {
  const h = getRandomNumber(360);
  const s = getRandomNumber(100);
  const l = getRandomNumber(100);
  return 'hsl(' + h + 'deg,' + s + '%,' + l + '%)';
}

function setBackgroundColor() {
  const $randomColor = getRandomColor();
  const $copyText = document.getElementById('copy');
  const $background = document.getElementById('background');
  const $svgs = document.getElementsByClassName('svg');
  $background.style.backgroundColor = $randomColor;
  $background.style.color = $randomColor;
  $copyText.style.color = $randomColor;
  for (i = 0; i < $svgs.length; i++) {
    $svgs[i].style.fill = $randomColor;
  }
}

function transferToGithub() {
  window.location.href = 'https://github.com/q0r3y/ShrinkNinja';
}

async function requestCode() {
  const $linkText = document.getElementById('link');
  const $copyText = document.getElementById('copy');
  const $instText = document.getElementById('instructions');
  let inputData = window.location.href.slice(window.location.origin.length + 1);

  const checkForProtocol = function (str) {
    const hasProtocol = str.match(/^[A-Za-z]+:\/\//);
    if (hasProtocol) {
      return str;
    } else {
      return 'https://' + str;
    }
  };

  if (inputData) {
    inputData = checkForProtocol(inputData);
    const longUrlJson = JSON.stringify({ longUrl: inputData });
    const newShortLink = await fetch('/api', {
      method: 'POST',
      body: longUrlJson,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    newShortLink.json().then((data) => {
      if (!data.errors) {
        $instText.style.display = 'none';
        $copyText.style.display = 'block';
        $linkText.innerText = data.longUrl || data.shortUrl;
        $linkText.style.display = 'block';
      } else {
        $instText.style.display = 'block';
      }
    });
  } else {
    $instText.style.display = 'block';
  }
}
