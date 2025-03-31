const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Da ket noi toi MongoDB");
  } catch (err) {
    console.error(err);
  }
}
module.exports = connectToDB;
