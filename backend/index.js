require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
const setupSwagger = require('./swagger')

const taskRoute = require("./src/routes/task.route.js")
const projectRoute = require("./src/routes/project.route.js")
const collaboratorRoute = require("./src/routes/collaborator.route.js")
const authRoute = require("./src/routes/auth.route.js")

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())
setupSwagger(app)

app.use("/api/tasks", taskRoute);
app.use("/api/projects", projectRoute);
app.use("/api/collaborators", collaboratorRoute);
app.use("/api/auth", authRoute)

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT, () => {
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));