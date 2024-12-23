import React, { useState } from "react";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import "../css/payment.css";
import "../css/app.css";

const Payment = ({
  cart,
  customerName,
  setCustomerName,
  orderType,
  setOrderType,
  paymentMethod = "TF",
  setPaymentMethod = "TF",
  deliveryAddress,
  setDeliveryAddress,
  discountCode,
  setDiscountCode,
  showReceipt,
  setShowReceipt,
  handleIncrease,
  handleDecrease,
}) => {
  // Daftar kode diskon yang valid
  const validDiscountCodes = {
    DISKON10: 10, // diskon 10%
    DISKON20: 20, // diskon 20%
    DISKON50: 50, // diskon 50%
  };

  // State untuk total setelah diskon, discountAmount, dan indikator diskon diterapkan
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  // Menghitung total sebelum diskon
  const totalBeforeDiscount = cart.reduce(
    (acc, product) => acc + product.totalPrice,
    0
  );

  // Fungsi untuk menerapkan diskon
  const applyDiscount = () => {
    if (discountCode && validDiscountCodes[discountCode]) {
      const discountPercentage = validDiscountCodes[discountCode];
      const calculatedDiscountAmount =
        (totalBeforeDiscount * discountPercentage) / 100;
      setDiscountAmount(calculatedDiscountAmount);
      setTotalAfterDiscount(totalBeforeDiscount - calculatedDiscountAmount);
      setIsDiscountApplied(true);
      Swal.fire(
        "Diskon diterapkan!",
        `Anda mendapat diskon ${discountPercentage}%`,
        "success"
      );
    } else {
      setDiscountAmount(0);
      setIsDiscountApplied(false);
      Swal.fire(
        "Kode diskon tidak valid!",
        "Masukkan kode diskon yang benar.",
        "error"
      );
    }
  };

  // Menampilkan gambar bon pesanan
  const downloadIMG = () => {
    const receiptElement = document.querySelector(".receipt-card");
    html2canvas(receiptElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "bon_pesanan.png";
      link.click();
    });
  };

  const handlePayment = () => {
    if (
      !customerName ||
      !paymentMethod ||
      (orderType === "Delivery" && !deliveryAddress)
    ) {
      Swal.fire(
        "Gagal!",
        "Pastikan semua data sudah diisi dengan benar.",
        "error"
      );
      return;
    }

    const totalToDisplay = isDiscountApplied
      ? totalAfterDiscount
      : totalBeforeDiscount;

    Swal.fire({
      title: "Konfirmasi Pembayaran",
      text: `Total pembayaran adalah Rp ${totalToDisplay.toLocaleString()}.\nLanjutkan proses pembayaran?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Bayar Sekarang",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Berhasil!", "Pembayaran Anda berhasil diproses.", "success");

        // Reset semua data setelah pembayaran berhasil
        setCustomerName("");
        setOrderType("");
        setPaymentMethod("");
        setDeliveryAddress("");
        setDiscountCode("");
        setShowReceipt(false);
        setDiscountAmount(0);
        setTotalAfterDiscount(0);
        setIsDiscountApplied(false);

        // Reset cart (menghapus semua item)
        cart.length = 0;
      }
    });
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
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((product) => (
              <tr key={product._id}>
                <td>{product.productName}</td>
                <td>Rp {product.productPrice.toLocaleString()}</td>
                <td>{product.quantity}</td>
                <td>Rp {product.totalPrice.toLocaleString()}</td>
                <td>
                  <div className="quantity-controls">
                    <button onClick={() => handleDecrease(product._id)}>
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button onClick={() => handleIncrease(product._id)}>
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4">Total</td>
              <td className="total-amount">
                Rp {totalBeforeDiscount.toLocaleString()}
              </td>
            </tr>
            {isDiscountApplied && (
              <>
                <tr>
                  <td colSpan="4">Diskon</td>
                  <td className="total-amount">
                    - Rp {discountAmount.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4">Total Setelah Diskon</td>
                  <td className="total-amount">
                    Rp {totalAfterDiscount.toLocaleString()}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

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

        <div className="delivery-address">
          <label>Alamat Pengiriman:</label>
          <textarea
            placeholder="Masukkan alamat pengiriman"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />
        </div>

        <div className="payment-method">
          <label>Metode Pembayaran:</label>
          <input
            type="text"
            value={paymentMethod} // Jika paymentMethod kosong, tampilkan "TF"
            readOnly
          />
        </div>

        <div className="discount-section">
          <input
            type="text"
            placeholder="Masukkan Kode Diskon"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button onClick={applyDiscount}>Terapkan Diskon</button>
        </div>

        <div className="payment-button">
          <button onClick={handlePayment}>Bayar Sekarang</button>
          <button
            onClick={() => setShowReceipt(!showReceipt)}
            className="receipt-button"
          >
            {showReceipt ? "Tutup Bon" : "Tampilkan Bon"}
          </button>
        </div>
      </div>

      {showReceipt && (
        <div>
          <div className="receipt-card">
            <h4>Bon Pesanan</h4>
            <p>Nama Pelanggan: {customerName}</p>
            <p>Pesan Via: {orderType}</p>
            {orderType === "Delivery" && (
              <p>Alamat Pengiriman: {deliveryAddress}</p>
            )}
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
                {cart.map((product) => (
                  <tr key={product._id}>
                    <td>{product.productName}</td>
                    <td>{product.quantity}</td>
                    <td>Rp {product.productPrice.toLocaleString()}</td>
                    <td>Rp {product.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
                {isDiscountApplied && (
                  <tr>
                    <td colSpan="3">Diskon</td>
                    <td>- Rp {discountAmount.toLocaleString()}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan="3">Total Setelah Diskon</td>
                  <td>Rp {totalAfterDiscount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="img-box">
            <button onClick={downloadIMG} className="img-button">
              Download IMG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
