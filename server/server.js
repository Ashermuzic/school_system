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

// Serve uploaded teacher files from the "teacher_files" directory
app.use("/attachedFiles", express.static("public/teacher_files"));

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

const teacherStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/teacher_files");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadTeacher = multer({ storage: teacherStorage });

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
  const sql =
    "SELECT teachers.*, subjects.subject_name FROM teachers JOIN subjects ON teachers.subject_id = subjects.id";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get teachers error in SQL" });
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

// =============LOGIN Admin============

// app.post("/login", (req, res) => {
//   const sql = "SELECT * FROM admins WHERE name = ? AND password = ?";
//   con.query(sql, [req.body.name, req.body.password], (err, result) => {
//     if (err)
//       return res.json({ Status: "Error", Error: "Error in running query" });
//     if (result.length > 0) {
//       const id = result[0].id;
//       const token = jwt.sign({ role: "admin" }, "jwt-secret-key", {
//         expiresIn: "1d",
//       });
//       res.cookie("token", token);

//       // Log the cookie
//       console.log("Cookie:", res.getHeaders()["set-cookie"]);
//       console.log(req.body.name);

//       // return res.json({ Status: "Success" });
//       return res.json({ Status: "Success" });
//     } else {
//       return res.json({ Status: "Error", Error: "Wrong Email or password" });
//     }
//   });
// });

// =============LOGIN Admin============

app.post("/loginAdmin", (req, res) => {
  const q = "SELECT * FROM admins WHERE name = ? AND password = ?";

  con.query(q, [req.body.name, req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    // The query will return a row only if the username and password match.
    // No further password processing is needed.

    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    const { password, ...other } = data[0];

    console.log(token);

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
});

// =============LOGIN Teacher============

app.post("/loginTeacher", (req, res) => {
  const q = "SELECT * FROM teachers WHERE name = ? AND password = ?";

  con.query(q, [req.body.name, req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    // The query will return a row only if the username and password match.
    // No further password processing is needed.

    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    const { password, ...other } = data[0];

    console.log(token);

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
});

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

// =============CREATE Post============

app.post("/publishPost", (req, res) => {
  const sql = "INSERT INTO posts (`name`,`desc`,`date`) VALUES (?)";

  const values = [req.body.name, req.body.desc, req.body.date];

  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Error Inside signup query" });
    return res.json({ Status: "Success" });
  });
});
// =============Fetch Post============

app.get("/getPosts", (req, res) => {
  const q = "SELECT * FROM posts";

  con.query(q, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});

// =============File Post Teacher============

app.post("/uploadTeacherFile", uploadTeacher.single("file"), (req, res) => {
  const sql =
    "INSERT INTO teacher_post (`name`, `desc`, `filename`, `date`) VALUES (?)";

  let attachedFilename = req.file ? req.file.filename : "no_file_found.png";

  const values = [
    req.body.name,
    req.body.desc,
    attachedFilename,
    req.body.date,
  ];

  con.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error in database query:", err);
      return res.status(500).json({ Error: "Internal server error" }); // Provide a more informative error message
    }
    return res.json({ Status: "Success" });
  });
});

// =============File Get Teacher============

app.get("/getTeacherFile", (req, res) => {
  const q = "SELECT * FROM teacher_post";

  con.query(q, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});

// Students fetched based on Teacher

app.get("/students/teacher/:teacherId", (req, res) => {
  const teacherId = req.params.teacherId;
  const sql = `
    SELECT students.*, grades.*
    FROM students
    INNER JOIN grades ON students.id = grades.student_id
    WHERE grades.teacher_id = ?
  `;

  con.query(sql, [teacherId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "An error occurred while fetching students and grades.",
      });
    }
    res.status(200).json(data);
    console.log(data);
  });
});

app.listen(8081, () => {
  console.log("running");
});
