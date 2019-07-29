const Post = require('../model/post');

const contentController = {
  getContentPage: async (req, res) => {
    const content = await Post.findById(req.params.contentNumber);
    content.meta.views += 1;
    await content.save();

    res.render('content', {
      title: 'Daily Frame | The creators Network',
      user: req.user,
      content
    });
  }
}

module.exports = contentController;