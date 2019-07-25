const PostHandler = class {
  constructor() {
    this.dropArea = document.getElementById('post-image-area');
  }

  addDragImageEvent() {
    this.dropArea.addEventListener("dragenter", (event) => {
      this.dragenter(event);
    }, false);

    this.dropArea.addEventListener("dragover", (event) => {
      this.dragover(event);
    }, false);

    this.dropArea.addEventListener("drop", (event) => {
      this.drop(event);
    }, false);
  }

  dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  drop(e) {
    e.stopPropagation();
    e.preventDefault();

    let dt = e.dataTransfer;
    let files = dt.files;

    this.handleFiles(files);
  }

  handleFiles(files) {
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
        document.getElementById('preview').src = reader.result;

        let img = document.createElement("img");
        img.classList.add("obj");
        img.file = file;
        img.src = reader.result;
        console.log(img)

        const tempImage = new Image();
        tempImage.src = reader.result;

        tempImage.onload = function () {
            const canvas = document.createElement('canvas');
            const canvasContext = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            canvasContext.drawImage(this, 0, 0);

            var dataURI = canvas.toDataURL("image/jpeg");

            document.getElementById('post-hidden').setAttribute("value", dataURI);
        };
      }
    }
  }

  run() {
    this.addDragImageEvent();
  }
}

window.addEventListener('load', () => {
  const postHandler = new PostHandler();
  postHandler.run();
  console.log('hi')
})