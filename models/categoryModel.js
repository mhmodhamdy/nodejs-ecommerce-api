const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name required'],
      unique: [true, 'Category must be unique'],
      minlength: [1, 'Too short category name'],
      maxlength: [256, 'too long category name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

//  findOne, findAll and updateOne
categorySchema.post('init', (doc) => {
  setImageUrl(doc);
});
//  createOne
categorySchema.post('save', (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model('Category', categorySchema);
