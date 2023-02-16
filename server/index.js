const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const crypto = require("crypto");
const fs = require("fs");
const ssh = require("ssh2").Client;
const app = express();

const upload = multer({ storage: multer.memoryStorage() });
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const conn = new ssh();
conn
  .on("ready", function () {
    conn.forwardOut(
      "127.0.0.1",
      12345,
      "127.0.0.1",
      3306,
      function (err, stream) {
        if (err) throw err;
        const db = mysql.createConnection({
          user: "phawit2",
          password: "root",
          database: "dropquest",
          stream: stream,
        });
        // app.get("/*", function (req, res) {
        //   res.sendFile(path.join(__dirname, "build", "index.html"));
        // });
        // set up your routes and middlewares here
        app.get("/users", function (req, res) {
          db.query("SELECT username, email FROM users;", (err, result) => {
            console.log(result);
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          });
        });

        app.get("/question", function (req, res) {
          db.query(
            "SELECT question_name, choice1, choice2, choice3, choice4, correct_choice FROM question_list;",
            (err, result) => {
              console.log(result);
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/create", upload.single("image"), (req, res) => {
          const email = req.body.email;
          const username = req.body.username;
          const password = req.body.password;
          const image = req.file;
          const imageBuffer = image.buffer;
          const salt = bcrypt.genSaltSync(10);
          const passwordHash = bcrypt.hashSync(password, salt);
          sharp(imageBuffer)
            .resize(100, 100)
            .toBuffer()
            .then((data) => {
              const imageBuffer = data;
              const sql =
                "INSERT INTO users (email, username, password, image) VALUES (?,?,?,?)";
              const values = [email, username, passwordHash, imageBuffer];

              db.query(sql, values, (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(500).send({ message: "Error uploading image" });
                } else {
                  console.log(result);
                  res.status(201).send({ message: "Image uploaded" });
                }
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({ message: "Error resizing image" });
            });
        });

        app.post("/login", (req, res) => {
          const email = req.body.email;
          const password = req.body.password;
          console.log(email, password);
          const sql = "SELECT * FROM users WHERE email = ?";
          const values = [email];

          db.query(sql, values, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send({ message: "Error logging in" });
            } else if (result.length === 0) {
              res
                .status(401)
                .send({ message: "Email or password is incorrect" });
            } else {
              const passwordHash = result[0].password;

              // Compare the provided password with the hashed password in the database
              bcrypt.compare(password, passwordHash, (err, match) => {
                if (err) {
                  console.log(err);
                  res.status(500).send({ message: "Error logging in" });
                } else if (match) {
                  res.status(200).send({
                    message: "Logged in",
                    username: result[0].username,
                    image: result[0].image,
                    user_id: result[0].user_id,
                  });
                } else {
                  res
                    .status(401)
                    .send({ message: "Email or password is incorrect" });
                }
              });
            }
          });
        });

        app.post("/resetpassword", (req, res) => {
          const email = req.body.email;
          // Check if email exists in the database
          const sql = "SELECT * FROM users WHERE email = ?";
          const values = [email];
          db.query(sql, values, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send({ message: "Error checking email" });
            } else if (result.length === 0) {
              res.status(400).send({ message: "Email not found" });
            } else {
              // Generate a password reset token
              const resetToken = crypto.randomBytes(20).toString("hex");
              // Save the reset token to the database
              const sql = "UPDATE users SET reset_token = ? WHERE email = ?";
              const values = [resetToken, email];
              db.query(sql, values, (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(500).send({ message: "Error saving reset token" });
                } else {
                  // Send an email with a password reset link
                  const resetLink = `http://dropquest.it.kmitl.ac.th/resetpassword/${resetToken}`;
                  const message = `Click the link to reset your password: ${resetLink}`;
                  const mailer = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                      user: "62070144@kmitl.ac.th",
                      pass: "Imnayeon1995",
                    },
                  });

                  const mailOptions = {
                    from: "dropquest@kmitl.ac.th",
                    to: email,
                    subject: "Reset Password",
                    text: message,
                  };

                  mailer.sendMail(mailOptions, (err, info) => {
                    if (err) {
                      console.log(err);
                      res.status(500).send({ message: "Error sending email" });
                    } else {
                      console.log(`Email sent: ${info.response}`);
                      res
                        .status(200)
                        .send({ message: "Password reset email sent" });
                    }
                  });
                }
              });
            }
          });
        });

        app.post("/changepassword", (req, res) => {
          const resetToken = req.body.token;
          const newPassword = req.body.password;

          // Check if reset token is valid
          const sql = "SELECT * FROM users WHERE reset_token = ?";
          const values = [resetToken];
          db.query(sql, values, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send({ message: "Error checking reset token" });
            } else if (result.length === 0) {
              res.status(400).send({ message: "Invalid reset token" });
            } else {
              // Hash the new password
              const hash = bcrypt.hashSync(newPassword, 10);
              // Update the password in the database
              const sql =
                "UPDATE users SET password = ?, reset_token = null WHERE reset_token = ?";
              const values = [hash, resetToken];
              db.query(sql, values, (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(500).send({ message: "Error updating password" });
                } else {
                  res.status(200).send({ message: "Password updated" });
                }
              });
            }
          });
        });

        app.post("/createquiz", upload.single("image"), (req, res) => {
          // Extract user id and quiz data from request body
          const userId = req.body.userid;
          const { groupname, category, releasedate, score, timer } = JSON.parse(
            req.body.quizdata
          );

          const image = req.file;
          const imageBuffer = image.buffer;

          sharp(imageBuffer)
            .resize(100, 100)
            .toBuffer()
            .then((data) => {
              const imageBuffer = data;

              // Insert data into question_group table
              db.query(
                "INSERT INTO question_group (g_name, createddate,question_time, question_score,privacy, user_user_id, category_category_id, question_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  groupname,
                  releasedate,
                  timer,
                  score,
                  "public",
                  userId,
                  category,
                  imageBuffer,
                ],
                (err, result) => {
                  if (err) {
                    return res.status(500).send(err);
                  }

                  // Get the inserted group id
                  const groupId = result.insertId;
                  const data = JSON.parse(req.body.questiondata);
                  console.log(data);
                  console.log(groupId, "group_id");

                  // Insert data into question_list table and question_list_has_question_group table
                  const questionListPromises = data.map((question) => {
                    return new Promise((resolve, reject) => {
                      db.query(
                        "SELECT * FROM question_list WHERE question_name = ? AND choice1 = ? AND choice2 = ? AND choice3 = ? AND choice4 = ?",
                        [
                          question.question,
                          question.choice1,
                          question.choice2,
                          question.choice3,
                          question.choice4,
                        ],
                        (err, result) => {
                          if (err) {
                            reject(err);
                          }

                          if (result.length === 0) {
                            db.query(
                              "INSERT INTO question_list (question_name,choice1,choice2,choice3,choice4,correct_choice) VALUES (?,?,?,?,?,?)",
                              [
                                question.question,
                                question.choice1,
                                question.choice2,
                                question.choice3,
                                question.choice4,
                                question.correct,
                              ],
                              (err, result) => {
                                if (err) {
                                  reject(err);
                                }
                                const questionId = result.insertId;
                                db.query(
                                  "INSERT INTO question_list_has_question_group (question_list_question_id, question_group_group_id) VALUES (?, ?)",
                                  [questionId, groupId],
                                  (err, result) => {
                                    if (err) {
                                      reject(err);
                                    }
                                    resolve();
                                  }
                                );
                              }
                            );
                          } else {
                            const questionId = result[0].question_id;
                            db.query(
                              "INSERT INTO question_list_has_question_group (question_list_question_id, question_group_group_id) VALUES (?, ?)",
                              [questionId, groupId],
                              (err, result) => {
                                if (err) {
                                  reject(err);
                                }
                                resolve();
                              }
                            );
                          }
                        }
                      );
                    });
                  });

                  Promise.all(questionListPromises)
                    .then(() => {
                      return res
                        .status(200)
                        .send({ message: "Quiz created successfully" });
                    })
                    .catch((err) => {
                      return res.status(500).send(err);
                    });
                }
              );
            });
        });

        // start the server
        const port = 4001;
        app.listen(port, 'dropquest.it.kmitl.ac.th' ,function () {
          console.log(`Server listening on port ${port}`);
        });
      }
    );
  })
  .connect({
    host: "161.246.49.33",
    port: 22,
    username: "myadmin",
    password: "@egT!cRs0026",
  });
