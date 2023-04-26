function copyLink() {
  let $shortLink = document.getElementById('link').innerText;
  if ($shortLink.length <= 12) $shortLink = 'https://' + $shortLink;
  navigator.clipboard.writeText($shortLink);
  const $copy = document.getElementById('copy');
  $copy.style.filter = 'invert(100%)';
  const $clone = $copy.cloneNode(true);
  $copy.parentNode.replaceChild($clone, $copy);
  $clone.classList.add('a');
}

function transferToGithub() {
  window.location.href = 'https://github.com/q0r3y/ShrinkNinja';
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

function setColors() {
  const randomColor = getRandomColor();
  window.randomColor = randomColor;

  function setBgColor(color) {
    const $background = document.getElementById('background');
    $background.style.backgroundColor = color;
    $background.style.color = color;
  }

  function setTextColor(color) {
    const $copyText = document.getElementById('copy');
    $copyText.style.color = color;
  }

  function setSvgColor(color) {
    const $svgs = document.getElementsByClassName('svg');
    for (i = 0; i < $svgs.length; i++) {
      $svgs[i].style.fill = color;
    }
  }

  setBgColor(randomColor);
  setTextColor(randomColor);
  setSvgColor(randomColor);
  if (window.qrCode) {
    window.qrCode.set({ foreground: randomColor });
  }
}

async function requestCode() {
  const $linkText = document.getElementById('link');
  const $copyText = document.getElementById('copy');
  const $instText = document.getElementById('instructions');
  const $qrCode = document.getElementById('qrcode');
  let inputData = window.location.href.slice(window.location.origin.length + 1);

  const checkForProtocol = function (str) {
    const hasProtocol = str.match(/^[A-Za-z]+:\/\//);
    if (hasProtocol) {
      return str;
    } else {
      return 'https://' + str;
    }
  };

  const createQrCode = function (website) {
    window.qrCode = new QRious({
      element: document.getElementById('qrcode'),
      backgroundAlpha: 0,
      foreground: window.randomColor,
      size: 300,
      value: 'https://' + website,
    });
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
        createQrCode(data.shortUrl);
        $qrCode.style.display = 'block';
      } else {
        $instText.style.display = 'block';
      }
    });
  } else {
    $instText.style.display = 'block';
  }
}
