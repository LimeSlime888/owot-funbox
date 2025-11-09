# [Our World of Text](https://owot.me) funbox
Scripts anyone is free to use (non-maliciously) for fun! :D  
**\*Run owotutilities.js before running this**
**°Run utilities.js before running this**
## screenshot.js
This script is for screenshotting canvas content.
Use the menu or the keybind (CTRL+1) to take a screenshot and put it into your clipboard.
Overlays are added to your screenshot. To toggle them, use the modal accessible through the *Screenshot settings* menu option.
## fastStickman.js*
This script is for quick stickman placement. If the desired pose is not in a preset, you can modify a preset to match it!  
**Current characters:** default, hazmat, squarie (`shock` = hazmat)  
Head, torso, and hazmat customisation to be added. For now, they're just the standard `o`, `|/\`, and `l`. For <ins>l</ins>ime.
## cursorgravity.js
This script puts a gravity-like force on your cursor. It originated from [/owotchallenge](https://owot.me/owotchallenge) by e_g., then was modified so the camera could have a set "smoothness" by the creator of [/owotparkour](https://owot.me/owotparkour). By combining the updated script from the sequel of /owotchallenge, [/impossibleway](https://owot.me/impossibleway), adding the base for a TAS frame-by-frame inputter, and tick rate, I made this abomination. Enjoy!
## stickPlat.js*
I made this script originally for exploring canvas like a platformer, but now it's been repurposed for OWoT Story Mode! Development version of this script will be kept private, though.
You can change the stickman palette, like fastStickman.js.
## sounds.js
This script adds sound effects to OWoT such as when you \/warp, when a message is received, when you use a client command, and when you connect to a world using \/warp.
You can adjust the volume of these sound effects in the Menu with the mediumvioletred slider.
## writebefore_chatbar.js°
This script lets you type from a pool of random characters / add colour modifications to the characters you type, signaled by including tokens in the chatbar. Helped in making [/lime.owot/city](https://owot.me/lime.owot/city) and [/mis◌◌◌◌◌◌.](https://github.com/LimeSlime888/mis------.).
### Syntax
#### Character pools
\[hd\], \[md\], \[ld\] - high, medium, and low density characters respectively.  
(s), (ul), (ll), (n) - include symbols, uppercase letters, lowercase letters, and numbers respectively.  
&(number) - add spaces to the pool.
#### Character modifications
\[ov\] - overline.
#### Colour modifications
\[B\] - exclude background colour from modification.  
\[C\] - exclude foreground colour from modification.  
\[swap\] - swap foreground and background colours.  
m(hexadecimal) - mix colour.  
M(float) - mix opacity, default 0.5.  
@(float) - brightness.  
±(float) - random brightness deviation.
