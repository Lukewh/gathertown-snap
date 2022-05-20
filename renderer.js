let sourceId = null;

// override getDisplayMedia
navigator.mediaDevices.getDisplayMedia = async () => {
  // create MediaStream
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sourceId,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720,
      },
    },
  });

  return stream;
};

let screenShareBtn = null;
let virtualShareBtn = null;

const swapBtns = (toVirtual) => {
  if (toVirtual) {
    screenShareBtn.style.display = "none";
    virtualShareBtn.style.display = "flex";
  } else {
    screenShareBtn.style.display = "flex";
    virtualShareBtn.style.display = "none";
  }
};

const getScreenShareBtn = () => {
  console.log("Find screenshare button");
  screenShareBtn = document.querySelector("[aria-label='Screen share']");

  if (!screenShareBtn) {
    setTimeout(getScreenShareBtn, 1000);
  } else {
    // replace the element to remove all other listeners
    virtualShareBtn = screenShareBtn.cloneNode(true);
    screenShareBtn.parentNode.appendChild(virtualShareBtn);
    swapBtns(true);

    virtualShareBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sourceSelector();
    });

    screenShareBtn.addEventListener("click", (e) => {
      swapBtns(true);
    });
  }
};

getScreenShareBtn();

const findTargetByClass = (target, className) => {
  if (target && target.classList && target.classList.contains(className)) {
    return target;
  } else if (target.parentNode) {
    return findTargetByClass(target.parentNode, className);
  }
};

const sourceSelector = async () => {
  const sources = await window.myCustomGetDisplayMedia();
  const selector = buildSourceSelector(sources);
  document.body.appendChild(selector);
  const sourceEls = selector.querySelectorAll(".source");
  for (const sourceEl of sourceEls) {
    sourceEl.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      const target = findTargetByClass(e.target, "source");
      const id = target.id;
      sourceId = id;
      selector.parentNode.removeChild(selector);
      screenShareBtn.click();
      swapBtns(false);
    });
  }
  const closeEl = selector.querySelector(".close");
  closeEl.addEventListener("click", (e) => {
    selector.parentNode.removeChild(selector);
  });
};

const buildSourceSelector = (sources) => {
  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", "snap-source-selector");

  const closeButton = document.createElement("div");
  closeButton.classList.add("close");
  closeButton.innerText = "X";
  wrapper.appendChild(closeButton);

  // Create screen wrapper
  const screens = document.createElement("div");
  screens.classList.add("screens");
  const screensTitle = document.createElement("h4");
  screensTitle.innerText = "Screens";

  // Create window wrapper
  const windows = document.createElement("div");
  windows.classList.add("windows");
  const windowTitle = document.createElement("h4");
  windowTitle.innerText = "Windows";

  wrapper.appendChild(screensTitle);
  wrapper.appendChild(screens);
  wrapper.appendChild(windowTitle);
  wrapper.appendChild(windows);

  // Loop through sources
  const sourceEls = sources.map(createSourceEl);
  for (const source of sourceEls) {
    if (source.type === "screen") {
      screens.appendChild(source.el);
    } else {
      windows.appendChild(source.el);
    }
  }

  return wrapper;
};
const createSourceEl = (source) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("source");
  wrapper.setAttribute("id", source.id);

  const name = document.createElement("p");
  name.classList.add("name");
  name.innerText = source.name;

  const thumbnail = document.createElement("img");
  thumbnail.classList.add("thumbnail");
  thumbnail.setAttribute("src", source.thumbnail_data);

  wrapper.appendChild(thumbnail);
  wrapper.append(name);
  return {
    type: source.id.indexOf("screen") === 0 ? "screen" : "window",
    el: wrapper,
  };
};

const addDevToggle = async () => {
  const devToolsButton = document.createElement("div");
  devToolsButton.setAttribute("id", "snap-dev-tools");
  devToolsButton.innerText = ">_";

  devToolsButton.addEventListener("click", () => {
    window.toggleDevTools();
  });

  document.body.appendChild(devToolsButton);
};

addDevToggle();
