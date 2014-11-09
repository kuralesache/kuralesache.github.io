function createButtons()
{
	// Save this into match so we always have match context
	var match = $(this);

	// skip a match if has already been processed
	if ($(match).hasClass("stream-processed"))
		return;

	// If we have not processed a match, grab the id and both players
	var match_id = $(match).find(".btn.btn-link.match_identifier.dropdown-toggle");
	var player1  = $(match).find(".match_top_half .inner_content span");
	var player2  = $(match).find(".match_bottom_half .inner_content span");

	// skip a match if it is not ready to be processed
	if (!(player1.attr("title") && player2.attr("title")))
		return;

	// Create the trigger file
	var triggerURL = window.URL.createObjectURL(new Blob([
			$(player1).text()+  "\n" + $(player2).text()
		]));

	// create a link
	$("<a>",
	{	href: triggerURL
	,	download: "trigger.txt"
	}).appendTo(player1);

	// Grab the links that we just created
	var link = $(match).find(".core a")[0];

	// Add a new click handler to click the links we created
	$(match_id).click(function() {
		link.click();
	});

	// Mark the match as processed
    $(match).addClass("stream-processed");

    $(match_id).css("background-color", "red");
    $(match_id).css("color", "white");
}

window.onload = function()
{
	var iFrame = document.getElementById("frame");
	iFrame.src = "http://michigansmash.challonge.com/umb4";
	iFrame.onload = function()
	{
		setInterval(function() {
			// Get the list of matches from the bracket
			var matches = $("body", window.frames[0].document).find(".match_table.match_qtip.match-tipsy");
			matches.each(createButtons);
		}, 100);
	};
};