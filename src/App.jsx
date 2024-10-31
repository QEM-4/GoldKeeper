/* eslint-disable react/prop-types */
import "./App.css";
import { useState } from "react";

import { Chart, ArcElement } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
Chart.register(ArcElement);


import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';



const App = () => {
  return (
    <div className="flex-container">
      <header className="header">Simple Expense Managing App</header>
      <main className="main-content">
        <ExpenseTracker />
      </main>
      <footer className="footer">Simple Expense Managing App</footer>
    </div>
  );
}

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
}

const ExpenseForm = ({ updateList }) => {
  
  function handleSubmit(e) {
    e.preventDefault();
    updateList(
      e.target.elements.cost.value,
      e.target.elements.category.value,
      e.target.elements.date.value,
      e.target.elements.note.value
    );
  }

  var curr = new Date();
  curr.setDate(curr.getDate());
  var date = curr.toISOString().substring(0, 10);

  return (
    <div>
      <form onSubmit={handleSubmit} className="expense-form-container">
        <label id="costLabel">Cost ($)</label>
        <input
          type="number"
          required
          step="0.01"
          placeholder="0.00"
          name="cost"
          id="costInput"
        />
        <label id="categoryLabel">Category</label>
        <select name="category" id="categoryInput">
          <option>Housing</option>
          <option>Utilities</option>
          <option>Transporation</option>
          <option>Grocieries</option>
          <option>Dining Out</option>
          <option>Insurance</option>
          <option>Healthcare</option>
          <option>Entertainment</option>
          <option>Education</option>
          <option>Debts & Loans</option>
          <option>Clothing</option>
          <option>Personal Care</option>
          <option>Charity & Gifts</option>
          <option>Travel</option>
          <option>Miscallaneous</option>
        </select>
        <label id="dateLabel">Date</label>
        <input
          type="date"
          required
          name="date"
          id="dateInput"
          defaultValue={date}
        />
        <label id="noteLabel">Note</label>
        <textarea
          name="note"
          maxLength={100}
          id="noteInput"
          placeholder="Optional Note"
        />
        <button type="submit" id="submitButton">
          Submit{" "}
        </button>
      </form>
    </div>
  );
}

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
      <div>Total Amount Spent ($): {totalSum}</div>
      <div className="chart-container">
        <Doughnut data={data} width={300} height={300} />
      </div>
    </article>
  );
}


const ExpenseList = ({ expenses }) => {
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'cost', headerName: 'Cost ($)', width: 130 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'note', headerName: 'Note', width: 250 }
  ];

  const rows = expenses.map((expense, rowIndex) => ({
    id: rowIndex, cost: expense.cost, category: expense.category, date: expense.date, note: expense.note == "" ? "No Note" : expense.note
  }));


  const paginationModel = { page: 0, pageSize: 9 };

  return (
    <Paper sx={{ height: 600, width: '100%' }}>
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
}

// const RemoveButton = ({ rowIndex, handleRemove }) => {
//   function clickHandler() {
//     handleRemove(rowIndex);
//   }

//   return <button onClick={clickHandler}>X</button>;
// }

