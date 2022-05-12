module.exports = mongoose => {
    const User = mongoose.model(
      "user",
      mongoose.Schema(
        {
          firstName: String,
          lastName: String,
          email: String,
          age:String,
          introduction:String
        },
        { timestamps: true }
      )
    );
    return User;
  };