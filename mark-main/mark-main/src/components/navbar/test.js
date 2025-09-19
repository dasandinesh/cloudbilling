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
        <span className="dropdown-icon">📊</span>
        <span>Sales</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/saleentry" onClick={handleNavSelect}>
          <span className="dropdown-icon">📊</span>
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
          <span className="dropdown-icon">✏️</span>
          Sale Order
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstSale" onClick={handleNavSelect}>
          <span className="dropdown-icon">✏️</span>
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
          <span className="dropdown-icon">📊</span>
          Purchase Entry
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/mobilEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">🧾</span>
          Purchase List
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">✏️</span>
           Purchase Order
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/gstEstimate" onClick={handleNavSelect}>
          <span className="dropdown-icon">✏️</span>
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
          <span className="dropdown-icon">📦</span>
          Order Entry
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/purchaseentry" onClick={handleNavSelect}>
          <span className="dropdown-icon">🛒</span>
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













/* Base Navbar Styles */
.custom-navbar {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar{
  padding: 0px;
}
/* Brand Styles */
.navbar-brand {
  font-weight: 700;
  font-size: 1.6rem;
  color: white !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  padding: 0.1rem 0;
}

.navbar-brand:hover {
  color: #ffd700 !important;
  transform: scale(1.02);
}

.brand-icon {
  font-size: 1.8rem;
  animation: bounce 0.6s ease infinite alternate;
}

@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-3px); }
}

/* Desktop Styles */
@media (min-width: 992px) {
  .navbar-expand-lg .navbar-nav {
    gap: 0.1rem;
  }

  .nav-item {
    position: relative;
  }

  /* Main Navigation Links */
  .nav-link {
    color: rgba(255, 255, 255, 255) !important;
    font-weight: 500;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .nav-link:hover, .nav-link:focus {
    color: #ffd700 !important;
    background: rgba(255, 255, 255, 0.1);
  }

  /* Dropdown Menus */
  .dropdown-menu {
    border: none;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    padding: 0.5rem 0;
    min-width: 220px;
    background:#284E91;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .dropdown-item {
    color:white !important;
    padding: 0.5rem 1.5rem;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .dropdown-item:hover, .dropdown-item:focus {
    background: #f8f9fa;
    color: #1e3c72 !important;
    padding-left: 1.8rem;
  }

  .dropdown-icon {
    width: 20px;
    text-align: center;
  }

  /* Submenu Styles */
  .dropdown-submenu {
    position: relative;
  }

  .dropdown-submenu > .dropdown-menu {
    top: 0;
    left: 100%;
    margin-top: -0.5rem;
    margin-left: 0.1rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.2s ease;
  }

  .dropdown-submenu:hover > .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  /* Active States */
  .dropdown-item.active,
  .dropdown-item:active {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white !important;
  }

  /* Dropdown Toggles */
  .dropdown-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dropdown-toggle::after {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
  }

  .show > .dropdown-toggle::after {
    transform: rotate(-180deg);
  }
}

/* Mobile Styles */
@media (max-width: 991.98px) {
  .navbar-collapse {
    padding: 0.3rem 0;
  }

  .nav-link {
    color: rgba(255, 255, 255, 0.9) !important;
    padding: 0.2rem 0.3rem !important;
    margin: 0.1rem 0;
  }

  .dropdown-menu {
    background: rgba(255, 255, 255, 0.05) !important;
    border: none !important;
    box-shadow: none !important;
    padding-left: 0.5rem !important;
    margin: 0 !important;
  }

  .dropdown-item {
    color: rgba(255, 255, 255, 0.9) !important;
    padding: 0.2rem 0.3rem !important;
  }

  .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    color: #ffd700 !important;
  }

  .dropdown-submenu > .dropdown-menu {
    position: static !important;
    padding-left: 0.5rem !important;
  }

  .dropdown-toggle::after {
    margin-left: auto;
    padding-left: 0.5rem;
  }
}

/* User Dropdown Specific */
.user-dropdown .dropdown-menu {
  min-width: 15rem;
}

.user-info {
  cursor: default;
  background: #f8f9fa;
  padding: 1rem !important;
  color: #333 !important;
}

.user-info .user-details {
  white-space: nowrap;
}

.user-info strong {
  display: block;
  color: #1e3c72;
  margin-bottom: 0.25rem;
}

.user-info small {
  font-size: 0.85rem;
  color: #6c757d !important;
  display: block;
}

.logout-item {
  color: #dc3545 !important;
}

.logout-item:hover {
  background: #f8d7da !important;
  color: #dc3545 !important;
}
