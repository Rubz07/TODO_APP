const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
const { response } = require("express");
dotenv.config();
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//DB CONNECCTION
const url = process.env.DB_CONNECT;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.connect(url, options).then(async (db, err) => {
  if (err) {
    console.log("err connecting to DB");
  }
  console.log("connected to DB!!");

  app.listen(3000, () => console.log("Server Up and running"));
});

//CRUD OPERATIONS
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("../view/todo.ejs", { todoTasks: tasks });
  });
});

app.post("/", async (req, res) => {
  try {
    const todoTask = new TodoTask({
      content: req.body.content,
    });
    await todoTask.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

//UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("../view/todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
