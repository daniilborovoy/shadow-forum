import {Schema, model, Types} from 'mongoose';

const UserSchema = new Schema({
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String}
});

export default model('User', UserSchema);