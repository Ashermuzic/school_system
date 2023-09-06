import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST, GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
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
  const sql = "UPDATE students set name = ? WHERE id = ?";
  con.query(sql, [req.body.name, id], (err, result) => {
    if (err) return res.json({ Error: "update student error in sql" });
    return res.json({ Status: "Success" });
  });
});

// =============UPDATE Teacher============

app.put("/updateTeacher/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE teacher set subject = ?, type =? WHERE id = ?";
  con.query(sql, [req.body.subject, req.body.type, id], (err, result) => {
    if (err) return res.json({ Error: "update teacher error in sql" });
    return res.json({ Status: "Success" });
  });
});

// =============DELETE============
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete employee error in sql" });
    return res.json({ Status: "Success" });
  });
});

// =============DELETE Teacher============
app.delete("/deleteTeacher/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM teacher WHERE id = ?";
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

// =============Employee count============

app.get("/studentCount", (req, res) => {
  const sql = "SELECT count(id) as student FROM students";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

// =============Employee count============

app.get("/teacherCount", (req, res) => {
  const sql = "SELECT count(id) as teacher FROM teachers";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

// =============Sum of salary============

app.get("/salary", (req, res) => {
  const sql = "SELECT sum(salary) as sumOfSalary FROM employee";
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

// app.post("/createStudent", upload.single("image"), (req, res) => {
//   const sql =
//     "INSERT INTO students (`name`,`email`,`age`,`sex`,`grade`,`phone`, `img`) VALUES (?)";

//   let imageFilename = req.file ? req.file.filename : "no_image_available.jpg"; // Set a default image filename if no image is provided

//   const values = [
//     req.body.name,
//     req.body.email,
//     req.body.age,
//     req.body.sex,
//     req.body.grade,
//     req.body.phone,
//     imageFilename,
//   ];

//   con.query(sql, [values], (err, result) => {
//     if (err) return res.json({ Error: "Error Inside signup query" });
//     return res.json({ Status: "Success" });
//   });
// });

app.post("/createStudent", upload.single("image"), (req, res) => {
  const sql =
    "INSERT INTO students (`name`,`email`,`phone`,`age`,`sex`,`grade`) VALUES (?)";

  const values = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.age,
    req.body.sex,
    req.body.grade,
  ];

  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Error Inside signup query" });
    return res.json({ Status: "Success" });
  });
});

// =============CREATE Teacher============

app.post("/createTeacher", upload.single("image"), (req, res) => {
  const sql =
    "INSERT INTO teacher (`name`,`email`,`password`,`subject`,`type`,`image`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Error: "Error in hashing password" });
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.subject,
      req.body.type,
      req.file.filename,
    ];

    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Inside signup query" });
      return res.json({ Status: "Success" });
    });
  });
});

app.listen(8081, () => {
  console.log("running");
});
