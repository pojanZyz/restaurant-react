import React from 'react';
import "../css/feedback.css";

const Feedback = () => {
  return (
    <div className="body-box">
      <div className="content-fb-box">
        <main className="container-fb">
          <div className="fb-header">
            <h1>Berikan Feedback Terbaik Anda</h1>
          </div>
          <div className="content-box-fb">
            <div className="input-box">
              <form id="feedback-form">
              <div className="input">
                  <label htmlFor="email">Nama:</label>
                  <input
                    name="email"
                    id="username"
                    placeholder="Nama anda"
                    required
                  />
                </div>
                <div className="input">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email Anda"
                    required
                  />
                </div>
                <div className="input">
                  <label htmlFor="pesan">Pesan:</label>
                  <textarea
                    name="pesan"
                    id="pesan"
                    placeholder="Pesan Anda"
                    required
                  ></textarea>
                </div>
                <div className="positif">
                  <label htmlFor="positif">Ulasan Positif : </label>
                  <input type="checkbox" id="positif" />
                </div>
                <div className="btn-box">
                  <button type="submit">Submit</button>
                  <button type="reset">Reset</button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <div className="dashboard">
          <h1>Statistik Ulasan</h1>
          <div className="stats-container">
            <div className="stat-box">
              <h2>Total Ulasan</h2>
              <p id="total-ulasan">0</p>
            </div>
            <div className="stat-box">
              <h2>Ulasan Positif</h2>
              <p id="ulasan-positif">0</p>
            </div>
            <div className="stat-box">
              <h2>Ulasan Negatif</h2>
              <p id="ulasan-negatif">0</p>
            </div>
          </div>
          <h2>Daftar Ulasan</h2>
          <table className="review-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Pesan</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody id="review-list">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Feedback