let sliderLeft = document.querySelector('.slider-left');
let sliderLeftItems = sliderLeft.querySelector('.slides');

let sliderRigth = document.querySelector('.slider-right');
let sliderRightItems = sliderRigth.querySelector('.slides');

let prev = document.querySelector('.prev');
let next = document.querySelector('.next');

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

  document.addEventListener('wheel', (event) => {
    if(event.deltaY > 0) {
      if(wrapper.classList.contains('slider-right')) {
        shiftSlide(1);
      } else {
        shiftSlide(-1);
      }
    }

    if(event.deltaY < 0) {
      if(wrapper.classList.contains('slider-right')) {
        shiftSlide(-1);
      } else {
        shiftSlide(1);
      }
    }
  });


  // Click events
  prev.addEventListener('click', function() {
    if(wrapper.classList.contains('slider-right')) {
      shiftSlide(1);
    } else {
      shiftSlide(-1);
    }
  });

  next.addEventListener('click', function() {
    if(wrapper.classList.contains('slider-right')) {
      shiftSlide(-1);
    } else {
      shiftSlide(1);
    }
  });

  // Transition events
  items.addEventListener('transitionend', checkIndex);

  function shiftSlide(dir, action) {
    items.classList.add('shifting');

    if(allowShift) {
      if(!action) {
        posInitial = items.offsetTop;
      }

      if (dir == 1) {
        items.style.top = posInitial - slideSize + 'px';
        index++;
      } else if (dir == -1) {
        items.style.top = posInitial + slideSize + 'px';
        index--;
      }
    }

    allowShift = false;
  }

  function checkIndex() {
    items.classList.remove('shifting');

    if (index == -1) {
      items.style.top = -(slidesLength * slideSize) + 'px';
      index = slidesLength - 1;
    }

    if (index == slidesLength) {
      items.style.top = -(1 * slideSize) + 'px';
      index = 0;
    }

    allowShift = true;
  }
}

slide(sliderLeft, sliderLeftItems, prev, next);
slide(sliderRigth, sliderRightItems, prev, next);
