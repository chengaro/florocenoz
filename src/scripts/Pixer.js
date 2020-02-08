export default class Pixer {

  constructor(activeSlide, slidesCount, duration) {
    this.options = [
      {cx: 0.5, cy: 0.1}, 
      {cx: 0.9, cy: 0.9}, 
      {cx: 0.9, cy: 0.5}, 
      {cx: 0.9, cy: 0.5}, 
      {cx: 0.9, cy: 0.5}, 
      {cx: 0.9, cy: 0.5}, 
      {cx: 0.9, cy: 0.5}, 
      {cx: 0.7, cy: 0.5}, 
      {cx: 0.7, cy: 0.5}
    ];

    this.activeSlide = activeSlide;
    this.slidesCount = slidesCount;
    this.duration = duration;
    this.sprites = [];
    this.mousePos = {};
    this.isSliding = false;

    this.preloaderText = document.querySelector('.preloader-text');

    this.init();
    this.subscribe();
    this.load();
  }


  init() {
    this.renderer = new PIXI.autoDetectRenderer({
      width: getScreenWidth(),
      height: getScreenHeight(),
      antialias: true,
      transparent: true
    });

    document.querySelector('.canvas').appendChild(this.renderer.view);
    this.stage = new PIXI.Container();
  }


  subscribe() {

    PubSub.subscribe('gotoSlide', (msg, data) => {

      this.activeSlide = data.to;
      let s1 = this.sprites[data.from];
      let s2 = this.sprites[data.to];

      this.stage.removeChild(s1);
      this.stage.addChild(s2);
      this.stage.addChild(s1);

      let moveTo = s1.origX + s1.width * (data.to > data.from ? -1 : 1);

      s2.x = s2.origX + s2.width * (data.to > data.from ? 1 : -1) * 1;

      let tl = new TimelineMax();

      if (data.to >= 2 && data.to <= 6 && data.from >=2 && data.from <= 6) {
        s2.x = s2.origX;
        this.stage.addChild(s2);
        this.stage.removeChild(s1);
        return;
      }

      this.isSliding = true;

      tl.to(s1, this.duration, {x: moveTo, onComplete: () => { 
          this.stage.removeChild(s1);
          this.isSliding = false;
        }})  
        .to(s2, this.duration, {x: s2.origX}, `-=${this.duration}`);
    
    });

  }


  load() {
    this.disSprite = PIXI.Sprite.fromImage("./images/gradient4.png");
    this.disSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;
    this.disSprite.anchor.set(0.5);

    this.disFilter = new PIXI.filters.DisplacementFilter(this.disSprite);
    this.disFilter.scale.x = 15;

    this.stage.addChild(this.disSprite);
    this.stage.filters = [this.disFilter];

    PIXI.loader.onLoad.add(evt => {
      this.preloaderText.innerHTML = 'LOADING ' + Math.floor(evt.progress) + '%';
    });
    
    PIXI.loader
    .add('a', './images/0.jpg').add('b', './images/1.jpg').add('c', './images/2.jpg')
    .add('d', './images/2.jpg').add('e', './images/2.jpg').add('f', './images/2.jpg')
    .add('g', './images/2.jpg').add('h', './images/3.jpg').add('i', './images/4.jpg')
    .load((loader, resources) => {

      for (let key in resources) {
        this.sprites.push(new PIXI.Sprite(resources[key].texture));
      }

      this.setSize();
      this.listen();

      this.stage.addChild(this.sprites[this.activeSlide]);

      this.run();
    });

  }


  listen() {
    window.addEventListener('resize', () => {
      this.renderer.resize(getScreenWidth(), getScreenHeight());
      this.setSize();
    });

    window.addEventListener('mousemove', evt => {
      this.mousePos.x = evt.clientX;
      this.mousePos.y = evt.clientY;
    });
  }


  setSize() {
    let w = getScreenWidth();
    let h = getScreenHeight();
    let imageRatio = 1.408;

    this.sprites.forEach((sprite, i) => {
      if (w / h >= imageRatio) {
        sprite.width = w + 15;
        sprite.height = sprite.width / imageRatio;
        sprite.x = -7.5;
        sprite.y = (h - sprite.height) * this.options[i].cy - 5;
      } else {
        sprite.height = h + 10;
        sprite.width = sprite.height * imageRatio;
        sprite.x = (w - sprite.width) * this.options[i].cx - 7.5;
        sprite.y = -5;
      }
      sprite.origX = sprite.x;
    });
  }


  run() {
    this.render();
    TweenMax.to(this.sprites[this.activeSlide], this.duration / 2, {alpha: 1});
    PubSub.publish('begin', {index: this.activeSlide});
  }


  render() {
    if (!this.isSliding) {
      TweenMax.to(this.disSprite, 0.5, {x: this.mousePos.x});
    }
    this.renderer.render(this.stage);
    window.requestAnimationFrame(this.render.bind(this));
  }

}