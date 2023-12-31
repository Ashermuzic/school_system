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
    if (data.length === 0)
      return res.status(404).json("Incorrect username or password !");

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
    if (data.length === 0)
      return res.status(404).json("Incorrect username or password !");

    // The query will return a row only if the username and password match.
    // No further password processing is needed.

    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    const { password, ...other } = data[0];

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
    "INSERT INTO teachers (`name`,`email`,`phone`,`password`,`subject_id`,`type`,`img`) VALUES (?)";

  let imageFilename = req.file ? req.file.filename : "no_image_available.png";

  const values = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.password,
    req.body.subject_id,
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

// Students Grade post based on Teacher

app.put("/studentGrades/:gradeId", (req, res) => {
  const gradeId = req.params.gradeId;
  const {
    studentId,
    teacherId,
    subjectId,
    continuous_assessment,
    midterm,
    final_exam,
    date,
  } = req.body;

  console.log("Data received from client:");
  console.log(req.body);

  // Create an object to store the fields and their values that need to be updated
  const updateFields = {};

  // Check if each field is provided in the request body and add it to the updateFields object
  if (studentId !== undefined) {
    updateFields.student_id = studentId;
  }
  if (teacherId !== undefined) {
    updateFields.teacher_id = teacherId;
  }
  if (subjectId !== undefined) {
    updateFields.subject_id = subjectId;
  }
  if (continuous_assessment !== undefined) {
    updateFields.continuous_assessment = continuous_assessment;
  }
  if (midterm !== undefined) {
    updateFields.midterm = midterm;
  }
  if (final_exam !== undefined) {
    updateFields.final_exam = final_exam;
  }
  if (date !== undefined) {
    updateFields.date = date;
  }

  // Check if any fields were provided for updating
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ error: "No fields to update." });
  }

  // Build the SQL update query dynamically
  const updateQuery = `
    UPDATE grades
    SET ?
    WHERE id = ?
  `;

  con.query(updateQuery, [updateFields, gradeId], function (err, result) {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while updating grades." });
    }
    res.status(200).json({ message: "Grades updated successfully" });
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
  });
});

//Fetch attendance
app.get("/attendance/teacher/:teacherId/date/:date", (req, res) => {
  const teacherId = req.params.teacherId;
  const date = req.params.date;

  const sql = `
    SELECT * 
    FROM attendance 
    WHERE teacher_id = ? AND date = ?
  `;

  con.query(sql, [teacherId, date], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "An error occurred while fetching attendance records.",
      });
    }
    res.status(200).json(result);
  });
});

// Create a new attendance record
app.post("/attendance", (req, res) => {
  const { teacher_id, student_id, date, status } = req.body;
  console.log(req.body);
  // Check for required fields
  if (!teacher_id || !student_id || !date || !status) {
    return res.status(400).json({
      error:
        "Required fields (teacher_id, student_id, date, status) are missing.",
    });
  }

  // Insert the attendance record into your database
  const sql = `
    INSERT INTO attendance (teacher_id, student_id, date, status)
    VALUES (?, ?, ?, ?)
  `;

  con.query(
    sql,
    [teacher_id, student_id, date, status],
    function (err, result) {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while inserting attendance." });
      }
      res
        .status(200)
        .json({ message: "Attendance record inserted successfully" });
    }
  );
});

// Endpoint to get attendance records for a specific teacher
app.get("/attendance/:teacherId", (req, res) => {
  const teacherId = req.params.teacherId;

  // Query the database to retrieve attendance records for the specific teacher
  const sql = `
    SELECT A.id AS id, S.id AS student_id, S.name AS student_name, S.img AS student_img, DATE_FORMAT(A.date, '%d/%m/%y') AS formatted_date, A.status
    FROM attendance AS A
    JOIN students AS S ON A.student_id = S.id
    WHERE A.teacher_id = ?
    ORDER BY A.date DESC;
  `;

  con.query(sql, [teacherId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "An error occurred while fetching attendance records.",
      });
    }
    res.status(200).json(results);
  });
});

// Teacher search by name
app.get("/teacher/search", (req, res) => {
  const teacherName = req.query.name;

  // Query the database to search for a teacher by name
  const sql = `
    SELECT id
    FROM teachers
    WHERE name = ?;
  `;

  con.query(sql, [teacherName], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while searching for the teacher." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Teacher not found." });
    }

    // Return the teacher's ID if found
    res.status(200).json({ id: results[0].id });
  });
});

// Endpoint to get the top-scoring students for a specific subject
app.get("/top-scoring-student/:subject", (req, res) => {
  const subject = req.params.subject;

  const sql = `
    SELECT S.id AS id, S.name AS student_name, S.grade, S.sex, S.age, S.img AS student_img, Sub.subject_name, SUM(G.continuous_assessment + G.midterm + G.final_exam) AS total_score
    FROM students AS S
    JOIN grades AS G ON S.id = G.student_id
    JOIN subjects AS Sub ON G.subject_id = Sub.id
    WHERE Sub.subject_name = ?
    GROUP BY S.id, S.name, S.grade, S.sex, S.age, S.img, Sub.subject_name
    ORDER BY total_score DESC
    LIMIT 5;
  `;

  con.query(sql, [subject], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error:
          "An error occurred while fetching the top-scoring students for the specified subject.",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: `Top-scoring students not found for the subject: ${subject}`,
      });
    }

    res.status(200).json(results); // Send the top-scoring students' data
  });
});

// Endpoint to get average points per class for a specific subject
app.get("/average-points/:subject", (req, res) => {
  const subject = req.params.subject;

  const sql = `
    SELECT S.grade AS grade, AVG(G.continuous_assessment + G.midterm + G.final_exam) AS average_points
    FROM students AS S
    JOIN grades AS G ON S.id = G.student_id
    JOIN subjects AS Sub ON G.subject_id = Sub.id
    WHERE Sub.subject_name = ?
    GROUP BY S.grade
    ORDER BY 
      CASE 
        WHEN S.grade = '8' THEN 1
        WHEN S.grade = '9' THEN 2
        WHEN S.grade = '10' THEN 3
        WHEN S.grade = '11' THEN 4
        WHEN S.grade = '12' THEN 5
        ELSE 6
      END;
  `;

  con.query(sql, [subject], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error:
          "An error occurred while fetching the average points per class for the specified subject.",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: `Average points data not found for the subject: ${subject}`,
      });
    }

    res.status(200).json(results); // Send the average points data
  });
});

app.listen(8081, () => {
  console.log("running");
});
