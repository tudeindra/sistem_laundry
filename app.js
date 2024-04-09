const express = require("express");
const app = express();
const conn = require("./config/db");

app.use(express.json());

app.get("/transactions", (req, res) => {
  conn.query("SELECT * FROM Transactions", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Gagal menampilkan data",
        error: err.sqlMessage,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Sukses menampilkan data",
        data: rows,
      });
    }
  });
});

app.post("/transactions", (req, res) => {
  const { customer_id, amount, date } = req.body;

  if (!customer_id || !amount || !date) {
    return res
      .status(400)
      .json({ error: "ID Pelanggan, Jumlah, dan Tanggal diperlukan" });
  }

  const sql =
    "INSERT INTO Transactions (customer_id, amount, date) VALUES (?, ?, ?)";
  conn.query(sql, [customer_id, amount, date], (err, result) => {
    if (err) {
      console.error("Gagal menambahkan transaksi:", err);
      return res.status(500).send("Gagal menambahkan transaksi");
    }
    console.log("Transaksi baru telah ditambahkan:", result);
    res.send("Transaksi baru telah ditambahkan");
  });
});

app.put("/transactions/:id", (req, res) => {
  const id = req.params.id;
  const { customer_id, amount, date } = req.body;

  if (!customer_id || !amount || !date) {
    return res.status(400).json({
      success: false,
      message: "ID Pelanggan, Jumlah, dan Tanggal diperlukan",
    });
  }

  const sql =
    "UPDATE Transactions SET customer_id = ?, amount = ?, date = ? WHERE id = ?";
  conn.query(sql, [customer_id, amount, date, id], (err, result) => {
    if (err) {
      console.error("Gagal memperbarui transaksi:", err);
      return res.status(500).json({
        success: false,
        message: "Gagal memperbarui transaksi",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    console.log("Transaksi telah diperbarui:", result);
    res.json({
      success: true,
      message: "Transaksi telah diperbarui",
    });
  });
});

app.delete("/transactions/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM Transactions WHERE id = ?";
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Gagal menghapus transaksi:", err);
      return res.status(500).send("Gagal menghapus transaksi");
    }
    console.log("Transaksi telah dihapus:", result);
    res.send("Transaksi telah dihapus");
  });
});

app.listen(3000);
