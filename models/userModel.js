const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email Required'],
      unique: [true, 'Email already exists'],
    },
    phone: String,
    profileImage: String,
    password: {
      type: String, //password will be encrypted using bcryptjs
      minlength: [6, 'Password must be 6 characters at least'],
      required: [true, 'Password Required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamp: true }
);

const setImageUrl = (doc) => {
  if (doc.profileImage) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
};

//  findOne, findAll and updateOne
userSchema.post('init', (doc) => {
  setImageUrl(doc);
});
//  createOne
userSchema.post('save', (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model('User', userSchema);
