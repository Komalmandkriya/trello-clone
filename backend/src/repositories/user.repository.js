import User from "../models/User.model.js";

class UserRepository {
  findByEmail(email, { withPassword = false } = {}) {
    const query = User.findOne({ email });

    if (withPassword) {
      query.select("+password +refreshToken");
    }

    return query;
  }

  findById(id, { withRefreshToken = false } = {}) {
    const query = User.findById(id);

    if (withRefreshToken) {
      query.select("+refreshToken");
    }

    return query;
  }

  create(data) {
    return User.create(data);
  }

  updateProfile(id, data) {
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
  updateRefreshToken(id, refreshToken) {
    return User.findByIdAndUpdate(id, { refreshToken }, { new: true });
  }
}

export default new UserRepository();
