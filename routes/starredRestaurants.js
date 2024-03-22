const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {
  // create a variable to store the ID
  const { id } = req.params;

       // Find the restaurant with the matching id.
      const foundRestaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.id === id);

      // if the restaurant doesn't exist, report the error 
      if (!foundRestaurant) {
        res.sendStatus(404);
        return;
      }

    // return the restaurant in JSON
    res.json(foundRestaurant); 
    }
);


/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {
  // create a variable for restaurant name
  const { body } = req;
  const { id } = body;
  // find the restaurant in STARRED_RESTAURANTS
  const restaurant = ALL_RESTAURANTS.find((restaurant) => restaurant.id === id);
  // if no restaurant exists, send error report
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }
  
    // generate unique ID
    const newId = uuidv4();
    // create a record for new starred restaurant
    const newStarredRestaurant = {
      id: newId,
      restaurantId: restaurant.id,
      comment: null,
    };
    // push new record into STARRED_RESTAURANTS
    STARRED_RESTAURANTS.push(newStarredRestaurant);
    
    console.log(`post request: ${id} added to StarredRestaurant list ✅`)
    // set success status, send data to front-end
    res.status(200).send({
      id:newStarredRestaurant.id,
      comment: newStarredRestaurant.comment,
      name: restaurant.name
    });
})


/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  // use .filter() to remove r from STARRED_RESTAURANTS and save in variable
  const newListOfStarredRestaurants = STARRED_RESTAURANTS.filter((r) => r.id !== id);
  // The user tried to unstar a restaurant that isn't currently starred
  if (STARRED_RESTAURANTS.length === newListOfStarredRestaurants.length) {
    res.sendStatus(404);
    return;
  }
  // reassign STARRED_RESTAURANTS with updated list from variable
  STARRED_RESTAURANTS = newListOfStarredRestaurants;
  
  res.sendStatus(200);
  
  console.log(`detlete request: restaurant with id: ${id} deleted ✅`)
});

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put("/:id", (req, res) => {
const { id } = req.params;
const { newComment } = req.body;
  // Find r in STARRED_RESTAURANTS
  const foundRestaurant = STARRED_RESTAURANTS.find((r) => r.id === id);
  // if r doesn't exist, send status code
  if (!foundRestaurant) {
    res.sendStatus(404);
    return;
  }
  // EXTRA: Error hanbdling if there is no {newComment}
  if (!newComment) {
    res.sendStatus(400).json({error: "A new comment is required, please. ❌"});
  }

  // update r's comment included in request body
  foundRestaurant.comment = newComment;
  // send success code
  res.sendStatus(200);
  
  console.log(`Put request: updated ${foundRestaurant.name} with id: ${id} ✅`);
});


module.exports = router;