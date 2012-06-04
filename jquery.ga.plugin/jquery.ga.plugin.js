/*************************
Georgetown University
Google Analytics
*************************/

// Link tests+dev notes on Dropbox

/********** jQuery Google Analytics Async Enhancements **********/
/* 
 * v1.0.00. Requires jQuery 1.4+ and GA async. Read the change log + developer notes.
 * Developed by Ignatius Hsu, Copyright 2012 Georgetown University. Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0) http://creativecommons.org/licenses/by-nc-sa/3.0/ and is provided as is, without guarantee or support.
 * Attribution: This code adapts code from gaAddons FREE v1.0, Copyright 2011 Stéphane Hamel (http://gaAddons.com), licensed under CC BY-NC-SA 3.0.
 */

$(document).ready(function() {

	// Set tracked file types
	var $ga_filetype = function() {
		return this.href.match(/\.(pdf|docx?|pptx?|xlsx?|mp\d|zip|mpe?g|mov|txt|rtf)$/i);
	};

	// DOWNLOADS
	$('a').filter($ga_filetype).click(function() {
		var ga_trk_download = this.href.replace(/^https?:\/\//, '').toLowerCase();
		_gaq.push(['_trackEvent', 'download', 'click', ga_trk_download]);
		_gaq.push(['master._trackEvent', 'download', 'click', ga_trk_download]);
		// alert('Download Test\n Full Href: ' + this.href + '\n GA Value: ' + ga_trk_download);
	});

	// MAILTO
	$('a[href^="mailto:"],a[href^="Mailto:"],a[href^="MAILTO:"]').click(function() {
		var ga_trk_mailto = this.href.replace(/^mailto:/i, '').toLowerCase();
		_gaq.push(['_trackSocial', 'email', 'send', ga_trk_mailto]);
		_gaq.push(['master._trackSocial', 'email', 'send', ga_trk_mailto]);
		// alert('Mailto Test\n Full Href: ' + this.href + '\n GA Value: ' + ga_trk_mailto);
	});
	
	// OUTBOUND LINKS
	$('a').not(function() {
		return this.href.match(/^$|mailto:|(https?:\/\/[^\/]+?georgetown\.edu)/i);
	})
	.not($ga_filetype).click(function(event) {
		var ga_trk_outbound = this.href.match(/\/\/([^\/]+)/i)[1].toLowerCase();
		_gaq.push(['_trackEvent', 'outbound', 'click', ga_trk_outbound]);
		_gaq.push(['master._trackEvent', 'outbound', 'click', ga_trk_outbound]);
		// alert('Outbound Test\n Full Href: ' + this.href + '\n GA Value: ' + ga_trk_outbound);
	});

	// 404 ERRORS
	if (document.title.search(/file not found|page not found/i) !== -1) {
		var ga_trk_error = '/virtualpageview/404/' + location.host + location.pathname + '?from=' + document.referrer;
		_gaq.push(['_trackPageview', ga_trk_error]);
		_gaq.push(['master._trackPageview', ga_trk_error]);
		// alert('404 Test\n Page Title: ' + document.title + '\n Full Href: ' + ga_trk_error);
	}

});