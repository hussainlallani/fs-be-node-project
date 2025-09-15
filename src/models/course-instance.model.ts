import mongoose, { Schema } from "mongoose";

const CourseInstanceSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Open", "Closed", "Cancelled"],
    default: "Open",
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
CourseInstanceSchema.virtual("url").get(function (this: {
  _id: Schema.Types.ObjectId;
}) {
  return `/api/courseinstance/${this._id}`;
});

// Export model
module.exports = mongoose.model("CourseInstance", CourseInstanceSchema);
