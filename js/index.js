var character_images = {};
var character;
var character_position = [1237, 501];
var stage_images = {};
var stage;

var settings = {};
var characters = {};

// images/drawing
var ctx;
var imgData;

// async counters
var loadComplete = false;
var toLoad = 0;
var canvasQueue = 0;

var optionsList =
[	"lookahead"
,	"movelist"
,	"color"
];

window.onload = function()
{
	document.getElementById('stage').onload = document.getElementById('character').onload = function()
	{
		toLoad--;
	};
	ctx = document.getElementById('canvas').getContext('2d');
	imgData = ctx.createImageData(1440, 1080);

	loadStage('final_destination');
	loadCharacter('fox');
	for (var i=0; i<optionsList.length; i++)
	{
		loadScript('js/options/' + optionsList[i] + '.js');
	}

	main();
}

function main()
{setTimeout(toLoad || !loadComplete ? main : function() {
	for (var i=0; i<optionsList.length; i++)
	{
		processOption(optionsList[i], character);
	}

	var anims = [];
	for (var i=0; i<settings.movelist.value.length; i++)
		if (settings.movelist.value[i].value === true)
			anims.push(settings.movelist.value[i].name);

	for (var i = 0; i < anims.length; i++)
	{
		drawAnimation(anims[i]);
	}

	draw();
},100);};