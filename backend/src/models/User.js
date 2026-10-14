import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: '', maxlength: 300 },
    phone: { type: String, default: '', maxlength: 30 },
    city: { type: String, default: '', maxlength: 80 },
  },
  { timestamps: true }
);

userSchema.methods.toProfile = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    bio: this.bio,
    phone: this.phone,
    city: this.city,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model('User', userSchema);
