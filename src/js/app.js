$(document).ready(function () {
  // Test JQ
  $('h1').hover(function(){
    $(this).css("text-decoration", "underline");
  }, function () {
    $(this).css("text-decoration", "none");
  });
//
// **GLOBAL VARIABLES**
// reference array for monster objects
var monstersObjArray = [
  {
    symbol: "S",
    cssClass: "blue"
  },
  {
    symbol: "X",
    cssClass: "green"
  },
  {
    symbol: "W",
    cssClass: "gray"
  },
  {
    symbol: "H",
    cssClass: "yellow"
  }
];
// reference array for level properties
var levelObjArray = [
  {
    level: 1,
    boxNumber: 3,
    maxMoves: 10,
    scoreGoal: 1200,
    pointsVal: 100,
    danger: null
  }
];
//
var numberOfMonsters = monstersObjArray.length;
var levelsArray = [3, 4, 5]; // might refactor to use levelObjArray
var currentLevel = 0;
//
// CREATE & STORE gameArray GLOBALLY
var gameArray = setUpBoard();
//
// CREATE & STORE currentSwitchPiece GLOBALLY
var currentSwitchPiece = createSwitchPiece();
//
// **FUNCTIONS**
//
// CREATE RANDOM MONSTER
// F:createRandomMonster: create 1 of 3 random monsters
function createRandomMonster() {
// Random number logic
  return Math.floor(Math.random() * numberOfMonsters);
}
//
// CREATE SWITCH PIECE
function createSwitchPiece() {
  var localSwitchIdx = createRandomMonster();
  var switchPiece = JSON.parse(JSON.stringify(monstersObjArray[localSwitchIdx]));
  // switchPiece.currentIndex = "switch-piece";
  $("#switch-piece").text(switchPiece.symbol);
  return switchPiece;
}
//
// DYNAMIC GAMEBOARD WITH RANDOM MONSTER PIECES ASSIGNED
function setUpBoard() {
  // create swap piece
  // create temp array for final 2d gameArray
  var localArray1 = [];
  // each row
  for (var i = 0; i < levelsArray[currentLevel]; i++) {
    // create temp array for internal 1d array that we attached to final
    var localArray2 = [];
    // create row and push to DOM
    $("#board").append("<div class='rows' id='row" + i + "'></div>");
    for (var k = 0; k < levelsArray[currentLevel]; k++) {
      // create box and assign id = array location[i][k]
      var box = $("<div class='box' id='idx" + i + k + "'></div>");
      // push columns to html
      $("#row" + i).append(box);
      // create random monster index
      var localMonsterIdx = createRandomMonster();
      // create local random monster obj that *does not reference original obj*
      var kLocalObj = JSON.parse(JSON.stringify(monstersObjArray[localMonsterIdx]));
      // set monster property currentIndex to idx[i]k[]
      kLocalObj.currentIndex = $("#idx" + i + k + "").attr("id");
      // add monster to gameArray (we are at position i, k)
      localArray2.push(kLocalObj);
      // console.log("kLocalObj: ", JSON.stringify(kLocalObj));
      // console.log("kIndex: ", kLocalObj.currentIndex);
      // assign monster symbols to gameboard
      $("#idx" + i + k + "").html(kLocalObj.symbol);
  // console.log("localArray2: ", JSON.stringify(localArray2));
    }
  // console.log("localArray2: ", JSON.stringify(localArray2));
  localArray1.push(localArray2);
  }
  return localArray1;
}
//
// PLAYER MOVE LOGIC
function switchPiece(row, col) {
  // create temperary reference to currentSwitchPiece
  // var tempGamePiece = gameArray[row][col];
  var tempSwitchPiece = currentSwitchPiece;
  // console.log("tempGP: ", JSON.stringify(tempSwitchPiece));
  // console.log("tempSP: ", tempSwitchPiece);
  // set currentSwitchPiece to gameboard obj data
  currentSwitchPiece = gameArray[row][col];
  // console.log("New curSwP: ", JSON.stringify(currentSwitchPiece));
  // update HTML UI to show new symbol
  $("#switch-piece").text(currentSwitchPiece.symbol);
  // set gameboard obj to tempSwitchPiece data
  gameArray[row][col] = tempSwitchPiece;
  // console.log("New gameP: ", JSON.stringify(gameArray[row][col]));
  // update text UI to show new symbol
  $("#idx" + row + col + "").text(gameArray[row][col].symbol);
}
//
// GAME LOGIC
// create score var at 0 and div
//
// POINTS LOGIC
function getPoints () {
  // set max moves at 10 and div
  var maxMoves = levelObjArray[currentLevel].maxMoves;
  // set score goal
  var scoreGoal = levelObjArray[currentLevel].scoreGoal;
  // set points value
  var pointsVal = levelObjArray[currentLevel].pointsVal;
  // establish box max width/height
  var maxSize = levelObjArray[currentLevel].boxNumber;
  console.log("Move:", maxMoves,
    "Goal:", scoreGoal,
    "pointsVal:", pointsVal,
    "maxSize:", maxSize);
  // establish horizontal and vertical counter at 0
  var rowCounter = 0;
  var colCounter = 0;
  // if max moves
  if (maxMoves > 0) {
    console.log("I got Moves", maxMoves);
    // set variable to compare
    // for loop that continues until entire row is equal
    for (var i = 0; i < maxSize; i++) {
      var keyRowPiece = gameArray[i][0].symbol;
      // winning until proven not winning
      var rowMatch = true;
      var checkArray1 = [];
      var checkArray2 = [];
      var checkArray3 = [];
      // console.log("keyRowPiece:", keyRowPiece);
      // console.log("In loop i");
      for (var k = 0; k < maxSize; k++) {
        // console.log("In loop k:", "i:", i, "k:", k);
        // compare each box in row (reference currentLevel) to next
        // checkArray1.push(gameArray[i][k].attr("id"));
        // console.log("keyColPiece:", keyColPiece);
        if (keyRowPiece !== gameArray[i][k].symbol) {
          rowMatch = false;
          // console.log("Match", rowMatch);
          break;
        }
      }
      if (rowMatch) {
        // for (var z = 0; z <checkArray1.length; z++) {
        //   var idWin = checkArray1[i];
        //   $("#idWin").addClass("score");
        // }
        console.log("Got a matched row");
      }
    }
  }
  if (maxMoves > 0) {
    for (var i = 0; i < maxSize; i++) {
      var keyColPiece = gameArray[0][i].symbol;
      var colMatch = true;
      // console.log("keyColPiece:", keyColPiece);
      for (var k = 0; k < maxSize; k++) {
        // console.log("In loop k:", "i:", i, "k:", k);
        if (keyColPiece !== gameArray[k][i].symbol) {
          colMatch = false;
          // console.log("colMatch:", colMatch);
          break;
        }
      }
      if (colMatch) {
        console.log("Column Match");
      }
    }
  }
}
//
// EVENT LISTENERS
// add click listeners - create fct parameters i, k
$(".box").click(function(e) {
  // on click, switch gameArray box obj & switchPiece
  var indexString = $(this).attr("id");
  // console.log("this: ", this);
  // console.log("indexString: ", indexString);
  var x = indexString.charAt(3);
  var y = indexString.charAt(4);
  // console.log(x, " ", y);
  switchPiece(x, y);
  getPoints();
  // check for winning combo (also do before game starts)
});
//
//
}); // End Ready