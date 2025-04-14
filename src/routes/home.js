import express from "express";
export const router = express.Router();

// Basic route
router.get("/", (req, res) => {
  // res.status(200).json({
  //   message: "Welcome to the API Builder!",
  //   status: "success",
  //   api_version: "1.0.0", // Example version, adjust as needed
  //   description:
  //     "This is the main entry point of the API. For more details, check the documentation.",
  // });
  res.render("index", { title: "My Express App", message: "Hello!" });
});
