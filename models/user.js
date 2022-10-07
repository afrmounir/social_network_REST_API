const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Nouvel utilisateur'
  },
  posts: [
    {
      type: Schema.Types.ObjectId, // reference to the Post model => we can easily retrieve posts with populate('posts')
      ref: 'Post'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);