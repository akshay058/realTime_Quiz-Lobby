// config/database.js
module.exports = {
  url: process.env.MONGO_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
