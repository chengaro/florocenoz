import PubSub from 'pubsub-js';
import Paginator from './Paginator';
import Pixer from './Pixer';
import Animator from './Animator';
import isMobile from 'ismobilejs';


window.addEventListener('DOMContentLoaded', () => {
  let duration = 1.4;
  let activeSlide = 0;
  let slidesCount = 9;

  function getScreenWidth() {
    if (isMobile.apple.device) {
      return window.orientation === 0 ? screen.width : screen.height;
    }
    return window.innerWidth;
  }


  function getScreenHeight() {
    if (isMobile.apple.device) {
      return window.orientation === 0 ? screen.height : screen.width;
    }
    return window.innerHeight;
  }

  window.getScreenWidth = getScreenWidth;
  window.getScreenHeight = getScreenHeight;

  new Animator(activeSlide, duration);
  new Pixer(activeSlide, slidesCount, duration);
  new Paginator(activeSlide, slidesCount, duration);
});
