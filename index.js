document.addEventListener("DOMContentLoaded", function () {

  const arrowLeft = document.getElementById('slider__arrow-left');
  arrowLeft.addEventListener("click", throttle(function () { changeSlide(true) }, 3000));

  const arrowRight = document.getElementById('slider__arrow-right');
  arrowRight.addEventListener("click", throttle(function () { changeSlide(false) }, 3000));

  const dots = document.getElementsByClassName('slider__dots');
  for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener("click", function () { handleDotsClick(i) });
  }

  const slideWrapper = document.querySelector('.slider__slide-wrapper');
  slideWrapper.addEventListener("dragstart", throttle(handleDragAndTouchStart, 3000));
  slideWrapper.addEventListener("dragend", throttle(handleDragAndTouchEnd, 3000));

  slideWrapper.addEventListener("touchstart", throttle(handleDragAndTouchStart, 3000));
  slideWrapper.addEventListener("touchend", throttle(handleDragAndTouchEnd, 3000));
});

let activeSlideIndex = 0;
let startingPositionX = 0;

function handleDotsClick(index) {{
  console.log(activeSlideIndex, index)
  if (activeSlideIndex === index) {
    return;
  }
  if (activeSlideIndex > index) {
    changeSlide(true, index);
    activeSlideIndex = index
    return;
  }
  changeSlide(false, index);
  activeSlideIndex = index
}}

function handleDragAndTouchStart(e) {
  startingPositionX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
}

function handleDragAndTouchEnd(e) {
  let position = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
  if (startingPositionX > position) {
    changeSlide(true);
    return;
  }
  changeSlide(false);
}

function changeSlide(isReverse, clickedIndex) {
  const aciveImgElements = document.querySelectorAll('.slider__image-wrapper.js-selected');
  const aciveImgElementsReverse = document.querySelectorAll('.slider__image-wrapper.js-selected-reverse');

  const aciveTextElement = document.querySelector('.slider__text-wrapper.js-selected');

  const aciveDotsElement = document.querySelector('.slider__dots.js-selected');

  if (!isReverse) {
    if (aciveImgElements.length !== 0) {
      changeIndex(aciveImgElements.length, true)
      for (let i = 0; i < aciveImgElements.length; i++) {
        addClassNextSibiling(aciveImgElements[i], "js-unselected", "js-selected", clickedIndex)
      }
      addClassNextSibiling(aciveTextElement, "js-unselected", "js-selected", clickedIndex)
      addClassNextSibiling(aciveDotsElement, null, "js-selected", clickedIndex)
    }
    if (aciveImgElementsReverse.length !== 0) {
      changeIndex(aciveImgElementsReverse.length, true)
      for (let i = 0; i < aciveImgElementsReverse.length; i++) {
        addClassNextSibiling(aciveImgElementsReverse[i], "js-unselected", "js-selected", clickedIndex)
      }
      addClassNextSibiling(aciveTextElement, "js-unselected", "js-selected", clickedIndex)
      addClassNextSibiling(aciveDotsElement, null, "js-selected", clickedIndex)
    }
  }

  if (isReverse) {
    if (aciveImgElements.length !== 0) {
      changeIndex(aciveImgElements.length, false)
      for (let i = 0; i < aciveImgElements.length; i++) {
        addClassPrevSibiling(aciveImgElements[i], "js-unselected-reverse", "js-selected-reverse", clickedIndex)
      }
      addClassPrevSibiling(aciveTextElement, "js-unselected", "js-selected", clickedIndex)
      addClassPrevSibiling(aciveDotsElement, null, "js-selected", clickedIndex)
    }
    if (aciveImgElementsReverse.length !== 0) {
      changeIndex(aciveImgElementsReverse.length, false)
      for (let i = 0; i < aciveImgElementsReverse.length; i++) {
        addClassPrevSibiling(aciveImgElementsReverse[i], "js-unselected-reverse", "js-selected-reverse", clickedIndex)
      }
      addClassPrevSibiling(aciveTextElement, "js-unselected", "js-selected", clickedIndex)
      addClassPrevSibiling(aciveDotsElement, null, "js-selected", clickedIndex)
    }
  }
}

function addClassNextSibiling(elem, firstAddedClass, secondAddedClass, clickedElemIndex) {
  for (let i = 0; i < elem.parentElement.children.length; i++) {
    removeAnimationClass(elem.parentElement.children[i]);
  }
  if (firstAddedClass) {
    elem.classList.add(firstAddedClass);
  }
  if (secondAddedClass) {
    const preveElem = elem.previousElementSibling ? elem.previousElementSibling : elem.parentElement.lastElementChild;

    let nextElem = elem.nextElementSibling ? elem.nextElementSibling : elem.parentElement.firstElementChild;
    if (clickedElemIndex !== undefined){
      nextElem = elem.parentElement.children[clickedElemIndex];
    }

    nextElem.classList.add(secondAddedClass);
  }
}

function addClassPrevSibiling(elem, firstAddedClass, secondAddedClass, clickedElemIndex) {
  for (let i = 0; i < elem.parentElement.children.length; i++) {
    removeAnimationClass(elem.parentElement.children[i]);
  }
  if (firstAddedClass) {
    elem.classList.add(firstAddedClass);
  }
  if (secondAddedClass) {
    const nextElem = elem.nextElementSibling ? elem.nextElementSibling : elem.parentElement.firstElementChild;

    let preveElem = elem.previousElementSibling ? elem.previousElementSibling : elem.parentElement.lastElementChild;
    if (clickedElemIndex !== undefined){
      preveElem = elem.parentElement.children[clickedElemIndex];
    }

    preveElem.classList.add(secondAddedClass);
  }
}

function removeAnimationClass(elem) {
  elem.classList.remove("js-selected");
  elem.classList.remove("js-selected-reverse");
  elem.classList.remove("js-unselected");
  elem.classList.remove("js-unselected-reverse");
}

function changeIndex(elemNumbers, shoudAdd) {
  console.log(`test`, elemNumbers, shoudAdd)
  if(shoudAdd) {
    activeSlideIndex = activeSlideIndex === elemNumbers ? 0 : activeSlideIndex + 1;
    return;
  }
  activeSlideIndex = activeSlideIndex === 0 ? elemNumbers : activeSlideIndex - 1;
}

function throttle (callback, limit) {
  var waiting = false;                      // Initially, we're not waiting
  return function () {                      // We return a throttled function
      if (!waiting) {                       // If we're not waiting
          callback.apply(this, arguments);  // Execute users function
          waiting = true;                   // Prevent future invocations
          setTimeout(function () {          // After a period of time
              waiting = false;              // And allow future invocations
          }, limit);
      }
  }
}