/*
 * This file will do all the background processes needed for the extension.
 * It contains a listener to check the URL of the sites that the user is
 * requesting to look into. If the URL includes a site that is supposed to be
 * blocked, the file would set the tab to the HTML page that says that it is
 * blocked. The user can go back to their initial page if the user went to the
 * URL page.
 */

var storage = chrome.storage.local; // the storage where data is saved.
var state, links, time, totalSeconds; // local vars that hold storage values

setDefault();
setInterval(setTime, 1000);
setInterval(checkSite, 500);

/*
 * Function: blockSite();
 * Description: It will update the active tab with the HTML page showing that
 * the page is blocked.
 */
function blockSite() 
{
    chrome.tabs.update({url: "../html/blockedSite.html"})
}

/*
 * Function: setDefault();
 * Description: It will set the array to block major social media websites and
 * it will save it into the local storage.
 */
function setDefault() 
{
    console.log("Set the default");
    storage.set({"links": ['facebook.com','youtube.com','twitter.com', 
        'linkedin.com', 'instagram.com']});
    storage.set({"time": 0});
    storage.set({"distractions": 0});
}


/*
 * Function: setTime();
 * Description: It will take the data from the local storage and increase
 * the number of seconds by 1. And set the final number into the local
 * storage. This will be called every time a second is passed.
 */
function setTime()
{

    chrome.storage.local.get(["state","time"], function(data)
    {
        // Gets data from the local storage
        state = data.state;
	    totalSeconds = data.time;

        // if not active productive session, then reset the session.
        if(!state) 
        {
            totalSeconds = 0;
            return;
        }
        totalSeconds++;

        storage.set({"time" : totalSeconds});

    });
}

/*
 * Function: checkSite()
 * Description: It takes in the current tab and checks if its in the list
 * of blocked websites. If it is not part of the list, then it does nothing
 * and returns. If it is, then we redirect the user to the blockedSite.html.
 */
function checkSite() 
{
    chrome.storage.local.get(["state","links", "distractions"], function(data) 
    {

        // Gets the data from the local storage
        state = data.state;
        links = data.links;
        distractions = data.distractions;
        // If not active productive session, then continue as normal.
        if(!state) return;

        chrome.tabs.query({active:true, lastFocusedWindow: true}, tabs => 
        {
        if (tabs.length == 0) return;
        let url = tabs[0].url;
        if (url.includes("html/blockedSite.html")) return;
            // checks every entry for a blocked URL.
            for(index=0; index< links.length; index++) 
            {

                // check if there is a URL and if it should be blocked
                if (url && url.includes(links[index])) 
                {
                    // This link shows when wanting to add a link to the blocked list
                    if (url.includes("settings.html?add_link=" + links[index])) return;

                    // This will update the tab to not go to the blocked URL.
                    blockSite();
                    storage.set({"distractions" : (distractions + 1)})
                        
                    return;
                }
            }
        });
    })
}
