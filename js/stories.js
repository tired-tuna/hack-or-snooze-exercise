"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

// ------------------------------------------------------------------------------------

// Make star HTML for favorites
function getStarHTML(story, user) {
  const isFav = user.isFav(story);
  const starStyle = isFav ? "fas" : "far";
  return `
  <span class="star">
  <i class='${starStyle} fa-star'></i>
  </span>
  `;
}

// Make delete button HTML for user posted stories
function getDeleteBtnHTML() {
  return `
    <span class="trash-can">
    <i class="fas fa-trash-alt"></i>
    </span>`;
}

// ------------------------------------------------------------------------------------

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // Show stars when user logs in
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      <div>
        ${showDeleteBtn ? getDeleteBtnHTML(story, currentUser) : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </div>
        </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
// ------------------------------------------------------------------------------------

// adds event listener to new story submission form
$("#submit-form").on("submit", submitNewStoryEntry);

// Handles submitting a new story entry
async function submitNewStoryEntry(evt) {
  console.debug("submitNewStoryEntry");
  evt.preventDefault();

  // Gather add story form data
  const author = $("#add-author").val();
  const title = $("#add-title").val();
  const url = $("#add-url").val();
  const username = currentUser.username;
  const storyData = { title, author, url, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // hide and reset form
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

// ------------------------------------------------------------------------------------

// Add functionality for list of user posted stories

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("No Stories Added Yet");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

// Handles deleting a story
async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

// ------------------------------------------------------------------------------------

// Adds functionality for favorites, and toggling stars

function putFavsOnPage() {
  console.debug("putFavsOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("No Favorites");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

// Handles toggle of  favorites
async function toggleFavStory(evt) {
  console.debug(toggleFavStory);

  const $e = $(evt.target);
  const $closestLi = $e.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  // Checks to see if there is an active star
  if ($e.hasClass("fas")) {
    // Toggles off star if active, and removes from user's favorites list if
    await currentUser.removeFav(story);
    $e.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFav(story);
    $e.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavStory);
