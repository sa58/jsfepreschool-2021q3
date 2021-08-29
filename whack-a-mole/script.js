let scoreBoard = document.querySelector('.score');
let levelBoard = document.querySelector('.level');
let livesBoard = document.querySelector('.lives');

let title = document.querySelector('h2');

let game = document.querySelector('.game');
let board = document.querySelector('.board');
let init = document.querySelector('.init');

let levelBest = document.querySelector('.best-level');
let scoreBest = document.querySelector('.best-score');
let levelLast = document.querySelector('.last-level');
let scoreLast = document.querySelector('.last-score');

let levelTime = 1000
let finish = false;
let scoreCount = 0;
let levelCount = 0;
let livesCount = 3;

let intervalLevel = 5000;

const nameStore = 'whack-a-balloon';

function initGame() {
  setText(livesBoard, livesCount);
  let statMemory = JSON.parse(localStorage.getItem(nameStore));
  let stat;

  if(!statMemory) {
    stat = {
      best: {level: 0, score: 0},
      last: {level: 0, score: 0}
    };
    localStorage.setItem(nameStore, JSON.stringify(stat));
  } else {
    stat = statMemory;
  }

  setText(levelBest, stat.best.level);
  setText(scoreBest, stat.best.score);
  setText(levelLast, stat.last.level);
  setText(scoreLast, stat.last.score);
}

function setText(el, value) {
  el.textContent = value;
}

function resetStats() {
  board.innerHTML = '';

  livesCount = 3;
  setText(livesBoard, livesCount);

  levelCount = 0;
  setText(levelBoard, levelCount);

  scoreCount = 0;
  setText(scoreBoard, scoreCount);

  levelTime = 1000;
  finish = false;
}

function randomTime(min, max) {
  // TODO
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomLeftPos() {
  let min = 0;
  let max = document.documentElement.clientWidth;

  // TODO
  return Math.round(Math.random() * (max - min) + min);
}

function startGame() {
  resetStats();

  game.classList.remove('invisible');
  init.classList.add('invisible');
  board.classList.remove('inactive');

  showBalloons();

  let timerID = setInterval(() => {
    if(livesCount === 0) {
      finish = true;
      clearInterval(timerID);
    } else {
      levelCount++;
      setText(levelBoard, levelCount);

      if(levelTime !== 100) {
        levelTime = levelTime - 50;
      }
    }

  }, intervalLevel)
}

function finishGame() {
  let best = calcBestResult();

  setText(title, 'Game over');

  setText(levelBest, best.level);
  setText(scoreBest, best.score);
  setText(levelLast, levelCount);
  setText(scoreLast, scoreCount);

  const score1 = {
    best: {level: best.level, score: best.score},
    last: {level: levelCount, score: scoreCount}
  };

  localStorage.setItem(nameStore, JSON.stringify(score1));

  board.classList.add('inactive');
  init.classList.remove('invisible');
}

function calcBestResult() {
  let stat = JSON.parse(localStorage.getItem(nameStore));
  let best = {};

  if(levelCount > stat.best.level) {
    best.level = levelCount;
    best.score = scoreCount;

    return best;
  }

  if(levelCount === stat.best.level) {
    if(scoreCount > stat.best.score) {
      best.level = levelCount;
      best.score = scoreCount;

      return best;
    }
  }

  return stat.best;
};

function createBalloon() {
  let el = document.createElement("div");
  el.classList.add('balloon');
  el.style.left = `${getRandomLeftPos()}px`;

  el.addEventListener('click', function(e) {
    if(!e.isTrusted) return;
    scoreCount++;
    setText(scoreBoard, scoreCount);
    this.remove();
  });

  board.append(el);
  return el;
}

function showBalloons() {
  const time = randomTime(20, levelTime);
  let balloon = createBalloon();

  let timerID = setTimeout(() => {
    if(!finish) showBalloons();
    let start = Date.now();
    let animationID;

    function animate() {
      let timePassed = Date.now() - start;
      balloon.style.transform = `translateY(-${timePassed / 10}px)`

      // TODO
      let transformProp = window.getComputedStyle(balloon).getPropertyValue("transform");
      if(transformProp) {
        let transformPropY = transformProp.split('(')[1].split(')')[0].split(',')[5];
        
        if(parseInt(transformPropY) < -1 * document.documentElement.clientHeight) {
          livesCount--;
          setText(livesBoard, livesCount);
          balloon.remove();
        };
      }

      if(livesCount === 0) {
        clearTimeout(timerID);
        cancelAnimationFrame(animationID);
      } else {
        animationID = requestAnimationFrame(animate);
      }
    }

    if(livesCount === 0) {
      cancelAnimationFrame(animationID);
      finishGame();
    } else {
      animationID = requestAnimationFrame(animate);
    }
  }, time)
}

initGame();
