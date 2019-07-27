const DiscoverHandler = class {
  constructor() {
    this.dateDomArr = document.getElementsByClassName('post-created-time');
    this.displayDateDomArr = document.getElementsByClassName('box-header-time');
    this.trendTabBtn = document.getElementById('discover-order-trend');
    this.recentTabBtn = document.getElementById('discover-order-recent');
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

  addGetTrendingPageEvent() {
    this.trendTabBtn.addEventListener('click', (event) => {
      event.target.style.color = 'black';
      this.recentTabBtn.style.color = 'gray';
    })
  }

  addGetRecentPageEvent() {
    this.recentTabBtn.addEventListener('click', (event) => {
      event.target.style.color = 'black';
      this.trendTabBtn.style.color = 'gray';
    })
  }


  ajax() {
    const getTrendingPageEvent = async () => {
      const url = `/discover/trending`;
      const response = await fetch(url, {
        method : 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      return await response.json();
    }

    return {
      getTrendingPageEvent
    }
  }


  run() {
    this.displayTime();
    this.addGetTrendingPageEvent();
    this.addGetRecentPageEvent()
  }
}

window.addEventListener('load', () => {
  const discoverHandler = new DiscoverHandler();
  discoverHandler.run();
  new Isotope( '.discover-content', {});
})