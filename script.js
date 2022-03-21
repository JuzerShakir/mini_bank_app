"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// MINI BANKING APP

// Dummy Accounts
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2018-11-01T13:15:33.035Z",
    "2012-05-30T09:48:16.867Z",
    "2017-12-25T06:04:23.907Z",
    "2022-06-25T14:18:46.235Z",
    "2021-05-05T16:33:06.386Z",
    "2021-04-10T14:43:26.374Z",
    "2022-03-25T18:49:59.371Z",
    "2021-02-26T12:01:20.894Z",
  ],
  currency: "OMR",
  locale: "ar-OM",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2011-11-01T13:15:33.035Z",
    "2012-01-30T09:48:16.867Z",
    "2013-06-25T06:04:23.907Z",
    "2022-05-25T14:18:46.235Z",
    "2021-04-05T16:33:06.386Z",
    "2020-03-10T14:43:26.374Z",
    "2021-02-25T18:49:59.371Z",
    "2022-01-26T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// ! To create initials of owner names of accounts
const createUserInit = (account) =>
  (account.username = account.owner
    .toLowerCase()
    .split(" ")
    .map((name) => name[0])
    .join(""));

accounts.forEach(function (account) {
  createUserInit(account);
});

/////////////////////////////////////////

// ! Global Variables
let currentUser, sorted, initialTime, timer;

//////////////////////////////////////////

// ! CALL Functions
const updateUI = function (currentUser) {
  // TODO Transaction history
  displayMovement(currentUser);
  // TODO Balance
  calcBPrintBalance(currentUser);
  // TODO Summary of income, outcome & interest
  calcDisplaySummary(currentUser);
  // TODO Dates
  labelDate.textContent = DateToStringConverter(new Date());
  // TODO Set Log Out Timer
  if (timer) clearInterval(timer);
  timer = logOutUserTimer();
};

const formattedCurrency = (amount, locale, currency) => {
  const currencyOptions = {
    style: "currency",
    currency: currency,
  };

  const amountInCurrency = new Intl.NumberFormat(
    locale,
    currencyOptions
  ).format(amount);

  return amountInCurrency;
};

const timePassed = (date) => {
  const convDate = new Date(date);
  const now = new Date();

  // console.log(convDate, now);
  const daysPassed = Math.round(
    Math.abs(now - convDate) / (1000 * 60 * 60 * 24)
  );

  // console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  else if (daysPassed === 1) return "Yesterday";
  else return `${daysPassed} days ago`;
};

const DateToStringConverter = (date) => {
  const options = {
    minute: "numeric",
    hour: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };
  // const locale = navigator.language;
  return new Intl.DateTimeFormat(currentUser.locale, options).format(date);
};

////////////////////////////////
// ! Login Functionality

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentUser = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // console.log(currentUser);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // TODO Greet User
    labelWelcome.textContent = `Welcome Back, ${
      currentUser.owner.split(" ")[0]
    }`;

    // TODO Update UI after user login
    updateUI(currentUser);

    // TODO change Opacity
    document.querySelector(".app").style.opacity = 100;

    // TODO remove text from login fields
    inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.value = "";
  }
});

///////////////////////////
// ! To display transaction history

const displayMovement = function (acc, sort = false) {
  const movements = acc.movements;
  containerMovements.innerHTML = "";

  const transactions = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  transactions.forEach(function (tran, i) {
    const type = tran > 0 ? "deposit" : "withdrawal";

    const tranIndex = movements.findIndex((v) => v === tran);
    const date = acc.movementsDates[tranIndex];
    const dateString = timePassed(date);
    // console.log(date);
    const amount = formattedCurrency(tran, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${dateString}</div>
        <div class="movements__value">${amount}</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/////////////////////////////////

// ! To DISPLAY Total Balance
const calcBPrintBalance = function (currentUser) {
  currentUser.balance = currentUser.movements.reduce(
    (acc, num) => acc + num,
    0
  );
  const balance = formattedCurrency(
    currentUser.balance,
    currentUser.locale,
    currentUser.currency
  );
  labelBalance.textContent = `${balance}`;
};

///////////////////////////////

// ! Calculate income, expense & interest value
const calcDisplaySummary = function (currentUser) {
  const movements = currentUser.movements;
  const int = currentUser.interestRate;

  const income = movements
    .filter((movement) => movement > 0)
    .reduce((acc, num) => acc + num, 0);
  labelSumIn.textContent = formattedCurrency(
    income,
    currentUser.locale,
    currentUser.currency
  );

  const outcome = movements
    .filter((movement) => movement < 0)
    .reduce((acc, num) => acc + num, 0);
  labelSumOut.textContent = formattedCurrency(
    Math.abs(outcome),
    currentUser.locale,
    currentUser.currency
  );

  const calcInterest = movements
    .filter((movement) => movement > 0)
    .map((dep) => dep * (int / 100))
    .filter((dep) => dep >= 1)
    .reduce((acc, num) => acc + num, 0);

  // const calcInterest2 = income * (1.2 / 100);

  labelSumInterest.textContent = formattedCurrency(
    calcInterest,
    currentUser.locale,
    currentUser.currency
  );
};

/////////////////////////////////

// ! To sort transactions in descending order
btnSort.addEventListener("click", function () {
  if (!sorted) displayMovement(currentUser, (sorted = true));
  else displayMovement(currentUser, (sorted = false));
});

///////////////////////////////////
// ! To transfer amount
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = "";
  inputTransferAmount.blur();
  inputTransferTo.value = "";

  if (
    amount > 0 &&
    currentUser.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentUser.username
  ) {
    receiverAcc.movements.push(amount);
    currentUser.movements.push(-amount);
    currentUser.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // displayMovement(currentUser.movements);
    // currentUser.balance -= amount;
    // labelBalance.textContent = `${currentUser.balance} €`;

    updateUI(currentUser);
  }
});

///////////////////////////////////////////

// ! To request Loan Amount
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  // console.log(amount);

  if (amount > 0 && currentUser.movements.some((mov) => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentUser.movements.push(amount);
      currentUser.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentUser);
    }, 3000);

    inputLoanAmount.value = "";
  }
});

//////////////////////////////////////////

// ! To Close an Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // console.log(acc_id);
  if (
    currentUser.username === inputCloseUsername.value &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const acc_index = accounts.findIndex(
      (acc) => acc.username === inputCloseUsername.value
    );

    accounts.splice(acc_index, 1);
    document.querySelector(".app").style.opacity = 0;
  }
  inputCloseUsername.value = "";
  inputClosePin.value = "";
});

///////////////////////////////////////////////

// ! Timer Functionality
const logOutUserTimer = function () {
  initialTime = new Date().setMinutes(5, 0, 0);
  const nullTime = new Date().setMinutes(0, 0, 0);
  // console.log(initialTime, milSecCounter);

  const options = {
    minute: "numeric",
    second: "numeric",
  };

  const milSecCounter = 1000;
  const logOutTimer = setInterval(function () {
    const milSecDiff = initialTime - milSecCounter;

    // console.log(milSecDiff, milSecCounter, initialTime);
    //

    if (initialTime > nullTime) {
      const timeLeft = Intl.DateTimeFormat(currentUser.locale, options).format(
        milSecDiff
      );
      labelTimer.textContent = timeLeft;
    } else {
      clearInterval(logOutTimer);
      containerApp.style.opacity = 0;
      currentUser = undefined;
      labelWelcome.textContent = `Log in to get started`;
    }
    initialTime -= 1000;
  }, 1000);

  return logOutTimer;
};
