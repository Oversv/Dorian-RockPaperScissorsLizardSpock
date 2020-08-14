"use strict";

var userChoice = document.getElementById('user-choice-img');
var movesChoice = document.getElementById('move-choice-list'); //mirar de cambiar nombre

var play = document.getElementById('start-game');
var computerResult = document.getElementById('computer-player-result');
var userResult = document.getElementById('user-player-result');
var formStartGame = document.getElementById('form-start-game'); //TODO hacer lo del log

var game = {
  computer: {
    username: "Machine",
    score: 0
  },
  user: {
    username: "",
    score: 0
  },
  difficult: "advanced",
  rounds: 1,
  log: []
}; //Functions
// TODO Mostraconst gameType = document.getElementById('select-game-type')r el ganador final.

var getUsername = function getUsername() {
  var result = sessionStorage.getItem('rockPaperScissorsUsername');

  if (result === null) {
    result = 'Loser :P';
  }

  return result;
}; //!función que genera un nº aleatorio para la máquina


var choiceMachine = function choiceMachine() {
  var imgComputer = document.getElementById('computer-choice-img');
  var min = 0;
  var options = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  var result;

  if (game.difficult === 'normal') {
    var max = 3;
    result = Math.floor(Math.random() * (max - min)) + min;
  } else {
    var _max = 5;
    result = Math.floor(Math.random() * (_max - min)) + min;
  }

  imgComputer.src = "images/".concat(options[result], ".svg");
  return options[result];
}; //! TODO función que compara el resultado de la máquina con el rival y da un ganador
//!Return null  si es empate
//!Return 0 si gana user
//!Return 1 si gana machine


var winerRound = function winerRound(user, machine) {
  if (game.difficult === 'normal') {
    // TODO la parte normal
    console.log("HACER");
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

var updateResult = function updateResult(result) {
  if (result === null) return;
  result ? game.computer.score++ : game.user.score++;
  computerResult.textContent = game.computer.score;
  userResult.textContent = game.user.score;
};

var updateInfoRound = function updateInfoRound(round) {
  var numberRounds = document.getElementById('info-round');
  var totalRounds = game.rounds;
  numberRounds.textContent = "Round ".concat(totalRounds - round + 1);
};

var updateRoundWinner = function updateRoundWinner(winner) {
  // TODO usar la constante que tiene almacenada el nombre  
  var roundWinner = document.getElementById('round-winner');
  var result = "";

  if (winner === null) {
    return;
  }

  winner ? result = "Computer Wins" : result = "User Wins";
  roundWinner.textContent = result;
};

var reset = function reset() {
  var machine = game.computer.score = 0;
  var user = game.user.score = 0;
  computerResult.textContent = machine;
  userResult.textContent = user;
  var numberRounds = document.getElementById('info-round');
  numberRounds.textContent = 'Round 1';
  var roundWinner = document.getElementById('round-winner');
  roundWinner.textContent = '';
};

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

var printerLog = function printerLog() {
  var modalContent = document.getElementById('modal-result-content');
  var fragment = document.createDocumentFragment();
  var div = document.createElement('DIV');
  var text = "";
  var winner = "";
  var checkTie = "";
  game.computer.score > game.user.score ? winner = game.computer.username : winner = game.user.username;
  div.innerHTML += "\n        <p>The winner is ".concat(winner, "</p>\n        <p>").concat(game.user.username, " ").concat(game.user.score, " - ").concat(game.computer.score, " ").concat(game.computer.username, "  </p>\n    ");
  game.log.forEach(function (e) {
    if (e.winner === 0) {
      text = "".concat(game.user.username, " wins");
    } else if (e.winner === 1) {
      text = "".concat(game.user.username, " loses");
    } else {
      text = "".concat(game.user.username, " tie");
    }

    if (checkTie !== e.round) {
      checkTie = "<p>Round ".concat(e.round, "</p>");
    } else {
      checkTie = "";
    }

    div.innerHTML += "\n            <p>".concat(checkTie, "</p>\n            <p>").concat(e.user, " VS ").concat(e.computer, " ").concat(text, " </p>\n        ");
    checkTie = e.round;
    fragment.appendChild(div);
  });
  modalContent.appendChild(fragment);
};

var showModalResult = function showModalResult() {
  var modalResult = document.getElementById('modal-result');
  modalResult.classList.add('modal--show');
  printerLog();
};

var startGame = function startGame() {
  var buttonPlay = document.getElementById('start-game');
  var rounds = game.rounds;
  buttonPlay.setAttribute('disabled', "");
  reset();

  (function loop(rounds) {
    countdown();
    setTimeout(function () {
      var machine = choiceMachine();
      var user = userChoice.getAttribute('data-value');
      var result = winerRound(user, machine);
      updateInfoRound(rounds);
      updateResult(result);
      updateRoundWinner(result);
      log(rounds, machine, user, result);
      if (result === null) rounds++;

      if (--rounds) {
        //When rounds is != 0 the condition is true 
        loop(rounds);
      } else {
        buttonPlay.removeAttribute('disabled');
        showModalResult();
      }
    }, 3000);
  })(rounds);
}; //Listener


formStartGame.addEventListener('submit', function (e) {
  var usernameInput = document.getElementById('input-username');
  var username = document.getElementById('user-player-username');

  if (usernameInput.value.trim().length > 0 && usernameInput.value.trim().length < 20) {
    sessionStorage.setItem('rockPaperScissorsUsername', usernameInput.value.trim());
  } else {
    console.log('Nombre incorrecto'); //TODO Añadir una clase para poner el nombre en rojo y mostrar el aviso
  }

  e.preventDefault();
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
    e.target.value === 'Classic' ? game.difficult = 'normal' : game.difficult = 'advanced';
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
});
play.addEventListener('click', function () {
  startGame();
});