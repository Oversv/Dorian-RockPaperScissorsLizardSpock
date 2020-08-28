const userChoice = document.getElementById('user-choice-img')
const movesChoice = document.getElementById('move-choice-list') //mirar de cambiar nombre
const play = document.getElementById('start-game')
const computerResult = document.getElementById('computer-player-result')
const userResult = document.getElementById('user-player-result')
const formStartGame = document.getElementById('form-start-game')
const game ={
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
} 
//Functions
/**
 * * Return the username
 */
const getUsername = () =>{
    let result = sessionStorage.getItem('rockPaperScissorsUsername')
    if(result === null){
        result = 'Loser :P'
    }
    return result
}

/**
 * * Generate a machine move, return a string with the move
 */
const choiceMachine = () =>{
    const imgComputer = document.getElementById('computer-choice-img')
    const min = 0
    const options = ['rock', 'paper', 'scissors', 'lizard', 'spock' ]
    let result
    
    if(game.level === 'normal'){ 
        const max = 3
        result =  Math.floor(Math.random() * (max - min)) + min;
    }else{
        const max = 5
        result = Math.floor(Math.random() * (max - min)) + min;  
    }
    imgComputer.src =`images/${options[result]}.svg`
    return options[result]
}
/**
 * * Hide the icons lizard and spock in the classic game
 */
const hideLizardAndSpock = () =>{
    const lizard = document.getElementById('lizard')
    const spock = document.getElementById('spock')
    
    lizard.classList.add('advanced-game-hide')
    spock.classList.add('advanced-game-hide')
}
/**
 * * Show the icons lizard and spock in the advanced game
 */
const showLizardAndSpock = () =>{
    const lizard = document.getElementById('lizard')
    const spock = document.getElementById('spock')
    
    lizard.classList.remove('advanced-game-hide')
    spock.classList.remove('advanced-game-hide')
}

/**
 * * Compare the machine result with the user result and return the winner    
 * @param {string} user move chosen by user 
 * @param {string} machine move chosen by machine 
 * return null if it is a tie
 * return 0 if user wins
 * return 1 if machine wins
*/
const winnerRound = (user, machine) =>{
 
    if(game.level === 'normal'){
        if(user === machine) return null
        if(user === 'rock'     && machine === 'scissors') return 0
        if(user === 'paper'    && machine === 'rock')     return 0
        if(user === 'scissors' && machine === 'paper')    return 0

        return 1

    }else{
        if(user === machine) return null
        if(user === 'rock'     && (machine === 'scissors' || machine === 'lizard'))   return 0
        if(user === 'paper'    && (machine === 'rock'     || machine === 'spock'))    return 0
        if(user === 'scissors' && (machine === 'paper'    || machine === 'lizard'))   return 0
        if(user === 'lizard'   && (machine === 'paper'    || machine === 'spock'))    return 0
        if(user === 'spock'    && (machine === 'rock'     || machine === 'scissors')) return 0
        
        return 1
    }  
}
/**
 * * Update the result of the round
 * @param {null, 0 or 1} result 
 */
const updateResult = (result) =>{
    if(result === null) return;
    
    (result) 
        ? game.computer.score++
        : game.user.score++ 

    computerResult.textContent = game.computer.score
    userResult.textContent = game.user.score
}
/**
 * * Update the number of the round
 * @param {number} round The total rounds
 */
const updateInfoRound = (round) =>{
    const numberRounds = document.getElementById('info-round')  
    const totalRounds = game.rounds
    
    numberRounds.textContent = `Round ${totalRounds - round + 1}`    
}
/**
 * * Update the winner of the round
 * @param {null, 0 or 1} winner 
 */
const updateRoundWinner = (winner) =>{

    const roundWinner = document.getElementById('round-winner')
    let result = "";    

    if(winner === null){
       return; 
    }

    (winner) 
        ? result = "Computer Wins" 
        : result = "User Wins"

    roundWinner.textContent = result
}
/**
 * * Reset the scores, log, number of the round and winner of the round
 */
const reset = () =>{
    const machine = game.computer.score = 0
    const user = game.user.score = 0
    game.log = []

    computerResult.textContent = machine
    userResult.textContent = user

    const numberRounds = document.getElementById('info-round')
    numberRounds.textContent = 'Round 1'

    const roundWinner = document.getElementById('round-winner')
    roundWinner.textContent = ''
}
/**
 * * Countdown of three seconds
 */
const countdown = () =>{
    const time = document.getElementById('timer');
    let count = 3;

    time.textContent = `Time ${count}`
   
    const interval = setInterval(()=>{

        time.textContent = `Time ${--count}`
        
        if (count === 0){
            clearInterval(interval);            
        }
    }, 1000);
}

/**
 * * Update log
 * @param {number} round total of rounds
 * @param {string} computer the computer move
 * @param {string} user the user move
 * @param {null, 0 or 1} winner the winner of the round
 */
const log = (round, computer, user, winner) =>{    
    const totalRounds = game.rounds     
    const log = {
        round: totalRounds - round + 1,
        computer,
        user,
        winner    
    }

    game.log.push(log) 
}

/**
 * * Create the log modal
 */
const printerLog = () =>{
    let modalContent = document.getElementById('modal-result-content')
    const fragment = document.createDocumentFragment()
    const div = document.createElement('DIV')  
    let text = ""
    let winner = ""
    let checkTie = ""

    modalContent.innerHTML= "";

    (game.computer.score > game.user.score)
        ? winner = game.computer.username
        : winner = game.user.username

    div.setAttribute('class', 'log')
    div.innerHTML+=`
        <p class="log__winner">The winner is ${winner}</p>
        <p><span class="green">${game.user.username}</span> ${game.user.score} - ${game.computer.score} <span class="red"> ${game.computer.username}</spam></p>
    `
    game.log.forEach(e =>{
        
        if(e.winner === 0){
            text = `<span class="green">${game.user.username} wins</span>`

        }else if(e.winner === 1){
            text = `<span class="red">${game.user.username} loses</span>`

        }else{
            text = `${game.user.username} tie`
        }

        if(checkTie !== e.round){            
           checkTie = `<p class="log__round">ROUND ${e.round}</p>`            
        }else{
            checkTie = ""
        } 

        div.innerHTML +=`
            <p>${checkTie}</p>
            <p><img class="log__img" src="images/${e.user}.svg"> vs <img class="log__img" src="images/${e.computer}.svg"> ${text} </p>
        ` 
        checkTie = e.round
        fragment.appendChild(div)
    }) 

    div.innerHTML+=`
        <button id="hide-log" class="button--XL active">CLOSE</button>
    `

    modalContent.appendChild(fragment)
    hideLogListener()
}
/**
 * * Show the log
 */
const showModalResult = () =>{
    const modalResult = document.getElementById('modal-result')

    modalResult.classList.add('modal--show')

    printerLog()
}
/**
 * * Disabled the buttons of play and settings while the game is running
 */
const disabledButtons = () =>{
    const buttonPlay = document.getElementById('start-game')
    const buttonSettings = document.getElementById('settings')

    buttonPlay.setAttribute('disabled', "")
    buttonPlay.classList.add('disabled')

    buttonSettings.setAttribute('disabled', "")
    buttonSettings.classList.add('disabled')
}
/**
 * * Enabled the buttons of play and settings
 */
const enabledButtons = () =>{
    const buttonPlay = document.getElementById('start-game')
    const buttonSettings = document.getElementById('settings')

    buttonPlay.removeAttribute('disabled')
    buttonPlay.classList.remove('disabled')

    buttonSettings.removeAttribute('disabled')
    buttonSettings.classList.remove('disabled')
}
/**
 * * Reproduce a short audio at the end of each round
 */
const playAudio = () =>{
    const audio = new Audio('audio/beep.mp3')   

    audio.play()
}

/**
 * * This fuction contains all functions for the game to work
 */
const startGame = () =>{   
    
    const rounds = game.rounds

    disabledButtons()
    reset(); 

    (function loop(rounds) {        
        countdown(); 

        setTimeout(()=> {        
            
            const machine = choiceMachine()      
            const user = userChoice.getAttribute('data-value')                
            const result = winnerRound(user, machine)     
            
            updateInfoRound(rounds)
            updateResult(result)
            updateRoundWinner(result)
            playAudio()
            log(rounds, machine, user, result)

            if(result === null) 
                rounds++;

            if(--rounds){//When rounds is != 0 the condition is true 
                loop(rounds)
            }else{
                showModalResult()
                enabledButtons()
            }        

        }, 3000)                
    })(rounds);  
}

//Listener
formStartGame.addEventListener('submit', e =>{
    const usernameInput = document.getElementById('input-username')
    const username = document.getElementById('user-player-username')
    e.preventDefault()    
    
    // ? Block access withouth username
    if(usernameInput.value.trim().length > 0 && usernameInput.value.trim().length < 10){
        sessionStorage.setItem('rockPaperScissorsUsername', usernameInput.value.trim())        
    }
    
    game.user.username = getUsername()
    username.textContent = game.user.username    
    
})

movesChoice.addEventListener('click', e =>{
    if(e.target.nodeName === 'IMG'){
        const dataValue = e.target.getAttribute("data-value")

        userChoice.src = e.target.src
        userChoice.setAttribute('data-value', dataValue)        
    }
})


const gameType = document.getElementById('select-game-type')
gameType.addEventListener('click', e =>{
    
    const buttons = Array.from(gameType.childNodes).filter(e => e.nodeName === 'INPUT')

    if(e.target.nodeName === "INPUT"){

        buttons.forEach(e => e.classList.remove('active'))
        e.target.classList.add('active');
        
        (e.target.value === 'Classic')
            ? game.level = 'normal'
            : game.level = 'advanced' 
    }  
})

const gameRounds = document.getElementById('select-game-round')
gameRounds.addEventListener('click', e =>{
    
    const buttons = Array.from(gameRounds.childNodes).filter(e => e.nodeName === 'INPUT')

    if(e.target.nodeName === "INPUT"){

        buttons.forEach(e => e.classList.remove('active'))
        e.target.classList.add('active')

        game.rounds = Number(e.target.value)
    }     
})

const go = document.getElementById('go')
go.addEventListener('click', ()=>{
    const modal = document.getElementById('modal-start')
    modal.classList.add('modal--hide')

    if(game.level === 'normal'){
        hideLizardAndSpock()               
    }else{
        showLizardAndSpock()
    }
})

const hideLogListener = () =>{

    const hideLog = document.getElementById('hide-log')
    hideLog.addEventListener('click', () =>{
        const modal = document.getElementById('modal-result')
        modal.classList.remove('modal--show')
    })
}

play.addEventListener('click', () =>{
    startGame()
})

const settings = document.getElementById('settings')
settings.addEventListener('click', ()=>{
    
    const modal = document.getElementById('modal-start')    
    modal.classList.remove('modal--hide')
})
