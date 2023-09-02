const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [128, 'Too long product title'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Too short product description'],
      maxlength: [1024, 'Too long product description'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is requierd'],
      min: 0,
      max: 1000,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Product price is requierd'],
      trim: true,
      maxlength: [16, 'Too long Product price'],
    },
    priceAfterDiscount: {
      type: Number,
      optional: true,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, 'Product ImageCover required'],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'product must be belong to category'],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    ratingAvarege: {
      type: Number,
      min: [1, 'Rating must be more than or equal 1'],
      max: [5, 'Rating must be less than or equa 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name',
  });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};

//  findOne, findAll and updateOne
productSchema.post('init', (doc) => {
  setImageUrl(doc);
});
//  createOne
productSchema.post('save', (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model('Product', productSchema);
