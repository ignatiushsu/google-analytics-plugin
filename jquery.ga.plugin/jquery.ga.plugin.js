/********** jQuery Google Analytics Async Enhancements **********/
/* 
 * v1.1.05 fixed bug where anchor hrefs w/javascript fail to open (issue #10). Requires jQuery 1.4.2 or higher and GA async. Read the change log + developer notes.
 * Developed by Ignatius Hsu, Copyright 2013 Georgetown University and Ignatius Hsu. Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0) http://creativecommons.org/licenses/by-nc-sa/3.0/ and is provided as is, without guarantee or support.
 * Attribution: This code is inspired by gaAddons free v1.0, Copyright 2011 Stephane Hamel (http://gaAddons.com).
 */

$(document).ready(function() {

  // VARIABLES
  // Set tracked file types
  var $ga_file = '\\.(pdf|docx?|xlsx?|pptx?|zip|mp\\d|rtf|txt|exe|app|apk)$';
  var $ga_file_regex = new RegExp($ga_file, "i");
  var $ga_file_fn = function() {
    return this.href.match($ga_file_regex);
  };
  
  // Set cross-domain
  var $ga_xdomain = '^https?:\/\/[^\/]*?(georgetown\\.edu|campaign4georgetown\\.org)';
  var $ga_xdomain_regex = new RegExp($ga_xdomain, "i");
  var $ga_xdomain_fn = function() {
    return this.href.match($ga_xdomain_regex);
  };

  // Set context as SLD.TLD
  var $ga_sld_tld = window.location.hostname.match(/[\d\w][\d\w-]{1,61}[\d\w]\.[\d\w]{2,6}$/i);

  // X-DOMAIN
  // track links as x-domain if matches x-domain list + does not match current host + does not match downloaded files.
  // does it need to exclude all hosts matching second level domain (blog.foo.com host matches foo.com)???
  $('a').filter($ga_xdomain_fn).not(function() {
    //exclude current SLD.TLD
    var ga_xdomain_current = new RegExp('^https?:\/\/[^\/]*?' + $ga_sld_tld + '|' + $ga_file, "i");
    return this.href.match(ga_xdomain_current);
  })
  .click(function(e) {
    e.preventDefault();
    _gaq.push(['_link', this.href.toLowerCase()]);
    // alert('Cross Domain Link Tracking Test\n Full Href: ' + this.href + '\n GA Value: ' + this.href.toLowerCase() + '\n This SLD.TLD: ' + $ga_sld_tld );
  });
  
  // OUTBOUND
  $('a').not(function() {
    var ga_outbound_fn = new RegExp('^$|mailto:|javascript:|' + $ga_xdomain + '|' + $ga_file, "i");
    return this.href.match(ga_outbound_fn);
  })
  .click(function(e) {
    e.preventDefault();
    var ga_trk_outbound = this.href.match(/\/\/([^\/]+)/i)[1].toLowerCase();
    _gaq.push(['_trackEvent', 'outbound', 'click', ga_trk_outbound]);
    _gaq.push(['master._trackEvent', 'outbound', 'click', ga_trk_outbound]);
    // alert('Outbound Test\n Domain: ' + this.href + '\n GA Value: ' + ga_trk_outbound);
    // If target, emulate with window.open(). If this and this eval fixes issue #9 in GitHub
    if ($(this).attr('target') !== undefined && $(this).attr('target') !== '' ){
	  var linkTarget = $(this).attr('target');
      window.open(this.href, linkTarget);
    }
    else {window.location = this.href;}
  });

  // DOWNLOADS
  $('a').filter($ga_file_fn).click(function(e) {
    e.preventDefault();
    var ga_trk_download = this.href.replace(/^https?:\/\//, '').toLowerCase();
    _gaq.push(['_trackEvent', 'download', 'click', ga_trk_download]);
    _gaq.push(['master._trackEvent', 'download', 'click', ga_trk_download]);
    // alert('Download Test\n Full Href: ' + this.href + '\n GA Value: ' + ga_trk_download);
    // If target, emulate with window.open()
    if ($(this).attr('target') !== undefined && $(this).attr('target') !== '' ){
	  var linkTarget = $(this).attr('target');
      window.open(this.href, linkTarget);
    }
    else {window.location = this.href;}
  });

  // MAILTO
  $('a[href^="mailto:"],a[href^="Mailto:"],a[href^="MAILTO:"]').click(function(e) {
    e.preventDefault();
    var ga_trk_mailto = this.href.replace(/^mailto:/i, '').toLowerCase();
    _gaq.push(['_trackSocial', 'email', 'send', ga_trk_mailto]);
    _gaq.push(['master._trackSocial', 'email', 'send', ga_trk_mailto]);
    //alert('Mailto Test\n Full Href: ' + this.href + '\n GA Value: ' + ga_trk_mailto);
    // If target, emulate with window.open()
    if ($(this).attr('target') !== undefined && $(this).attr('target') !== '' ){
	  var linkTarget = $(this).attr('target');
      window.open(this.href, linkTarget);
    }
    else {window.location = this.href;}
  });
  
  // 404 ERROR PAGES
  if (document.title.search(/file not found|page not found/i) !== -1) {
    var ga_trk_error = '/virtualpageview/404/' + location.host + location.pathname + '?from=' + document.referrer;
    _gaq.push(['_trackPageview', ga_trk_error]);
    _gaq.push(['master._trackPageview', ga_trk_error]);
    // alert('404 Test\n Page Title: ' + document.title + '\n Full Href: ' + ga_trk_error);
  }

  // DOMAIN REDIRECTS
  // F5 domain redirects append #domain-redirected to destination domain.
  var redirectURL = window.location.href.match(/#domain-redirected([\?&-][^\/^\#]+)?$/i);
  if (redirectURL){
    var domainCurrent = window.location.href.match(/\/\/([^\/]+)/i)[1];

    // clean up referrals from popular search engines with localized TLDs
    if (document.referrer.match(/(google|bing)(\.com?)?(\.[\w]{2,3})?\/(url|search)\?[\w]+?/i)){ var domainReferral = document.referrer.match(/\/\/([^\/]+\/(url|search)\?)/i)[1]; }
    else if (document.referrer.match(/(search\.yahoo)(\.com?)?(\.[\w]{2,3})?\/(mobile\/s|search)/i)){ var domainReferral = document.referrer.match(/\/\/([^\/]+\/(mobile\/s|search))/i)[1]; }
    // report full URL from non-search referrals
    else if (document.referrer){ var domainReferral = document.referrer.match(/\/\/(.*)/i)[1].toLowerCase(); }
    // report direct if no referral
    else { var domainReferral = 'direct'; }

    _gaq.push(['_trackEvent', 'inbound-redirect', 'referral', domainReferral, 1, true]);
    _gaq.push(['master._trackEvent', 'inbound-redirect', 'referral', domainReferral, 1, true]);
    // alert('Referrer: ' + domainReferral);

    // Display mssg (temp redirect)
	// Negative lookahead
    if (window.location.href.match(/#domain-redirected(?!&mssg=no)/i)){
      // Message to visitor
      // Detect if using GU Core markup
      if ($('#main .first .asset-body').length > 0){
      $('#main .first .asset-body').append('<div class="callout information"><h3>New Website, New Link</h3><p>Thanks for viewing our new site. We see that you found us through our old URL. Please visit us at this URL in the future (<a href="http://' + domainCurrent + '">http://' + domainCurrent + '</a>).</p></div><br/>');
      }
	  // If not, fallback to body tag
      else {
        $('body').prepend('<style>#visitor-mssg {margin: 0px auto; border: 4px solid #bdbdbd; width:100%; min-height:4.5em; background: #dedede;}#visitor-mssg div {margin: 0px auto; max-width:750px; text-align: center; padding: 0.5em 3%;}#visitor-mssg div p {margin:0.3em;}</style><div id="visitor-mssg"><div><p><strong>New Website, New Link</strong></p><p>Thanks for viewing our new site. We see that you found us through our old URL. Please visit us at this URL in the future (<a href="http://' + domainCurrent + '">http://' + domainCurrent + '</a>).</p></div></div>');
	  }
      // alert(' Hash: ' + redirectURL + '\n Current Domain: ' + domainCurrent);
    }
    // Do not display mssg (long-term redirect)
    else{}

  }
  // else {alert('no redirect url');}
  
});