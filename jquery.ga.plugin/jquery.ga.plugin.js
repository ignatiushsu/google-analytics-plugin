/*************************
Georgetown University
Google Analytics for Office of Advancement
*************************/

// Link tests+dev notes on Dropbox 

/********** jQuery Google Analytics Async Enhancements **********/
/* 
 * v1.0.01 new function for X-domain. Requires jQuery 1.4.2+ and GA async. Read the change log + developer notes.
 * Developed by Ignatius Hsu, Copyright 2012 Georgetown University. Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0) http://creativecommons.org/licenses/by-nc-sa/3.0/ and is provided as is, without guarantee or support.
 * Attribution: This code adapts code from gaAddons FREE v1.0, Copyright 2011 Stéphane Hamel (http://gaAddons.com), licensed under CC BY-NC-SA 3.0.
 */

$(document).ready(function() {

	// VARIABLES
	// Set tracked file types
	var $ga_file = '\\.(pdf|docx?|pptx?|xlsx?|zip|rar|mp\\d|txt|rtf)$';
	var $ga_file_regex = new RegExp($ga_file, "i");
	var $ga_file_fn = function() {
		return this.href.match($ga_file_regex);
	};
	
	// Set cross-domain
	var $ga_xdomain = '^https?:\/\/[^\/]*?(georgetown\\.edu|campaign4georgetown\\.org|bar\\.com)';
	var $ga_xdomain_regex = new RegExp($ga_xdomain, "i");
	var $ga_xdomain_fn = function() {
		return this.href.match($ga_xdomain_regex);
	};

	// Set context as SLD.TLD
	var $ga_sld_tld = window.location.hostname.match(/[\d\w][\d\w-]{1,61}[\d\w]\.[\d\w]{2,6}$/i);

	// X-DOMAIN
	// track links as x-domain if matches x-domain list + does not match current host + does not match downloaded files.
	// does it need to exclude all hosts matching second level domain (blog.foo.com host matches foo.com)???
	$('a').filter($ga_xdomain_fn).not(function(e) {
		//exclude current SLD.TLD
		var ga_xdomain_current = new RegExp('^https?:\/\/[^\/]*?' + $ga_sld_tld + '|' + $ga_file, "i");
		return this.href.match(ga_xdomain_current);
	})
	.click(function(e) {
		alert('Cross Domain Link Tracking Test\n Full Href: ' + this.href + '\n GA Value: ' + this.href.toLowerCase() + '\n This SLD.TLD: ' + $ga_sld_tld );
		_gaq.push(['_link', this.href.toLowerCase()]);
	});
	
	// OUTBOUND
	$('a').not(function(e) {
		var ga_outbound_fn = new RegExp('^$|mailto:|' + $ga_xdomain + '|' + $ga_file, "i");
		return this.href.match(ga_outbound_fn);
	})
	.click(function(e) {
		e.preventDefault();
		var ga_trk_outbound = this.href.match(/\/\/([^\/]+)/i)[1].toLowerCase();
		_gaq.push(['_trackEvent', 'outbound', 'click', ga_trk_outbound]);
		_gaq.push(['master._trackEvent', 'outbound', 'click', ga_trk_outbound]);
		alert('Outbound Test\n Full Href: ' + this.href + '\n GA Value: ' + ga_trk_outbound);
	});

	// DOWNLOADS
	$('a').filter($ga_file_fn).click(function(e) {
		e.preventDefault();
		var ga_trk_download = this.href.replace(/^https?:\/\//, '').toLowerCase();
		_gaq.push(['_trackEvent', 'download', 'click', ga_trk_download]);
		_gaq.push(['master._trackEvent', 'download', 'click', ga_trk_download]);
		alert('Download Test\n Full Href: ' + this.href + '\n GA Value: ' + ga_trk_download);
	});

	// MAILTO
	$('a[href^="mailto:"],a[href^="Mailto:"],a[href^="MAILTO:"]').click(function(e) {
		e.preventDefault();
		var ga_trk_mailto = this.href.replace(/^mailto:/i, '').toLowerCase();
		_gaq.push(['_trackSocial', 'email', 'send', ga_trk_mailto]);
		_gaq.push(['master._trackSocial', 'email', 'send', ga_trk_mailto]);
		alert('Mailto Test\n Full Href: ' + this.href + '\n GA Value: ' + ga_trk_mailto);
	});
	
	// 404 ERROR PAGES
	if (document.title.search(/file not found|page not found/i) !== -1) {
		var ga_trk_error = '/virtualpageview/404/' + location.host + location.pathname + '?from=' + document.referrer;
		_gaq.push(['_trackPageview', ga_trk_error]);
		_gaq.push(['master._trackPageview', ga_trk_error]);
		// alert('404 Test\n Page Title: ' + document.title + '\n Full Href: ' + ga_trk_error);
	}

});