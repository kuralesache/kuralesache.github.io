function createButtons()
{
	// Get the list of matches from the bracket
	var matches = $(".match_table.match_qtip.match-tipsy");
	matches.each(function() {

	// Save this into match so we always have match context
	var match = $(this);

		if (!$(match).hasClass("stream-processed"))
		{
			// If we have not processed a match, grab the id and both players
			var match_id = $(match).find(".btn.btn-link.match_identifier.dropdown-toggle");
			var player1 = $(match).find(".match_top_half .inner_content span");
			var player2 = $(match).find(".match_bottom_half .inner_content span");

			// This is a way to tell if a match is ready to be processed
			if (player1.attr("title") && player2.attr("title"))
			{
				// Create the player text files
				var player1URL = window.URL.createObjectURL(new Blob([$(player1).text()]));
				var player2URL = window.URL.createObjectURL(new Blob([$(player2).text()]));

				// If we don't find a player file
				if ($(player1).find("a").length > 0)
				{   
					// Replace current link with new link
					$(player1).find("a").replaceWith($("<a></a>").
					    attr("href", player1URL).
					    attr("download", "player1.txt")
					)
				}
				else
				{
					// Otherwise create the link because it never existed
					$("<a></a>").
				    attr("href", player1URL).
				    attr("download", "player1.txt").
				    appendTo($(player1));
				}

				// If we don't find a player file
				if (player2.find("a").length > 0)
				{
					// Replace current link with new link
					player2.find("a").replaceWith($("<a></a>").
					    attr("href", player2URL).
					    attr("download", "player2.txt")
					)
				}
				else
				{
					// Otherwise create the link because it never existed
					$("<a></a>").
				    attr("href", player2URL).
				    attr("download", "player2.txt").
				    appendTo($(player2));
				}

				// Grab the links that we just created
				var links = $(match).find(".core a");

				// Unbind the matches click handler so we don't create multiples
				$(match_id).unbind("click");

				// Add a new click handler to click the links we created
				$(match_id).click(function() {
					links.each(function(index, value) {
						$(value)[0].click();
					});
				});

				// Mark the match as processed
			    $(match).addClass("stream-processed");
			}
		}
	});
}

window.onload = function()
{
	iFrame = document.getElementById("frame");
	iFrame.src = "http://michigansmash.challonge.com/umb4";
	iFrame.onload = function()
	{
		setInterval(function() {
			iFrame.contentWindow.createButtons();
		}, 100);
	};
};