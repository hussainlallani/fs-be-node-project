// // Collections Schemas
// export const authorSchema = {
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["name"],
//       properties: {
//         name: {
//           bsonType: "string",
//           description: "must be a string and is required",
//         },
//         bio: {
//           bsonType: "string",
//           description: "must be a string and is required",
//         },
//         website: {
//           bsonType: "objectId",
//           description: "must be object Id",
//         },
//       },
//     },
//   },
//   validationLevel: "strict",
//   validationAction: "error",
// };

import { Schema, model } from "mongoose";

const authorSchema = new Schema({
  name: { type: String, required: true },
  bio: { type: String },
  website: { type: String },
});

export const Author = model("Author", authorSchema);
