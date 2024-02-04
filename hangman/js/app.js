const body = document.querySelector('body');

let currentWord;
let wrongGuesseCount;
let correctLetters;
const maxGuesses = 6;

function renderGamePage() {
    body.insertAdjacentHTML('afterbegin', `
        <div class="container">
            <div class="hangman-box">
                <img class="hangman-box__img" src="./assets/images/hangman-0.svg" alt="hangman img">
                <h1 class="hangman-box__title">Hangman Game</h1>
            </div>
            <div class="game-box">
                <ul class="word-display"></ul>
                <h2 class="game-box__title hint-text">Hint: 
                    <b></b>
                </h2>
                <h2 class="game-box__title guesses-text">Incorrect guesses: 
                    <b></b>
                </h2>
                <div class="keyboard"></div>
            </div>
            </div>
            <div class="game-modal">
                <div class="modal-content">
                    <img class="modal-content__img">
                    <h2 class="modal-content__title"></h2>
                    <p class="modal-content__text"></p>
                    <button class="play-again modal-content__button">Play Again</button>
                </div>
        </div>
    `);

    const hangmanImg = document.querySelector('.hangman-box__img');
    const keyboard = document.querySelector('.keyboard');
    const wordDisplay = document.querySelector('.word-display');
    const guessesText = document.querySelector('.guesses-text b');
    const gameModal = document.querySelector('.game-modal');
    const playAgainBtn = document.querySelector('.play-again');

    function resetGame() {
        correctLetters = [];
        wrongGuesseCount = 0;
        hangmanImg.src = `./assets/images/hangman-${wrongGuesseCount}.svg`;
        guessesText.innerText = `${wrongGuesseCount} / ${maxGuesses}`;
        keyboard.querySelectorAll('button').forEach(btn => btn.disabled = false);
        wordDisplay.innerHTML = currentWord.split('').map(() => `<li class="letter"></li>`).join('');
        gameModal.classList.remove('show');   
    }

    function gameOver(isVictory) {
        setTimeout(() => {
            const modalText = isVictory? `You find the word:` : `The correct word was:`;
            gameModal.classList.add('show');
            document.querySelector('.modal-content__img').src = `./assets/images/${isVictory? 'victory' : 'lost'}.gif`;
            document.querySelector('.modal-content__img').alt = `${isVictory? 'victory' : 'lost'} gif`;
            document.querySelector('.modal-content__title').innerText = `${isVictory? 'Congrats!' : 'Game Over!'}`;
            document.querySelector('.modal-content__text').innerHTML = `${modalText} <b>${currentWord}</b>`;
            let audio = isVictory? new Audio('./assets/audio/win.mp3') : new Audio('./assets/audio/draw.mp3');
            audio.play();       
        }, 300);
    }
    
    function initGame(button, clickedLetter) {
        if(currentWord.includes(clickedLetter)) {
            currentWord.split('').forEach((letter, index) => {
                if(letter === clickedLetter) {
                    correctLetters.push(letter);
                    wordDisplay.querySelectorAll('li')[index].innerText = letter;
                    wordDisplay.querySelectorAll('li')[index].classList.add('guessed');
                }
            })
        } else {
            wrongGuesseCount ++;
            hangmanImg.src = `./assets/images/hangman-${wrongGuesseCount}.svg`;
        }
        button.disabled = true;
        guessesText.innerText = `${wrongGuesseCount} / ${maxGuesses}`;
    
        if(wrongGuesseCount === maxGuesses) return gameOver(false);
        if(correctLetters.length === currentWord.length) return gameOver(true);
    }

    function createKeyboardButtons() {
        for(let i = 97; i < 123; i++) {
            const button = document.createElement('button');
            button.innerText = String.fromCharCode(i);
            keyboard.append(button);
            button.addEventListener('click', e => initGame(e.target, String.fromCharCode(i)))
        }
    }

    function getRandomWord() {
        const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
        if(currentWord === word) {
            getRandomWord();
        } else {
            currentWord = word;
            console.log(`word: ${word}`);
            document.querySelector('.hint-text b').innerText = hint;
            resetGame();
        }
    }

    playAgainBtn.addEventListener('click', getRandomWord);

    document.addEventListener('keydown', function(e) {
        if (e.key === "Enter" && gameModal.classList.contains("show")) {
            getRandomWord();
        } else if(!gameModal.classList.contains("show")) {
            if( /^[a-zA-Z]$/i.test(e.key)){
                let button;
                let key = e.key.toLowerCase();
                keyboard.querySelectorAll('button').forEach((btn, index) => {
                    if(key === btn.innerText.toLowerCase() && !btn.disabled) {
                        button = keyboard.querySelectorAll('button')[index];
                        initGame(button, key);
                    }
                });           
            } else {
                alert('Please, use for game English letter keys') 
            }           
        }
    });

    createKeyboardButtons();
    getRandomWord();
}

renderGamePage();
