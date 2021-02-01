
const router= require('express').Router();
const validateSession=require('../Middleware/validate-session-teacher')
const Teacher= require('../Db').import('../Models/teacherUser');
const jwt= require('jsonwebtoken')
const bcrypt= require('bcryptjs');
const validateSessionTeacher = require('../Middleware/validate-session-teacher');
const User= require('../Db').import('../Models/studentUser');
const Service = require("../Db").import("../Models/service");


router.post('/signup', (req,res) =>{
   let randomNumber= Math.floor(1000+Math.random() * 9000)
    Teacher.create({
        firstName: req.body.teacherUser.firstName,
        lastName:req.body.teacherUser.lastName,
        email:req.body.teacherUser.email,
        password:bcrypt.hashSync(req.body.teacherUser.password, 12),
        classId: randomNumber,
        
    })
    .then(teacherUser =>{
        const token= jwt.sign({classId:teacherUser.classId}, process.env.JWT_SECRET, {expiresIn:"7d"})
        res.json({
            user: teacherUser,
            message:"user was created successfully",
            sessionToken:token
        })
    }).catch(err =>res.status(500).send(err))
})


//login
router.post('/login',  (req, res) =>{

    Teacher.findOne({
        where:{email: req.body.teacherUser.email}
    })
    .then(teacherUser => {
        if(teacherUser){
            
                bcrypt.compare(req.body.teacherUser.password, teacherUser.password, (err, matches) =>{
                    if(matches){
                        const token=jwt.sign({classId:teacherUser.classId},process.env.JWT_SECRET, {expiresIn:"7d"})
                        res.status(200).json({
                            user: teacherUser,
                            message: "successfully authenticated",
                            sessionToken:token
                        })
                    }else {
                        res.status(502).json({error:'password mismatch'})
                    }
                })
            
        } else {
            res.status(500).json({error:'user not found'});
        }
    })
    .catch(err=> res.status(500).json({error:err}))
})

router.get('/me', validateSessionTeacher, async (req, res) => {
    try {
      console.log(req.user)
      const dbResult = await Teacher.findOne({
        where: { classId: req.user.classId },
        include: [{ model: User }]
      })
  
      res.status(200).json(dbResult)
    } catch (err) {
      res.status(500).json(err)
    }
  })

    //GET '/' --- Gets all users (eventually add validateSession when connected to teacher)
router.get("/all", validateSession,   function (req, res) {
    console.log(req.originalUrl)
    return Teacher.findAll( 
        
        {include: [{model: User}]})
      .then((userinfo) => res.status(200).json(userinfo))
      .catch((err) => res.status(500).json({ error: err }));
  });

      //GET ---find all students associated with specific teacher
router.get("/", validateSession, function (req, res) {
   console.log(req.user.id)
    return  Teacher.findOne(
       { 
        where: { classId: req.user.classId },
        include:[{model: User}]
    
    }
     )
      .then((userinfo) => res.status(200).json(userinfo))
      .catch((err) => res.status(500).json({ error: err }));
  });


  //Update User Info By ID --- I want a user & teacher to be able to do this
router.put("/:id",  function (req, res) {
    const updateTeacherUserInfo = {
        firstName: req.body.teacherUser.firstName,
        lastName:req.body.teacherUser.lastName,
        email:req.body.teacherUser.email,
        password:bcrypt.hashSync(req.body.teacherUser.password, 12)
    };
    // const query = { where: { classId: req.params.id } }; 
  
   Teacher.update(updateTeacherUserInfo, {where:{ classId: req.params.id } })
      .then((userinfo) => res.status(200).json(userinfo))
      .catch((err) => res.status(500).json({ error: err }));
  });


router.delete("/deleteadmin", validateSession, function (req, res) {
    const query = { where: {  classId: req.user.classId }, include:[{model: User}] };
    Teacher.destroy(query)
      .then(() => res.status(200).json({ message: "user is removed" }))
      .catch((err) => res.status(500).json({ error: err }));
      
  });
  
  router.delete("/deleteclass", function (req, res) {
    const query = { where: {  classId: null} };
    User.destroy(query)
      .then(() => res.status(200).json({ message: "user is removed" }))
      .catch((err) => res.status(500).json({ error: err }));
  });
  
  router.delete("/deleteclassentries", function (req, res) {
    const query = { where: {  studentUserId: null} };
    Service.destroy(query)
      .then(() => res.status(200).json({ message: "class service is removed" }))
      .catch((err) => res.status(500).json({ error: err }));
  });
  



module.exports= router;