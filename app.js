const btnDown = document.querySelector('.btn-down');
const btnUp = document.querySelector('.btn-up');

const sliderContainer = document.querySelector('.slider');
const slidesCount = sliderContainer.querySelectorAll('div');

let activeSlideIndex = 0;

btnDown.addEventListener('click', () => {
  changeSlides();
})

btnUp.addEventListener('click', () => {
  changeSlides();
})

const changeSlides = () => {
  activeSlideIndex++;

  const height = sliderContainer.clientHeight;

  console.log(activeSlideIndex, height)

  if(activeSlideIndex === 4) {
    sliderContainer.style.transform = `translateY(${0}px)`;
    activeSlideIndex = 0;
  } else {
    sliderContainer.style.transform = `translateY(${-height * activeSlideIndex}px)`;
  }
}