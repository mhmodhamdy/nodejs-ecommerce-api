const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name required'],
      unique: [true, 'Brand must be unique'],
      minlength: [3, 'Too short brand name'],
      maxlength: [32, 'too long brand name'],
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
    const imageUrl = `${process.env.BASE_URL}/beands/${doc.image}`;
    doc.image = imageUrl;
  }
};

//  findOne, findAll and updateOne
brandSchema.post('init', (doc) => {
  setImageUrl(doc);
});
//  createOne
brandSchema.post('save', (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model('Brand', brandSchema);
