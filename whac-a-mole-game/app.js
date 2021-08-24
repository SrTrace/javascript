const square = document.querySelectorAll('.square');
const mole = document.querySelectorAll('.mole');
const timeLeft = document.querySelector('#time-left');
let score = document.querySelector('#score');

let result =  0;
let currentTime = Number(timeLeft.textContent);
let hitPosition = null;
let timerIdMole;
let timerIdCounter;

function randomSquare() {
    square.forEach(className => {
        className.classList.remove('mole');
    });
    let randomPosition = square[Math.floor(Math.random()*9)];
    randomPosition.classList.add('mole');

    // assing the id of the randomPosition to hitPosition for us to use later
    hitPosition = randomPosition.id;
}

square.forEach(el => {
   el.addEventListener('mousedown', ()=> {
       if (el.id === hitPosition) {
           result++;
           score.textContent = result.toString();
           hitPosition = null;
       }
   });
});

function moveMole() {
    timerIdMole =  setInterval(randomSquare, 1000);
}

moveMole();

function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime.toString();

    if (currentTime === 0) {
        clearInterval(timerIdCounter);
        clearInterval(timerIdMole);
        console.log('Game Over! Your final score is ' + result);
    }
}

timerIdCounter = setInterval(countDown, 1000);