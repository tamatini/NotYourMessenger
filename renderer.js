const customTitlebar = require("custom-electron-titlebar");

new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#2b2e3b'),
    shadow: true
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  } 
  
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})