const userChoice = document.getElementById('user-choice-img')
const movesChoice = document.getElementById('move-choice-list') //mirar de cambiar nombre
const play = document.getElementById('start-game')
const computerResult = document.getElementById('computer-player-result')
const userResult = document.getElementById('user-player-result')
const formStartGame = document.getElementById('form-start-game')


//TODO hacer lo del log


const game ={
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
}


//Functions
// TODO Mostraconst gameType = document.getElementById('select-game-type')r el ganador final.

const getUsername = () =>{
    let result = sessionStorage.getItem('rockPaperScissorsUsername')
    if(result === null){
        result = 'Loser :P'
    }
    return result
}

//!función que genera un nº aleatorio para la máquina
const choiceMachine = () =>{
    const imgComputer = document.getElementById('computer-choice-img')
    const min = 0
    const options = ['rock', 'paper', 'scissors', 'lizard', 'spock' ]
    let result
    
    if(game.difficult === 'normal'){
        const max = 3
        result =  Math.floor(Math.random() * (max - min)) + min;
    }else{
        const max = 5
        result = Math.floor(Math.random() * (max - min)) + min;  
    }
    imgComputer.src =`images/${options[result]}.svg`
    return options[result]
}


//! TODO función que compara el resultado de la máquina con el rival y da un ganador
//!Return null  si es empate
//!Return 0 si gana user
//!Return 1 si gana machine
const winerRound = (user, machine) =>{
 
    if(game.difficult === 'normal'){
        // TODO la parte normal
        console.log("HACER")
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

const updateResult = (result) =>{
    if(result === null) return;
    
    (result) 
        ? game.computer.score++
        : game.user.score++ 

    computerResult.textContent = game.computer.score
    userResult.textContent = game.user.score
}

const updateInfoRound = (round) =>{
    const numberRounds = document.getElementById('info-round')  
    const totalRounds = game.rounds
    
    numberRounds.textContent = `Round ${totalRounds - round + 1}`    
}

const updateRoundWinner = (winner) =>{
    // TODO usar la constante que tiene almacenada el nombre  
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

const reset = () =>{
    const machine = game.computer.score = 0
    const user = game.user.score = 0

    computerResult.textContent = machine
    userResult.textContent = user

    const numberRounds = document.getElementById('info-round')
    numberRounds.textContent = 'Round 1'

    const roundWinner = document.getElementById('round-winner')
    roundWinner.textContent = ''
}

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

const printerLog = () =>{
    const modalContent = document.getElementById('modal-result-content')
    const fragment = document.createDocumentFragment()
    const div = document.createElement('DIV')  
    let text = ""
    let winner = ""
    let checkTie = "";

    (game.computer.score > game.user.score)
        ? winner = game.computer.username
        : winner = game.user.username

    div.innerHTML+=`
        <p>The winner is ${winner}</p>
        <p>${game.user.username} ${game.user.score} - ${game.computer.score} ${game.computer.username}  </p>
    `
    game.log.forEach(e =>{
        
        if(e.winner === 0){
            text = `${game.user.username} wins`

        }else if(e.winner === 1){
            text = `${game.user.username} loses`

        }else{
            text = `${game.user.username} tie`
        }

        if(checkTie !== e.round){            
           checkTie =  `<p>Round ${e.round}</p>`            
        }else{
            checkTie = ""
        } 

        div.innerHTML +=`
            <p>${checkTie}</p>
            <p>${e.user} VS ${e.computer} ${text} </p>
        ` 
        checkTie = e.round
        fragment.appendChild(div)
    })
    modalContent.appendChild(fragment)
}

const showModalResult = () =>{
    const modalResult = document.getElementById('modal-result')

    modalResult.classList.add('modal--show')

    printerLog()
}

const startGame = () =>{
    const buttonPlay = document.getElementById('start-game')
    const rounds = game.rounds

    buttonPlay.setAttribute('disabled', "")

    reset(); 

    (function loop(rounds) {        
        countdown(); 

        setTimeout(()=> {        
            
            const machine = choiceMachine()      
            const user = userChoice.getAttribute('data-value')                
            const result = winerRound(user, machine)     
            
            updateInfoRound(rounds)
            updateResult(result)
            updateRoundWinner(result)
            log(rounds, machine, user, result)

            if(result === null) 
                rounds++;

            if(--rounds){//When rounds is != 0 the condition is true 
                loop(rounds)
            }else{
                buttonPlay.removeAttribute('disabled')
                showModalResult()
            }        

        }, 3000)
                
    })(rounds);  
    

    
}

//Listener
formStartGame.addEventListener('submit', e =>{
    const usernameInput = document.getElementById('input-username')
    const username = document.getElementById('user-player-username')
    
    if(usernameInput.value.trim().length > 0 && usernameInput.value.trim().length < 20){
        sessionStorage.setItem('rockPaperScissorsUsername', usernameInput.value.trim())
    }else{
        console.log('Nombre incorrecto') //TODO Añadir una clase para poner el nombre en rojo y mostrar el aviso
    }

    e.preventDefault()    
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
            ? game.difficult = 'normal'
            : game.difficult = 'advanced' 
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
})

play.addEventListener('click', () =>{
    startGame()
})