var bcrypt = require('bcrypt');
var _ = require('underscore');


module.exports = function(sequelize, DataTypes) {
    var student =  sequelize.define('student', {
        student_loginID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        student_email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        student_password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function(value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('student_password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
        hooks: {
            beforeValidate: function(student, options) {
                //validating Email of student
                if (typeof student.student_loginID === 'string') {
                    student.student_loginID = student.student_loginID.toUpperCase();
                }
            }


        },
        instanceMethods: {
            toPublicJSON: function() {
                var json = this.toJSON();
                return _.pick(json, 'id', 'student_loginID', 'student_email');
            }
        },

        classMethods: {
            authenticate: function(body) {
                return new Promise(function(resolve, reject) {
                    if (typeof body.loginID !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }
                    student.findOne({
                        where: {
                            student_loginID: body.loginID
                        }
                    }).then(function(student) {
                        if (!student || !(bcrypt.compareSync(body.password, student.get('password_hash')))) {
                            return reject();
                        }
                        resolve(student);
                        //res.json(student.toJSON());
                    }, function(e) {
                        return reject();
                    });
                })
            }
        }
    });

    return student;
};


// student_firstname: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//         len: [1, 250]
//     }
// },
// student_middlename: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//         len: [1, 250]
//     }
// },
// student_lastname: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//         len: [1, 250]
//     }
// },
// student_addressl1: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//         len: [0, 250]
//     }
// },
// student_addressl2: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//         len: [0, 250]
//     }
// },
// student_city: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//         len: [0, 250]
//     }
// },
// student_mobileno: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//         len: [10]
//     }
// }
// }, 

// },


// {
//     classMethods: {
//         associate: function(models) {
//             // associations can be defined here
//         },

//         validPassword: function(password, passwd, done, student) {
//             bcrypt.compare(password, passwd, function(err, isMatch) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 if (isMatch) {
//                     return done(null, student);
//                 } else {
//                     return done(null, false);
//                 }
//             })
//         }
//     }
