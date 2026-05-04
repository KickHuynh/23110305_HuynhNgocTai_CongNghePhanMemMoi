import CRUDService from '../services/CRUDService';

const getHomePage = async (req, res) => {
  try {
    return res.render('home.ejs');
  } catch (error) {
    console.log(error);
  }
};

const getCRUD = (req, res) => {
  return res.render('crud.ejs');
};

const postCRUD = async (req, res) => {
  try {
    await CRUDService.createNewStudent(req.body);
    return res.redirect('/get-crud');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error from server');
  }
};

const getFindAllCRUD = async (req, res) => {
  try {
    const data = await CRUDService.getAllStudents();

    return res.render('students/findAllStudent.ejs', {
      datalist: data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error from server');
  }
};

const getEditCRUD = async (req, res) => {
  try {
    const studentId = req.query.id;

    if (studentId) {
      const studentData = await CRUDService.getStudentInfoById(studentId);

      return res.render('students/updateStudent.ejs', {
        data: studentData
      });
    }

    return res.send('Student ID is required');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error from server');
  }
};

const putCRUD = async (req, res) => {
  try {
    const data = await CRUDService.updateStudent(req.body);

    return res.render('students/findAllStudent.ejs', {
      datalist: data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error from server');
  }
};

const deleteCRUD = async (req, res) => {
  try {
    const id = req.query.id;

    if (id) {
      await CRUDService.deleteStudentById(id);
      return res.redirect('/get-crud');
    }

    return res.send('Student ID is required');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error from server');
  }
};

module.exports = {
  getHomePage,
  getCRUD,
  postCRUD,
  getFindAllCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD
};