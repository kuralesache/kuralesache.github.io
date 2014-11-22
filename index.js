var winnersRounds, losersRounds;

function createButtons()
{
	// Save this into match so we always have match context
	var match = $(this);

	// skip a match if has already been processed
	if ($(match).hasClass("stream-processed"))
		return;

	// If we have not processed a match, grab the id and both players
	var match_id = $(match).find(".btn.btn-link.match_identifier.dropdown-toggle");
	var round    = parseInt($(match).find(".match_top_half .inner_content").attr("data-round"));
	var player1  = $(match).find(".match_top_half .inner_content span");
	var player2  = $(match).find(".match_bottom_half .inner_content span");

	// skip a match if it is not ready to be processed
	if (!(player1.attr("title") && player2.attr("title")))
		return;

	if (round > 0)
	{
		switch (winnersRounds-round)
		{
			case 0:
				round_text = "Grand Finals";
				break;
			case 1:
				round_text = "Winners' Finals";
				break;
			case 2:
				round_text = "Winners' Semifinals";
				break;
			default:
				round_text = "Winners' Top " + Math.pow(2, winnersRounds-round);
				break;
		}
	}
	else
	{
		round *= -1;
		switch (losersRounds-round)
		{
			case 0:
				round_text = "Losers' Finals";
				break;
			default:
				round_text = "Top " + (Math.pow(2, winnersRounds-1-(0|(round/2))) * (1 + ((losersRounds-round+1)%2)/2)) + ", Losers' Side";
				break;
		}
	}
 
	// Create the trigger file
	var triggerURL = window.URL.createObjectURL(new Blob([
		$(player1).text() +  "\n" + $(player2).text() + "\n" + round_text
	]));

	// create a link
	$("<a>",
	{	href: triggerURL
	,	download: "trigger.txt"
	}).appendTo(player1);

	// Grab the link that we just created
	var link = $(player1).find("a")[0];

	$(match_id).unbind("click");

	// Add a new click handler to click the link we created
	$(match_id).click(function() {
		link.click();
	});

	// Add a new click handler to click the link we created
	$(match_id).click(function() {
		link.click();
	});

	// Mark the match as processed
    $(match).addClass("stream-processed");

    $(match_id).css("background-color", "red");
    $(match_id).css("color", "white");
}

function setWinnersRounds()
{
	var i;
	for (i = 1; window.frames[0].document.getElementById("round" + i + "_label"); i++)
		;
	winnersRounds = i-1;
}

function setLosersRounds()
{
	for (losersRounds = 1; window.frames[0].document.getElementById("round-" + losersRounds + "_label"); losersRounds++)
		;
	losersRounds--;
}

window.onload = function()
{
	var iFrame = document.getElementById("frame");
	iFrame.src = "http://michigansmash.challonge.com/umb5";
	iFrame.onload = function()
	{
		setWinnersRounds();
		setLosersRounds();
		setInterval(function() {
			// Get the list of matches from the bracket
			var matches = $("body", window.frames[0].document).find(".match_table.match_qtip.match-tipsy");
			matches.each(createButtons);
		}, 300);
	};
};