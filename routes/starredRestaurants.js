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

  // join all of the starred restaurants inot a new array
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (r) => r.id === starredRestaurant.restaurantId
      );
      return restaurant;
    });
      // find the restaurant with the id in the new list
      const foundRestaurant = joinedStarredRestaurants.find((restaurant) => restaurant.id === id);

      // if the restaurant doesn't exist, report the error 
      if (!foundRestaurant) {
        res.sendStatus(404);
        return;
      }
  const foundRestaurantData = {
    id: foundRestaurant.id,
    comment: foundRestaurant.comment,
    name: foundRestaurant.name
  }
    // return the restaurant in JSON
    res.json(foundRestaurantData); 
    }
);


/**
 * Feature 8: Adding to your list of starred restaurants.
 */



/**
 * Feature 9: Deleting from your list of starred restaurants.
 */


/**
 * Feature 10: Updating your comment of a starred restaurant.
 */



module.exports = router;