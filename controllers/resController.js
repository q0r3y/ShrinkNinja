'use strict';

function resFormat(res, msg, fs) {
  if (!fs) {
    fs = `2em`;
  }
  res.format({
    'text/plain': function () { // For curl usage
      res.send(msg);
    },
    'text/html': function () {
      res.send(`
            <!DOCTYPE html>
            <style>.l:active{transform:translateY(4px);}
            .a{animation:fadeOut ease 2s;animation-fill-mode:forwards;}
            @keyframes fadeOut{0%{opacity:1;}100%{opacity:0;}}</style><script>
            function c(e) {navigator.clipboard.writeText(e.innerText);
            let f=document.getElementById('a');f.style.color='white';
            let n=f.cloneNode(true);f.parentNode.replaceChild(n,f);
            n.classList.add('a');}</script><body style="background:black;margin:0;
            height:100vh;display:flex;align-items:center;justify-content:center;
            flex-direction: column;"><p onclick="c(this)" class="l" 
            style="font-size:${fs};color:white;text-align:center;
            word-break:break-all;max-width:75%;">${msg}</p>
            <p id="a" style="color:black;text-align:center;">Copied</p>
            </body>
        `);
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

module.exports = {resFormat, resError}
