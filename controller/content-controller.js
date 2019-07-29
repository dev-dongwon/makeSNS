const Post = require('../model/post');

const contentController = {
  getContentPage: async (req, res) => {
    const content = await Post.findById(req.params.contentNumber);
    res.render('content', {
      title: 'Daily Frame | The creators Network',
      user: req.user,
      content
    });
  }
}

module.exports = contentController;