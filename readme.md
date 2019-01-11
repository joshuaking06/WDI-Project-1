# WDI Project 1
# General Assembly Project 1: Battleship
### Timeframe
7 Days

## Technologies Used
* Javascript(ES6)
* jQuery
* SCSS/CSS
* HTML5/ HTML Audio
* Github

## Game Summary

![screenshot 2019-01-11 at 10 56 20](https://user-images.githubusercontent.com/43890120/51030097-4d6d6680-1590-11e9-8ed1-e4f37d5fed7a.png)

Battleship is a classic board game. The basic idea of the game is to sink all of your opponent's ships before they can sink yours, all while being blind to the location of the enemy ships.


### Game Controls
* Use the  ← ↑ → ↓ keys to move around the grids
* Use Shift to rotate your ships during the ship placement phase
* Use enter to confirm your ship placement
* Players can fire at enemy ships using either their mouse or the enter key


### Playing through the Game

![screenshot 2019-01-11 at 10 56 35](https://user-images.githubusercontent.com/43890120/51030126-64ac5400-1590-11e9-8b09-f2e04e7d88d5.png)

1. The game begins with a a start screen displaying the game title and a start game button


2. Upon pressing the start button, the player is brought to the battle screen, where we can see two grids: one grid for the player's ships, and one for the opponent(AI). On the battle screen is also a 'reset game' button and small display showing the names and sizes of each ship in the game.

![screenshot 2019-01-11 at 11 05 18](https://user-images.githubusercontent.com/43890120/51030274-cc629f00-1590-11e9-980b-48d173ebb1df.png)

3. The player then can place each of their ships using the aforementioned controls. Each ships is color coded on the grid for clarity.

4. After placing their last ship, the game transitions to the combat phase, with the player and the AI alternating turns firing on each other's grid. During the combat phase, there is also a log of the last 12 turns being displayed in a dynamic log in the middle of the screen.

![screenshot 2019-01-11 at 10 57 57](https://user-images.githubusercontent.com/43890120/51030167-7beb4180-1590-11e9-9489-eed12ec7b14e.png)

5. After the combat phase has finished and one player's ships have all been destroyed, the end screen will be displayed. On this screen, the player can see some relevant stats about how they played relative to their opponent, and will be given the option to begin a new game if they want to play again.

![screenshot 2019-01-11 at 11 00 12](https://user-images.githubusercontent.com/43890120/51030293-e13f3280-1590-11e9-8641-9882479f8cef.png)

## Process

### Creating Grids and Ship Placement

The first task in making this game was to create 2 grids, one for the player and one for the opponent. This was done with a simple for loop and appending 100 'square' divs to each of the 2 grids that were created in HTML. I first worked on movement and placement of ships inside the player's grid, as well as the target reticule for firing on enemy squares. This was done by applying and removing classes on each square when the player uses any of the arrow keys, to go to a different square.

Next, I stored each player's ships in it's own object, with keys and values showing their location(if they had one), whether they were sunk or not, as well as their name. Each of these objects was then all placed in an array, which was used for the placement.

A recursive function was used for the ship placement. Once the player pressed enter after deciding where to place their ship, the placeUserShips() function would call itself again, pulling a different ship from the players ships array. Further restrictions were needed to also ensure player could not place ships on top of other ships.


The next(and more challenging) task was to create the AI's board. It was randomly generated and also needed to avoid overlap with other ships, as well as respecting the grid's borders.

To do this I used a 'makeShip' function, and passed in the argument for how long the each ship needed to be.

```
cpuShips[0].index = makeShip(4)
cpuShips[1].index = makeShip(2)
cpuShips[2].index = makeShip(3)
cpuShips[3].index= makeShip(5)
cpuShips[4].index = makeShip(3)
```

Inside of this makeShip function, I would randomly generate  either a horizontal or vertical ship, while also using several array methods to ensure that any possible coordinates were not taken already. If they were, the function would simply call itself again until it returned a valid random location.

```
function makeShip(size){
  const newRandomShip = Math.random() < 0.5 ? randomVertical(size) : randomHorizontal(size)
  if(takenIndexes.some(index => newRandomShip.includes(index))){
    return makeShip(size)
  }
  takenIndexes.push(...newRandomShip)
  return newRandomShip
}
```


### Handling the Combat

Combat was handled on the player's side using a keydown event, listening for either a click/enter on any of the opponent's squares. There would then be a check to see if any of the squares were inhabited by a ship, and if so, the checkForSunk function would then be called, and the game would update the log in the center of the screen, then change combat to the next player's turn. Different sounds and classes would then be added depending on if it was a miss, hit, final hit, etc.

The AI's turn required more logic. First, it would guess any random square on the player's board, continuing this until it found a hit. Upon a hit, the location of that hit would then be pushed into the 'recentHits' array. The AI would then use this recentHits array and look through possible next hits in the direction's possible(up down left right).

After finding a second hit, then AI would then push this new location into the recent hits array and would calculate the difference between the two recent hits. Because this is a grid based game, squares above each other have a difference of 10, and those adjacent have a difference of 1. So if the difference was 10, then AI would begin guessing vertically and would cease to check horizontally, checking only squares that were not already hit or missed of course.

```
if(recentHits.length > 1 &&  ((recentHits[0] -recentHits[1] === 10) || (recentHits)[1]-recentHits[0] ===10)){
  for(var i = 0; i<vertOptions.length; i++){
    possibleOption = originalHit + vertOptions[i]
    if((!(userSquaresAttacked.includes(possibleOption))) &&
      possibleOption>=0 && possibleOption<100) return possibleOption
  }
}
```
At the end of each player's turn, there is also a check to see how many hits each player has had. Because battleship has only 17 possible hits, as soon as this number is reached the endGame function is called, sending the player to a win or lose screen. Displaying different stats about how the game played out.


### Challenges and Wins

By far the biggest challenges in this game were handling the AI's side of the game, the main 2 being handling the random generation of the board as well as improving the AI decision making when firing at the player's ships.

I enjoyed adding the extra little features around the game that I felt helped really make the game come to life more. Things like tracking stats and a dynamic log in the center of the screen certainly helped the feel of the game and added to my enjoyment in playing it.


## Future features

If given some more time, there are certainly some things I'd like to add to the game. First thing would be to implement a type of 'pass and play' mode where 2 human players could play against each other.

The next would be to work a lot more on the AI, allowing them to make more intelligent decisions in specific situations that proved difficult for me when making this.

In terms of styling, I'd also love to add some torpedo animations when firing on ships. I'd also like to find some good sprites that could be used for the ships, which would also rotate correctly when the ships do.

And as a final future feature, I'd like to come back and even make this playable online versus a friend!
