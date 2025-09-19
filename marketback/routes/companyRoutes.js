const express = require('express');
const router = express.Router();
const {
  validateCompanyData,
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyBranches,
  addBranchToCompany,
  updateBranch,
  deleteBranch
} = require('../controllers/companyController');

// Company Routes
router.get('/companies', getAllCompanies);
router.get('/companies/:id', getCompanyById);
router.post('/companies', validateCompanyData, createCompany);
router.put('/companies/:id', validateCompanyData, updateCompany);
router.delete('/companies/:id', deleteCompany);

// Branch Routes
router.get('/companies/:id/branches', getCompanyBranches);
router.post('/companies/:id/branches', addBranchToCompany);
router.put('/companies/:id/branches/:branchId', updateBranch);
router.delete('/companies/:id/branches/:branchId', deleteBranch);

module.exports = router;
