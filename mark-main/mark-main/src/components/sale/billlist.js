import React, { useState, useEffect } from 'react';
import { Table, Form, Row, Col, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { FaSearch, FaEye, FaEdit, FaTrash, FaFileInvoiceDollar } from 'react-icons/fa';
import { URL_SALE_list, URL_SALE_Delete } from '../url/url';
import './billlist.css';
import Orderprint from '../order/Orderprint';

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [selectedBill, setSelectedBill] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Fetch bills from API
    const fetchBills = async () => {
        try {
            setLoading(true);
            const response = await axios.get(URL_SALE_list);
            setBills(Array.isArray(response.data) ? response.data : (response.data?.sales || []));
            setError('');
        } catch (err) {
            console.error('Error fetching bills:', err);
            setError('Failed to fetch bills. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    // Handle search
    const filteredBills = (Array.isArray(bills) ? bills : []).filter(bill => 
        (bill.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bill.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bill._id?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedBills = [...filteredBills].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Get current bills for pagination
    const indexOfLastBill = currentPage * itemsPerPage;
    const indexOfFirstBill = indexOfLastBill - itemsPerPage;
    const currentBills = sortedBills.slice(indexOfFirstBill, indexOfLastBill);
    const totalPages = Math.ceil(sortedBills.length / itemsPerPage);

    // Keep selectedIndex in sync with currentBills
    useEffect(() => {
        if (!selectedBill) {
            setSelectedIndex(-1);
            return;
        }
        const idx = currentBills.findIndex(b => b._id === selectedBill._id);
        setSelectedIndex(idx);
    }, [currentBills, selectedBill]);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Format date
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Handle bill delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bill?')) {
            try {
                await axios.delete(`${URL_SALE_Delete}/${id}`);
                setBills(bills.filter(bill => bill._id !== id));
            } catch (error) {
                console.error('Error deleting bill:', error);
                setError('Failed to delete bill. Please try again.');
            }
        }
    };

    // Calculate total amount
    const calculateTotal = (items) => {
        return items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    };

    const toOrderShape = (bill) => {
        if (!bill) return null;
        const products = bill.products || bill.items || [];
        // try to preserve existing bill_details, otherwise compute a minimal one
        const subtotal = products.reduce((sum, it) => {
            const qty = Number(it.quantity) || 0;
            const rate = Number(it.single_price) || 0;
            const amount = Number(it.price) || (qty * rate);
            return sum + amount;
        }, 0);
        const bill_details = bill.bill_details || {
            date: bill.createdAt || new Date().toISOString(),
            subtotal: subtotal,
            totalbagprice: 0,
            totalWages: 0,
            totalcommission: 0,
            transport: 0,
            bill_amount: subtotal,
            cash: 0,
            credit: 0,
            new_balance: 0,
        };
        return {
            customer: bill.customer || {},
            bill_details,
            products,
        };
    };

    return (
                <div className="bill-grid">
          <div className="bill-list-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><FaFileInvoiceDollar className="me-2" /> Sales Bills</h2>
                <Button variant="primary" onClick={fetchBills} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Refresh'}
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="mb-3">
                <InputGroup>
                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Search by customer name, invoice number, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
            </div>

            <div className="table-responsive">
                <Table striped bordered hover className="bill-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('invoiceNumber')}>
                                Inv {sortConfig.key === 'invoiceNumber' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th onClick={() => requestSort('customer.name')}>
                                Customer {sortConfig.key === 'customer.name' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th onClick={() => requestSort('createdAt')}>
                                Date {sortConfig.key === 'createdAt' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th>Items</th>
                            <th onClick={() => requestSort('totalAmount')} className="text-end">
                                Total {sortConfig.key === 'totalAmount' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </td>
                            </tr>
                        ) : currentBills.length > 0 ? (
                            currentBills.map((bill) => (
                                <tr key={bill._id}>
                                    <td>{bill.invoiceNumber || 'N/A'}</td>
                                    <td style={{"width":"300px"}}>{bill.customer?.name || 'N/A'}</td>
                                    <td style={{"width":"400px"}}>{formatDate(bill.createdAt)}</td>
                                    <td>{bill.items?.length || 0} items</td>
                                    <td className="text-end">
                                        ₹{calculateTotal(bill.items).toFixed(2)}
                                    </td>
                                    <td>
                                        <Button variant="info" style={{"width":"30px"}} size="sm" className="me-1" title="View" onClick={() => { setSelectedBill(bill); }}>
                                            <FaEye />
                                        </Button>
                                        <Button 
                                           style={{"width":"30px"}}
                                            variant="danger" 
                                            size="sm" 
                                            title="Delete"
                                            onClick={() => handleDelete(bill._id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No bills found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                                className="page-link" 
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                <button onClick={() => paginate(number)} className="page-link">
                                    {number}
                                </button>
                            </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                                className="page-link" 
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
        <div className='billprew'>
 
        {selectedBill ? (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div>
                        <Button
                            className="me-1"
                            size="sm"
                            variant="secondary"
                            disabled={selectedIndex <= 0}
                            onClick={() => {
                                if (selectedIndex > 0) {
                                    const newIndex = selectedIndex - 1;
                                    setSelectedIndex(newIndex);
                                    setSelectedBill(currentBills[newIndex]);
                                }
                            }}
                        >
                            Previous
                        </Button>
                        <Button
                            className="me-1"
                            size="sm"
                            variant="secondary"
                            disabled={selectedIndex === -1 || selectedIndex >= currentBills.length - 1}
                            onClick={() => {
                                if (selectedIndex < currentBills.length - 1) {
                                    const newIndex = selectedIndex + 1;
                                    setSelectedIndex(newIndex);
                                    setSelectedBill(currentBills[newIndex]);
                                }
                            }}
                        >
                            Next
                        </Button>
                        <Button
                            className="me-1"
                            size="sm"
                            variant="danger"
                            disabled={!selectedBill}
                            onClick={async () => {
                                if (!selectedBill) return;
                                await handleDelete(selectedBill._id);
                                // After delete, try to select a sensible next bill on the same page
                                const remaining = currentBills.filter(b => b._id !== selectedBill._id);
                                if (remaining.length === 0) {
                                    setSelectedBill(null);
                                    setSelectedIndex(-1);
                                } else {
                                    const newIdx = Math.min(selectedIndex, remaining.length - 1);
                                    setSelectedBill(remaining[newIdx]);
                                    setSelectedIndex(newIdx);
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setSelectedBill(null)}>Close</Button>
                </div>
                <Orderprint selectedOrder={toOrderShape(selectedBill)} />
            </div>
        ) : (
            <div style={{ padding: 12, color: '#6c757d', border: '1px dashed #ced4da', borderRadius: 8 }}>
                Click a View button to preview a bill here.
            </div>
        )}
        
        </div>
        </div>
   );
};

export default BillList;