"use strict";

var userChoice = document.getElementById('user-choice-img');
var movesChoice = document.getElementById('move-choice-list'); //mirar de cambiar nombre

var play = document.getElementById('start-game');
var computerResult = document.getElementById('computer-player-result');
var userResult = document.getElementById('user-player-result');
var formStartGame = document.getElementById('form-start-game');
var game = {
  computer: {
    username: "Machine",
    score: 0
  },
  user: {
    username: "",
    score: 0
  },
  level: "advanced",
  rounds: 3,
  log: []
}; //Functions

/**
 * * Return the username
 */

var getUsername = function getUsername() {
  var result = sessionStorage.getItem('rockPaperScissorsUsername');

  if (result === null) {
    result = 'Loser :P';
  }

  return result;
};
/**
 * * Generate a machine move, return a string with the move
 */


var choiceMachine = function choiceMachine() {
  var imgComputer = document.getElementById('computer-choice-img');
  var min = 0;
  var options = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  var result;

  if (game.level === 'normal') {
    var max = 3;
    result = Math.floor(Math.random() * (max - min)) + min;
  } else {
    var _max = 5;
    result = Math.floor(Math.random() * (_max - min)) + min;
  }

  imgComputer.src = "images/".concat(options[result], ".svg");
  return options[result];
};
/**
 * * Hide the icons lizard and spock in the classic game
 */


var hideLizardAndSpock = function hideLizardAndSpock() {
  var lizard = document.getElementById('lizard');
  var spock = document.getElementById('spock');
  lizard.classList.add('advanced-game-hide');
  spock.classList.add('advanced-game-hide');
};
/**
 * * Show the icons lizard and spock in the advanced game
 */


var showLizardAndSpock = function showLizardAndSpock() {
  var lizard = document.getElementById('lizard');
  var spock = document.getElementById('spock');
  lizard.classList.remove('advanced-game-hide');
  spock.classList.remove('advanced-game-hide');
};
/**
 * * Compare the machine result with the user result and return the winner    
 * @param {string} user move chosen by user 
 * @param {string} machine move chosen by machine 
 * return null if it is a tie
 * return 0 if user wins
 * return 1 if machine wins
*/


var winnerRound = function winnerRound(user, machine) {
  if (game.level === 'normal') {
    if (user === machine) return null;
    if (user === 'rock' && machine === 'scissors') return 0;
    if (user === 'paper' && machine === 'rock') return 0;
    if (user === 'scissors' && machine === 'paper') return 0;
    return 1;
  } else {
    if (user === machine) return null;
    if (user === 'rock' && (machine === 'scissors' || machine === 'lizard')) return 0;
    if (user === 'paper' && (machine === 'rock' || machine === 'spock')) return 0;
    if (user === 'scissors' && (machine === 'paper' || machine === 'lizard')) return 0;
    if (user === 'lizard' && (machine === 'paper' || machine === 'spock')) return 0;
    if (user === 'spock' && (machine === 'rock' || machine === 'scissors')) return 0;
    return 1;
  }
};
/**
 * * Update the result of the round
 * @param {null, 0 or 1} result 
 */


var updateResult = function updateResult(result) {
  if (result === null) return;
  result ? game.computer.score++ : game.user.score++;
  computerResult.textContent = game.computer.score;
  userResult.textContent = game.user.score;
};
/**
 * * Update the number of the round
 * @param {number} round The total rounds
 */


var updateInfoRound = function updateInfoRound(round) {
  var numberRounds = document.getElementById('info-round');
  var totalRounds = game.rounds;
  numberRounds.textContent = "Round ".concat(totalRounds - round + 1);
};
/**
 * * Update the winner of the round
 * @param {null, 0 or 1} winner 
 */


var updateRoundWinner = function updateRoundWinner(winner) {
  var roundWinner = document.getElementById('round-winner');
  var result = "";

  if (winner === null) {
    return;
  }

  winner ? result = "Computer Wins" : result = "User Wins";
  roundWinner.textContent = result;
};
/**
 * * Reset the scores, log, number of the round and winner of the round
 */


var reset = function reset() {
  var machine = game.computer.score = 0;
  var user = game.user.score = 0;
  game.log = [];
  computerResult.textContent = machine;
  userResult.textContent = user;
  var numberRounds = document.getElementById('info-round');
  numberRounds.textContent = 'Round 1';
  var roundWinner = document.getElementById('round-winner');
  roundWinner.textContent = '';
};
/**
 * * Countdown of three seconds
 */


var countdown = function countdown() {
  var time = document.getElementById('timer');
  var count = 3;
  time.textContent = "Time ".concat(count);
  var interval = setInterval(function () {
    time.textContent = "Time ".concat(--count);

    if (count === 0) {
      clearInterval(interval);
    }
  }, 1000);
};
/**
 * * Update log
 * @param {number} round total of rounds
 * @param {string} computer the computer move
 * @param {string} user the user move
 * @param {null, 0 or 1} winner the winner of the round
 */


var log = function log(round, computer, user, winner) {
  var totalRounds = game.rounds;
  var log = {
    round: totalRounds - round + 1,
    computer: computer,
    user: user,
    winner: winner
  };
  game.log.push(log);
};
/**
 * * Create the log modal
 */


var printerLog = function printerLog() {
  var modalContent = document.getElementById('modal-result-content');
  var fragment = document.createDocumentFragment();
  var div = document.createElement('DIV');
  var text = "";
  var winner = "";
  var checkTie = "";
  modalContent.innerHTML = "";
  game.computer.score > game.user.score ? winner = game.computer.username : winner = game.user.username;
  div.setAttribute('class', 'log');
  div.innerHTML += "\n        <p class=\"log__winner\">The winner is ".concat(winner, "</p>\n        <p><span class=\"green\">").concat(game.user.username, "</span> ").concat(game.user.score, " - ").concat(game.computer.score, " <span class=\"red\"> ").concat(game.computer.username, "</spam></p>\n    ");
  game.log.forEach(function (e) {
    if (e.winner === 0) {
      text = "<span class=\"green\">".concat(game.user.username, " wins</span>");
    } else if (e.winner === 1) {
      text = "<span class=\"red\">".concat(game.user.username, " loses</span>");
    } else {
      text = "".concat(game.user.username, " tie");
    }

    if (checkTie !== e.round) {
      checkTie = "<p class=\"log__round\">ROUND ".concat(e.round, "</p>");
    } else {
      checkTie = "";
    }

    div.innerHTML += "\n            <p>".concat(checkTie, "</p>\n            <p><img class=\"log__img\" src=\"images/").concat(e.user, ".svg\"> vs <img class=\"log__img\" src=\"../images/").concat(e.computer, ".svg\"> ").concat(text, " </p>\n        ");
    checkTie = e.round;
    fragment.appendChild(div);
  });
  div.innerHTML += "\n        <button id=\"hide-log\" class=\"button--XL active\">CLOSE</button>\n    ";
  modalContent.appendChild(fragment);
  hideLogListener();
};
/**
 * * Show the log
 */


var showModalResult = function showModalResult() {
  var modalResult = document.getElementById('modal-result');
  modalResult.classList.add('modal--show');
  printerLog();
};
/**
 * * Disabled the buttons of play and settings while the game is running
 */


var disabledButtons = function disabledButtons() {
  var buttonPlay = document.getElementById('start-game');
  var buttonSettings = document.getElementById('settings');
  buttonPlay.setAttribute('disabled', "");
  buttonPlay.classList.add('disabled');
  buttonSettings.setAttribute('disabled', "");
  buttonSettings.classList.add('disabled');
};
/**
 * * Enabled the buttons of play and settings
 */


var enabledButtons = function enabledButtons() {
  var buttonPlay = document.getElementById('start-game');
  var buttonSettings = document.getElementById('settings');
  buttonPlay.removeAttribute('disabled');
  buttonPlay.classList.remove('disabled');
  buttonSettings.removeAttribute('disabled');
  buttonSettings.classList.remove('disabled');
};
/**
 * * Reproduce a short audio at the end of each round
 */


var playAudio = function playAudio() {
  var audio = new Audio('audio/beep.mp3');
  audio.play();
};
/**
 * * This fuction contains all functions for the game to work
 */


var startGame = function startGame() {
  var rounds = game.rounds;
  disabledButtons();
  reset();

  (function loop(rounds) {
    countdown();
    setTimeout(function () {
      var machine = choiceMachine();
      var user = userChoice.getAttribute('data-value');
      var result = winnerRound(user, machine);
      updateInfoRound(rounds);
      updateResult(result);
      updateRoundWinner(result);
      playAudio();
      log(rounds, machine, user, result);
      if (result === null) rounds++;

      if (--rounds) {
        //When rounds is != 0 the condition is true 
        loop(rounds);
      } else {
        showModalResult();
        enabledButtons();
      }
    }, 3000);
  })(rounds);
}; //Listener


formStartGame.addEventListener('submit', function (e) {
  var usernameInput = document.getElementById('input-username');
  var username = document.getElementById('user-player-username');
  e.preventDefault(); // ? Block access withouth username

  if (usernameInput.value.trim().length > 0 && usernameInput.value.trim().length < 10) {
    sessionStorage.setItem('rockPaperScissorsUsername', usernameInput.value.trim());
  }

  game.user.username = getUsername();
  username.textContent = game.user.username;
});
movesChoice.addEventListener('click', function (e) {
  if (e.target.nodeName === 'IMG') {
    var dataValue = e.target.getAttribute("data-value");
    userChoice.src = e.target.src;
    userChoice.setAttribute('data-value', dataValue);
  }
});
var gameType = document.getElementById('select-game-type');
gameType.addEventListener('click', function (e) {
  var buttons = Array.from(gameType.childNodes).filter(function (e) {
    return e.nodeName === 'INPUT';
  });

  if (e.target.nodeName === "INPUT") {
    buttons.forEach(function (e) {
      return e.classList.remove('active');
    });
    e.target.classList.add('active');
    e.target.value === 'Classic' ? game.level = 'normal' : game.level = 'advanced';
  }
});
var gameRounds = document.getElementById('select-game-round');
gameRounds.addEventListener('click', function (e) {
  var buttons = Array.from(gameRounds.childNodes).filter(function (e) {
    return e.nodeName === 'INPUT';
  });

  if (e.target.nodeName === "INPUT") {
    buttons.forEach(function (e) {
      return e.classList.remove('active');
    });
    e.target.classList.add('active');
    game.rounds = Number(e.target.value);
  }
});
var go = document.getElementById('go');
go.addEventListener('click', function () {
  var modal = document.getElementById('modal-start');
  modal.classList.add('modal--hide');

  if (game.level === 'normal') {
    hideLizardAndSpock();
  } else {
    showLizardAndSpock();
  }
});

var hideLogListener = function hideLogListener() {
  var hideLog = document.getElementById('hide-log');
  hideLog.addEventListener('click', function () {
    var modal = document.getElementById('modal-result');
    modal.classList.remove('modal--show');
  });
};

play.addEventListener('click', function () {
  startGame();
});
var settings = document.getElementById('settings');
settings.addEventListener('click', function () {
  var modal = document.getElementById('modal-start');
  modal.classList.remove('modal--hide');
});