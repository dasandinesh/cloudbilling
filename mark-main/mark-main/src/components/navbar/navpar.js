import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Button, Dropdown, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaChevronRight, FaChevronDown } from 'react-icons/fa';


// Custom dropdown toggle component
const CustomToggle = React.forwardRef(({ children, onClick, show }, ref) => (
  <a
    href="#"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="dropdown-toggle nav-link"
  >
    {children}
    <FaChevronDown className={`ms-1 transition-transform ${show ? 'rotate-180' : ''}`} style={{ fontSize: '0.7rem' }} />
  </a>
));

const NavbarComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const dropdownRefs = useRef({});
  const { user, isAuthenticated, logout } = useAuth();
  
  const handleNavSelect = () => {
    setExpanded(false);
    setDropdownOpen({});
  };

  const handleLogout = async () => {
    await logout();
    setExpanded(false);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Navbar 
      expand="lg" 
      className="custom-navbar"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container fluid className="p-0 m-0">
        <Navbar.Brand href="/" className="navbar-brand">
          <span className="brand-icon">🏪</span>
          <span className="brand-text">MarketPro</span>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="navbar-toggler"
        />
        
        <Navbar.Collapse id="basic-navbar-nav" className="p-0 m-0">
          <Nav className="me-auto main-nav p-0 m-0">
            {/* Quick Actions */}
            <div className="nav-section">
              <Nav.Link href="/mobilorder" className="nav-link-primary" onClick={handleNavSelect}>
                <span className="nav-icon">📋</span>
                Orders
              </Nav.Link>
              </div>
              <div className="nav-section">
              <Nav.Link href="/mobilsale" className="nav-link-primary" onClick={handleNavSelect}>
                <span className="nav-icon">💰</span>
                Bills
              </Nav.Link>
            </div>

<Dropdown as="div" className="nav-item" onToggle={() => toggleDropdown('entry')} show={dropdownOpen['entry']}>
  <Dropdown.Toggle as={CustomToggle} show={dropdownOpen['entry']}>
    <span className="nav-icon">📝</span>
    <span className="ms-1">Entry</span>
  </Dropdown.Toggle>
  
  <Dropdown.Menu className="dropdown-menu-multilevel">
    <Dropdown as="div" className="dropdown-submenu" onToggle={() => toggleDropdown('sales')} show={dropdownOpen['sales']}>
      <Dropdown.Toggle as={CustomToggle} show={dropdownOpen['sales']} className="dropdown-item">
        <span className="dropdown-icon">📝</span>
        <span>Sales</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/saleentry" onClick={handleNavSelect}>
          <span className="dropdown-icon">📝</span>
          Sale Entry
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/mobilSale" onClick={handleNavSelect}>
          <span className="dropdown-icon">🧾</span>
          Mobile Sale
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstSale" onClick={handleNavSelect}>
          <span className="dropdown-icon">✏️</span>
          Sale Return
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstSale" onClick={handleNavSelect}>
          <span className="dropdown-icon">✏️</span>
          Sale Return List
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstSale" onClick={handleNavSelect}>
          <span className="dropdown-icon">📑</span>
          Sale Order
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstSale" onClick={handleNavSelect}>
          <span className="dropdown-icon">🚚</span>
          Sale Order List
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown as="div" className="dropdown-submenu" onToggle={() => toggleDropdown('sales')} show={dropdownOpen['sales']}>
      <Dropdown.Toggle as={CustomToggle} show={dropdownOpen['sales']} className="dropdown-item">
        <span className="dropdown-icon">📊</span>
        <span>Estimate</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/estimateentry" onClick={handleNavSelect}>
          <span className="dropdown-icon">📊</span>
          Estimate Entry
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/mobilEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">🧾</span>
          Estimate List
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">✏️</span>
           Estimate Order
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">✏️</span>
           Estimate Order List
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown as="div" className="dropdown-submenu" onToggle={() => toggleDropdown('sales')} show={dropdownOpen['sales']}>
      <Dropdown.Toggle as={CustomToggle} show={dropdownOpen['sales']} className="dropdown-item">
        <span className="dropdown-icon">📊</span>
        <span>purchase</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/estimateentry" onClick={handleNavSelect}>
          <span className="dropdown-icon">🛒</span>
          Purchase Entry
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/mobilEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">📦</span>
          Purchase List
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">📑</span>
           Purchase Order
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">🚚</span>
           Purchase Order List
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">✏️</span>
           Purchase Return
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">✏️</span>
           Purchase Return List
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    
    <Dropdown as="div" className="dropdown-submenu" onToggle={() => toggleDropdown('orders')} show={dropdownOpen['orders']}>
      <Dropdown.Toggle as={CustomToggle} show={dropdownOpen['orders']} className="dropdown-item">
        <span className="dropdown-icon">📦</span>
        <span>Orders & Purchases</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/orderentry" onClick={handleNavSelect}>
          <span className="dropdown-icon"></span>
          Order Entry
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/purchaseentry" onClick={handleNavSelect}>
          <span className="dropdown-icon">�</span>
          Purchase Entry
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    
    <Dropdown.Divider />
    
    <Dropdown.Item as={Link} to="/ExpenseList" onClick={handleNavSelect}>
      <span className="dropdown-icon">💸</span>
      View Expenses
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>




            <NavDropdown 
              title={
                <span className="dropdown-title">
                  <span className="nav-icon">💳</span>
                  List
                </span>
              } 
              id="finance-dropdown"
              className="custom-dropdown"
            >
              <div className="dropdown-section">
                <h6 className="dropdown-header">Bill List</h6>
                <NavDropdown.Item href="/billlist" onClick={handleNavSelect}>
                  <span className="dropdown-icon">📊</span>
                  Bill list
                </NavDropdown.Item>
                <NavDropdown.Item href="/billlist" onClick={handleNavSelect}>
                  <span className="dropdown-icon">🧾</span>
                  Receipts
                </NavDropdown.Item>
                <NavDropdown.Item href="/salelist" onClick={handleNavSelect}>
                  <span className="dropdown-icon">✏️</span>
                  Sale List
                </NavDropdown.Item>
              </div>
              <div className="dropdown-section">
                <h6 className="dropdown-header">Purchase List</h6>
                <NavDropdown.Item href="/purchaseList" onClick={handleNavSelect}>
                  <span className="dropdown-icon">💸</span>
                  Purchase List
                </NavDropdown.Item>
                </div>
              
            </NavDropdown>
           
            {/* Master Data */}
            <NavDropdown 
              title={
                <span className="dropdown-title">
                  <span className="nav-icon">📊</span>
                  Master Data
                </span>
              } 
              id="master-dropdown"
              className="custom-dropdown"
            >
              <div className="dropdown-section">
                <h6 className="dropdown-header">Products & Services</h6>
                <NavDropdown.Item href="/product" onClick={handleNavSelect}>
                  <span className="dropdown-icon">📦</span>
                  Products
                </NavDropdown.Item>
                <NavDropdown.Item href="/addproduct" onClick={handleNavSelect}>
                  <span className="dropdown-icon">➕</span>
                  Add Product
                </NavDropdown.Item>
              </div>
              
              <div className="dropdown-section">
                <h6 className="dropdown-header">Business Partners</h6>
                <NavDropdown.Item href="/customer" onClick={handleNavSelect}>
                  <span className="dropdown-icon">👥</span>
                  Customers
                </NavDropdown.Item>
                <NavDropdown.Item href="/company" onClick={handleNavSelect}>
                  <span className="dropdown-icon">🏢</span>
                  Companies
                </NavDropdown.Item>
                <NavDropdown.Item href="/branch" onClick={handleNavSelect}>
                  <span className="dropdown-icon">🏪</span>
                  Branches
                </NavDropdown.Item>
              </div>
              
              <div className="dropdown-section">
                <h6 className="dropdown-header">Users & Roles</h6>
                <NavDropdown.Item href="/userlist" onClick={handleNavSelect}>
                  <span className="dropdown-icon">👤</span>
                  Users
                </NavDropdown.Item>
                <NavDropdown.Item href="/role" onClick={handleNavSelect}>
                  <span className="dropdown-icon">🔐</span>
                  Roles
                </NavDropdown.Item>
              </div>
            </NavDropdown>

            {/* Financial Management */}
            <NavDropdown 
              title={
                <span className="dropdown-title">
                  <span className="nav-icon">💳</span>
                  Finance
                </span>
              } 
              id="finance-dropdown"
              className="custom-dropdown"
            >
              <div className="dropdown-section">
                <h6 className="dropdown-header">Accounting</h6>
                <NavDropdown.Item href="/ledger" onClick={handleNavSelect}>
                  <span className="dropdown-icon">📊</span>
                  Ledger
                </NavDropdown.Item>
                <NavDropdown.Item href="/receipt" onClick={handleNavSelect}>
                  <span className="dropdown-icon">🧾</span>
                  Receipts
                </NavDropdown.Item>
                <NavDropdown.Item href="/receiptentry" onClick={handleNavSelect}>
                  <span className="dropdown-icon">✏️</span>
                  New Receipt
                </NavDropdown.Item>
              </div>
              
              <div className="dropdown-section">
                <h6 className="dropdown-header">Expenses</h6>
                <NavDropdown.Item href="/ExpenseList" onClick={handleNavSelect}>
                  <span className="dropdown-icon">💸</span>
                  View Expenses
                </NavDropdown.Item>
              </div>
            </NavDropdown>
          </Nav>

          {/* Right side actions - Authentication */}
          <Nav className="ms-auto" style={{ alignItems: 'center', gap: 12 }}>
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span className="user-dropdown-title">
                    <FaUser className="me-2" />
                    {user?.name || 'User'}
                  </span>
                } 
                id="user-dropdown"
                className="user-dropdown"
                align="end"
              >
                <NavDropdown.Item className="user-info">
                  <div className="user-details">
                    <strong>{user?.name || 'User'}</strong>
                    <small className="text-muted d-block">{user?.email}</small>
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="logout-item">
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="auth-buttons">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  size="sm" 
                  className="me-2"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="light" 
                  size="s"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;