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

        app.get("/users", function (req, res) {
          db.query("SELECT username, email FROM users;", (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          });
        });

        app.get("/gameinfo", function (req, res) {
          const code = req.body.course_code
          db.query("SELECT course_id, course_code,room_id, name, startdate, enddate, g_name,question_time ,question_score, question_name, choice1, choice2, choice3, choice4, correct_choice FROM course join room ON room.room_id = course.room_room_id JOIN question_group ON room.question_group_group_id = question_group.group_id JOIN question_list_has_question_group ON question_group.group_id = question_list_has_question_group.question_group_group_id JOIN question_list ON question_list_has_question_group.question_list_question_id = question_list.question_id where course.course_code = ?;",[code] ,(err, result) => {
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
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.get("/allquiz", function (req, res) {
          db.query(
            "SELECT question_group.group_id, question_group.g_name, users.username, category.category_name, question_group.question_image FROM question_group INNER JOIN category ON question_group.category_category_id=category.category_id JOIN users ON question_group.user_user_id=users.user_id;",
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/allsession", function (req, res) {
          const roomid = req.body.roomid;
          db.query(
            "SELECT distinct course_code, course_id From course where course.room_room_id = ?;",
            [roomid],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/sessioninfo", function (req, res) {
          const roomid = req.body.roomid;
          db.query(
            "SELECT student_name, score, course_id, course_code FROM studentlist join studentlist_has_course ON studentlist.student_id = studentlist_has_course.studentlist_student_id join course ON studentlist_has_course.course_course_id = course.course_id where course.room_room_id = ?;",
            [roomid],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/roominfo", function (req, res) {
          const roomid = req.body.roomid;
          db.query(
            "SELECT name, startdate,enddate FROM room where room_id = ?;",
            [roomid],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/allquiztopic", function (req, res) {
          db.query("SELECT g_name FROM question_group;", (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          });
        });

        app.post("/myroom", function (req, res) {
          const userid = req.body.userid;
          db.query(
            "SELECT room_id, name, startdate, enddate,question_group_group_id, g_name FROM room join question_group ON room.question_group_group_id = question_group.group_id where room.user_user_id = ?;",
            [userid],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/roomdetail", function (req, res) {
          const userid = req.body.userid;
          db.query(
            "SELECT course_code, room_room_id FROM course JOIN room ON room.room_id = course.room_room_id WHERE room.user_user_id = ?;",
            [userid],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/allmyquiz", function (req, res) {
          const userid = req.body.userid;
          db.query(
            "SELECT question_group.group_id, question_group.g_name,category.category_name, users.username, question_group.question_image FROM question_group INNER JOIN category ON question_group.category_category_id=category.category_id  INNER JOIN users ON question_group.user_user_id=users.user_id where question_group.user_user_id = ?;",
            [userid],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/quizdetail", function (req, res) {
          const quizid = req.body.quizid;
          db.query(
            "SELECT question_name,choice1,choice2,choice3,choice4,correct_choice FROM question_list JOIN question_list_has_question_group ON question_list_has_question_group.question_list_question_id = question_list.question_id JOIN question_group  ON question_group.group_id = question_list_has_question_group.question_group_group_id WHERE question_group.group_id = ?;",
            [quizid],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/quiztopic", function (req, res) {
          const quizid = req.body.quizid;
          db.query(
            "SELECT distinct g_name,question_time,question_score,question_description,users.username,category_name, category_id FROM question_list JOIN question_list_has_question_group ON question_list_has_question_group.question_list_question_id = question_list.question_id JOIN question_group ON question_group.group_id = question_list_has_question_group.question_group_group_id JOIN category ON question_group.category_category_id = category.category_id INNER JOIN users ON question_group.user_user_id=users.user_id WHERE question_group.group_id = ?;",
            [quizid],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.get("/category", function (req, res) {
          db.query(
            "SELECT DISTINCT category_name FROM category INNER JOIN question_group ON question_group.category_category_id=category.category_id;",
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.get("/allcategory", function (req, res) {
          db.query("SELECT category_name FROM category;", (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          });
        });

        app.post("/code", function (req, res) {
          const code = req.body.code;
          db.query(
            "SELECT * FROM question_list JOIN question_list_has_question_group ON question_list_has_question_group.question_list_question_id = question_list.question_id JOIN question_group ON question_group.group_id = question_list_has_question_group.question_group_group_id  JOIN room ON question_group.group_id = room.question_group_group_id Join course On room.room_id = course.room_room_id where course.course_code = ?;",
            [code],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            }
          );
        });

        app.post("/editprofile", upload.single("image"), (req, res) => {
          const userid = req.body.userid;
          const username = req.body.username;
          const image = req.file;
          const imageBuffer = image.buffer;

          sharp(imageBuffer)
            .resize(100, 100)
            .toBuffer()
            .then((data) => {
              const imageBuffer = data;
              const sql =
                "UPDATE users SET username = ?, image = ? WHERE user_id = ?";
              const values = [username, imageBuffer, userid];

              db.query(sql, values, (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(500).send({ message: "Error updating profile" });
                } else {
                  const selectSql =
                    "SELECT email, username, image, user_id, googlestatus FROM users WHERE user_id = ?";
                  const selectValues = [userid];

                  db.query(
                    selectSql,
                    selectValues,
                    (selectErr, selectResult) => {
                      if (selectErr) {
                        console.log(selectErr);
                        res.status(500).send({
                          message: "Error fetching updated user data",
                        });
                      } else {
                        res.status(200).send({
                          message: "Logged in",
                          email: selectResult[0]?.email,
                          username: selectResult[0]?.username,
                          image: selectResult[0]?.image,
                          user_id: selectResult[0]?.user_id,
                          status: selectResult[0]?.googlestatus,
                        });
                      }
                    }
                  );
                }
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({ message: "Error resizing image" });
            });
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
                "INSERT INTO users (email, username, password, image, googlestatus) VALUES (?,?,?,?,?)";
              const values = [
                email,
                username,
                passwordHash,
                imageBuffer,
                "false",
              ];

              db.query(sql, values, (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(500).send({ message: "Error uploading image" });
                } else {
                  res.status(201).send({ message: "Image uploaded" });
                }
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({ message: "Error resizing image" });
            });
        });

        app.post("/googlelogin", upload.single("image"), (req, res) => {
          const email = req.body.email;
          const username = req.body.username;
          const password = req.body.password;
          const image = req.file;
          const imageBuffer = image.buffer;

          // Check if email already exists in database
          const checkUserSql =
            "SELECT * FROM users WHERE email = ? and password = ?";
          const checkUserValues = [email, password];
          db.query(checkUserSql, checkUserValues, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send({ message: "Error checking user" });
            } else if (result.length > 0) {
              // Email already exists in database, log user in
              res.status(200).send({
                message: "Logged in",
                email: result[0]?.email,
                username: result[0]?.username,
                image: result[0]?.image,
                user_id: result[0]?.user_id,
                status: result[0]?.googlestatus,
              });
            } else {
              // Email doesn't exist in database, insert new record
              const insertUserSql =
                "INSERT INTO users (email, username, password, image, googlestatus) VALUES (?,?,?,?,?)";
              sharp(imageBuffer)
                .resize(100, 100)
                .toBuffer()
                .then((data) => {
                  const imageBuffer = data;
                  const values = [
                    email,
                    username,
                    password,
                    imageBuffer,
                    "true",
                  ];
                  db.query(insertUserSql, values, (err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(500).send({ message: "Error inserting user" });
                    } else {
                      const selectUserSql =
                        "SELECT * FROM users WHERE email = ?";
                      const selectUserValues = [email];
                      db.query(
                        selectUserSql,
                        selectUserValues,
                        (err, result) => {
                          if (err) {
                            console.log(err);
                            res
                              .status(500)
                              .send({ message: "Error selecting user" });
                          } else {
                            res.status(200).send({
                              message: "Logged in",
                              email: result[0]?.email,
                              username: result[0]?.username,
                              image: result[0]?.image,
                              user_id: result[0]?.user_id,
                              status: result[0]?.googlestatus,
                            });
                          }
                        }
                      );
                    }
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send({ message: "Error resizing image" });
                });
            }
          });
        });

        app.post("/login", (req, res) => {
          const email = req.body.email;
          const password = req.body.password;
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
                    email: result[0]?.email,
                    username: result[0].username,
                    image: result[0].image,
                    user_id: result[0].user_id,
                    status: result[0].googlestatus,
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
          const {
            groupname,
            category,
            releasedate,
            score,
            timer,
            description,
          } = JSON.parse(req.body.quizdata);

          const image = req.file;
          const imageBuffer = image.buffer;

          sharp(imageBuffer)
            .resize({ width: 300 })
            .toBuffer()
            .then((data) => {
              const imageBuffer = data;

              // Insert data into question_group table
              db.query(
                "INSERT INTO question_group (g_name, createddate,question_time, question_score,privacy, user_user_id, category_category_id, question_image,question_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  groupname,
                  releasedate,
                  timer,
                  score,
                  "public",
                  userId,
                  category,
                  imageBuffer,
                  description,
                ],
                (err, result) => {
                  if (err) {
                    return res.status(500).send(err);
                  }

                  // Get the inserted group id
                  const groupId = result.insertId;
                  const data = JSON.parse(req.body.questiondata);
                  // Insert data into question_list table and question_list_has_question_group table
                  const questionListPromises = data.map((question) => {
                    return new Promise((resolve, reject) => {
                      db.query(
                        "SELECT * FROM question_list WHERE question_name = ? AND choice1 = ? AND choice2 = ? AND choice3 = ? AND choice4 = ?",
                        [
                          question.question_name,
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
                                question.question_name,
                                question.choice1,
                                question.choice2,
                                question.choice3,
                                question.choice4,
                                question.correct_choice,
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

        app.post("/updatequiz", upload.none(), (req, res) => {
          // Extract quiz data from request body
          const {
            groupname,
            category,
            releasedate,
            score,
            timer,
            description,
          } = JSON.parse(req.body.quizdata);

          const quizid = req.body.quizid;

          // Update data in question_group table
          db.query(
            "UPDATE question_group SET g_name = ?, createddate = ?, question_time = ?, question_score = ?, category_category_id = ?, question_description = ? WHERE group_id = ?",
            [
              groupname,
              releasedate,
              timer,
              score,
              category,
              description,
              quizid,
            ],
            (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }

              const data = JSON.parse(req.body.questiondata);

              // Delete questions that are no longer used in this quiz
              db.query(
                "DELETE FROM question_list_has_question_group WHERE question_group_group_id = ?",
                [quizid],
                (err, result) => {
                  if (err) {
                    return res.status(500).send(err);
                  }

                  // Update or add new questions
                  const questionListPromises = data.map((question) => {
                    return new Promise((resolve, reject) => {
                      db.query(
                        "SELECT * FROM question_list WHERE question_id = ?",
                        [question.question_id],
                        (err, result) => {
                          if (err) {
                            console.log(err);
                            reject(err);
                          }

                          if (result.length === 0) {
                            db.query(
                              "INSERT INTO question_list (question_name,choice1,choice2,choice3,choice4,correct_choice) VALUES (?,?,?,?,?,?)",
                              [
                                question.question_name,
                                question.choice1,
                                question.choice2,
                                question.choice3,
                                question.choice4,
                                question.correct_choice,
                              ],
                              (err, result) => {
                                if (err) {
                                  console.log(err);
                                  reject(err);
                                }

                                const questionId = result.insertId;
                                db.query(
                                  "INSERT INTO question_list_has_question_group (question_list_question_id, question_group_group_id) VALUES (?, ?)",
                                  [questionId, quizid],
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
                            db.query(
                              "UPDATE question_list SET question_name = ?, choice1 = ?, choice2 = ?, choice3 = ?, choice4 = ?, correct_choice = ? WHERE question_id = ?",
                              [
                                question.question_name,
                                question.choice1,
                                question.choice2,
                                question.choice3,
                                question.choice4,
                                question.correct,
                                question.question_id,
                              ],
                              (err, result) => {
                                if (err) {
                                  console.log(err);
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
                        .send({ message: "Quiz updated successfully" });
                    })
                    .catch((err) => {
                      return res.status(500).send(err);
                    });
                }
              );
            }
          );
        });

        app.delete("/deletequiz/:id", (req, res) => {
          const quizId = req.params.id;

          db.query(
            "SET FOREIGN_KEY_CHECKS = 0", // disable foreign key constraint
            (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }
              db.query(
                "DELETE FROM question_list_has_question_group WHERE question_group_group_id = ?",
                [quizId],
                (err, result) => {
                  if (err) {
                    return res.status(500).send(err);
                  }
                  db.query(
                    "DELETE FROM question_list WHERE question_id NOT IN (SELECT question_list_question_id FROM question_list_has_question_group)",
                    [quizId],
                    (err, result) => {
                      if (err) {
                        return res.status(500).send(err);
                      }
                      db.query(
                        "DELETE FROM question_group WHERE group_id = ?",
                        [quizId],
                        (err, result) => {
                          if (err) {
                            return res.status(500).send(err);
                          }
                          db.query(
                            "SET FOREIGN_KEY_CHECKS = 1", // re-enable foreign key constraint
                            (err, result) => {
                              if (err) {
                                return res.status(500).send(err);
                              }
                              return res
                                .status(200)
                                .send("Quiz deleted successfully");
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });

        app.post("/createroom", (req, res) => {
          const { name, startdate, enddate, quizid, room } = req.body;
          const userid = req.body.userid;
          const roomCodes = JSON.parse(room);

          // Insert into room table
          db.query(
            "INSERT INTO room (name, startdate, enddate, question_group_group_id, user_user_id) VALUES (?, ?, ?, ?,?)",
            [name, startdate, enddate, quizid, userid],
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).send(err);
              }

              const roomId = result.insertId;

              // Insert into course table for each room code
              roomCodes.forEach((code) => {
                db.query(
                  "INSERT INTO course (course_code,room_room_id) VALUES (?,?)",
                  [code, roomId],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      return res.status(500).send(err);
                    }
                  }
                );
              });
              return res.status(200).send("Create Room successfully");
            }
          );
        });


        app.post("/resscore", (req, res) => {
          const { name, score, course_id } = req.body;
          // Insert into room table
          db.query(
            "INSERT INTO studentlist (student_name, score) VALUES (?, ?)",
            [name, score],
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).send(err);
              }

              const student_id = result.insertId;



              db.query(
                "INSERT INTO studentlist_has_course (studentlist_student_id,course_course_id) VALUES (?,?)",
                [student_id, course_id],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                  }
                }
              );

              return res.status(200).send("Sent score successfully");
            }
          );
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
