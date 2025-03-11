import React, { useState, useEffect } from 'react';

const PastTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/medical-transactions/medical-transactions');
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch past transactions');
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching past transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPastTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Past Medical Transactions</h2>
      {transactions.length > 0 ? (
        <ul style={listStyle}>
          {transactions.map((transaction) => (
            <li key={transaction._id} style={listItemStyle}>
            
              <strong>Patient:</strong> {transaction.patient.firstName} {transaction.patient.lastName} <br />
              <strong>Amount:</strong> ${transaction.totalAmount.toFixed(2)} <br />
              <strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p style={noTransactionsStyle}>No past transactions found.</p>
      )}
    </div>
  );
};

// Inline styles
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  maxWidth: '800px',
  margin: '100px auto',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  fontSize: '24px',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
};

const listItemStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const noTransactionsStyle = {
  textAlign: 'center',
  color: '#777',
};

export default PastTransactions;
