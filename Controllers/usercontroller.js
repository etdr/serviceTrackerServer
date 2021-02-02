const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const validateSession = require("../Middleware/validate-session");
const validateSessionTeacher = require("../Middleware/validate-session-teacher");

const { StudentUser: User, TeacherUser, Service } = require('../Models/index')

router.post("/signup/:role", async (req, res) => {

  try {

    if (!['teacher', 'student'].includes(req.params.role))
      throw new Error('role must be teacher or student')

    const M = req.params.role === 'student' ? User : TeacherUser

    const creationResult = await M.create({
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      email: req.body.user.email,
      password: await bcrypt.hash(req.body.user.password, 12),
      classId: req.body.user.classId,
      teacher: req.params.role === 'teacher'
    })
      
    const token = jwt.sign({ id: studentUser.id }, process.env.JWT_SECRET, { expiresIn: "7d" })
    
    res.json({
      user: creationResult,
      message: `${req.params.role} user was created successfully`,
      sessionToken: token,
    })

  } catch (err) {
    res.status(500).send(err)
  }
});

//login
router.post("/login", async (req, res) => {
  try {

    try {
      const studentResult = await User.findOne({
        where: { email: req.body.user.email },
      })
        
      if (studentResult) {
        const bcResult = await bcrypt.compare(req.body.user.password, user.password)
          
        if (bcResult) {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
          res.status(200).json({
            user: user,
            message: "successfully authenticated",
            sessionToken: token,
          });
        } else {
          res.status(502).json({ error: "password mismatch" });
        }

      } else {
        res.status(500).json({ error: "user not found" });
      }
    } catch (err) {

      const teacherResult = await TeacherUser.findOne({
        where: { email: req.body.user.email }
      })

      if (teacherResult) {
        const bcResult = await bcrypt.compare(req.body.user.password, user.password)
          
        if (bcResult) {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
          res.status(200).json({
            user: user,
            message: "successfully authenticated",
            sessionToken: token,
          });
        } else {
          res.status(502).json({ error: "password mismatch" });
        }

      }
    }
      
  } catch (err) {
    res.status(500).json(err)
  }
});

















//GET '/' --- Gets all users (eventually add validateSession when connected to teacher)
router.get("/all", validateSessionTeacher, function (req, res) {
  return User.findAll({
    where: { classId: req.user.classId },
    include: [{ model: teacherUser }, { model: Service }],
    order: [["firstName", "ASC"]]
  })
    .then((userinfo) => res.status(200).json(userinfo))
    .catch((err) => res.status(500).json({ error: err }));
});

//GET '/' --- Gets all users (eventually add validateSession when connected to teacher)
router.get("/allbyhours", validateSessionTeacher, function (req, res) {
  return User.findAll({
    where: { classId: req.user.classId },
    include: [{ model: teacherUser }, { model: Service }],
    order: [["totalHours", "Desc"]]
  })
    .then((userinfo) => res.status(200).json(userinfo))
    .catch((err) => res.status(500).json({ error: err }));
});

// GET user with a token
router.get('/me', validateSession, async (req, res) => {
  try {
    const dbResult = await User.findOne({
      where: { id: req.user.id },
      include: [teacherUser, Service]
    })

    res.status(200).json(dbResult)
  } catch (err) {
    res.status(500).json(err)
  }
})


//GET '/:id' --- Gets all users (eventually add validateSession when connected to teacher)
router.get("/:id", validateSessionTeacher, function (req, res) {
    return User.findOne({
      where: {id: req.params.id, classId: req.user.classId },
      include: [{ model: teacherUser }, { model: Service }],
      order: [["firstName", "ASC"]]
    })
      .then((userinfo) => res.status(200).json(userinfo))
      .catch((err) => res.status(500).json({ error: err }));
  });

//Update User Info By ID --- I want a user & teacher to be able to do this
router.put("/:id", validateSessionTeacher, function (req, res) {
  const updateUserInfo = {
    firstName: req.body.studentUser.firstName,
    lastName: req.body.studentUser.lastName,
    email: req.body.studentUser.email,
    // password: bcrypt.hashSync(req.body.studentUser.password, 12),
  };

if(req.body.studentUser.password){  updateUserInfo.password= bcrypt.hashSync(req.body.studentUser.password, 12)}

  const query = {
    where: { id: req.params.id, classId: req.user.classId },
    include: [{ model: User }],
  };

  User.update(updateUserInfo, query)
    .then((userinfo) => res.status(200).json(userinfo))
    .catch((err) => res.status(500).json({ error: err }));
});



router.put("/totalHours/:id", validateSessionTeacher , function (req, res) {
  const updateUserInfo = {
   totalHours: req.body.studentUser.totalHours,
  };
  const query = { where: { id: req.params.id} };
    //req.body.service -- instead of saying I have to have all of the above-- I just want anything that happens to be in that object will be sent
  // req.body.service
  User.update(req.body.studentUser, query)
    .then((entry) => res.status(200).json(entry))
    .catch((err) => res.status(500).json({ error: err }));
});



router.delete("/delete", validateSession, function (req, res) {
  const query = { where: { id: req.user.id } };
  User.destroy(query)
    .then(() => res.status(200).json({ message: "user is removed" }))
    .catch((err) => res.status(500).json({ error: err }));
});

//   router.delete("/:id", validateSessionTeacher, function (req, res) {
//     const query = { where: {id: req.params.id} };
//     User.destroy(query)
//       .then(() => res.status(200).json({ message: "student user is removed" }))
//       .catch((err) => res.status(500).json({ error: err }));
//   });

router.delete("/:id", validateSessionTeacher, function (req, res) {
  const query = { where: { id: req.params.id }, include: [{ model: User }] };
  User.destroy(query)
    .then(() => res.status(200).json({ message: "student user is removed" }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
