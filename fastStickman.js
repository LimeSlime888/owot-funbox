stickmanPalette = [0, 0xff, 0xff0000, 0xff00, 0xffff];
latestPose = null;
overwrittenChars = {};
cleanUpAfterStickman = true;
replaceOverwrittenWithSpace = false;
continuousMode = true;
stickStyle = document.createElement('style');
stickStyle.innerText = `.posebuttons span button { display: inline-flex }
.posebuttons span {
	background: #4447;
	margin: 2px;
	display: -webkit-inline-box;
	padding: 4px;
	border-radius: 4px;
}
#limbselection button {
	display: inline-flex;
	padding: 4px;
	margin: 2px;
	border: 1px solid #7bd;
	background: black;
	font-size: 32px;
	font-family: Consolas, monospace, legacycomputing;
}
#limbselection .selected {
	border: 2px solid #54e58b;
}`;
document.head.append(stickStyle);
poses = {};
poses.default = {
	empty: [],
	idle: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	pointl: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["–", 1, -1, -1],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	pointr: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["–", 1, 1, -1],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	leanl: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["|", 2, 0, 0],
		["\\", 2, 1, 0]
	],
	leanr: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["|", 2, 0, 0]
	],
	raisel: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["\\", 1, -1, -2],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	raise: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["\\", 1, -1, -2],
		["/", 1, 1, -2],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	raiser: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["/", 1, 1, -2],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	shockl: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["<", 1, -1, -2],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	shock: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["<", 1, -1, -2],
		[">", 1, 1, -2],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	shockr: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		[">", 1, 1, -2],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	aakml: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["<", 1, -1, -1],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	aakm: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["<", 1, -1, -1],
		[">", 1, 1, -1],
		["/", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	aakmr: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		[">", 1, 1, -1],
		["/", 2, -1, 0],
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
	mach0r: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["-", 2, -1, 0],
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
	mach1r: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
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
	mach2r: [
		["o", 0, 1, -2],
		["/", 0, 0, -1],
		["_", 1, -1, -2],
		["–", 1, 1, -1],
		[">", 2, -1, 0],
		["\\", 2, 1, 0]
	],
	crawll: [
		[".", 1, -2, 0],
		[".", 1, -1, 0],
		["o", 0, 0, 0],
		["_", 0, 1, 0],
		["_", 0, 2, 0],
		["∠", 2, 3, 0]
	],
	crawlr: [
		[".", 1, 2, 0],
		[".", 1, 1, 0],
		["o", 0, 0, 0],
		["_", 0, -1, 0],
		["_", 0, -2, 0],
		["⦣", 2, -3, 0]
	],
	climbrdy: [
		["o", 0, 0, -1],
		["'", 0, 0, 0],
		[".", 1, -1, -1],
		[".", 1, 1, -1],
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
	climbf: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["\\", 1, -1, -2],
		["/", 1, 1, -2],
		["<", 2, -1, 0],
		[">", 2, 1, 0]
	],
	climbr: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, 1, -2],
		["–", 1, 1, -1],
		[">", 2, 0, 0],
		["\\", 2, 1, 0]
	],
	stretchl: [
		["o", 0, 0, -2],
		["|", 0, -1, -1],
		["\\", 1, 0, -1],
		["\\", 1, -1, -2],
		["|", 2, -1, 0],
		["\\", 2, 0, 0]
	],
	stretchr: [
		["o", 0, 0, -2],
		["|", 0, 1, -1],
		["/", 1, 1, -2],
		["/", 1, 0, -1],
		["/", 2, 0, 0],
		["|", 2, 1, 0]
	],
	sit2l: [
		["o", 0, 0, -1],
		["|", 0, 0, 0],
		["\\", 1, 1, 0],
		["_", 2, -1, 0]
	],
	sit2r: [
		["o", 0, 0, -1],
		["|", 0, 0, 0],
		["/", 1, -1, 0],
		["_", 2, 1, 0]
	],
	sit3l: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["/", 2, -1, 0],
		["/", 2, 0, 0]
	],
	sit3r: [
		["o", 0, 0, -2],
		["|", 0, 0, -1],
		["/", 1, -1, -1],
		["\\", 1, 1, -1],
		["\\", 2, 0, 0],
		["\\", 2, 1, 0]
	]
};
poses.hazmat = {
	empty: [],
	idle: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	pointl: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["–", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	pointr: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["–", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	leanl: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["|", 3, 0, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	leanr: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["|", 3, 0, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	raisel: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["\\", 3, -2, -2, 8],
		["\\", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	raise: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["\\", 3, -2, -2, 8],
		["/", 3, 2, -2, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	raiser: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["/", 3, 2, -2, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	shockl: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["<", 3, -2, -2, 8],
		["\\", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	shock: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["<", 3, -2, -2, 8],
		[">", 3, 2, -2, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	shockr: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		[">", 3, 2, -2, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	aakml: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["<", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	aakm: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["<", 3, -1, -1, 8],
		[">", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	aakmr: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		[">", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	mach0l: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["-", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	mach0r: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["-", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	mach1l: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["<", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	mach1r: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		[">", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	mach2l: [
		["o", 0, -1, -2],
		["l", 3, 0, -1, 8],
		["–", 3, -1, -1, 8],
		["_", 3, 1, -2, 8],
		["/", 3, -1, 0, 8],
		["<", 3, 1, 0, 8],
		["(", 4, -2, -2],
		[")", 4, 0, -2]
	],
	mach2r: [
		["o", 0, 1, -2],
		["l", 3, 0, -1, 8],
		["_", 3, -1, -2, 8],
		["–", 3, 1, -1, 8],
		[">", 3, -1, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, 0, -2],
		[")", 4, 2, -2]
	],
	crawll: [
		[".", 3, -3, 0, 8],
		[".", 3, -2, 0, 8],
		["o", 0, 0, 0],
		["_", 3, 2, 0, 8],
		["∠", 3, 3, 0, 8],
		["(", 4, -1, 0],
		[")", 4, 1, 0]
	],
	crawlr: [
		[".", 3, 3, 0, 8],
		[".", 3, 2, 0, 8],
		["o", 0, 0, 0],
		["_", 3, -2, 0, 8],
		["⦣", 3, -3, 0, 8],
		["(", 4, -1, 0],
		[")", 4, 1, 0]
	],
	climbrdy: [
		["o", 0, 0, -1],
		["'", 3, 0, 0, 8],
		[".", 3, -2, -1, 8],
		[".", 3, 2, -1, 8],
		["<", 3, -1, 0, 8],
		[">", 3, 1, 0, 8],
		["(", 4, -1, -1],
		[")", 4, 1, -1]
	],
	climbl: [
		["o", 0, 1, -2],
		["l", 3, 0, -1, 8],
		["–", 3, -1, -1, 8],
		["\\", 3, -1, -2, 8],
		["/", 3, -1, 0, 8],
		["<", 3, 0, 0, 8],
		["(", 4, 0, -2],
		[")", 4, 2, -2]
	],
	climbf: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["\\", 3, -2, -2, 8],
		["/", 3, 2, -2, 8],
		["<", 3, -1, 0, 8],
		[">", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	climbr: [
		["o", 0, -1, -2],
		["l", 3, 0, -1, 8],
		["/", 3, 1, -2, 8],
		["–", 3, 1, -1, 8],
		[">", 3, 0, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -2, -2],
		[")", 4, 0, -2]
	],
	sit2l: [
		["o", 0, 0, -1],
		["l", 3, 0, 0, 8],
		["\\", 3, 1, 0, 8],
		["_", 3, -1, 0, 8],
		["(", 4, -1, -1],
		[")", 4, 1, -1]
	],
	sit2r: [
		["o", 0, 0, -1],
		["l", 0, 0, 0, 8],
		["/", 1, -1, 0, 8],
		["_", 2, 1, 0, 8],
		["(", 4, -1, -1],
		[")", 4, 1, -1]
	],
	sit3l: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["/", 3, -1, 0, 8],
		["/", 3, 0, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	],
	sit3r: [
		["o", 0, 0, -2],
		["l", 3, 0, -1, 8],
		["/", 3, -1, -1, 8],
		["\\", 3, 1, -1, 8],
		["\\", 3, 0, 0, 8],
		["\\", 3, 1, 0, 8],
		["(", 4, -1, -2],
		[")", 4, 1, -2]
	]
};
poses.squarie = {
	empty: [],
	idle: [
		["[", 2, -1, 0],
		["╍", 0, 0, 0],
		["]", 2, 1, 0]
	],
	shock: [
		["[", 3, -1, 0, 8],
		["╍", 0, 0, 0],
		["]", 3, 1, 0, 8]
	]
};
selectedChar = "default";
drawStickman = function(pose, x, y){
	let cc = convertTileToXY(...(cursorCoords??[]).swap(1, 2));
	x ??= cc[0]; y ??= cc[1];
	x = Math.floor(x);
	y = Math.floor(y);
	if ([x,y].includes(NaN)) return false;
	if (pose.constructor == String) pose = (poses[selectedChar]??{})[pose];
	if (!pose) return false;
	overwrittenChars[selectedChar] ??= [];
	let sloc = overwrittenChars[selectedChar];
	if (sloc&&cleanUpAfterStickman) {
		sloc.forEach(function(e){
			e[4] ??= {};
			if (replaceOverwrittenWithSpace) {
				e[2] = " "; e[4] = {};
			}
			writeCharToXY(e[2], e[3], e[0], e[1], _, e[5]??null,
				e[4].bold, e[4].italic, e[4].under, e[4].strike
			);
		});
	}
	sloc.splice(0);
	pose.forEach(function(e){
		queueCharToXY(e[0], stickmanPalette[e[1]], x+e[2], y+e[3], _, 2,
			{bold: e[4]&8, italic: e[4]&4, under: e[4]&2, strike: e[4]&1});
		let overwrittenChar = getCharInfoXY(x+e[2], y+e[3]);
		sloc.push([
			x+e[2], y+e[3], overwrittenChar.char,
			overwrittenChar.color,
			overwrittenChar.decoration,
			overwrittenChar.bgColor
		])
	})
	flushQueue();
	latestPose = [x, y, pose];
	return true;
}
poseButtonOrder = ["empty,idle", "pointl,pointr,leanl,leanr,sit2l,sit2r,sit3l,sit3r",
				  "raisel,raise,raiser", "shockl,shock,shockr", "climbrdy,climbl,climbr,climbf", "crawll,crawlr,stretchl,stretchr",
				  "aakml,aakm,aakmr", "mach0l,mach0r,mach1l,mach1r,mach2l,mach2r"].map(e=>e.split(","))
makeStickModal = function () {
	var modal = new Modal();
	modal.createForm();
	modal.setFormTitle("");
	modal.inputField.appendChild(poseButtons = document.createElement("div"));
	modal.inputField.style.gridTemplateColumns = "";
	modal.inputField.style.padding = "3px";
	poseButtons.style = `max-width:512px;overflow-y:auto;max-height:384px;line-height:0;`;
	poseButtons.classList.add("posebuttons");
	poseButtonOrder.forEach(function(e){
		let craze = document.createElement("span");
		e.forEach(function(f){
			let cool = document.createElement("button");
			cool.innerText = f;
			cool.addEventListener("click", function(){
				poseInput.value = this.innerText;
				modal.submitForm();
			});
			craze.appendChild(cool);
		})
		poseButtons.appendChild(craze);
	});
	let poseLabel;
	modal.inputField.appendChild(document.createElement("label")).innerText = "Or name a pose:";
	poseInput = modal.inputField.appendChild(document.createElement("input"));
	modal.onSubmit(function() {
		if (cursorCoords) {
			drawStickman(poseInput.value, ...convertTileToXY(...cursorCoords.swap(1,2)));
		}
	});
	modal.setFooterCheckbox("Clean up | ", a=>{cleanUpAfterStickman=a}, true);
	modal.setFooterCheckbox("Destroy", a=>{replaceOverwrittenWithSpace=a}, false);
	return w.ui.stickModal = modal;
}
makeStickModal();
menu.addOption("Place stickman", _=>w.ui.stickModal.open());
poseData = {newPose: function(){
	[...limbSelection.children].forEach(e=>e.remove());
	poseData.limbs.forEach(function(limb, i){
		let b;
		limbSelection.appendChild(b = poseData.genLimbButton(limb, i));
		if (poseData.selectedLimb == i) b.click();
	});
}, genLimbButton: function(limb, i){
	let lamb = document.createElement("button");
	lamb.limb = limb;
	lamb.index = i;
	lamb.innerText = limb[0];
	lamb.style.color = int_to_hexcode(stickmanPalette[limb[1]]);
	lamb.addEventListener("click", function(){
		[...limbSelection.children].forEach(e=>e.classList.remove("selected"));
		lamb.classList.add("selected");
		poseData.selectedLimb = i;
		limbModify.char.value = limb[0];
		limbModify.color.value = limb[1];
		limbModify.offset.value = `${limb[2]},${limb[3]}`;
	});
	return lamb;
},
limbs: [], selectedLimb: -1};
makeStickCustomModal = function () {
	var modal = new Modal();
	modal.createForm();
	modal.setFormTitle("∠–⦣");
	modal.inputField.appendChild(poseCustomButtons = document.createElement("div"));
	modal.inputField.style.gridTemplateColumns = "";
	modal.inputField.style.padding = "3px";
	poseCustomButtons.style = `max-width:512px;overflow-y:auto;max-height:384px;line-height:0;`;
	poseCustomButtons.classList.add("posebuttons");
	[...poseButtonOrder, ["new limb", "remove limb"]].forEach(function(e){
		let craze = document.createElement("span");
		e.forEach(function(f){
			let cool = document.createElement("button");
			cool.innerText = f;
			cool.addEventListener("click",
				(function(){
					let fun;
					if(f == "new limb"){fun = function(){
						let limb = ["$", 0, 0, 0, 0];
						let i = poseData.limbs.push(limb) - 1;
						limbSelection.appendChild(poseData.genLimbButton(limb, i));
					}}else if(f == "remove limb"){fun = function(){
						poseData.limbs.splice(poseData.selectedLimb, 1);
						poseData.newPose();
					}}else{fun = function(){
						if(!poses[selectedChar][this.innerText])return;
						poseData.limbs = poses[selectedChar][this.innerText].map(e=>[...e]);
						poseData.newPose();
					}}
					return fun;
				})());
			craze.appendChild(cool);
		})
		poseCustomButtons.appendChild(craze);
	});
	modal.inputField.appendChild(limbSelection = document.createElement("div"));
	limbSelection.id = "limbselection";
	modal.inputField.appendChild(limbModify = document.createElement("div"));
	limbModify.appendChild(document.createElement("label")).innerText = "Character: ";
	limbModify.appendChild(limbModify.char = document.createElement("input"));
	limbModify.char.addEventListener("input", function(){
		let selectedLimb = poseData.limbs[poseData.selectedLimb];
		if (!selectedLimb) return;
		[...limbSelection.children]
			.find(e=>e.limb==selectedLimb).innerText =
			selectedLimb[0] = this.value;
	})
	limbModify.appendChild(document.createElement("br"));
	limbModify.appendChild(document.createElement("label")).innerText = "Palette colour: ";
	limbModify.appendChild(limbModify.color = document.createElement("input"));
	limbModify.color.type = "number";
	limbModify.color.addEventListener("input", function(){
		let selectedLimb = poseData.limbs[poseData.selectedLimb];
		let color = stickmanPalette[+this.value]??0;
		this.style.background = int_to_hexcode(color)
		this.style.color = isLight([(color>>16)&255, (color>>8)&255, color&255])?"#000":"#fff";
		if (!selectedLimb) return;
		selectedLimb[1] = +this.value;
		[...limbSelection.children].find(e=>e.limb==selectedLimb).style.color = this.style.background;
	})
	limbModify.appendChild(document.createElement("br"));
	limbModify.appendChild(document.createElement("label")).innerText = "Offset: ";
	limbModify.appendChild(limbModify.offset = document.createElement("input"));
	limbModify.offset.addEventListener("input", function(){
		let selectedLimb = poseData.limbs[poseData.selectedLimb];
		if (!selectedLimb) return;
		let offset = this.value.split(",").map(e=>{let p=parseInt(e); if(isNaN(p)){return}else{return p}});
		selectedLimb[2] = offset[0]??0;
		selectedLimb[3] = offset[1]??0;
	})
	modal.onSubmit(function() {
		if (cursorCoords) {
			drawStickman(poseData.limbs, ...convertTileToXY(...cursorCoords.swap(1,2)));
		}
	});
	poseData.selectedLimb = -1;
	return w.ui.stickCustomModal = modal;
}
makeStickCustomModal();
menu.addOption("Place stickman (Custom)", _=>w.ui.stickCustomModal.open());
menu.addOption("Place last pose", _=>drawStickman(latestPose[2], _, _));
menu.addOption("Clear overwritten", _=>overwrittenChars[selectedChar].splice(0));
menu.addOption("Space overwritten", ()=>overwrittenChars[selectedChar].forEach(e=>e[2]=" "));
function makeCharModal() {
	var modal = new Modal();
	modal.setMinimumSize(290, 128);
	modal.createForm();
	modal.setFormTitle("");
	let charName = modal.addEntry("Character", "text").input;
	charName.value = selectedChar;
	modal.onSubmit(function(){
		selectedChar = charName.value;
	})
	return w.ui.charModal = modal;
}
makeCharModal();
menu.addOption("Select character", _=>w.ui.charModal.open());
function makeStickPalModal() {
	var modal = new Modal();
	modal.setMinimumSize(512);
	modal.createForm();
	modal.inputField.style.gridTemplateColumns = "";
	modal.setFormTitle("Separate values with , and use hex code.");
	let pal = document.createElement("input");
	pal.type = "text";
	pal.value = stickmanPalette.map(e=>e.toString(16)).join(',');
	pal.style.width = "400px";
	modal.inputField.appendChild(pal);
	modal.onSubmit(function(){
		stickmanPalette = pal.value.split(",").map(e=>parseInt(e, 16))
	})
	modal.onOpen(function(){
		pal.value = stickmanPalette.map(e=>e.toString(16))
	})
	return w.ui.stickPalModal = modal;
}
makeStickPalModal();
menu.addOption("Change palette", _=>w.ui.stickPalModal.open());
