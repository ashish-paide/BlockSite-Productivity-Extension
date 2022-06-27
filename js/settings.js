/*
 * This file changes the local data and the HTML display based on
 * what the user wants. It will handle the cases where the user
 * clicks on a button. It will add/delete websites from the blocked 
 * websites list.
 */

// variable representing the local storage.
var storage = chrome.storage.local;


// Variables that hold the elements from settings.html
var blockedSitesOutput = document.getElementById("blockedSites");
var userInput = document.getElementById("inputLink");
var userEnter = document.getElementById("inputEnter");
var userInputDelete = document.getElementById("inputDeleteLink");
var userEnterDelete = document.getElementById("inputDeleteEnter");

// Event listeners
userEnter.addEventListener("click", addLink);
userEnterDelete.addEventListener("click", deleteLink);


updateOutput();

/*
 * Function: addLink();
 * Description: It will add a link into the blocked list and save it into the
 * local data.
 */
function addLink()
{  
    var inputValue = userInput.value;
    console.log("<Attempting to add '" + inputValue + "'>");

    // in the case that a user tries to add undefined value.
    if(inputValue == 0) 
    {
        alert("This is empty!");
        return;
    }
    storage.get("links", function(x)
    {
        // checks if its already in the list.
        for(i in x.links) {
            if(x.links[i] == inputValue) {
                alert("It is already in the list!");
                return;
            }
        }
        // if not, push it into the list
        newLinks = x.links;
        newLinks.push(inputValue);

        // save it into the local storage.
        storage.set({"links": newLinks});
        console.log("<Successfully added '" + inputValue + "'>");
    });
    updateOutput();
}

/*
 * Function: deleteLink();
 * Description: It will delete a link from the blocked list and ave it into
 * the local data.
 */
function deleteLink()
{
    var deleteValue = userInputDelete.value;
    console.log("<Attempting to delete '" + deleteValue + "'>");

    // if input was empty,
    if(deleteValue == 0) 
    {
        alert("This is empty!");
        return;
    }
    storage.get("links", function(x)
    {
        // go through all of the links
        for(i in x.links) 
        {
            // if found,
            if(x.links[i] == deleteValue) 
            {
                // delete it from the list
                x.links.splice(i,1);
                console.log("<Successfully deleted '" + deleteValue + "'>");
                
                //saved it into the local storage.
                storage.set({"links": x.links});
                console.log(x.links);
                return;
            }
        }
    });
    updateOutput();

}

/*
 * Function: updateOutput();
 * Description: The function changes the data that displays the blocked 
 * URLs to the user.
 */
function updateOutput()
{
    storage.get("links", function(data)
    {
        // create a new list
        var list = document.createElement('ul');

        // takes list from local data and save it to the new list.
        for(index in data.links)
        {
            var listItem = document.createElement('li');
            listItem.innerText= data.links[index];

            list.appendChild(listItem);
        }

        // set the inner html to the new list.
        blockedSitesOutput.innerHTML = list.innerHTML;
    });
}
