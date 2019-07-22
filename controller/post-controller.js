const postController = {
  uploadImage: (req, res, next) => {
    try {
      console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음 

      let payLoad = { url: req.file.location };
      res.json(payLoad);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = postController;