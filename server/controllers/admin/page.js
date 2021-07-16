const Page = require("../../models/page");
exports.create = (req, res) => {
  const { banners, products } = req.files;
  if (banners.length > 0) {
    req.body.banners = banners.map((banner, index) => ({
      img: `${process.env.API}/public/${banner.filename}`,
      navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
    }));
  }
  if (products.length > 0) {
    req.body.products = products.map((product, index) => ({
      img: `${process.env.API}/public/${product.filename}`,
      navigateTo: `/productClicked?productId=${req.body.category}&type=${req.body.type}`,
    }));
  }
  req.body.createdBy = req.user._id;
  const page = new Page(req.body);
  page.save((error, page) => {
    if (error) return res.status(400).json({ error });
    return res.status(201).json({ page });
  });
};
