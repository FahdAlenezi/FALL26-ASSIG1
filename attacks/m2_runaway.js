// =====================================================================
// MISSION 2 ATTACK: The Runaway Button
// =====================================================================
// Write your attack here, then COPY the whole file and PASTE it into the
// DevTools Console of http://localhost:3000.
//
// Everything is wrapped in (() => { ... })(); on purpose. It is an
// immediately invoked function: it lets you paste the script again after
// a page reload without "Identifier has already been declared" errors.
//
// Author:
// =====================================================================

(() => {
  const zone = document.getElementById("danger-zone");
  const original = document.getElementById("purge-btn");

    const button = original.cloneNode(true);
  original.replaceWith(button);

  button.tabIndex = -1;

  zone.style.position = "relative";
  button.style.position = "absolute";

  let count = 0;

  const counter = document.createElement("p");
  counter.textContent = "Moves: 0";
  zone.appendChild(counter);

  let oldX = button.offsetLeft;
  let oldY = button.offsetTop;

  function moveButton() {
    const maxX = zone.clientWidth - button.offsetWidth;
    const maxY = zone.clientHeight - button.offsetHeight;

    let x;
    let y;

    do {
      x = Math.floor(Math.random() * maxX);
      y = Math.floor(Math.random() * maxY);
    } while (
      Math.abs(x - oldX) < button.offsetWidth &&
      Math.abs(y - oldY) < button.offsetHeight
    );

    button.style.left = x + "px";
    button.style.top = y + "px";

    oldX = x;
    oldY = y;

    count++;
    counter.textContent = "Moves: " + count;

    button.textContent = "Try again";
  }

  button.addEventListener("mouseenter", moveButton);

  console.log("[attack] runaway button installed");
})();
