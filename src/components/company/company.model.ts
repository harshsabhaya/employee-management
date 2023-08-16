import mongoose, { Schema } from 'mongoose';

const companySchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    lowercase: true,
    unique: true,
  },
  address: {
    line1: {
      type: String,
      require: true,
    },
    line2: {
      type: String,
    },
    city: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    zipCode: {
      type: Number,
      require: true,
    },
  },
  contact: {
    type: Number,
    minlength: 10,
    require: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    require: true,
  },
});

const Company = mongoose.model('company', companySchema);

export default Company;
