import React, { useState, useCallback } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import './navbar.css';

// Menu configuration
const menuItems = [
  {
    title: 'Orders',
    path: '/mobilorder',
    icon: '📋',
  },
  {
    title: 'Bills',
    path: '/mobilsale',
    icon: '💰',
  },
  {
    title: 'Entry',
    icon: '📝',
    submenu: [
      {
        title: 'Sales',
        icon: '📊',
        items: [
          { title: 'Sale Entry', path: '/saleentry' },
          { title: 'Mobile Sale', path: '/mobilSale' },
          { title: 'Sale Return', path: '/gstSale' },
        ],
      },
      {
        title: 'Estimate',
        icon: '📋',
        items: [
          { title: 'Estimate Entry', path: '/estimateentry' },
          { title: 'Estimate List', path: '/mobilEstimate' },
        ],
      },
      {
        title: 'Purchase',
        icon: '🛒',
        items: [
          { title: 'Purchase Entry', path: '/purchaseentry' },
          { title: 'Purchase List', path: '/purchaseList' },
        ],
      },
    ],
  },
];

const CustomDropdownToggle = React.forwardRef(({ children, onClick, show }, ref) => (
  <a
    href="#"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="nav-link"
  >
    <span className="d-flex align-items-center">
      {children}
      <FaChevronDown className={`ms-1 transition-transform ${show ? 'rotate-180' : ''}`} style={{ fontSize: '0.7rem' }} />
    </span>
  </a>
));

const NavItem = ({ item, onSelect }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  
  if (item.submenu) {
    return (
      <Dropdown as="li" className="nav-item">
        <Dropdown.Toggle as={CustomDropdownToggle} className={`nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">{item.icon}</span>
          <span className="ms-1">{item.title}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-multilevel">
          {item.submenu.map((subItem, idx) => (
            <React.Fragment key={idx}>
              {subItem.items ? (
                <Dropdown as="div" className="dropdown-submenu">
                  <Dropdown.Toggle as={CustomDropdownToggle} className="dropdown-item">
                    <span className="dropdown-icon">{subItem.icon}</span>
                    <span>{subItem.title}</span>
                    <FaChevronRight className="ms-auto" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {subItem.items.map((nestedItem, nestedIdx) => (
                      <Dropdown.Item 
                        key={nestedIdx} 
                        as={Link} 
                        to={nestedItem.path}
                        className={location.pathname === nestedItem.path ? 'active' : ''}
                        onClick={onSelect}
                      >
                        <span className="dropdown-icon">{nestedItem.icon || '•'}</span>
                        {nestedItem.title}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Dropdown.Item 
                  as={Link} 
                  to={subItem.path}
                  className={location.pathname === subItem.path ? 'active' : ''}
                  onClick={onSelect}
                >
                  <span className="dropdown-icon">{subItem.icon || '•'}</span>
                  {subItem.title}
                </Dropdown.Item>
              )}
            </React.Fragment>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <li className="nav-item">
      <Link 
        to={item.path} 
        className={`nav-link ${isActive ? 'active' : ''}`}
        onClick={onSelect}
      >
        <span className="nav-icon">{item.icon}</span>
        {item.title}
      </Link>
    </li>
  );
};

const UserMenu = ({ user, onLogout }) => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  const toggleDropdown = useCallback((e) => {
    setShow(prev => !prev);
  }, []);

  return (
    <Dropdown as="li" className="nav-item user-dropdown" show={show} onToggle={toggleDropdown}>
      <Dropdown.Toggle as={CustomDropdownToggle} className="nav-link">
        <span className="nav-icon"><FaUser /></span>
        <span className="ms-1">{user?.name || 'User'}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end" className="user-menu">
        <div className="user-info px-3 py-2">
          <strong>{user?.name || 'User'}</strong>
          <small className="text-muted d-block">{user?.email || ''}</small>
        </div>
        <Dropdown.Divider />
        <Dropdown.Item 
          as={Link} 
          to="/profile" 
          className={location.pathname === '/profile' ? 'active' : ''}
          onClick={() => setShow(false)}
        >
          <FaUser className="me-2" />
          Profile
        </Dropdown.Item>
        <Dropdown.Item onClick={onLogout}>
          <FaSignOutAlt className="me-2" />
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const NavbarComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleNavSelect = useCallback(() => {
    setExpanded(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setExpanded(false);
  }, [logout]);

  return (
    <Navbar 
      expand="lg" 
      className="custom-navbar"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <span className="brand-icon">🏪</span>
          <span className="brand-text">MarketPro</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" className="navbar-toggler" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav as="ul" className="me-auto main-nav">
            {menuItems.map((item, index) => (
              <NavItem 
                key={index} 
                item={item} 
                onSelect={handleNavSelect} 
              />
            ))}
          </Nav>
          
          <Nav as="ul" className="ms-auto">
            {isAuthenticated ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={handleNavSelect}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link" onClick={handleNavSelect}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
