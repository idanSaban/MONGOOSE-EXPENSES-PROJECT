const express = require("express");
const router = express.Router();
const moment = require("moment");
const Expense = require("../models/Expense");

router.get("/expenses", function(req, res) {
  console.log("got one");
  console.log(req.query);
  if (req.query.d1) {
    const date1 = moment(req.query.d1).format("LLLL");
    if (req.query.d2) {
      const date2 = moment(req.query.d2).format("LLLL");
      // two dates
      console.log("two dates");
      Expense.find({
        $and: [{ date: { $gte: date1 } }, { date: { $lte: date2 } }]
      })
        .sort({ date: -1 })
        .exec(function(err, expense) {
          res.send(expense);
        });
    } else {
      //one date
      const now = moment().format("LLLL");
      console.log("one date");
      Expense.find({
        $and: [{ date: { $gte: date1 } }, { date: { $lte: now } }]
      })
        .sort({ date: -1 })
        .exec(function(err, expense) {
          res.send(expense);
        });
    }
  } else {
    //no date
    console.log("no date");
    Expense.find({})
      .sort({ date: -1 })
      .exec(function(err, expenses) {
        res.send(expenses);
      });
  }
});

router.post("/new", function(req, res) {
  let date = moment().format("LLLL");
  if (req.body.date) {
    date = moment(req.body.date).format("LLLL");
  }
  const expense = new Expense({
    item: req.body.item,
    amount: req.body.amount,
    group: req.body.group,
    date: date
  });
  expense.save(function(err, expense) {
    console.log(`new expense amount: ${expense.amount}`);
    res.send(expense);
  });
});

router.put("/update/:group1/:group2", function(req, res) {
  Expense.findOneAndUpdate(
    { group: req.params.group1 },
    { group: req.params.group2 },
    { new: true }
  ).exec(function(err, doc) {
    res.send(doc);
  });
});

router.get("/expenses/:group", function(req, res) {
  console.log(req.query.total);
  if (req.query.total === "true") {
    Expense.aggregate([
      { $match: { group: req.params.group } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).exec(function(err, expenses) {
      res.send(expenses);
    });
  }
  Expense.find({ group: req.params.group }).exec(function(err, expenses) {
    res.send(expenses);
  });
});

// const dataMaster = require('../../expenses.json')
// dataMaster.forEach(e=> {
//     const expense=new Expense(e)
//     expense.save()
// })

module.exports = router;
