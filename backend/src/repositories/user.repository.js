import User from "../models/User.model.js";

class UserRepository {
  findByEmail(email, { withPassword = false } = {}) {
    const query = User.findOne({ email });

    if (withPassword) {
      query.select("+password +refreshToken");
    }

    return query;
  }

  findById(id) {
    return User.findById(id);
  }

  create(data) {
    return User.create(data);
  }
}

export default new UserRepository();
