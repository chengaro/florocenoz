export default class Animator {
  constructor(activeSlide, duration) {
    this.options = [
      {maskColor: '#A1ADC5', maskBlend: 'multiply'}, 
      {maskColor: '#113272', maskBlend: 'hard-light'}, 
      {maskColor: '#153D8A', maskBlend: 'multiply'}, 
      {maskColor: '#153D8A', maskBlend: 'multiply'}, 
      {maskColor: '#153D8A', maskBlend: 'multiply'}, 
      {maskColor: '#153D8A', maskBlend: 'multiply'}, 
      {maskColor: '#153D8A', maskBlend: 'multiply'}, 
      {maskColor: '#1A3364', maskBlend: 'hard-light'}, 
      {maskColor: '#999999', maskBlend: 'multiply'}
    ];

    this.activeSlide = activeSlide;
    this.duration = duration;

    this.indexEl = document.querySelector('.index');
    this.headerEl = document.querySelector('.header');

    // this.mask = document.querySelector('.mask');

    this.strip1 = document.querySelector('.strip-1');
    this.stripOver1 = document.querySelector('.js-strip-1');
    
    // this.strip2 = this.mask.querySelector('.strip-2');
    // this.stripOver2 = document.querySelector('.js-strip-2');

    // this.strip3 = this.mask.querySelector('.strip-3');
    // this.stripOver3 = document.querySelector('.js-strip-3');

    window.addEventListener('resize', this.resizeHandler.bind(this));

    this.isMixSupported = (window.getComputedStyle(document.body).mixBlendMode !== undefined);

    this.run();
  }

  resizeHandler() {
    if (!this.isMixSupported) return;
    let rect1 = this.stripOver1.getBoundingClientRect();
    this.strip1.style.top = (rect1.top - 10 + pageYOffset) + 'px';
    this.strip1.style.height = (rect1.bottom - rect1.top + 10) + 'px';

  //   let rect2 = this.stripOver2.getBoundingClientRect();
  //   this.strip2.style.top = rect2.top + 'px';
  //   this.strip2.style.height = (rect2.bottom - rect2.top) + 'px';

  //   let rect3 = this.stripOver3.getBoundingClientRect();
  //   this.strip3.style.top = rect3.top + 'px';
  //   this.strip3.style.height = (rect3.bottom - rect3.top) + 'px';
  }


  run() {

    PubSub.subscribe('begin', (msg, data)  => {
      let firstSlide = document.querySelector(`[data-slide="${data.index}"]`);
      this.indexEl.innerHTML = `0${data.index + 1}`;
      let tl = new TimelineMax();

      tl.set('.preloader', {display: 'none'})

        .fromTo(firstSlide, 0.7, {y: 50}, {opacity: 1, y: 0, onComplete: () => {
          this.resizeHandler();
        }})

        .set(firstSlide, {zIndex: 1})
        .set('.header', {opacity: 1})
        .set('.footer', {opacity: 1})
        .set(`.mask-${data.index}`, {
          display: 'block', 
          opacity: this.isMixSupported ? 1 : 0.5
        })
        .set(this.indexEl, {opacity: 0.1});
      
    });



    PubSub.subscribe('gotoSlide', (msg, data) => {
      let currSection = document.querySelector(`[data-slide="${data.from}"]`);
      let currMask = document.querySelector(`.mask-${data.from}`);
      let nextSection = document.querySelector(`[data-slide="${data.to}"]`);
      let nextMask = document.querySelector(`.mask-${data.to}`);

      this.activeSlide = data.to;

      let tl = new TimelineMax();
      let direction = data.from < data.to ? 1 : -1;

      if (data.to >= 2 && data.to <= 6 && data.from >=2 && data.from <= 6) {

        tl.set(currSection, {filter: 'blur(0px)'})

          .to(currSection, this.duration / 2, {
                opacity: 0, 
                y: -100 * direction, 
                filter: 'blur(10px)',
                onComplete: () => {this.indexEl.innerHTML = `0${data.to + 1}`}
              })
          
          .set(currSection, {filter: 'none', zIndex: 0})
          .set(currMask, {display: 'none', opacity: 0})
          .set(nextMask, {display: 'block', opacity: this.isMixSupported ? 1 : 0.5})
          .set(nextSection, {zIndex: 1})
          .set(this.headerEl, {display: (getScreenHeight() < 400 
            && this.activeSlide == 5) ? 'none' : 'block'})
          
          .fromTo(nextSection, this.duration / 2,
                  {y: 100 * direction},
                  {opacity: 1, y: 0, ease: Power1.easeOut})

      } else {

        tl.staggerTo(
            [currSection, currMask], 
            this.duration / 2, 
            {opacity: 0, onComplete: () => {this.indexEl.innerHTML = `0${data.to + 1}`}})
          
          .set(currSection, {zIndex: 0})
          .set(currMask, {display: 'none'})
          .set(nextSection, {zIndex: 1})
          .set(nextMask, {display: 'block', opacity: 0})
          .set(this.headerEl, {display: (getScreenHeight() < 400 
            && this.activeSlide == 7) ? 'none' : 'block'})
          
          .fromTo(nextSection, this.duration / 2, 
                  {x: 150 * direction}, 
                  {opacity: 1, x: 0}, 
                  `+=${this.duration / 5}`)

          .set(nextMask, {
            display: 'block', 
            opacity: this.isMixSupported ? 1 : 0.5
          })
          
      }  

    });
  }

}



