const mongoose = require("mongoose");

const timeTableSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  schedule: {
    Monday: { type: Map, of: String, default: {} },
    Tuesday: { type: Map, of: String, default: {} },
    Wednesday: { type: Map, of: String, default: {} },
    Thursday: { type: Map, of: String, default: {} },
    Friday: { type: Map, of: String, default: {} },
  },
});

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

module.exports = TimeTable;
