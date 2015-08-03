settings.color = {};
settings.color.create = function(character, div)
{
	div.innerHTML = 'hitbox color: <input type="color" id="colorpicker" value="#FF0000"></input></br>'
	+ 'hitbox opacity: <input type="range" id="coloropacity" value="#50"></input>';
};
settings.color.apply = function()
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(document.getElementById("colorpicker").value);
	settings.color.value = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), document.getElementById("coloropacity").value * 255/100];
};