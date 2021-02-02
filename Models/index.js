const StudentUser = require('./studentUser')
const TeacherUser = require('./teacherUser')
const Service = require('./service')
const Event = require('./event')

// User.hasOne(User)
// User.hasMany(User, { as: 'Students', through: 'Students' })

TeacherUser.hasMany(StudentUser, { foreignKey: 'classId' })
StudentUser.belongsTo(TeacherUser, { foreignKey: 'classId' })

TeacherUser.hasMany(Event, { foreignKey: 'classId' })
Event.belongsTo(TeacherUser, { foreignKey: 'classId' })

TeacherUser.hasMany(Service, { foreignKey: 'classId' })
Service.belongsTo(TeacherUser, { foreignKey: 'classId' })

StudentUser.hasMany(Service)
Service.belongsTo(StudentUser)


module.exports = {
  StudentUser,
  TeacherUser,
  Service,
  Event
}

