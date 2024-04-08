const express = require("express");
const app = express();
const conn = require("./config/db");

// Middleware untuk mengizinkan parsing body JSON
app.use(express.json());

app.get("/pelanggan", (req, res) => {
  conn.query("SELECT * FROM Pelanggan", (err, rows) => {
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

app.post("/pelanggan", (req, res) => {
  const { name, alamat, telepon } = req.body;

  if (!name || !alamat || !telepon) {
    return res
      .status(400)
      .json({ error: "Nama, Alamat, dan Telepon diperlukan" });
  }

  const sql =
    "INSERT INTO Pelanggan (Nama, Alamat, Nomor_telepon) VALUES (?, ?, ?)";
  conn.query(sql, [name, alamat, telepon], (err, result) => {
    if (err) {
      console.error("Gagal menambahkan pelanggan:", err);
      return res.status(500).send("Gagal menambahkan pelanggan");
    }
    console.log("Pelanggan baru telah ditambahkan:", result);
    res.send("Pelanggan baru telah ditambahkan");
  });
});

app.put("/pelanggan/:id", (req, res) => {
  const id = req.params.id;
  const { id_pelanggan, name, alamat, telepon } = req.body;

  // Periksa apakah ID_Pelanggan, nama, alamat, dan telepon telah disediakan
  if (!id_pelanggan || !name || !alamat || !telepon) {
    return res.status(400).json({
      success: false,
      message: "ID_Pelanggan, Nama, Alamat, dan Telepon diperlukan",
    });
  }

  const sql =
    "UPDATE Pelanggan SET ID_Pelanggan = ?, Nama = ?, Alamat = ?, Nomor_telepon = ? WHERE ID_Pelanggan = ?";
  conn.query(sql, [id_pelanggan, name, alamat, telepon, id], (err, result) => {
    if (err) {
      console.error("Gagal memperbarui pelanggan:", err);
      return res.status(500).json({
        success: false,
        message: "Gagal memperbarui pelanggan",
        error: err.message,
      });
    }

    // Periksa apakah ada baris yang terpengaruh oleh operasi UPDATE
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Pelanggan tidak ditemukan",
      });
    }

    console.log("Pelanggan telah diperbarui:", result);
    res.json({
      success: true,
      message: "Pelanggan telah diperbarui",
    });
  });
});

app.delete("/pelanggan/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM Pelanggan WHERE ID_Pelanggan = ?";
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Gagal menghapus pelanggan:", err);
      return res.status(500).send("Gagal menghapus pelanggan");
    }
    console.log("Pelanggan telah dihapus:", result);
    res.send("Pelanggan telah dihapus");
  });
});

app.listen(3000);
