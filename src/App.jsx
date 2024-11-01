/* eslint-disable react/prop-types */
import "./App.css";
import { useState } from "react";

import { Chart, ArcElement } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
Chart.register(ArcElement);

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";

const App = () => {
  return (
    <div className="flex-container">
      <header className="header">
        <Typography variant="h6">Simple Expense Managing App</Typography>
      </header>
      <main className="main-content">
        <ExpenseTracker />
      </main>
      <footer className="footer">
        <Typography variant="h6">Simple Expense Managing App</Typography>
      </footer>
    </div>
  );
};

export default App;

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);

  function updateList(cost, category, date, note) {
    let temp = [...expenses];
    let newExpense = { cost, category, date, note };
    temp.push(newExpense);

    setExpenses(temp);
  }

  // function handleRemove(rowIndex) {
  //   let temp = [...expenses];
  //   temp.splice(rowIndex, 1);
  //   setExpenses(temp);
  // }

  if (expenses.length == 0) {
    return (
      <div className="expense-tracker-container">
        <ExpenseForm updateList={updateList} />
      </div>
    );
  } else {
    return (
      <div className="expense-tracker-container">
        <ExpenseForm updateList={updateList} />
        <ExpenseResult expenses={expenses} />
        <ExpenseList expenses={expenses} />
      </div>
    );
  }
};

const ExpenseForm = ({ updateList }) => {
  function handleSubmit(event) {
    event.preventDefault();
    updateList(
      event.target.elements.cost.value,
      event.target.elements.category.value,
      event.target.elements.date.value,
      event.target.elements.note.value
    );
  }

  let curr = new Date();
  curr.setDate(curr.getDate());
  let date = curr.toISOString().substring(0, 10);

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      autoComplete="off"
      onSubmit={handleSubmit}
      className="expense-form-container"
    >
      <TextField
        id="costInput"
        name="cost"
        label="Cost"
        type="number"
        required
        placeholder="0.0"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: "0.01"
        }}
      />
      <TextField
        id="categoryInput"
        name="category"
        select
        label="Category"
        defaultValue="Housing"
        required
      >
        <MenuItem value="Housing">Housing</MenuItem>
        <MenuItem value="Utilities">Utilities</MenuItem>
        <MenuItem value="Transportation">Transportation</MenuItem>
        <MenuItem value="Groceries">Groceries</MenuItem>
        <MenuItem value="Dining Out">Dining Out</MenuItem>
        <MenuItem value="Insurance">Insurance</MenuItem>
        <MenuItem value="Healthcare">Healthcare</MenuItem>
        <MenuItem value="Entertainment">Entertainment</MenuItem>
        <MenuItem value="Education">Education</MenuItem>
        <MenuItem value="Debts & Loans">Debts & Loans</MenuItem>
        <MenuItem value="Clothing">Clothing</MenuItem>
        <MenuItem value="Personal Care">Personal Care</MenuItem>
        <MenuItem value="Charity & Gifts">Charity & Gifts</MenuItem>
        <MenuItem value="Travel">Travel</MenuItem>
        <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
      </TextField>
      <TextField
        id="dateInput"
        name="date"
        label="Date"
        type="date"
        required
        defaultValue={date}
        slotProps={{
          shrink: true,
        }}
      />
      <TextField
        id="noteInput"
        name="note"
        label="Note"
        multiline
        placeholder="Optional note"
        maxRows={4}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button variant="outlined" type="submit" id="submitButton">
        Submit
      </Button>
    </Box>
  );
};

const ExpenseResult = ({ expenses }) => {
  let totalSum = 0;
  let categories = [];
  let correspondingSums = [];
  for (let expense of expenses) {
    totalSum = totalSum + Number(expense.cost);
    if (categories.includes(expense.category)) {
      let indexWhere = categories.findIndex((cat) => cat == expense.category);
      correspondingSums[indexWhere] =
        correspondingSums[indexWhere] + Number(expense.cost);
    } else {
      categories.push(expense.category);
      correspondingSums.push(Number(expense.cost));
    }
  }

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Expense Distribution Dataset",
        data: correspondingSums,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
          "rgb(255, 99, 71)",
          "rgb(106, 90, 205)",
          "rgb(0, 128, 128)",
          "rgb(255, 215, 0)",
          "rgb(199, 21, 133)",
          "rgb(220, 20, 60)",
          "rgb(34, 139, 34)",
          "rgb(70, 130, 180)",
          "rgb(224, 184, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <article className="expense-result-container">
      <Typography variant="h6">Total Amount Spent ($): {totalSum}</Typography>
      <div className="chart-container">
        <Doughnut data={data} width={300} height={300} />
      </div>
    </article>
  );
};

const ExpenseList = ({ expenses }) => {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "cost", headerName: "Cost ($)", width: 130 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "note", headerName: "Note", width: 250 },
  ];

  const rows = expenses.map((expense, rowIndex) => ({
    id: rowIndex,
    cost: expense.cost,
    category: expense.category,
    date: expense.date,
    note: expense.note == "" ? "No Note" : expense.note,
  }));

  const paginationModel = { page: 0, pageSize: 9 };

  return (
    <Paper sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

// const RemoveButton = ({ rowIndex, handleRemove }) => {
//   function clickHandler() {
//     handleRemove(rowIndex);
//   }

//   return <button onClick={clickHandler}>X</button>;
// }
