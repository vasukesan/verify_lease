
/* When the browser-action button is clicked... */
chrome.browserAction.onClicked.addListener(function(tab) {
    /*...check the URL of the active tab against our pattern and... */
    //alert("test");
    
    chrome.tabs.executeScript({
    	file: "content.js"
  });
});







