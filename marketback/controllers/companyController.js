const Company = require('../model/Company');

// Middleware for error handling
const handleError = (res, error, message = 'An error occurred') => {
  console.error(error);
  res.status(500).json({
    success: false,
    message,
    error: error.message
  });
};

// Validation middleware
const validateCompanyData = (req, res, next) => {
  const { name, address, phone, email, branches } = req.body;
  
  if (!name || !address || !phone || !email) {
    return res.status(400).json({
      success: false,
      message: 'All company fields (name, address, phone, email) are required'
    });
  }
  
  if (!branches || !Array.isArray(branches) || branches.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one branch is required'
    });
  }
  
  // Validate each branch
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    if (!branch.name || !branch.code || !branch.address) {
      return res.status(400).json({
        success: false,
        message: `Branch ${i + 1}: name, code, and address are required`
      });
    }
    
    const { doorno, street, places, district, pincode } = branch.address;
    if (!doorno || !street || !places || !district || !pincode) {
      return res.status(400).json({
        success: false,
        message: `Branch ${i + 1}: all address fields are required`
      });
    }
  }
  
  next();
};

// Company Controllers

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { 'branches.name': { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const companies = await Company.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Company.countDocuments(query);
    
    res.json({
      success: true,
      data: companies,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: companies.length,
        totalRecords: total
      }
    });
  } catch (error) {
    handleError(res, error, 'Error fetching companies');
  }
};

// Get company by ID
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    handleError(res, error, 'Error fetching company');
  }
};

// Create new company
const createCompany = async (req, res) => {
  try {
    // Check if company with same email already exists
    const existingCompany = await Company.findOne({ email: req.body.email });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company with this email already exists'
      });
    }
    
    // Check for duplicate branch codes
    const branchCodes = req.body.branches.map(branch => branch.code);
    const uniqueCodes = [...new Set(branchCodes)];
    if (branchCodes.length !== uniqueCodes.length) {
      return res.status(400).json({
        success: false,
        message: 'Branch codes must be unique'
      });
    }
    
    // Check if any branch code already exists in database
    const existingBranch = await Company.findOne({
      'branches.code': { $in: branchCodes }
    });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'One or more branch codes already exist'
      });
    }
    
    const company = new Company(req.body);
    await company.save();
    
    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Company with this email or branch code already exists'
      });
    }
    handleError(res, error, 'Error creating company');
  }
};

// Update company
const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    
    // Check if company exists
    const existingCompany = await Company.findById(companyId);
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    // Check if email is being changed and if new email already exists
    if (req.body.email !== existingCompany.email) {
      const emailExists = await Company.findOne({ 
        email: req.body.email,
        _id: { $ne: companyId }
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Company with this email already exists'
        });
      }
    }
    
    // Check for duplicate branch codes within the update
    const branchCodes = req.body.branches.map(branch => branch.code);
    const uniqueCodes = [...new Set(branchCodes)];
    if (branchCodes.length !== uniqueCodes.length) {
      return res.status(400).json({
        success: false,
        message: 'Branch codes must be unique'
      });
    }
    
    // Check if any branch code already exists in other companies
    const existingBranch = await Company.findOne({
      'branches.code': { $in: branchCodes },
      _id: { $ne: companyId }
    });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'One or more branch codes already exist in other companies'
      });
    }
    
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Company with this email or branch code already exists'
      });
    }
    handleError(res, error, 'Error updating company');
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    handleError(res, error, 'Error deleting company');
  }
};

// Branch Controllers

// Get all branches of a company
const getCompanyBranches = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id, 'branches');
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    res.json({
      success: true,
      data: company.branches
    });
  } catch (error) {
    handleError(res, error, 'Error fetching branches');
  }
};

// Add branch to company
const addBranchToCompany = async (req, res) => {
  try {
    const { name, code, address, estimatefiledoptionsId } = req.body;
    
    if (!name || !code || !address) {
      return res.status(400).json({
        success: false,
        message: 'Branch name, code, and address are required'
      });
    }
    
    // Check if branch code already exists
    const existingBranch = await Company.findOne({
      'branches.code': code
    });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'Branch code already exists'
      });
    }
    
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    company.branches.push({ name, code, address, estimatefiledoptionsId });
    await company.save();
    
    res.status(201).json({
      success: true,
      message: 'Branch added successfully',
      data: company.branches[company.branches.length - 1]
    });
  } catch (error) {
    handleError(res, error, 'Error adding branch');
  }
};

// Update branch
const updateBranch = async (req, res) => {
  try {
    const { name, code, address, estimatefiledoptionsId } = req.body;
    
    if (!name || !code || !address) {
      return res.status(400).json({
        success: false,
        message: 'Branch name, code, and address are required'
      });
    }
    
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    const branch = company.branches.id(req.params.branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }
    
    // Check if branch code is being changed and if new code already exists
    if (code !== branch.code) {
      const existingBranch = await Company.findOne({
        'branches.code': code
      });
      if (existingBranch) {
        return res.status(400).json({
          success: false,
          message: 'Branch code already exists'
        });
      }
    }
    
    branch.name = name;
    branch.code = code;
    branch.address = address;
    branch.estimatefiledoptionsId = estimatefiledoptionsId;
    
    await company.save();
    
    res.json({
      success: true,
      message: 'Branch updated successfully',
      data: branch
    });
  } catch (error) {
    handleError(res, error, 'Error updating branch');
  }
};

// Delete branch
const deleteBranch = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    const branch = company.branches.id(req.params.branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }
    
    // Don't allow deletion if it's the last branch
    if (company.branches.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last branch. A company must have at least one branch.'
      });
    }
    
    company.branches.pull(req.params.branchId);
    await company.save();
    
    res.json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    handleError(res, error, 'Error deleting branch');
  }
};

module.exports = {
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
};
