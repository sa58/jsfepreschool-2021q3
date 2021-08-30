console.log(`
  1.1 Код исходного проекта изучен, местами воспроизведен
  (10)
  2.1 Скорость появления шаров увеличивается каждые 5 секунд (максимальный уровень - 18)
  2.2 В LocalStorage сохраняются лучший и последний результаты; доступны после перезагрузки
  (10)
  3.1 Добавлена анимация
  3.2 Добавлено ограничение на количество пропущенных шаров
  (10)
`)

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

// TODO: compute this value
let balloonWidth = 90

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
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomLeftPos() {
  let min = 0;
  let max = document.documentElement.clientWidth;

  let rand = Math.floor(Math.random() * (max - min + 1));

  if(max - rand < balloonWidth) {
    let min1  = balloonWidth - (max - rand);
    let max1 = balloonWidth;

    // balloons on the right appear more than on the left
    let randRightPos = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
    let leftOrRight = Math.floor(Math.random() * 2);

    // generally balance is recovered
    if(leftOrRight) {
      rand = rand - randRightPos;
    } else {
      rand = max - (max - (max - rand));
    }
  }

  return rand;
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
      if(levelTime !== 100) {
        levelCount++;
        setText(levelBoard, levelCount);
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

  const newScore = {
    best: {level: best.level, score: best.score},
    last: {level: levelCount, score: scoreCount}
  };

  localStorage.setItem(nameStore, JSON.stringify(newScore));

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

    // TODO
    if(livesCount === 0) {
      cancelAnimationFrame(animationID);
      finishGame();
    } else {
      animationID = requestAnimationFrame(animate);
    }
  }, time)
}

initGame();
