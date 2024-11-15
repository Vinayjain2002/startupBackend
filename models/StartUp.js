import mongoose  from "mongoose";

const startUpSchema= mongoose.Schema({
    startUpName: {
        type:String,
        required: true,
        unique: true
    },
    isRegistered: {
        type: Boolean,
        requried: true,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    founder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    customerBase:{
        type: Number,
        required: true,
        default: 0
    },
    investors: [
        {
            investorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Investor"
            },
            investmentAmount: {
                type: Number,
                required: true
            },
            dateOfInvestment: {
                type: Date,
                default: Date.now
            }
        }
    ],
    fundingDetails: {
        totalFunding: {
            type: Number,
            required: true,
            default: 0 // Total amount of funding raised by the startup
          },
          fundingRounds: [
            {
              roundName: { type: String, required: true },
              amountRaised: { type: Number, required: true },
              date: { type: Date, default: Date.now },
              investors: [
                {
                  investorId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Investor',
                    required: true
                  },
                  investmentAmount: { type: Number, required: true }
                }
              ]
            }
        ]
    },
    employees:
    [
        {
            employeeId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User', // Refers to the User model for employees
              required: true
            },
            role: {
              type: String,
              required: true
            },
            salary: {
              type: Number,
              required: true
            },
            dateJoined: {
              type: Date,
              default: Date.now
            }
          }
    ],
    industry: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      logo: {
        type: String,
        default: '' // Store logo URL or placeholder if not provided
      },
      website: {
        type: String,
        default: ''
      },
      socialMediaLinks: {
        facebook: {
          type: String,
          default: ''
        },
        twitter: {
          type: String,
          default: ''
        },
        linkedin: {
          type: String,
          default: ''
        }
    }
});

startUpSchema.methods.calculateEmployeesCount= function(){
    return this.employees.length;
}

startUpSchema.methods.calculateTotalFunding= function(){
    return this.fundingDetails.totalFunding;
}

const StartUp= mongoose.model('StartUp', startUpSchema);
export default StartUp;