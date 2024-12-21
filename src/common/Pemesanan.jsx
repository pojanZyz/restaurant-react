



// import React, { useState } from 'react';
// import "../css/pemesanan.css";
// import Select from 'react-select';

// const Pemesanan = ({ cart }) => {
//   const [reservationName, setReservationName] = useState('');
//   const [reservationTime, setReservationTime] = useState('');
//   const [numPeople, setNumPeople] = useState(1);
//   const [selectedTables, setSelectedTables] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [orderName, setOrderName] = useState('');
//   const [orderItems, setOrderItems] = useState([]);
//   const [itemQuantity, setItemQuantity] = useState(1);
//   const [orderType, setOrderType] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [deliveryAddress, setDeliveryAddress] = useState('');
//   const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  
  
//   const customStyles = {
//     option: (provided) => ({
//       ...provided,
//       color: 'black', // Mengubah warna teks pada opsi select
//       fontSize: '16px',
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       color: 'black', // Mengubah warna teks pada nilai yang dipilih
//       fontSize: '16px',
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       color: 'black', // Mengubah warna teks placeholder
//       fontSize: '16px',
//     }),
//     occupied: (provided) => ({
//       ...provided,
//       backgroundColor: "red",
//     })
//   };

//   const tables = [
//     { id: 1, price: 50000, status: 'available' },
//     { id: 2, price: 50000, status: 'occupied' },
//     { id: 3, price: 5000, status: 'available' },
//     { id: 4, price: 50000, status: 'available' }
//   ];

//   const menuItems = cart.map(produk => ({
//     id: produk._id,
//     name: produk.productName,
//     price: produk.productPrice,
//     label: `${produk.productName} - Rp ${produk.productPrice.toLocaleString()}`
//   }));

  

//   console.log(cart);

//   const handleTableSelection = (selectedOptions) => {
//     setSelectedTables(selectedOptions ? selectedOptions.map(option => option.value) : []);
//   };

//   const handleAddItem = () => {
//     if (selectedMenuItem) {
//       const selectedItem = menuItems.find(item => item.id === selectedMenuItem.value);
//       if (selectedItem) {
//         setOrderItems([
//           ...orderItems,
//           { ...selectedItem, quantity: itemQuantity }
//         ]);
//         setTotalPrice(totalPrice + selectedItem.price * itemQuantity);
//         setSelectedMenuItem(null); 
//         setItemQuantity(1); 
//       }
//     }
//   };
  
  

//   const handleSubmitReservation = (e) => {
//     e.preventDefault();
//     console.log('Reservation submitted');
//   };

//   const handleSubmitOrder = (e) => {
//     e.preventDefault();
//     console.log('Order submitted');
//   };

//   const handleTableClick = (table) => {
//     if (table.status === 'available') {
//       const isSelected = selectedTables.includes(table.id);
//       const updatedSelectedTables = isSelected
//         ? selectedTables.filter((id) => id !== table.id)
//         : [...selectedTables, table.id];
//       setSelectedTables(updatedSelectedTables);
//       calculateTotalPrice(updatedSelectedTables);
//     }
//   };

//   const calculateTotalPrice = (selected) => {
//     const selectedTableDetails = tables.filter((table) => selected.includes(table.id));
//     const total = selectedTableDetails.reduce((sum, table) => sum + table.price, 0);
//     setTotalPrice(total);
//   };

//   const tableOptions = tables.map((table) => ({
//     value: table.id,
//     label: `Meja ${table.id} (${table.status === 'available' ? 'Kosong' : 'Terisi'}) - Rp ${table.price}`,
//     isDisabled: table.status === 'occupied',
//   }));

//   const menuOptions = menuItems.map(item => ({
//     value: item.id,
//     label: `${item.name} - Rp ${item.price}`
//   }));

//   const orderTypeOptions = [
//     { value: 'TakeAway', label: 'Take-Away' },
//     { value: 'Delivery', label: 'Delivery' }
//   ];

//   const paymentMethodOptions = [
//     { value: 'COD', label: 'COD / Bayar di Tempat' },
//     { value: 'TF', label: 'Transfer' }
//   ];

//   return (
//     <div className="body-box">
//       <div className="content-box">

//         {/* Table Reservation Section */}
//         <div className="reservation-box">
//           <h3>Reservasi Meja</h3>
//           <div className="table-grid">
//             {tables.map((table) => (
//               <div
//                 key={table.id}
//                 className={`table-item ${table.status} ${selectedTables.includes(table.id) ? 'selected' : ''}`}
//                 style={{
//                   backgroundColor: table.status === 'occupied' ? 'red' : selectedTables.includes(table.id) ? 'green' : 'white',
//                   color: table.status === 'occupied' ? 'white' : 'black',
//                   cursor: table.status === 'occupied' ? 'not-allowed' : 'pointer',
//                 }}
//                 onClick={() => handleTableClick(table)}
//               >
//                 {`Meja ${table.id} (${table.status === 'available' ? 'Kosong' : 'Terisi'}) - Rp ${table.price}`}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Reservation Form */}
//         <div className="reservation-box">
//           <h3>Formulir Reservasi</h3>
//           <form>
//             <div>
//               <label>Nama Pemesan:</label>
//               <input
//                 type="text"
//                 value={reservationName}
//                 onChange={(e) => setReservationName(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label>Waktu Reservasi:</label>
//               <input
//                 type="datetime-local"
//                 value={reservationTime}
//                 onChange={(e) => setReservationTime(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label>Jumlah Orang:</label>
//               <input
//                 type="number"
//                 value={numPeople}
//                 onChange={(e) => setNumPeople(e.target.value)}
//                 min="1"
//                 max="4"
//                 required
//               />
//             </div>
//             <div>
//               <label>Nomor Meja:</label>
//               <Select
//                 isMulti
//                 styles={customStyles}
//                 options={tableOptions}
//                 value={tableOptions.filter((option) => selectedTables.includes(option.value))}
//                 isDisabled
//               />
//             </div>
//             <p>Total: Rp {totalPrice.toLocaleString()}</p>
//             <button type="submit" className="btn btn-primary">
//               Reservasi
//             </button>
//           </form>
//         </div>

//         {/* Order Section */}
//         <div className="order-box">
//           <h3>Pesanan Take-Away atau Delivery</h3>
//           <form id="orderForm" onSubmit={handleSubmitOrder}>
//             <div>
//               <label>Nama Pemesan:</label>
//               <input
//                 type="text"
//                 value={orderName}
//                 onChange={(e) => setOrderName(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//             <Select
//             id="menuItems"
//             styles={customStyles}
//             placeholder="Pastikan menu sudahh di dalam keranjang"
//             options={menuOptions}
//             value={menuOptions.find(option => option.value === selectedMenuItem)}
//             onChange={(option) => setSelectedMenuItem(option)}
//             required
//           />

//             </div>
//             <div>
//               <label>Jumlah:</label>
//               <input
//                 type="number"
//                 value={itemQuantity}
//                 onChange={(e) => setItemQuantity(e.target.value)}
//                 min="1"
//                 required
//               />
//             </div>
//             <div>
//               <label>Jenis Pemesanan:</label>
//               <Select
//                 options={orderTypeOptions}
//                 styles={customStyles}
//                 value={orderTypeOptions.find(option => option.value === orderType)}
//                 onChange={(e) => setOrderType(e.value)}
//                 required
//               />
//             </div>
//             {orderType === 'Delivery' && (
//               <div>
//                 <label>Alamat Pengantaran:</label>
//                 <textarea
//                   value={deliveryAddress}
//                   onChange={(e) => setDeliveryAddress(e.target.value)}
//                 />
//               </div>
//             )}
//             <div>
//               <label>Metode Pembayaran:</label>
//               <Select
//                 options={paymentMethodOptions}
//                 styles={customStyles}
//                 value={paymentMethodOptions.find(option => option.value === paymentMethod)}
//                 onChange={(e) => setPaymentMethod(e.value)}
//                 required
//               />
//             </div>
//             {paymentMethod === 'TF' && (
//               <div>
//                 <label>Bukti Transfer:</label>
//                 <input type="file" />
//               </div>
//             )}
//             <div>
//               <h4>Ringkasan Pesanan:</h4>
//               <ul>
//                 {orderItems.map((item, index) => (
//                   <li key={index}>
//                     {item.name} x{item.quantity} - Rp {item.price * item.quantity}
//                   </li>
//                 ))}
//               </ul>
//               <p>Total: Rp {totalPrice}</p>
//             </div>
//             <button type="button" onClick={handleAddItem} className="btn btn-secondary">
//               Konfirmasi
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={totalPrice === 0}
//             >
//               Pesan
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pemesanan;




import React, { useState } from 'react';
import "../css/pemesanan.css";
import Select from 'react-select';

const Pemesanan = ({ cart }) => {
  const [reservationName, setReservationName] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [selectedTables, setSelectedTables] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const tables = [
    { id: 1, price: 50000, status: 'available' },
    { id: 2, price: 50000, status: 'occupied' },
    { id: 3, price: 5000, status: 'available' },
    { id: 4, price: 50000, status: 'available' }
  ];

  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      fontSize: '16px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black',
      fontSize: '16px',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'black',
      fontSize: '16px',
    })
  };

  const handleTableClick = (table) => {
    if (table.status === 'available') {
      const isSelected = selectedTables.includes(table.id);
      const updatedSelectedTables = isSelected
        ? selectedTables.filter((id) => id !== table.id)
        : [...selectedTables, table.id];
      setSelectedTables(updatedSelectedTables);
      calculateTotalPrice(updatedSelectedTables);
    }
  };

  const handleTableSelection = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedTables(selectedIds);
    calculateTotalPrice(selectedIds);
  };

  const calculateTotalPrice = (selected) => {
    const selectedTableDetails = tables.filter((table) => selected.includes(table.id));
    const total = selectedTableDetails.reduce((sum, table) => sum + table.price, 0);
    setTotalPrice(total);
  };

  const tableOptions = tables.map((table) => ({
    value: table.id,
    label: `Meja ${table.id} (${table.status === 'available' ? 'Kosong' : 'Terisi'}) - Rp ${table.price}`,
    isDisabled: table.status === 'occupied',
  }));

  return (
    <div className="body-box">
      <div className="content-box">

        {/* Table Reservation Section */}
        <div className="reservation-box">
          <h3>Reservasi Meja</h3>
          <div className="table-grid">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`table-item ${table.status} ${selectedTables.includes(table.id) ? 'selected' : ''}`}
                style={{
                  backgroundColor: table.status === 'occupied' ? 'red' : selectedTables.includes(table.id) ? 'green' : 'white',
                  color: table.status === 'occupied' ? 'white' : 'black',
                  cursor: table.status === 'occupied' ? 'not-allowed' : 'pointer',
                }}
                onClick={() => handleTableClick(table)}
              >
                {`Meja ${table.id} (${table.status === 'available' ? 'Kosong' : 'Terisi'}) - Rp ${table.price}`}
              </div>
            ))}
          </div>
        </div>

        {/* Reservation Form */}
        <div className="reservation-box">
          <h3>Formulir Reservasi</h3>
          <form>
            <div>
              <label>Nama Pemesan:</label>
              <input
                type="text"
                value={reservationName}
                onChange={(e) => setReservationName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Waktu Reservasi:</label>
              <input
                type="datetime-local"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Jumlah Orang:</label>
              <input
                type="number"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                min="1"
                max="4"
                required
              />
            </div>
            <div>
              <label>Nomor Meja:</label>
              <Select
                isMulti
                styles={customStyles}
                options={tableOptions}
                value={tableOptions.filter((option) => selectedTables.includes(option.value))}
                onChange={handleTableSelection}
              />
            </div>
            <p>Total: Rp {totalPrice.toLocaleString()}</p>
            <button type="submit" className="btn btn-primary">
              Reservasi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pemesanan;
