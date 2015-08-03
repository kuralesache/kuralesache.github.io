function draw()
{
	setTimeout(toLoad || canvasQueue ? draw : function() {
		ctx.putImageData(imgData, 0, 0);
		document.getElementById('stage').style.display = 'block';
		document.getElementById('character').style.display = 'block';
		document.getElementById('character').style.left = character_position[0] + 'px';
		document.getElementById('character').style.top = character_position[1] + 'px';
	},100);
}

function clearData()
{
	for (var i = 3; i < imgData.data.length; i+=4)
	{
		imgData.data[i] = 0;
	}
}

function drawAnimation(name)
{
	asyncArtist(function(){
		for (var frame = 0; frame < settings.lookahead.value; frame++)
		{
			drawFrame(name, frame);
		}
	});
}

function drawFrame(name, frame)
{
	asyncArtist(function(){
		var animation = characters[character].animations[name];
		if (!animation[frame])
			return;

		var	lb = animation[frame].left_bound - 240
		,	tb = animation[frame].top_bound
		;

		// set right and bottom bounds
		var	rb = animation[frame].frame_data.length + lb
		,	bb = animation[frame].frame_data[0].length + tb
		;

		for (var i = lb; i < rb; i++)
		{
			for (var j = tb; j < bb; j++)
			{
				if (animation[frame].frame_data[i-lb][j-tb])
				{
					imgData.data[4*(i+j*1440)+0] = settings.color.value[0];
					imgData.data[4*(i+j*1440)+1] = settings.color.value[1];
					imgData.data[4*(i+j*1440)+2] = settings.color.value[2];
					imgData.data[4*(i+j*1440)+3] = settings.color.value[3];
				}
			}
		}
	});
}

function asyncArtist(func)
{
	canvasQueue++;

	function asyncDraw()
	{
		setTimeout(toLoad ? asyncDraw : function(){
			func();
			canvasQueue--;
		}, 100);
	}

	asyncDraw();
}