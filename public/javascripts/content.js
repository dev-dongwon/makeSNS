const ContentsHandler = class {
  constructor() {
    this.deleteIcon = document.getElementById('content-header-icon-delete');
    this.updateIcon = document.getElementById('content-header-icon-modified');
    this.contentId = document.getElementById('hidden-content-id').value;
    this.infoModal = document.getElementById('content-modal');
    this.closeModal = document.getElementById('modal-btn-no');
    this.excuteDeleteBtn = document.getElementById('modal-btn-yes');
  }

  async deleteContentEvent(event) {
    const result = await this.ajax().deleteContent();
    if (result === 'success') {
      location.href = '/discover';
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
    this.deleteIcon.addEventListener('click', (event) => {
      this.infoModal.style.display = "block";
      this.addExcuteDeleteEvent();
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
    }
  }

  run() {
    this.addDeleteContentEvent();
    this.addCloseModalEvent();
  }
}

window.addEventListener('load', () => {
  const contentsHandler = new ContentsHandler();
  contentsHandler.run();
})