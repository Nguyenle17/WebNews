import User from "../db/schema/user.schema.js";
import Interest from '../db/schema/interest.schema.js'

export default class UserModel {
  async add(data) {
    try {
      const user = await User.create(data);
      return user;
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async update(user, data) {
    try {
      return await User.findByIdAndUpdate(user.id, { $set: data });
    } catch (error) {
      console.error('Error update user:', error);
    }
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async getInterests(user) {
    return await Interest.find({
      userId: user.id,
      email: user.email,
    })
  }

  async addInterest(user, data) {
    return await Interest.create({
      userId: user.id,
      email: user.email,
      content: data,
    })
  }

  async deleteInterest(user, id) {
    return await Interest.deleteOne({ _id: id, userId: user.id, email: user.email })
  }
}
