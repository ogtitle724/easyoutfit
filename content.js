let canvas, ctx, cursor, display, imgWidth, imgHeight, rafId;
let size = 30;
const [cursorWidth, cursorHeight] = [80, 80];
const dpr = window.devicePixelRatio;
const mouse = { x: null, y: null };

//set up the event listeners
document.addEventListener("mousemove", handleMousemove);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.isActive && request.dataUrl) createOverlay(request.dataUrl);
  else destroyOverlay();
  sendResponse({ ack: "Got your message" });
});

function createOverlay(dataUrl) {
  cursor = document.createElement("div");
  cursor.style.cssText = `
    width: ${cursorWidth}px;
    height: ${cursorHeight}px;
    display: flex;
    position: fixed;
    top: ${mouse.y ?? 0}px;
    left: ${mouse.x ?? 0}px;
    justify-content: center;
    align-items: center;
    border-radius: 20% 100% 100% 100%;
    border: 1px solid white;
    background: black;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
    z-index: 10000;
    pointer-events: none;
  `;

  display = document.createElement("div");
  display.style.cssText = `
    width: 90%;
    height: 90%;
    border-radius: 100%;
    background: white;
    background-size: cover;
  `;

  cursor.appendChild(display);
  document.body.appendChild(cursor);

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = dataUrl;

  img.onload = () => {
    imgWidth = img.width;
    imgHeight = img.height;

    canvas = document.createElement("canvas");
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "9999";
    canvas.style.cursor = "none";

    ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.scale(dpr, dpr);
    ctx.drawImage(img, 0, 0, imgWidth / dpr, imgHeight / dpr);
    document.body.appendChild(canvas);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", preventScroll, { passive: false });
  };
}

function destroyOverlay() {
  if (cursor) {
    cursor.remove();
    cursor = null;
    display = null;
  }

  if (canvas) {
    canvas.remove();
    canvas = null;
    ctx = null;
  }

  window.removeEventListener("wheel", handleWheel);
  window.removeEventListener("scroll", preventScroll);
}

function preventScroll(event) {
  event.preventDefault();
  event.stopPropagation();
}

function imgData2DataURL(imageData) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

function getSampleImageData(x, y) {
  let startX = Math.floor(x * dpr - size / 2);
  let startY = Math.floor(y * dpr - size / 2);

  if (startX < 0) startX = 0;
  if (startY < 0) startY = 0;
  if (startX + size > imgWidth) startX = imgWidth - size;
  if (startY + size > imgHeight) startY = imgHeight - size;
  return ctx.getImageData(startX, startY, size, size);
}

function handleMousemove(event) {
  if (rafId) cancelAnimationFrame(rafId);

  rafId = requestAnimationFrame(() => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    if (cursor) {
      cursor.style.left = `${mouse.x}px`;
      cursor.style.top = `${mouse.y}px`;

      const sampleData = getSampleImageData(mouse.x, mouse.y);
      display.style.backgroundImage = `url(${imgData2DataURL(sampleData)})`;
    }
  });
}

function handleWheel(event) {
  if (cursor) {
    const { deltaY } = event;

    if (deltaY > 0) size += 2;
    else size -= 2;

    size = Math.max(10, Math.min(cursorWidth, size));

    const sampleData = getSampleImageData(mouse.x, mouse.y);
    display.style.backgroundImage = `url(${imgData2DataURL(sampleData)})`;
  }
}
