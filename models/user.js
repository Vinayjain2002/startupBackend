
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true // Ensure emails are unique in the database
    },
    password: {
      type: String,
      required: true
    },
    phoneNo: {
        type: Number
    },

    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, default: Date.now }
      }
    ],
    bio: {
      type: String,
      default: ''
    },
    profilePicture: {
      type: String,
      default: 'https://www.example.com/default-profile-pic.jpg' // Add the default image URL here
    },
    StartUp: {
      role: { type: String },
      startUpName: { type: String },
      startUpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StartUp' // Make sure 'StartUp' collection exists
      }
    },
    refreshToken: {
      type: String
    },
    accessTokenExp: {
      type: Date
    },
    accessToken: {
      type:String
    },
    investments: [
        {
          startUpId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StartUp', // Refers to the Startup model
            required: true
          },
          investmentAmount: {
            type: Number,
            required: true
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ],
      portfolio: [
        {
            startUpId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "StartUp"
            },
            percentageOwnership: {
                type: Number,
                required: true
            }
        }
      ],
    isInvestor: {
        type: Boolean,
        default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
    }
    },
  {
    timestamps: true // To keep track of created and updated times
  }
);

// Hash password before saving user
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next(); // Skip hashing if the password has not been modified
    }
    const hashedPassword = await bcrypt.hash(this.password, 10); // Hash the password with a salt factor of 10
    this.password = hashedPassword;
    next(); // Continue saving the user
  } catch (err) {
    next(err); // If there was an error, pass it to the next middleware
  }
});

// checking is the user is a investor also
userSchema.methods.isAdmin= async function () {
    return this.isInvestor;
}
// Method to compare entered password with the stored hashed password
userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate a JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, email: this.email }, 'yourSecretKey', { expiresIn: '1h' });
  return token;
};

const User = mongoose.model('User', userSchema);
export default User;