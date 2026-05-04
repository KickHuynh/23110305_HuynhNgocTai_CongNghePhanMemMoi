import db from '../models/index';

const createNewStudent = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Student.create({
        studentCode: data.studentCode,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        className: data.className,
        major: data.major
      });

      resolve('Create a new student successfully!');
    } catch (error) {
      reject(error);
    }
  });
};

const getAllStudents = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const students = await db.Student.findAll({
        raw: true
      });

      resolve(students);
    } catch (error) {
      reject(error);
    }
  });
};

const getStudentInfoById = (studentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const student = await db.Student.findOne({
        where: { id: studentId },
        raw: true
      });

      if (student) {
        resolve(student);
      } else {
        resolve({});
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateStudent = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const student = await db.Student.findOne({
        where: { id: data.id }
      });

      if (student) {
        student.studentCode = data.studentCode;
        student.fullName = data.fullName;
        student.email = data.email;
        student.phoneNumber = data.phoneNumber;
        student.className = data.className;
        student.major = data.major;

        await student.save();

        const allStudents = await db.Student.findAll({
          raw: true
        });

        resolve(allStudents);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const deleteStudentById = (studentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const student = await db.Student.findOne({
        where: { id: studentId }
      });

      if (student) {
        await student.destroy();
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewStudent,
  getAllStudents,
  getStudentInfoById,
  updateStudent,
  deleteStudentById
};