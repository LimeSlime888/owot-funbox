palette = [0x54e58b, 0xbcf1, 0x2a7346];
latestPose = null;
overChars = [];
stickPos = [...convertTileToXY(...cursorCoords.swap(1,2))];
coyote = 2;
climb = 0;
poses = {
    idle: [
        ["o", 0, 0, -2],
        ["|", 0, 0, -1],
        ["/", 1, -1, -1],
        ["\\", 1, 1, -1],
        ["/", 2, -1, 0],
        ["\\", 2, 1, 0]
    ],
    mach0r: [
        ["o", 0, 0, -2],
        ["|", 0, 0, -1],
        ["/", 1, -1, -1],
        ["\\", 1, 1, -1],
        ["-", 2, -1, 0],
        ["\\", 2, 1, 0]
    ],
    mach0l: [
        ["o", 0, 0, -2],
        ["|", 0, 0, -1],
        ["/", 1, -1, -1],
        ["\\", 1, 1, -1],
        ["/", 2, -1, 0],
        ["-", 2, 1, 0]
    ],
    mach1r: [
        ["o", 0, 0, -2],
        ["|", 0, 0, -1],
        ["/", 1, -1, -1],
        ["\\", 1, 1, -1],
        [">", 2, -1, 0],
        ["\\", 2, 1, 0]
    ],
    mach1l: [
        ["o", 0, 0, -2],
        ["|", 0, 0, -1],
        ["/", 1, -1, -1],
        ["\\", 1, 1, -1],
        ["/", 2, -1, 0],
        ["<", 2, 1, 0]
    ],
    mach2r: [
        ["o", 0, 1, -2],
        ["/", 0, 0, -1],
        ["_", 1, -1, -2],
        ["–", 1, 1, -1],
        [">", 2, -1, 0],
        ["\\", 2, 1, 0]
    ],
    mach2l: [
        ["o", 0, -1, -2],
        ["\\", 0, 0, -1],
        ["–", 1, -1, -1],
        ["_", 1, 1, -2],
        ["/", 2, -1, 0],
        ["<", 2, 1, 0]
    ],
    fall: [
        ["o", 0, 0, -2],
        ["|", 0, 0, -1],
        ["\\", 1, -1, -2],
        ["/", 1, 1, -2],
        ["/", 2, -1, 0],
        ["\\", 2, 1, 0]
    ],
    fastfall: [
        ["o", 0, 0, -2],
        ["|", 0, 0, -1],
        ["\\", 1, -1, -2],
        ["/", 1, 1, -2],
        ["<", 2, -1, 0],
        [">", 2, 1, 0]
    ],
	climbl: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["–", 1, -1, -1],
		["\\", 1, -1, -2],
		["/", 2, -1, 0],
		["<", 2, 0, 0]
	],
	climbr: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, 1, -2],
		["–", 1, 1, -1],
		[">", 2, 0, 0],
		["\\", 2, 1, 0]
	]
}
drawStickman = function(x, y, pose){
	x = Math.floor(x); y = Math.floor(y);
    pose = poses[pose];
    if (!pose) return false;
    let overCharsCopy = [...overChars];
	if (overCharsCopy.length) {
        overChars.splice(0).forEach(function(e){
            e[5] ??= {};
    		queueCharToXY(e[2], e[3], e[0], e[1], _, -1, e[4], e[5].bold, e[5].italic, e[5].under, e[5].strike);
        })
    }
    for (let e of pose) {
	    let info = overCharsCopy.findLast(f=>f[0]==x+e[2]&&f[1]==y+e[3]);
	    if (info) { overChars.push(info) } else {
	        info = getCharInfoXY(x+e[2], y+e[3]);
	        overChars.push([x+e[2], y+e[3], info.char, info.color, info.decoration, info.bgColor])
	    }
	    queueCharToXY(e[0], palette[e[1]], x+e[2], y+e[3]);
	}
    flushQueue();
    latestPose = [x, y, pose];
    return true;
}
jumping = 0;
const fl = Math.floor;
getRelativeToStick = function(x, y){
    return getCharInfoXY(fl(stickPos[0]+x), fl(stickPos[1]+y))
}
gRTS = getRelativeToStick;
updatePos = function(direction=0, run=false, actions=[]){
    if(!run||!direction){ranFor = 0}else{ranFor++}
    let xChange = Math.min(Math.max(-1024, direction*(1+!!ranFor+(ranFor>=5))/2), 1024);
	let xChangeAccum = xChange;
	let minu = function(n){
		let pos = n >= 0
		if (pos) { return Math.max(n, 1) }
		else { return Math.min(n, -1) }
	}
	let xStep = function(x){
	    const wallColliders = [
	        gRTS(minu(x)+direction, 0),
	        gRTS(minu(x)+direction, -1),
	        gRTS(minu(x)+direction, -2)
	    ];
	    let canGo = !wallColliders.some(function(e,f){
	        return e.char!=" "
	    });
		return canGo;
	}
	while (xChangeAccum != 0) {
		let currChange = Math.max(Math.ceil(stickPos[0])-1, Math.min(stickPos[0] + xChangeAccum, Math.floor(stickPos[0])+1)) - stickPos[0];
		let canGo = xStep(currChange);
	    if(canGo){stickPos[0]+=currChange;xChangeAccum-=currChange}
		else{break}
	}
	if (xChangeAccum == 0) {
		if (climb) {
			let canGo = false;
			if (!canGo) {
			    const wallColliders = [
			        gRTS(-climb, 0),
			        gRTS(-climb, -1),
			        gRTS(-climb, -2)
			    ];
			    canGo = !wallColliders.some(function(e,f){
			        return e.char!=" "
			    });
			}
			if (canGo) climb = 0;
		}
	}
	else {climb = direction}
	
    let floorColliders;
    if (climb) {
        floorColliders = [gRTS(0, 1), gRTS(climb, 1)]
    } else {
        floorColliders = [
            gRTS(-1, 1), gRTS(0, 1), gRTS(1, 1)
        ]
    }
    let fall = !floorColliders.some(e=>e.char!=" ");
	if (fall && xChange != 0 && xChangeAccum == 0) climb = 0;
    coyote -= fall;
    if (!fall) coyote = 2;
    let poseName = "idle";
    if (actions.includes("jump") && (!fall || (coyote>0 && jumping<=0) || climb)) {
        jumping = 3;
    }
    if (direction) {
	    let dirLet = direction<0?"l":"r";
		poseName = (ranFor?ranFor>=5?"mach2":"mach1":"mach0") + dirLet;
    }
	if (climb) {
	    let climbLet = climb<0?"l":"r";
		poseName = "climb"+climbLet;
	}
    else if (fall && jumping <= 0) {
		if (keyDown) poseName = "fastfall";
        else if (jumping <= -5) poseName = "fall";
        stickPos[1] += 1 + keyDown;
    }
    let ceilColliders;
    if (climb) {
        ceilColliders = [gRTS(0, -3), gRTS(direction, -3)]
    } else {
        ceilColliders = [
            gRTS(-1, -3), gRTS(0, -3), gRTS(1, -3)
        ]
    }
    let ceilClear = !ceilColliders.filter(e=>e.char!=" ").length;
    if (jumping > 0 && !climb) {
        if (ceilClear) {stickPos[1] -= 1}
        else {jumping = 0}
    }
    jumping -= 1;
    if (climb) {
        if (keyUp && ceilClear) {
            stickPos[1] -= 1;
        }
        if (keyDown && fall) {
            stickPos[1] += 1
        }
    }
    return drawStickman(...stickPos, poseName);
}
if(!window.listenersApplied){
    [keyUp, keyLeft, keyRight, keyDown, keyShift] = [!1, !1, !1, !1, !1];
    document.addEventListener("keydown", function(e) {
        let k = e.key.toLowerCase();
        if (["arrowup", "w", " "].includes(k)) {
            keyUp = true;
        }
        if (["arrowdown", "s"].includes(k)) {
            keyDown = true;
        }
        if (["arrowleft", "a"].includes(k)) {
            keyLeft = true;
        }
        if (["arrowright", "d"].includes(k)) {
            keyRight = true;
        }
        if (k == "shift") {
            keyShift = true;
        }
    });
    document.addEventListener("keyup", function(e) {
        let k = e.key.toLowerCase();
        if (["arrowup", "w", " "].includes(k)) {
            keyUp = false;
        }
        if (["arrowdown", "s"].includes(k)) {
            keyDown = false;
        }
        if (["arrowleft", "a"].includes(k)) {
            keyLeft = false;
        }
        if (["arrowright", "d"].includes(k)) {
            keyRight = false;
        }
        if (k == "shift") {
            keyShift = false;
        }
    });
    listenersApplied = true;
}
theCool = function(){
    let actions = [];
    keyUp ? actions.push("jump") : 0;
    updatePos(keyRight-keyLeft, keyShift, actions);
}
stickmanUpdating = false;
clearInterval(window.stickInterval);
stickInterval = -1;
toggleStick = function(state=!stickmanUpdating, interval=100) {
    clearInterval(window.stickInterval);
    stickmanUpdating = state;
    if(!state)return;
    stickInterval = setInterval(_=>theCool(), interval);
}
toggleStick(1)
