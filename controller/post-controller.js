const postController = {
  uploadImage: (req, res) => {
    try {
      console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음 

      let payLoad = { url: req.file.location };
      res.json(payLoad);
    } catch (err) {
        console.log(err);
        response(res, 500, "서버 에러")
    }
  }
}

module.exports = postController;