let sliderLeft = document.querySelector('.slider-left');
let sliderLeftItems = sliderLeft.querySelector('.slides');

let sliderRigth = document.querySelector('.slider-right');
let sliderRightItems = sliderRigth.querySelector('.slides');

let prev = document.querySelector('.prev');
let next = document.querySelector('.next');

const up = -1;
const down = 1;

function slide(wrapper, items, prev, next) {
  let posInitial;
  let slides = items.getElementsByClassName('slide');
  let slidesLength = slides.length;
  let slideSize = slides[0].offsetHeight;
  let firstSlide = slides[0];
  let lastSlide = slides[slidesLength - 1];
  let cloneFirst = firstSlide.cloneNode(true);
  let cloneLast = lastSlide.cloneNode(true);
  let index = 0;
  let allowShift = true;

  // Clone first and last slide
  items.appendChild(cloneFirst);
  items.insertBefore(cloneLast, firstSlide);
  wrapper.classList.add('loaded');

  const formDirections = (dir1, dir2) => {
    if(wrapper.classList.contains('slider-right')) {
      shiftSlide(dir1);
    } else {
      shiftSlide(dir2);
    }
  }

  document.addEventListener('wheel', (event) => {
    if(event.deltaY > 0) {
      formDirections(down, up);
    }

    if(event.deltaY < 0) {
      formDirections(up, down);
    }
  });

  // Click events
  prev.addEventListener('click', function() {
    formDirections(down, up);
  });

  next.addEventListener('click', function() {
    formDirections(up, down);
  });

  // Transition events
  items.addEventListener('transitionend', checkIndex);

  function shiftSlide(dir) {
    items.classList.add('shifting');

    if(allowShift) {
      posInitial = items.offsetTop;

      if(dir == 1) {
        items.style.top = `${posInitial - slideSize}px`;
        index++;
      } 

      if(dir == -1) {
        items.style.top = `${posInitial + slideSize}px`;
        index--;
      }
    }

    allowShift = false;
  }

  function checkIndex() {
    items.classList.remove('shifting');

    if(index == -1) {
      items.style.top = `${-(slidesLength * slideSize)}px`;
      index = slidesLength - 1;
    }

    if(index == slidesLength) {
      items.style.top = `${-(1 * slideSize)}px`;
      index = 0;
    }

    allowShift = true;
  }
}

slide(sliderLeft, sliderLeftItems, prev, next);
slide(sliderRigth, sliderRightItems, prev, next);
