settings.movelist = {};
settings.movelist.value = [];
settings.movelist.create = function(character, div)
{
	div.innerHTML = '<div class="option_title">show moves</div>';
	for (var j=0; j<characters[character].movelist.length; j++)
	{
		var name = characters[character].movelist[j];
		settings.movelist.value[j] = {"name":name,"value":true};
		div.innerHTML += '<input type="checkbox" checked="true" id="toggle_' + name + '"></input> ' + name + '</br>';
	}
};
settings.movelist.apply = function()
{
	for (var j=0; j<characters[character].movelist.length; j++)
	{
		settings.movelist.value[j].value = document.getElementById('toggle_' + characters[character].movelist[j]).checked;
	}
};