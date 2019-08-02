const CommentHandler = class {
  constructor() {
    this.removeIcons = document.getElementsByClassName('reply-remove-icon');
    this.replyWrapperBox = document.getElementsByClassName('contnet-reply-box')[0];
    this.infoModal = document.getElementById('content-modal');
    this.closeModal = document.getElementById('modal-btn-no');
    this.excuteDeleteBtn = document.getElementById('modal-btn-yes');
    this.commentInputArea = document.getElementById('content-comment-area');
  }

  async removeEvent(event) {
    const result = await this.ajax().removeCommentAjax(event.target.id);
    if (result === 'success') {
      const removeTarget = document.getElementById(`content-reply-${event.target.id}`);
      const replyLine = document.getElementById(`reply-line-${event.target.id}`)
      this.replyWrapperBox.removeChild(removeTarget);
      this.replyWrapperBox.removeChild(replyLine);
      this.infoModal.style.display = "none";
      }
  }

  addRemoveEvent() {
    Array.from(this.removeIcons).forEach((icon) => {
      icon.addEventListener('click', (event) => {
        this.infoModal.style.display = "block";
        this.commentInputArea.value = '';
        this.addRemoveCommentEvent(event);
      })
    })
  }

  addCloseModalEvent() {
    this.closeModal.addEventListener('click', () => {
      this.infoModal.style.display = "none";
    })
  }

  addRemoveCommentEvent(event) {
    this.excuteDeleteBtn.addEventListener('click', () => {
      this.removeEvent(event);
    })
  }

  ajax() {
    const removeCommentAjax = async (id) => {
      const url = `/comments/${id}`;
      const response = await fetch(url, {
        method : 'DELETE'
      })
      return await response.json();
    }

    return {
      removeCommentAjax,
    }
  }

  run() {
    this.addRemoveEvent();
  }
}

window.addEventListener('load', () => {
  const commentHandler = new CommentHandler();
  commentHandler.run();
})