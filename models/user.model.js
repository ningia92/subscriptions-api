import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'User Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 2,
    maxLength: 50,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid Email address']
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
    minLength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true })

// hash the password before saving it into db
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
})

// compare provided password with saved password
UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

// create jwt token
UserSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
}

const User = mongoose.model('User', UserSchema)

export default User