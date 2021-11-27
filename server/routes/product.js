const multer = require('multer');
const express = require('express');
const slugify = require('slugify');
const shortid = require('shortid');

const { requireSignin, isAdmin } = require('../middlewares');
const { create, getBySlug, getById, getByQuery, update, remove, search, getAll } = require('../controllers/product');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const { name } = req.body;
    cb(null, slugify(name) + '-' + Date.now() + '.jpg');
  },
});
const upload = multer({ storage });

router.post(
  '/product/create',
  // requireSignin,
  // isAdmin,
  upload.array('productPictures'),
  create
);
router.put(
  '/product/:id',
  // requireSignin,
  // isAdmin,
  upload.array('productPictures'),
  update
);
router.delete(
  '/product/:id',
  // requireSignin,
  // isAdmin,
  remove
);
router.get('/product/:id', getById);

router.get('/products/search/:page/:perPage', getByQuery);


module.exports = router;
