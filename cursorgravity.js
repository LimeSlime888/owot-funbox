// Section: Cursor nametags by fp
let barfocused;
elm.chatbar.onfocus = _ => barfocused = 1;
elm.chatbar.onblur = _ => barfocused = 0;
w.broadcastReceive();
let nametagSenderList = {},
    nametagField = document.createElement("div");
elm.main_view.appendChild(nametagField), w.on("cmd", function(a) {
    let b = a.data,
        c = a.username,
        d = a.sender;
    if (d == w.socketChannel) return;
    if (b = b.split(";"), 3 != b.length) return;
    if ("nametag" != b[0]) return;
    if ("pos" != b[1]) return;
    let e = b[2].split(",");
    if (2 != e.length) return;
    let f = parseInt(e[0]),
        g = parseInt(e[1]);
    if (isNaN(f) || isNaN(g)) return;
    let h, i, j, k = Math.floor(f / 16),
        l = Math.floor(g / 8),
        m = f - 16 * k,
        n = g - 8 * l;
    nametagSenderList[d] ? (h = nametagSenderList[d], i = h.elms.tag, j = h.elms.cur, h.pos.tileX = k, h.pos.tileY = l, h.pos.charX = m, h.pos.charY = n) : (i = document.createElement("span"), j = document.createElement("span"), !c && (c = "Anonymous"), i.innerText = c, i.style.backgroundColor = "rgba(0, 0, 255, 0.1)", i.style.position = "absolute", i.style.fontFamily = "Verdana", i.style.padding = "2px", i.style.color = "#888", i.style.pointerEvents = "none", i.style.fontSize = "0.8em", j.style.width = cellW + "px", j.style.height = cellH + "px", j.style.position = "absolute", j.style.backgroundColor = "rgb(255, 255, 0, 0.9)", h = {
        nick: c,
        color: "#FFFF00",
        pos: {
            tileX: k,
            tileY: l,
            charX: m,
            charY: n
        },
        elms: {
            tag: i,
            cur: j
        },
        tagOffset: [10, 20]
    }, nametagSenderList[d] = h, nametagField.appendChild(i), nametagField.appendChild(j));
    let o = tileAndCharsToWindowCoords(k, l, m, n);
    i.style.top = o[1] + h.tagOffset[1] + "px", i.style.left = o[0] + h.tagOffset[0] + "px", j.style.top = o[1] + "px", j.style.left = o[0] + "px"
}), w.on("tilesrendered", function() {
    for (let a in nametagSenderList) {
        let b = nametagSenderList[a],
            c = b.elms.tag,
            d = b.elms.cur,
            e = tileAndCharsToWindowCoords(b.pos.tileX, b.pos.tileY, b.pos.charX, b.pos.charY);
        c.style.top = e[1] + b.tagOffset[1] + "px", c.style.left = e[0] + b.tagOffset[0] + "px", d.style.top = e[1] + "px", d.style.left = e[0] + "px"
    }
}), w.on("cursormove", function(a) {
    let b = 16 * a.tileX + a.charX,
        c = 8 * a.tileY + a.charY;
    w.broadcastCommand("nametag;pos;" + b + "," + c, !0)
});

// Section: Cursor gravity by e_g.
// smooth camera by * unknown
// modified for no jump delay by lime.owot
// TAS support by lime.owot
keyConfig.cursorUp = "";
keyConfig.cursorDown = "";
keyConfig.cursorLeft = "";
keyConfig.cursorRight = "";
var aa = parseInt(prompt("smoothness"));
var backpressureX = 0;
var backpressureY = 0;
var velocityX = 0;
var velocityY = 0;
var keyLeft = false;
var keyRight = false;
var keyUp = false;
var went = true;
var backrooms = 128;
var rKey = false;
document.addEventListener("keydown", function(e) {
    if (checkKeyPress(e, "R")) {
        rKey = true;
    }
    if (checkKeyPress(e, ["UP", "W"])) {
        keyUp = true;
    }
    if (checkKeyPress(e, ["LEFT", "A"])) {
        keyLeft = true;
    }
    if (checkKeyPress(e, ["RIGHT", "D"])) {
        keyRight = true;
    }
});
document.addEventListener("keyup", function(e) {
    if (checkKeyPress(e, "R")) {
        rKey = false;
    }
    if (checkKeyPress(e, ["UP", "W"])) {
        keyUp = false;
    }
    if (checkKeyPress(e, ["LEFT", "A"])) {
        keyLeft = false;
    }
    if (checkKeyPress(e, ["RIGHT", "D"])) {
        keyRight = false;
    }
});
addEventListener("keypress", function(h) {
    if (h.key == "`") {
        aa = parseInt(prompt("smoothness"))
    }
});

clearInterval(window.gravInterval);
tas = true;
tasTime = 0;
tasData = [
    ...Array(30).fill("d"), "wd", "wa"
];
function resetTAS() {
    backpressureX = 0;
    backpressureY = 0;
    velocityX = 0;
    velocityY = 0;
    tasTime = 0;
}
function tick() {
    if (tas) {
        let inputs = tasData[tasTime] ?? "";
        [rKey, keyUp, keyLeft, keyRight] = [false, false, false, false]
        if (inputs.includes("r") || tasTime == 0) rKey = true;
        if (inputs.includes("a")) keyLeft = true;
        if (inputs.includes("w")) keyUp = true;
        if (inputs.includes("d")) keyRight = true;
        ++tasTime;
    }
    if (getCharBgColor() == 0x00B0B0) localStorage.checkpoint = cursorCoords;
    if (getCharBgColor() == 0xD02000 ||
        rKey && !barfocused ||
        (cursorCoords??[]).join(" ") == "403 3 14 6") {
        w.redraw(cursorCoords = localStorage.checkpoint.split(",").map(eval));
    }
    backpressureY += velocityY + 0.7;
    velocityY /= 1.2;
    backpressureX += velocityX;
    velocityX /= 1.2;
    if (keyLeft && !barfocused) velocityX -= 2;
    if (keyRight && !barfocused) velocityX += 2;
    if (keyUp && !barfocused) {
        moveCursor("down");
        var char = getChar();
        moveCursor("up");
        if (char != " " || getCharBgColor() == 0x105090) {
          	backpressureY -= 1;
            velocityY -= 3 + ((getCharBgColor() == 0x00C000) * 7) +
              ((getCharBgColor() == 0x00FF00) * 9997) -
              ((getCharBgColor() == 0x800000) * 2);
        }
    }
    if (!keyLeft && !keyRight && Math.abs(velocityX) > 0.5) velocityX = 0;
    if (backpressureY >= 1) {
        backpressureY %= 1;
        moveCursor("down");
        if (!["▁"," "].includes(getChar()) && getCharColor() != 0x8000ff) {
            moveCursor("up");
            velocityY = 0;
            if (backrooms < 1 && went) {
                let previous = [...cursorCoords];
                w.doGoToCoord(1, 99);
                cursorCoords = [396, -4, 1, 1];
                w.redraw(alert("What happened?"))
            }
            backrooms = 128
        } else {
            backrooms--
        }
    } else if (backpressureY <= -1) {
        backpressureY %= 1;
        moveCursor("up");
        if (!["▔"," "].includes(getChar()) && getCharColor() != 0xc0ff00) {
            moveCursor("down");
            velocityY = 0;
        }
    }
    if (backpressureX >= 1) {
        backpressureX %= 1;
        moveCursor("right");
        if (!([..."▔▁ "].includes(getChar()) || [0xc0ff00, 0x8000ff].includes(getCharColor()))) {
            velocityX = 0;
            moveCursor("left");
        }
    } else if (backpressureX <= -1) {
        backpressureX %= 1;
        moveCursor("left");
        if (!([..."▔▁ "].includes(getChar()) || [0xc0ff00, 0x8000ff].includes(getCharColor()))) {
            velocityX = 0;
            moveCursor("right");
        }
    }
    if (aa !== 0 && cursorCoords) {
        positionX += (-(cursorCoords[0] + cursorCoords[2] / tileC) * tileW - positionX) / aa;
        positionY += (-(cursorCoords[1] + cursorCoords[3] / tileR) * tileH - positionY) / aa;
        w.render();
    }
}

var tickRate;
function setTickRate(tr) {
    clearInterval(window.gravInterval);
    gravInterval = undefined;
    if(tr===0){return}
    if(Number(tr)===tr && !isNaN(tr)){
        gravInterval = setInterval(_=>tick(), 1000 / tr);
    } else {
        setTickRate(Number(prompt("Ticks per second? (Legit: 30)")));
    }
    tickRate = tr;
    return gravInterval;
}
setTickRate();
