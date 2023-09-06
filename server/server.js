import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const app = express();

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST, GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //the folder

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "school_system_db",
  // database: "defense",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

con.connect(function (err) {
  if (err) {
    console.log("Error in connection");
  } else {
    console.log("Connection successful");
  }
});

// =============getAdmin============

app.get("/getAdmins", (req, res) => {
  const sql = "SELECT * FROM admins";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get Admins error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

// =============getEmployees============

app.get("/getStudents", (req, res) => {
  const sql = "SELECT * FROM students";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get students error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

// =============getTeachers============

app.get("/getTeachers", (req, res) => {
  const sql = "SELECT * FROM teachers";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get teachers error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

// =============GET Student based on ID============

app.get("/getStudent/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM students WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get student error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

// =============GET Teacher based on ID============

app.get("/getTeacher/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM teachers WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get Teacher error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

// =============GET Admin based on ID============

app.get("/getAdmin/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM admins WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get Admins error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

// =============UPDATE student============

app.put("/updateStudent/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body; // Get all updated data from the request body

  console.log(updatedData);
  // Define the SQL query to update all fields of the student's record
  const sql = `
    UPDATE students 
    SET 
      name = ?,
      email = ?,
      phone = ?,
      age = ?,
      sex = ?,
      grade = ?,
      img = ?
    WHERE id = ?
  `;

  const values = [
    updatedData.name,
    updatedData.email,
    updatedData.phone,
    updatedData.age,
    updatedData.sex,
    updatedData.grade,
    updatedData.img,
    id,
  ];

  // Execute the SQL query with the updated data and student id
  con.query(sql, values, (err, result) => {
    if (err) {
      // Handle any errors that occur during the database query
      return res
        .status(500)
        .json({ error: "Error updating student record in the database" });
    }

    // Check if any rows were affected by the update
    if (result.affectedRows === 0) {
      // If no rows were affected, it means the student with the given id was not found
      return res.status(404).json({ error: "Student not found" });
    }

    // If the update was successful and at least one row was affected, return a success response
    return res.status(200).json({ status: "Success" });
  });
});

// =============UPDATE Teacher============

app.put("/updateTeacher/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body; // Get all updated data from the request body

  // Define the SQL query to update all fields of the student's record
  const sql = `
    UPDATE teachers 
    SET 
      name = ?,
      email = ?,
      phone = ?,
      subject = ?,
      type = ?,
      img = ?
    WHERE id = ?
  `;

  const values = [
    updatedData.name,
    updatedData.email,
    updatedData.phone,
    updatedData.subject,
    updatedData.type,
    updatedData.img,
    id,
  ];

  // Execute the SQL query with the updated data and student id
  con.query(sql, values, (err, result) => {
    if (err) {
      // Handle any errors that occur during the database query
      return res
        .status(500)
        .json({ error: "Error updating student record in the database" });
    }

    // Check if any rows were affected by the update
    if (result.affectedRows === 0) {
      // If no rows were affected, it means the student with the given id was not found
      return res.status(404).json({ error: "Student not found" });
    }

    // If the update was successful and at least one row was affected, return a success response
    return res.status(200).json({ status: "Success" });
  });
});

// =============DELETE Student============
app.delete("/deleteStudent/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM students WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete student error in sql" });
    return res.json({ Status: "Success" });
  });
});

// =============DELETE Teacher============
app.delete("/deleteTeacher/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM teachers WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete teacher error in sql" });
    return res.json({ Status: "Success" });
  });
});

// =============Verify user============

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not Authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json({ Error: "Token wrong" });
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    });
  }
};

app.get("/dashboard", verifyUser, (req, res) => {
  return res.json({ Status: "Success", role: req.role, id: req.id });
});

// =============Admin count============

app.get("/adminCount", (req, res) => {
  const sql = "SELECT count(id) as admin FROM admins";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

// =============Student count============

app.get("/studentCount", (req, res) => {
  const sql = "SELECT count(id) as student FROM students";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

// =============teacher count============

app.get("/teacherCount", (req, res) => {
  const sql = "SELECT count(id) as teacher FROM teachers";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

// =============LOGIN============

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in running query" });
    if (result.length > 0) {
      const id = result[0].id;
      const token = jwt.sign({ role: "admin" }, "jwt-secret-key", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or password" });
    }
  });
});

// =============EmployeeLOGIN============

app.post("/employeelogin", (req, res) => {
  const sql = "SELECT * FROM employee WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in running query" });
    if (result.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        result[0].password,
        (err, response) => {
          if (err)
            return res.json({
              Error: "Password Error ",
            });
          if (response) {
            const token = jwt.sign(
              { role: "employee", id: result[0].id },
              "jwt-secret-key",
              {
                expiresIn: "1d",
              }
            );
            res.cookie("token", token);
            return res.json({ Status: "Success", id: result[0].id });
          } else {
            return res.json({
              Status: "Error",
              Error: "Wrong Email or Password",
            });
          }
        }
      );
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or password" });
    }
  });
});

// app.get("/employee/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = "SELECT * FROM employee WHERE id = ?";
//   con.query(sql, [id], (err, result) => {
//     if (err) return res.json({ Error: "Get employee error in sql" });
//     return res.json({ Status: "Success", Result: result });
//   });
// });

// =============LOGOUT============

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

// =============CREATE Student============

app.post("/createStudent", upload.single("img"), (req, res) => {
  const sql =
    "INSERT INTO students (`name`,`email`,`phone`,`age`,`sex`,`grade`,`img`) VALUES (?)";

  let imageFilename = req.file ? req.file.filename : "no_image_available.png";

  const values = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.age,
    req.body.sex,
    req.body.grade,
    imageFilename,
  ];

  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Error Inside signup query" });
    return res.json({ Status: "Success" });
  });
});

// =============CREATE Teacher============

app.post("/createTeacher", upload.single("img"), (req, res) => {
  const sql =
    "INSERT INTO teachers (`name`,`email`,`phone`,`password`,`subject`,`type`,`img`) VALUES (?)";

  let imageFilename = req.file ? req.file.filename : "no_image_available.png";

  const values = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.password,
    req.body.subject,
    req.body.type,
    imageFilename,
  ];

  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Error Inside signup query" });
    return res.json({ Status: "Success" });
  });
});

app.listen(8081, () => {
  console.log("running");
});
