const _ = window._ = undefined;
String.prototype.cRepeat = function(num){
	let num2 = Math.floor(+num)
	if (isNaN(+num2)) {return this}
	if (num2 < 0) {return ''}
	if (num2 > 16384) {num = 16384}
	repeatedString = num2==0?'':this;
	for(let i=0;i<num2-1;i++){
		repeatedString += this
	}
	if((num|0)!=+num){
		repeatedString+=this.substring(0,Math.floor(this.length*((+num)-(num|0))))
	}
	return repeatedString
}
Array.prototype.randomElm = function(){return this[Math.floor(Math.random()*this.length)]};
Array.prototype.last = function(){return this[this.length-1]}
Math.randRange = (a,b)=>Math.random()*(b-a)+a;
Number.prototype.inRange = function(a, b, exclusive=0){
	if(a>b){[a,b]=[b,a]}
	switch (exclusive) {
		case 0: {return this >= a && this <= b;}
		case 1: {return this > a && this <= b;}
		case 2: {return this >= a && this < b;}
		case 3: {return this > a && this < b;}
	}
}
Array.prototype.swap = function(i, j){
	let newArray = structuredClone(this);
	[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	return newArray;
}
isLight = function (c) {return .213 * c[0] + .715 * c[1] + .072 * c[2] > 127.5}
sleep = function(ms) {
	return new Promise(function(resolve) {
		setTimeout(resolve, ms);
	});
}
mod = (x, y)=>((x % y) + y) % y;
hsv_to_rgb = function(h=0, s=1, v=1) {
	h = mod(h, 360);
	let m = v * s;
	let o = m * (1 - Math.abs((h/60)%2 - 1));
	let r, g, b;
	switch (Math.floor(h/60)) {
		case 0: [r, g, b] = [m, o, 0];break;
		case 1: [r, g, b] = [o, m, 0];break;
		case 2: [r, g, b] = [0, m, o];break;
		case 3: [r, g, b] = [0, o, m];break;
		case 4: [r, g, b] = [o, 0, m];break;
		default: [r, g, b] = [m, 0, o];
	}
	let w = v - m;
	return [(r+w)*255, (g+w)*255, (b+w)*255];
}
fullWidthRegex = /[ᄀ-ᅟ⺀-⻳⼀-⿕⿰-⿻　-〾ぁ-䶿一-鿼가-힣ힰ-ퟻ豈-龎︐-︙︰-﹫！-｠￠-￦𖿠-𖿤𖿰𖿱𗀀-𘴈𛀀-𛄢𛅐-𛋻🀀-🁡🄐-🄪🄮🅰-🆏🆑-🆭🈀-🌪🎘🎞-🏴🏷-🐾👀👂-💦💨-💱💳-📌📏-📾🔀-🔇🔉-🕁🕅🕉🕋-🕧🕪-🕮🕰🕲🕳🕵🕶🕸🕾-🖀🖂-🖆🖉-🖍🖐🖕🖖🖘-🖝🖤🖦-🖨🖪-🖸🖼🗂🗃🗔🗖🗗🗚-🗠🗢-🗳🗺-🙩🙬🙮🙰-🙵🙼-🚎🚐-🚥🚧-🛇🛋-🛍🛐-🛒🛕🛠🛣-🛥🛧-🛰🛲-🜀�-🜇🜐🜓🜜🜡🜤🜳🜼🜽🜾🝃🝄🝇🝉🝐-🝒🝙-🝜🝠🝫🝬🝮🞁🞃🞅-🞋🞎-🞖🞚-🞜🞡-🞧🞯-🞴🞺🟈🟕-🟘🟠-🟫🠰🠲🡠-🢇🤀-🫖⌚⌛〈〉⏩-⏬⏰⏳⏽⏾☔☕♈-♓♿⚓⚡⚪⚫⚽⚾⛄⛅⛎⛔⛪⛲⛳⛵⛽✅✊✋✨❌❎❓❔➰➿⬛⬜⭐⭕]/gu;
addSpaceToFullWidth = function(str, addatend=true) {
	let matches = str.matchAll(fullWidthRegex);
	str = str.split('');
	for (let m of matches) {
		let i = m.index;
		if (i == str.length - 1 && !addatend) continue;
		str[i + m[0].length - 1] += " ";
	}
	return str.join("");
}
Array.prototype.sum = function() {
	let sum = 0;
	for (let v of this) {
		if (! (v && v.__proto__ == Number.prototype)) {continue}
		sum += v;
	}
	return sum;
}
Array.prototype.mean = function(){
	return this.sum() / this.length
}
bright = function(c, a=0.5, limit=true){
    let r = (c>>16)&255
    let g = (c>>8)&255
    let b = c&255;
    [r, g, b] = [r, g, b].map(x=>limit ? Math.min(255, Math.floor(x*a)) : Math.floor(x*a))
    return (r<<16)+(g<<8)+b
}
// w.changeColor(bright(YourWorld.Color, chatbar.value ? +chatbar.value : _));
lerpcol = function(c, c2, a=0.5, limit=true){
    let r = (c>>16)&255;
    let g = (c>>8)&255;
    let b = c&255;
    let r2 = (c2>>16)&255;
    let g2 = (c2>>8)&255;
    let b2 = c2&255;
    [r, g, b] = [r+(r2-r)*a, g+(g2-g)*a, b+(b2-b)*a].map(x=>limit ? Math.min(255, Math.floor(x)) : Math.floor(x));
    return (r<<16)+(g<<8)+b
}
/*
meow = chatbar.value.split(' ');
meow[1] = +meow[1];
if (isNaN(meow[1])) meow[1] = undefined;
w.changeColor(lerpcol(YourWorld.Color, parseInt(meow[0], 16), meow[1]))
*/
getDayProgress = function(d=(new Date), offset=0){
	// offset: Number or true
	let date;
	if (d instanceof Date) { date = d }
	else if (d.constructor == Number) { date = new Date; date.setTime(d) }
	else { return }
	let h, m, s, ms;
	if (offset === true) {
		[h, m, s, ms] = [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()];
	} else {
		[h, m, s, ms] = [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()];
	}
	return h/24 + m/24/60 + s/24/3600 + ms/24/3600/1000;
}
// Math.floor(getDayProgress()*65536).toString(16)