"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

// Show story submission form upon clicking "submit" on nav bar
function navStoryEntryClick(evt) {
  console.debug("navStoryEntryClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navStoryEntry.on("click", navStoryEntryClick);

// Show favorited stories when "favorites" is clicked in nav bar
function navFavClick(evt) {
  console.debug("navFavClick", evt);
  hidePageComponents();
  putFavsOnPage();
}

$body.on("click", "#nav-favs", navFavClick);

// Show stories that were posted by the current user
function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-user-stories", navMyStories);


// ------------------------------------------------------------------------------------

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".navbar-main").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}



function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);