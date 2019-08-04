const ContentsHandler = class {
  constructor() {
    this.deleteIcon = document.getElementById('content-header-icon-delete');
    this.updateIcon = document.getElementById('content-header-icon-modified');
    this.contentId = document.getElementById('hidden-content-id').value;
    this.infoModal = document.getElementById('content-modal');
    this.closeModal = document.getElementById('modal-btn-no');
    this.excuteDeleteBtn = document.getElementById('modal-btn-yes');
    this.updateContentBtn = document.getElementById('content-header-icon-modified');
    this.previewArea = document.getElementById('content-update-preview-area');
    this.replyArea = document.getElementsByClassName('contnet-reply-box')[0];
    this.commentInputArea = document.getElementById('content-comment-area');
    this.date = Date.now();
  }

  async deleteContentEvent(event) {
    const result = await this.ajax().deleteContent();
    if (result === 'success') {
      location.href = '/discover';
    }
  }

  async updateContentEvent(event) {

    const data = new FormData();
    const image = document.getElementById('post-image-btn').files[0];
    const content = document.getElementById('content-update-text-area').firstElementChild.value;
    
    data.append('image', image);
    data.append('content', content);
    data.append('id', this.contentId )
    const result = await this.ajax().updateContent(data);
    if (result === 'success') {
      location.href = `/contents/${this.contentId}`;
    }
  }

  addupdateContentEvent() {
    this.updateBtn = document.getElementById('content-update-btn');
    this.updateBtn.addEventListener('click', (event) => {
      this.updateContentEvent(event);
    })
  }

  addGetUpdateForm() {
    if (this.updateContentBtn) {
      this.updateContentBtn.addEventListener('click', () => {
        const imageArea = document.getElementsByClassName('content-image')[0];
        const textArea = document.getElementsByClassName('content-body')[0];
  
        const updateForm = document.getElementById('content-update-box');
  
        imageArea.style.display = 'none';
        textArea.style.display = 'none';
        updateForm.style.display = 'block';
      })
    }
  }

  addCancelUpdateEvent() {
    const cancelBtn = document.getElementById('content-cancel-btn');
    cancelBtn.addEventListener('click', (event) => {
      const imageArea = document.getElementsByClassName('content-image')[0];
      const textArea = document.getElementsByClassName('content-body')[0];
      const updateForm = document.getElementById('content-update-box');

      updateForm.style.display = 'none';
      imageArea.style.display = 'block';
      imageArea.style.margin = 'auto';
      textArea.style.display = 'block';
    })
  }

  addChangeInputEvent() {
    const files = document.getElementById('post-image-btn');
    files.addEventListener('change', (event) => {
      this.handleFiles(event.target.files);
    })
  }

  makeImgNode(file, reader) {
    const img = document.createElement("img");
    img.classList.add("content-update-preview-image");
    img.file = file;
    img.src = reader.result;
    return img;
  }

  handleFiles(files) {
    this.previewArea.style.display = 'block';
    for (let i=0; i < files.length; i++) {
      const file = files[i];
      const imageType = /image.*/;

      if (!file.type.match(imageType)) {
        alert('이미지 파일만 업로드가 가능합니다!');
        continue;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        let img = this.makeImgNode(file, reader);

        const tempImage = new Image();
        tempImage.src = reader.result;

        this.previewArea.innerHTML = '';
        this.previewArea.appendChild(img);
      }
    }
  }

  addCloseModalEvent() {
    this.closeModal.addEventListener('click', () => {
      this.infoModal.style.display = "none";
    })
  }

  addExcuteDeleteEvent() {
    this.excuteDeleteBtn.addEventListener('click', () => {
      this.deleteContentEvent(event);
    })
  }

  addDeleteContentEvent() {
    if (this.deleteIcon) {
      this.deleteIcon.addEventListener('click', (event) => {
        this.infoModal.style.display = "block";
        this.addExcuteDeleteEvent();
      })
    }
  }

  addUpdateLikeEvent() {
    const likeBtn = document.getElementsByClassName('box-bottom-like')[0];
    likeBtn.addEventListener('click', async (event) => {
      const result = await this.ajax().updateLikeStatus(this.contentId);
      let likeNumber = document.getElementsByClassName('box-like-count')[0];
      
      if (result === 'notLoggedIn') {
        alert('로그인이 필요한 서비스입니다');
        return;
      }
      
      if (result === 'unlike') {
        event.target.src = '/images/board/like.png'
        const updatedNumber = likeNumber.textContent * 1 - 1;
        likeNumber.textContent = updatedNumber;
        likeNumber -= 1;
        return;
      }
      
      if (result === 'like') {
        event.target.src = '/images/board/fill-like.png'
        const updatedNumber = likeNumber.textContent * 1 + 1;
        likeNumber.textContent = updatedNumber;
        likeNumber += 1;
        return;
      }
    })
  }

  addSubmitCommentEvent() {
    const commentBtn = document.getElementById('btn-comment-submit');
    commentBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      const comment = document.getElementById('content-comment-area').value;
      const contentId = document.getElementById('hidden-content-id').value;
      const formData = {
        comment: comment,
        contentId : contentId
      }
      const result = await this.ajax().addComment(JSON.stringify(formData));

      if (result === 'notLoggedIn') {
        alert('로그인이 필요한 서비스입니다');
        return;
      }

      const commentJsonData = JSON.parse(result);
      const htmlForm = this.getHtmlForm(commentJsonData);
      this.replyArea.appendChild(htmlForm.contentReply);
      this.replyArea.appendChild(htmlForm.replyLine);
      this.commentInputArea.value='';
    })
  }

  getHtmlForm(comment) {
    const htmlForm =
    `
      <div class="content-reply-avatar">
        <img src="${comment.userAvatar}" />
      </div>
      <div class="content-reply-comment">
        <div class="content-reply-comment-id">
          <p>@${comment.username}</p>
        </div>
        <div class="content-reply-comment-text">
          <p>${comment.content}</p>
          </div>
      </div>
      <div class="content-reply-icon-update">
        <img class="reply-update-icon" src="/images/content/modify.png">
      </div>
      <div class="content-reply-icon-remove">
        <img class="reply-remove-icon" src="/images/content/delete.png">
      </div>
      <div class="content-reply-time">
        ${this.calcDate(comment.createdDate)}
      </div>
    `

    const contentReply = document.createElement('div');
    contentReply.className = 'content-reply';
    contentReply.innerHTML = htmlForm;

    const replyLine = document.createElement('hr');
    replyLine.className = 'reply-line';
    replyLine.id = `${comment._id}`;
    
    return {
      contentReply,
      replyLine
    }
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
    
    const dateDomArr = document.getElementsByClassName('reply-created-time');
    const displayDateDomArr = document.getElementsByClassName('content-reply-time');
    
    Array.from(dateDomArr).forEach((dom) => {
      gapTimeArr.push(this.calcDate(dom.value));
    })

    Array.from(displayDateDomArr).forEach((dom, index) => {
      dom.innerHTML = `${gapTimeArr[index]}`
    })
  }

  ajax() {
    const deleteContent = async () => {
      const url = `/contents/${this.contentId}`;
      const response = await fetch(url, {
        method : 'DELETE',
      })
      return await response.text();
    }

    const updateContent = async (contentObj) => {
      const url = `/contents/${this.contentId}`;
      const response = await fetch(url, {
        method : 'PATCH',
        body : contentObj
      })
      return await response.text();
    }

    const updateLikeStatus = async (contentsNumber) => {
      const url = `/contents/meta/${contentsNumber}/like`
      const response = await fetch(url, {
        method : 'PATCH'
      })
      return await response.text();
    }

    const addComment = async (formData) => {
      const url = '/comments';
      const response = await fetch(url, {
        method : 'POST',
        body : formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

      })
      return await response.text();
    }

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
      deleteContent,
      updateContent,
      updateLikeStatus,
      addComment
    }
  }

  run() {
    this.addDeleteContentEvent();
    this.addCloseModalEvent();
    this.addGetUpdateForm();
    this.addChangeInputEvent();
    this.addCancelUpdateEvent();
    this.addupdateContentEvent();
    this.addUpdateLikeEvent();
    this.addSubmitCommentEvent();
    this.displayTime();
  }
}

window.addEventListener('load', () => {
  const contentsHandler = new ContentsHandler();
  contentsHandler.run();
})