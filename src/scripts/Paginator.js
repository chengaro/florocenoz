export default class Paginator {
  constructor(activeSlide, slidesCount, duration) {
    this.activeSlide = activeSlide;
    this.slidesCount = slidesCount;
    this.duration = duration;
    this.canSlide = true;
    this.swipeStart = false;

    this.addScrollListeners();
    this.addTouchListeners();
    this.addKeyListeners();
    this.addClickListeners();
  }

  scrollHandler(evt) {
    if (!this.canSlide) return;

    evt = evt || window.event;
    let delta = evt.deltaY || evt.detail || -evt.wheelDelta;
    let direction = delta > 0 ? 1 : -1;
    this.gotoSlide(direction);
  }

  addScrollListeners() {
    if ('onwheel' in document) {
      // IE9+, FF17+, Ch31+
      window.addEventListener('wheel', this.scrollHandler.bind(this), { passive: true });
    } else if ('onmousewheel' in document) {
      // устаревший вариант события
      window.addEventListener('mousewheel', this.scrollHandler.bind(this), { passive: true });
    } else {
      // Firefox < 17
      window.addEventListener('MozMousePixelScroll', this.scrollHandler.bind(this), { passive: true });
    }
  }

  touchStartHandler(evt) {
    if (!this.canSlide) return;

    this.swipeStart = true;
    this.touchX = evt.changedTouches[0].clientX;
  }

  touchEndHandler(evt) {
    if (this.swipeStart) {
      this.swipeStart = false;
      let deltaX = evt.changedTouches[0].clientX - this.touchX;
      let direction = 0;

      if (Math.abs(deltaX) > 50) { // swipe is long enough
        direction = deltaX < 0 ? 1 : -1;
      }

      this.gotoSlide(direction);
    }
  }

  addTouchListeners() {
    window.addEventListener('touchstart', this.touchStartHandler.bind(this));
    window.addEventListener('touchend', this.touchEndHandler.bind(this));
  }

  keyDownHandler(evt) {
    if (!this.canSlide) return;

    let key = evt.keyCode;
    let direction = 0;

    if (key === 37 || key === 38) {
      direction = -1;
    } else if (key === 39 || key === 40) {
      direction = 1;
    }

    this.gotoSlide(direction);
  }

  addKeyListeners() {
    if (document.addEventListener) {
      document.addEventListener('keydown', this.keyDownHandler.bind(this));
    }
  }

  addClickListeners() {
    let links = document.querySelectorAll('.index');
    [].forEach.call(links, link => {
      link.addEventListener('click', evt => {
        if (!this.canSlide) return;
        this.gotoSlide(1);
      });
    });
  }

  gotoSlide(direction) {
    let newSlide = +this.activeSlide + direction;
    if (newSlide >= this.slidesCount || newSlide < 0 || newSlide === this.activeSlide) return;
    this.canSlide = false;

    PubSub.publish('gotoSlide', {
      from: this.activeSlide,
      to: newSlide
    });

    this.activeSlide = newSlide;

    window.setTimeout(() => {
      this.canSlide = true;
    }, this.duration * 1000);
  }

}