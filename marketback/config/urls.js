// URL Configuration for Company Module
// These URLs match the frontend React component expectations

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Company URLs that match your React frontend
const URL_CompanyNewAdd = `${BASE_URL}/api/companies`;
const URL_CompanyListGet = `${BASE_URL}/api/companies`;

module.exports = {
  URL_CompanyNewAdd,
  URL_CompanyListGet,
  BASE_URL
};
