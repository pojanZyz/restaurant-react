import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import "../css/payment.css";
import "../css/app.css";

const Payment = ({ cart }) => {
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState('TakeAway');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  // Tambahkan properti quantity ke setiap produk
  const [cartState, setCartState] = useState(
    cart.map((item) => ({ ...item, quantity: 1 }))
  );

  const handleIncrease = (id) => {
    setCartState((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartState((prevCart) =>
      prevCart.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const totalAmount = cartState.reduce(
    (total, product) => total + product.productPrice * product.quantity,
    0
  );

  const handleDiscount = () => {
    if (discountCode === 'DISKON10') {
      setDiscountMessage('Diskon 10% berhasil diterapkan!');
    } else {
      setDiscountMessage('Kode diskon tidak valid.');
    }
  };

  const handleShowReceipt = () => {
    setShowReceipt(!showReceipt);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Setting font and size for title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text('Bon Pesanan', 20, 10);
  
    // Setting font for text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    // Customer Name
    doc.text(`Nama Pelanggan: ${customerName}`, 20, 30);
    doc.text(`Pesan Via: ${orderType}`, 20, 40);
    if (orderType === 'Delivery') {
      doc.text(`Alamat Pengiriman: ${deliveryAddress}`, 20, 50);
    }
    doc.text(`Metode Pembayaran: ${paymentMethod}`, 20, 60);
    
    // Drawing table header
    let yPosition = 70;
    const colWidths = [60, 40, 40, 40]; // Column widths
    doc.setFont("helvetica", "bold");
    
    // Header row
    doc.text('Nama Produk', 20, yPosition);
    doc.text('Jumlah', 80, yPosition);
    doc.text('Harga', 120, yPosition);
    doc.text('Total', 160, yPosition);
  
    // Draw table header line
    doc.line(20, yPosition + 2, 200, yPosition + 2);
  
    // Drawing table rows
    doc.setFont("helvetica", "normal");
    yPosition += 10;
    cartState.forEach((product) => {
      doc.text(product.productName, 20, yPosition);
      doc.text(product.quantity.toString(), 80, yPosition);
      doc.text(`Rp ${product.productPrice.toLocaleString()}`, 120, yPosition);
      doc.text(`Rp ${(product.productPrice * product.quantity).toLocaleString()}`, 160, yPosition);
  
      yPosition += 10;
    });
  
    // Draw the bottom border of the table
    doc.line(20, yPosition, 200, yPosition);
  
    // Total amount
    yPosition += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: Rp ${totalAmount.toLocaleString()}`, 20, yPosition);
    
    // Footer with thank you message
    yPosition += 20;
    doc.setFont("helvetica", "normal");
    doc.text('Terima kasih telah berbelanja!', 20, yPosition);
    
    // Save the PDF
    doc.save("bon_pesanan.pdf");
  };




  return (
    <div className="body-box">
      <div className="payment-summary">
        <h3>Rincian Pesanan</h3>
        <table id="cartSummaryTable">
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Jumlah</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cartState.map((product) => (
              <tr key={product._id}>
                <td>{product.productName}</td>
                <td>Rp {product.productPrice.toLocaleString()}</td>
                <td>
                  <div className="quantity-controls">
                  <button onClick={() => {
                      setCartState((prevCart) => {
                        // Mengurangi jumlah produk, bahkan jika jumlahnya 1
                        const updatedCart = prevCart.map((item) =>
                          item._id === product._id
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                        );
                        // Menghapus produk jika jumlahnya 0
                        return updatedCart.filter((item) => item.quantity > 0);
                      });
                    }}> - </button>
                    <span>{product.quantity}</span>
                    <button onClick={() => handleIncrease(product._id)}>+</button>
                  </div>
                </td>
                <td>Rp {(product.productPrice * product.quantity).toLocaleString()}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3">Total</td>
              <td className="total-amount">Rp {totalAmount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Customer Name */}
        <div className="customer-name">
          <label>Nama Pelanggan:</label>
          <input
            type="text"
            placeholder="Masukkan nama Anda"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        {/* Order Type */}
        <div className="order-type">
          <label>Pesan Via:</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="Dine_in">Dine in</option>
            <option value="TakeAway">Take-Away</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>

        {/* Delivery Address */}
        {orderType === 'Delivery' && (
          <div className="delivery-address">
            <label>Alamat Pengiriman:</label>
            <textarea
              placeholder="Masukkan alamat pengiriman"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>
        )}

        {/* Payment Method */}
        <div className="payment-method">
          <label>Metode Pembayaran:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Cash">Cash</option>
            <option value="TF">Transfer</option>
          </select>
        </div>

        {/* Discount Section */}
        <div className="discount-section">
          <input
            type="text"
            placeholder="Masukkan Kode Diskon"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button onClick={handleDiscount}>Terapkan Diskon</button>
          <p>{discountMessage}</p>
        </div>

        {/* Show Receipt */}
        <div className="payment-button">
          <button>Bayar Sekarang</button>
          <button onClick={handleShowReceipt} className="receipt-button">
            {showReceipt ? 'Tutup Bon' : 'Tampilkan Bon'}
          </button>
        </div>
      </div>

      {/* Receipt */}
      {showReceipt && (
        <div className="receipt-card">
          <h4>Bon Pesanan</h4>
          <p>Nama Pelanggan: {customerName}</p>
          <p>Pesan Via: {orderType}</p>
          {orderType === 'Delivery' && <p>Alamat Pengiriman: {deliveryAddress}</p>}
          <p>Metode Pembayaran: {paymentMethod}</p>
          <table>
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartState.map((product) => (
                <tr key={product._id}>
                  <td>{product.productName}</td>
                  <td>{product.quantity}</td>
                  <td>Rp {product.productPrice.toLocaleString()}</td>
                  <td>Rp {(product.productPrice * product.quantity).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3">Total</td>
                <td>Rp {totalAmount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div className="receipt-card-footer">
            <p>Terima kasih telah berbelanja!</p>
            <button onClick={downloadPDF}>Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
