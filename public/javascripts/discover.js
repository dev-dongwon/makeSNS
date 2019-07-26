const DiscoverHandler = class {
  constructor() {
    this.dateDomArr = document.getElementsByClassName('post-created-time');
    this.displayDateDomArr = document.getElementsByClassName('box-header-time');
  }
  
  calcDate(postDate) {
    const date = Date.now();
    const parsedDate = Date.parse(postDate);
    const gapByMinute = Math.floor((date - parsedDate)/(1000*60));

    if (gapByMinute < 60) {
      return `${gapByMinute} m`
    }

    const gapByHours = Math.floor(gapByMinute / 60);

    if (gapByHours < 24) {
      return `${gapByHours} h`
    }

    const gapByDay = Math.floor(gapByHours / 24);

    if (gapByDay < 7) {
      return `${gapByHours} d`
    }

    const gapByWeek = Math.floor(gapByDay / 7);

    if (gapByWeek < 4) {
      return `${gapByWeek} w`
    }
  }

  displayTime() {
    const gapTimeArr = [];
    Array.from(this.dateDomArr).forEach((dom) => {
      gapTimeArr.push(this.calcDate(dom.value));
    })

    Array.from(this.displayDateDomArr).forEach((dom, index) => {
      dom.innerHTML = `${gapTimeArr[index]}`
    })
  }


  run() {
    this.displayTime();
  }
}

window.addEventListener('load', () => {
  const discoverHandler = new DiscoverHandler();
  discoverHandler.run();
})