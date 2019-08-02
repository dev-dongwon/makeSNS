const CommentHandler = class {
  constructor() {
    this.removeIcons = document.getElementsByClassName('reply-remove-icon');
    this.replyWrapperBox = document.getElementsByClassName('contnet-reply-box')[0];
  }

  async removeEvent(event) {
    const result = await this.ajax().removeCommentAjax(event.target.id);
    if (result === 'success') {
      const removeTarget = document.getElementById(`content-reply-${event.target.id}`);
      this.replyWrapperBox.removeChild(removeTarget);
      this.replyWrapperBox.removeChild(this.replyWrapperBox.lastElementChild);
    }
  }

  addRemoveEvent() {
    Array.from(this.removeIcons).forEach((icon) => {
      icon.addEventListener('click', (event) => {
        this.removeEvent(event);
      })
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