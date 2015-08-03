settings.lookahead = {};
settings.lookahead.create = function(character, div)
{
	div.innerHTML = 'look ahead <input type="number" id="lookahead" value="60" step="1" min="1" max="600"></input> frames';
};
settings.lookahead.apply = function()
{
	settings.lookahead.value = document.getElementById('lookahead').value;
};