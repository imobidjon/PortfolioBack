const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');


const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

// mdb connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.r2livdc.mongodb.net/portfolio?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DataBase Connected");
  })
  .catch((err) => console.log(err));

// models
const Skills = mongoose.model(
  "skills",
  new mongoose.Schema({
    name: String,
    image: String,
  })
);

const Portfolio = mongoose.model(
  "portfolio",
  new mongoose.Schema({
    name: String,
    technologies: [
      {
        name: String,
      },
    ],
    description: String,
    frontGit_link: String,
    backGit_link: String,
    host_link: String,
  })
);

const Message = mongoose.model(
  "message",
  new mongoose.Schema({
    name: String,
    email: String,
    message: String,
  })
);

// routes
app.get("/api/skills", async (req, res) => {
  try {
    const skills = await Skills.find({});
    res.send(skills);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/api/skills", async (req, res) => {
  const { name, image } = req.body;

  try {
    const skill = new Skills({ name, image });
    await skill.save();
    res.send(skill);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.get("/api/portfolio", async (req, res) => {
  try {
    const portfolio = await Portfolio.find({});
    res.send(portfolio);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/api/portfolio", async (req, res) => {
  const {
    name,
    technologies,
    description,
    frontGit_link,
    backGit_link,
    host_link,
  } = req.body;

  try {
    const portfolio = new Portfolio({
      name,
      technologies,
      description,
      frontGit_link,
      backGit_link,
      host_link,
    });
    await portfolio.save();
    res.send(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.post("/api/message", async (req, res) => {
  const {
    name,
    email,
    message
  } = req.body;

  try {
    const contact = new Message({
      name,
      email,
      message
    });
    await contact.save();
    res.status(200).send({info: 'information saved'});
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

const port = 5000;
app.listen(port, () => console.log(`serve at http://localhost:${port}`));
