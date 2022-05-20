const { ipcRenderer, contextBridge } = require("electron");
const { readFileSync } = require("fs");
const { join } = require("path");

// inject renderer.js into the web page
window.addEventListener("DOMContentLoaded", () => {
  const rendererScript = document.createElement("script");
  rendererScript.text = readFileSync(join(__dirname, "renderer.js"), "utf8");
  document.body.appendChild(rendererScript);

  // create custom css and append here
  const styles = readFileSync(join(__dirname, "renderer.css"), "utf8");
  document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
});

contextBridge.exposeInMainWorld("myCustomGetDisplayMedia", async () => {
  return await ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES");
});
