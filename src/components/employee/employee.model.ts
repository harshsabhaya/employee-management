import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const employeeSchema = new Schema({
  email: {
    type: String,
    unique: true,
    require: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  designation: {
    type: String,
    enum: ['MANAGER', 'TEAM_LEADER', 'DEVELOPER'],
    require: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'company',
  },
  isVerified: {
    type: Boolean,
    default: false,
    require: true,
  },
});

employeeSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  designation: 'text',
});

employeeSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

employeeSchema.methods.isValidPassword = async function (password: any) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log('Password Match Error > ', error);
  }
};

const Employee = mongoose.model('employee', employeeSchema);

export default Employee;
