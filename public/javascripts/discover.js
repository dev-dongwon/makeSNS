const DiscoverHandler = class {
  constructor() {
    this.dateDomArr = document.getElementsByClassName('post-created-time');
    this.displayDateDomArr = document.getElementsByClassName('box-header-time');
    this.trendTabBtn = document.getElementById('discover-order-trend');
    this.recentTabBtn = document.getElementById('discover-order-recent');
    this.date = Date.now();
  }
  
  calcDate(postDate) {
    const parsedDate = Date.parse(postDate);
    const gapByMinute = Math.floor((this.date - parsedDate)/(1000*60));

    if (gapByMinute < 60) {
      return `${gapByMinute} m`
    }

    const gapByHours = Math.floor(gapByMinute / 60);

    if (gapByHours < 24) {
      return `${gapByHours} h`
    }

    const gapByDay = Math.floor(gapByHours / 24);

    if (gapByDay < 7) {
      return `${gapByDay} d`
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

  addUpdateLikeEvent() {
    const likeBtns = document.getElementsByClassName('box-bottom-like');
    Array.from(likeBtns).forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        const contentNumber = event.target.parentNode.firstChild.value;
        const result = await this.ajax().updateLikeStatus(contentNumber);

        if (result === 'notLoggedIn') {
          alert('로그인이 필요한 서비스입니다');
          return;
        }

        if (result === 'unlike') {
          event.target.src = '/images/board/like.png'
          let likeNumber = event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent * 1 - 1;
          event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent = likeNumber;
          likeNumber -= 1;
          return;
        }
        
        if (result === 'like') {
          event.target.src = '/images/board/fill-like.png'
          let likeNumber = event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent * 1 + 1;
          event.target.parentNode.parentNode.getElementsByClassName('box-like-count')[0].textContent = likeNumber;
          likeNumber += 1;
          return;
        }
      })
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


    const updateLikeStatus = async (contentsNumber) => {
      const url = `/contents/meta/${contentsNumber}/like`
      const response = await fetch(url, {
        method : 'PATCH'
      })
      return await response.text();
    }

    return {
      getTrendingPageEvent,
      updateLikeStatus
    }
  }

  setContentTimeParams() {
    const contentTimes = document.getElementsByClassName('box-header-time');
    const contentLinks = document.getElementsByClassName('disdover-content-link');
    Array.from(contentLinks).forEach((dom, index) => {
      dom.href = `${dom.href}?time=${contentTimes[index].textContent}`
    })
  }


  run() {
    this.displayTime();
    this.addGetTrendingPageEvent();
    this.addGetRecentPageEvent();
    this.setContentTimeParams();
    this.addUpdateLikeEvent();
  }
}

window.addEventListener('load', () => {
  const discoverHandler = new DiscoverHandler();
  discoverHandler.run();
  new Isotope( '.discover-content', {});
})