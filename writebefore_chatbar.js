function onwrite(e){
    let whitespace = e.char.match(/\w /g);
    let valcopy = chatbar.value;
    let a = [];
    if (!whitespace) {
        if (valcopy.includes("[hd]")) {
            if (valcopy.includes("(s)")) {
                a.push(..."@#$%&")
            }
            if (valcopy.includes("(ul)")) {
                a.push(..."ABEMRW")
            }
        }
        if (valcopy.includes("[md]")) {
            if (valcopy.includes("(s)")) {
                a.push(..."!()[]{}<>/\\+=:;")
            }
            if (valcopy.includes("(ul)")) {
                a.push(..."GIKNPRSTUVXZ")
            }
            if (valcopy.includes("(ll)")) {
                a.push(..."ij")
            }
            if (valcopy.includes("(n)")) {
                a.push(..."14")
            }
        }
        if (valcopy.includes("[ld]")) {
            if (valcopy.includes("(s)")) {
                a.push(...".'\",`*-")
            }
        }
        if (valcopy.includes("┼")) {
            a.push(..."┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋")
        }
        if (valcopy.includes("─")) {
            a.push(..."─╾╼━")
        }
    }
    let buffer = '';
    let mode = null;
    let spaces, brightness, mixcol, mixop, brightnessdev;
    for (let ch of valcopy + '¬') {
        if (mode) {
            let newBuffer = buffer + ch;
            if (parseInt(newBuffer, 16) == parseInt(buffer, 16) &&
               'm'.includes(mode)) {
                if (mode == 'm') {
                    mixcol = parseInt(buffer, 16);
                }
            } else if (isNaN(+newBuffer) && !isNaN(+buffer) &&
                '&@M±'.includes(mode)) {
                if (mode == '&') {
                    spaces = +buffer;
                } else if (mode == '@') {
                    brightness = +buffer;
                } else if (mode == '±') {
                    brightnessdev = +buffer;
                } else if (mode == 'M') {
                    mixop = +buffer;
                }
            } else { buffer = newBuffer }
        }
        if ('&@mM±'.includes(ch)) { mode = ch; buffer = '' }
    }
    if (a.length && !whitespace) {
        if (!isNaN(spaces) && spaces) {
            a.push(...Array(spaces).fill(' '));
        }
        e.char = a[Math.floor(Math.random()*a.length)]
    }
    if (valcopy.includes('[ov]')) {
        e.char += '\u0305';
    }
    if (!isNaN(brightnessdev)) {
        brightness -= brightnessdev;
        brightness += brightnessdev * 2 * Math.random();
    }
    if (mixcol) {
        if (!valcopy.includes('[C]')) e.color = lerpcol(e.color, mixcol, mixop);
        if (e.bgColor >= 0 && !valcopy.includes('[B]')) e.bgColor = lerpcol(e.bgColor, mixcol, mixop);
    }
    if (!isNaN(brightness)) {
        if (!valcopy.includes('[C]')) e.color = bright(e.color, brightness);
        if (e.bgColor >= 0 && !valcopy.includes('[B]')) e.bgColor = bright(e.bgColor, brightness);
    }
    if (valcopy.includes('[swap]')) {
        [e.color, e.bgColor] = [e.bgColor, e.color];
    }
}
if (!w.events.writebefore || w.events.writebefore && !w.events.writebefore.map(e=>e.toString()).includes("e=>onwrite(e)")) {
    w.on("writebefore", e=>onwrite(e))
}
