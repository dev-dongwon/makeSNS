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
    this.updateContentBtn.addEventListener('click', () => {
      const imageArea = document.getElementsByClassName('content-image')[0];
      const textArea = document.getElementsByClassName('content-body')[0];

      const updateForm = document.getElementById('content-update-box');

      imageArea.style.display = 'none';
      textArea.style.display = 'none';
      updateForm.style.display = 'block';
    })
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

    const updateContent = async (contentObj) => {
      const url = `/contents/${this.contentId}`;
      const response = await fetch(url, {
        method : 'PATCH',
        body : contentObj
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
      updateContent
    }
  }

  run() {
    this.addDeleteContentEvent();
    this.addCloseModalEvent();
    this.addGetUpdateForm();
    this.addChangeInputEvent();
    this.addCancelUpdateEvent();
    this.addupdateContentEvent();
  }
}

window.addEventListener('load', () => {
  const contentsHandler = new ContentsHandler();
  contentsHandler.run();
})