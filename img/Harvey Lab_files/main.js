// Write a function/set of functions that matches all the card types, gets their ID, and loads the matching html file.

// Convert newlines to <br> tags:
function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

// Load card data from url:
function cardLoad(url, card) {
	$.get(url, function(data) {
		cardSetup(card, data);
	});
}

// Insert loaded content into card and format it:
function cardSetup(card, data){
	$(card).html(data);
	
	// Hide text sections that are accessible by clicking "read more":
	//$(card).find(".buttonShowMore").closest("p").nextAll().addClass( "hidden" );
	//cardShowLess(card);
	var divMore = $(card).find("div.more");
	divMore.hide();
	
	// Attach "show more" function to "show more" button:
	$(card).find(".buttonShowMore").click(function(){cardShowMore(card)});
	
	// Attach "show less" function to "show less" button:
	$(card).find(".buttonShowLess").click(function(){cardShowLess(card)});
	
	// Add style to standard body text (i.e. <p>'s with no class):
	$(card).find('p:not([class])').addClass("bodyText");
	
	// Add links to emails:
	$(card).find(".personEmail").each(function() {
		$(this).wrap('<a href="mailto:' + $(this).text() + '"></a>');
	})
}

function cardPrepareThumbnailForAnimation(card, thumbnail) {
	var divMore = $(card).find("div.more");
	var thumbLeft = $(thumbnail).position().left;
	var thumbHeight = $(thumbnail).outerHeight(true);
	
	// Check if the text is floating next to the thumbnail. If not, i.e. if the text is below the thumbnail (because the screen is narrow), then we don't have to do the rest of the function:
	if ($(thumbnail).position().top < $(card).find(":not(img.thumbnail)").first().position().top) {
		return;
	};
	
	// Get height before the div.less, i.e. everything that does not get animated:
	var heightBefore = -thumbHeight;
	$(card).find("div.less").prevAll(":visible").each(function(){
		heightBefore += $(this).outerHeight(true);
	});
		
	// Remove thumbnail from floating elements:
	$(thumbnail).css({
		"position" : "absolute",
		"float" : "none",
		"left" : thumbLeft});
	
	// Add animated part of thumbnail placeholder (lower part) to "more" div :
	$('<div class="thumbnailPlaceholder"></div>').css({
			"clear" : "both",
			"float" : "right", 
			"width" : thumbnail.outerWidth(true),
			"height" : thumbHeight-heightBefore,
			"margin" : "0", 
			"padding" : "0"
	}).prependTo($(divMore));
	
	// Add non-animated part of thumbnail placeholder (upper part) to "card" div:
	$('<div class="thumbnailPlaceholder"></div>').css({
			"float" : "right", 
			"width" : thumbnail.outerWidth(true),
			"height" : heightBefore,
			"margin" : "0", 
			"padding" : "0"
	}).insertAfter($(thumbnail));
}

function cardShowMore(card) {
	var buttonShowMore = $(card).find(".buttonShowMore");
	var thumbnail = $(card).find("img.thumbnail");
	
	// Set min-height of card to be the current height, so that it cannot shrink transiently during animation:
	$(card).css({
		"min-height" : $(card).outerHeight()
	});
	
	// If thumbnail exists, manage thumbnail layout:
	if ($(thumbnail).length > 0) {
		cardPrepareThumbnailForAnimation(card, thumbnail);
	}
	
	// Hide button, then slide down:
	$(buttonShowMore).hide();
	$(card).find("div.more").slideDown(500, function(){
		// Once animation is done, remove placeholders again:
		$(thumbnail).removeAttr('style'); // Resets thumbnail style.
		$(card).find("div.thumbnailPlaceholder").remove();
	});
}

function cardShowLess(card) {
	var buttonShowMore = $(card).find(".buttonShowMore");
	var thumbnail = $(card).find("img.thumbnail");
	
	// If thumbnail exists, manage thumbnail layout:
	if ($(thumbnail).length > 0) {
		cardPrepareThumbnailForAnimation(card, thumbnail);
	}
	
	// Slide up, then show button:
	$(card).find("div.more").slideUp(500, function(){
		$(card).removeAttr('style'); // Resets card style (i.e. the min-height used to prevent transient shrinking).
		$(thumbnail).removeAttr('style'); // Resets thumbnail style.
		$(card).find("div.thumbnailPlaceholder").remove();
		$(buttonShowMore).fadeIn(100);
	});
	
}

// Functions to run when website is first loaded:
$(document).ready(function(){
	// Load main header:
	$("div.header#main").load("header.html"); 
	
	// Load main footer:
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	$("div.footer#main").html("&copy; " + yyyy + " Christopher Harvey. All rights reserved. Last modified " + document.lastModified); 
		
	// Load cards:
	$( "div.card" ).each(function() {
		var card = this;
		var url = $(card).attr('id') + ".html";
		
		$.get(url, function(data) {
			cardSetup(card, data);
			
			// If this is the last card in it's section, make the entrie section visible:
			if($(card).is(':last-child'))
			{
				$(card).closest("div.section").css({"visibility" : "visible"}).hide().fadeIn(200);
			}
		});
	});
	
	// Make all links open in new window:
	$("a").click( function() {
		window.open( $(this).attr('href') );
		return false;
	});
	
	// Lastly, make content visible:
/* 	$("div.section").each(function() {
		$(this).css({"visibility" : "visible"});
		}); */
});