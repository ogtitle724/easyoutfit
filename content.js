let rafID = null;
let overlay = null;
let isActive = false;
const mouse = { x: null, y: null };
const interactiveElements = document.querySelectorAll(
  "a, button, input, textarea, select, div, svg"
);

document.addEventListener("mousemove", followMouse);
document.addEventListener("click", handleClick);
document.addEventListener("keydown", handleKeydown);

function followMouse(event) {
  if (rafID) cancelAnimationFrame(rafID);

  rafID = requestAnimationFrame(() => {
    if (isActive) {
      overlay.style.left = `${event.clientX}px`;
      overlay.style.top = `${event.clientY}px`;
    } else {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }
  });
}

function handleClick(event) {
  event.preventDefault();

  if (event.button === 0) {
    // Save the extracted pattern or color.
    // Open window for combine clothes
  }
}

function handleKeydown(event) {
  //InActive
  if (event.key === "Escape" || event.keyCode === 27) {
    if (overlay) overlay.remove();

    overlay = null;
    isActive = false;
    document.body.style.cursor = "auto";
    interactiveElements.forEach((element) => {
      element.style.cursor = "auto";
    });
  }

  //Active
  if (event.ctrlKey && (event.key === "q" || event.code === "KeyQ")) {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.style.cssText = `
        width: 50px;
        height: 50px;
        display: flex;
        position: fixed;
        top: ${mouse.y}px;
        left: ${mouse.x}px;
        justify-content: center;
        align-items: center;
        border-radius: 30% 100% 100% 100%;
        background: black;
        box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
        z-index: 10000;
        pointer-events: none;
      `;

      const display = document.createElement("div");
      display.style.cssText = `
        width: 36px;
        height: 36px;
        border-radius: 100%;
        background: white;
        background-size: cover;
      `;

      overlay.appendChild(display);
      document.body.appendChild(overlay);
    }

    //hide cursor => If I overlay it with canvas, is this even necessary?
    document.body.style.cssText += "cursor: none !important;";

    interactiveElements.forEach((element) => {
      element.style.cssText += `
      cursor: none !important;
      `;
    });

    isActive = true;
  }
}
