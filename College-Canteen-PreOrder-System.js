// ======================================================
// FILE: server.js
// BACKEND - Node.js + Express + MongoDB
// ======================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/college")
  .then(() => console.log("MongoDB Connected"));

const Order = mongoose.model("students", new mongoose.Schema({
  studentName: String,
  rollNo: Number,
  course: String,
  foodItem: String,
  price: Number,
  quantity: Number,
  total: Number
}));

const food = [
  { name: "Pizza", price: 100 },
  { name: "Veg Burger", price: 60 },
  { name: "Sandwich", price: 50 },
  { name: "Samosa", price: 20 }
];

// GET /food
app.get("/food", (req, res) => {
  res.json(food);
});

// POST /orders
app.post("/orders", async (req, res) => {
  const {
    studentName,
    rollNo,
    course,
    foodItem,
    quantity
  } = req.body;

  const item = food.find(f => f.name === foodItem);
  const total = item.price * quantity;

  const order = new Order({
    studentName,
    rollNo,
    course,
    foodItem,
    price: item.price,
    quantity,
    total
  });

  await order.save();
  res.json(order);
});

// GET /orders
app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});


// ======================================================
// FILE: App.jsx
// FRONTEND - React + Axios
// ======================================================

import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [food, setFood] = useState([]);
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState({
    studentName: "",
    rollNo: "",
    course: "",
    foodItem: "",
    quantity: 1
  });

  useEffect(() => {
    axios.get("http://localhost:5000/food")
      .then(res => setFood(res.data));

    getOrders();
  }, []);

  const getOrders = () => {
    axios.get("http://localhost:5000/orders")
      .then(res => setOrders(res.data));
  };

  const change = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const order = e => {
    e.preventDefault();

    axios.post("http://localhost:5000/orders", {
      ...form,
      rollNo: Number(form.rollNo),
      quantity: Number(form.quantity)
    })
    .then(() => {
      alert("Order Placed!");
      getOrders();

      setForm({
        studentName: "",
        rollNo: "",
        course: "",
        foodItem: "",
        quantity: 1
      });
    });
  };

  return (
    <div className="container">

      <h1>College Canteen Pre-Order System</h1>

      <h2>Food Items</h2>

      <div className="food">
        {food.map(f => (
          <div key={f.name}>
            <b>{f.name}</b>
            <p>₹{f.price}</p>
          </div>
        ))}
      </div>

      <h2>Student Order Form</h2>

      <form onSubmit={order}>

        <input
          name="studentName"
          placeholder="Student Name"
          value={form.studentName}
          onChange={change}
          required
        />

        <input
          name="rollNo"
          placeholder="Roll No"
          value={form.rollNo}
          onChange={change}
          required
        />

        <input
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={change}
          required
        />

        <select
          name="foodItem"
          value={form.foodItem}
          onChange={change}
          required
        >
          <option value="">Select Food</option>

          {food.map(f => (
            <option key={f.name} value={f.name}>
              {f.name} - ₹{f.price}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          min="1"
          value={form.quantity}
          onChange={change}
        />

        <button>Place Order</button>

      </form>

      <h2>Placed Orders</h2>

      <table>

        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Course</th>
            <th>Food</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>

          {orders.map(o => (
            <tr key={o._id}>
              <td>{o.studentName}</td>
              <td>{o.rollNo}</td>
              <td>{o.course}</td>
              <td>{o.foodItem}</td>
              <td>₹{o.price}</td>
              <td>{o.quantity}</td>
              <td>₹{o.total}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;


// ======================================================
// FILE: App.css
// FRONTEND STYLING
// ======================================================

body {
  font-family: Arial;
  background: #f2f2f2;
}

.container {
  width: 90%;
  margin: auto;
}

h1 {
  text-align: center;
  color: #333;
}

.food {
  display: flex;
  gap: 15px;
}

.food div {
  background: white;
  padding: 15px;
  width: 150px;
  border-radius: 8px;
}

form {
  background: white;
  padding: 20px;
  margin: 20px 0;
}

input,
select,
button {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  box-sizing: border-box;
}

button {
  background: green;
  color: white;
  border: none;
  cursor: pointer;
}

table {
  width: 100%;
  background: white;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}

th {
  background: #333;
  color: white;
  }
