// ══════════════════════════════
//  LOGIN
// ══════════════════════════════
function doLogin() {
  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();
  var errorMsg = document.getElementById('loginError');

  if (username === 'admin' && password === '1234') {
    errorMsg.classList.remove('show');
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('dashPage').classList.add('active');
    showTab('calculator');
  } else {
    errorMsg.classList.add('show');
    document.getElementById('username').classList.add('error');
    document.getElementById('password').classList.add('error');
    setTimeout(function () {
      document.getElementById('username').classList.remove('error');
      document.getElementById('password').classList.remove('error');
    }, 2000);
  }
}

function doLogout() {
  document.getElementById('dashPage').classList.remove('active');
  document.getElementById('loginPage').classList.add('active');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('loginError').classList.remove('show');

  // Reset calculator fields
  document.getElementById('calc-name').value = '';
  document.getElementById('calc-date').value = '';
  document.getElementById('calc-amount').value = '';
  document.getElementById('calc-duration').value = '';
  document.getElementById('calc-interest').value = '';
  clearCalcError();

  // Reset method tab to default (Method 1)
  selectedMethod = '1';
  document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
  var defaultBtn = document.querySelector('.tab-btn[data-method="1"]');
  if (defaultBtn) defaultBtn.classList.add('active');

  // Hide all result tables and show empty state
  document.getElementById('card1').classList.remove('visible');
  document.getElementById('card2').classList.remove('visible');
  document.getElementById('card3').classList.remove('visible');
  document.getElementById('emptyState').classList.add('visible');
  document.getElementById('table1').innerHTML = '';
  document.getElementById('table2').innerHTML = '';
  document.getElementById('table3').innerHTML = '';
  document.getElementById('summary1').innerHTML = '';
  document.getElementById('summary2').innerHTML = '';
  document.getElementById('summary3').innerHTML = '';
}

// Press Enter to login
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    var loginPage = document.getElementById('loginPage');
    if (loginPage.classList.contains('active')) {
      doLogin();
    }
  }
});

// ══════════════════════════════
//  NAV TABS (Dashboard / Calculator)
// ══════════════════════════════
function showTab(tabName) {
  // Toggle tab content
  document.querySelectorAll('.tab-content').forEach(function (tab) {
    tab.classList.remove('active');
  });
  var target = document.getElementById('tab-' + tabName);
  if (target) target.classList.add('active');

  // Toggle nav-link highlight
  document.querySelectorAll('.nav-link').forEach(function (btn) {
    btn.classList.remove('active');
  });
  var activeBtn = document.querySelector('.nav-link[onclick="showTab(\'' + tabName + '\')"]');
  if (activeBtn) activeBtn.classList.add('active');
}
function showTab(tabName) {
  // Toggle tab content
  document.querySelectorAll('.tab-content').forEach(function (tab) {
    tab.classList.remove('active');
  });
  var target = document.getElementById('tab-' + tabName);
  if (target) target.classList.add('active');

  // Toggle nav-link highlight
  document.querySelectorAll('.nav-link').forEach(function (btn) {
    btn.classList.remove('active');
  });
  var activeBtn = document.querySelector('.nav-link[onclick="showTab(\'' + tabName + '\')"]');
  if (activeBtn) activeBtn.classList.add('active');
}
// ══════════════════════════════
//  QUICK PAYMENT (Dashboard)
// ══════════════════════════════
function processPayment() {
  var amount = document.getElementById('payAmount').value.trim();
  var message = amount
    ? '✅ Payment of $' + amount + ' processed!'
    : '✅ Payment processed successfully!';

  document.getElementById('toastMsg').textContent = message;
  var toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 3500);
  document.getElementById('payAmount').value = '';
}

// ══════════════════════════════
//  LOAN CALCULATOR
// ══════════════════════════════
var selectedMethod = '1';

document.addEventListener('DOMContentLoaded', function () {
  // Method tab buttons
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedMethod = btn.dataset.method;
    });
  });
});

function showCalcError(msg) {
  var el = document.getElementById('calcError');
  el.textContent = '⚠️ ' + msg;
  el.style.display = 'block';
}
function clearCalcError() {
  document.getElementById('calcError').style.display = 'none';
}

function parseDateInput(value) {
  var match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
  if (!match) return null;
  var d = Number(match[1]), m = Number(match[2]), y = Number(match[3]);
  if (y < 100) y += 2000;
  return new Date(y, m - 1, d);
}

function formatDate(date) {
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear()
  ].join('-');
}

function fmt(n) { return n.toFixed(2); }

function makeSummary(id, principal, interest, total) {
  document.getElementById(id).innerHTML =
    '<div class="summary-box blue"><div class="s-label">Principal</div><div class="s-value">' + fmt(principal) + '</div></div>' +
    '<div class="summary-box green"><div class="s-label">Total Interest</div><div class="s-value">' + fmt(interest) + '</div></div>' +
    '<div class="summary-box orange"><div class="s-label">Grand Total</div><div class="s-value">' + fmt(total) + '</div></div>';
}

function buildTableHeader(nameRow) {
  return (nameRow ? '<tr><th colspan="5" style="text-align:left; background:#3451d1;">' + nameRow + '</th></tr>' : '') +
    '<tr><th>#</th><th>Date</th><th>Principal</th><th>Interest</th><th>Total</th></tr>';
}

function calculate() {
  clearCalcError();

  var name = document.getElementById('calc-name').value.trim();
  var dateVal = document.getElementById('calc-date').value.trim();
  var amount = Number(document.getElementById('calc-amount').value);
  var duration = Number(document.getElementById('calc-duration').value);
  var interestRate = Number(document.getElementById('calc-interest').value);

  if (!dateVal) return showCalcError('Please enter a start date.');
  if (!amount || amount <= 0) return showCalcError('Please enter a valid loan amount greater than 0.');
  if (!duration || duration <= 0 || !Number.isInteger(duration)) return showCalcError('Please enter a whole number of months.');
  if (isNaN(interestRate) || interestRate < 0) return showCalcError('Please enter a valid interest rate (0 or more).');

  var startDate = parseDateInput(dateVal);
  if (!startDate || isNaN(startDate.getTime())) return showCalcError('Date must be in dd-mm-yy or dd-mm-yyyy format.');

  document.getElementById('emptyState').classList.remove('visible');

  var show1 = selectedMethod === '1' || selectedMethod === 'all';
  var show2 = selectedMethod === '2' || selectedMethod === 'all';
  var show3 = selectedMethod === '3' || selectedMethod === 'all';

  document.getElementById('card1').classList.toggle('visible', show1);
  document.getElementById('card2').classList.toggle('visible', show2);
  document.getElementById('card3').classList.toggle('visible', show3);

  var nameRow = name ? ' Name: ' + name : null;

  if (show1) buildTable1(nameRow, startDate, amount, duration, interestRate);
  if (show2) buildTable2(nameRow, startDate, amount, duration, interestRate);
  if (show3) buildTable3(nameRow, startDate, amount, duration, interestRate);
}

// Method 1: Fixed interest on original amount
function buildTable1(nameRow, startDate, amount, duration, rate) {
  var monthlyPrincipal = amount / duration;
  var interest = amount * (rate / 100);
  var rows = buildTableHeader(nameRow);
  var totalP = 0, totalI = 0, totalT = 0;

  for (var i = 1; i <= duration; i++) {
    var d = new Date(startDate);
    d.setMonth(d.getMonth() + i - 1);
    var total = monthlyPrincipal + interest;
    totalP += monthlyPrincipal; totalI += interest; totalT += total;
    rows += '<tr><td>' + i + '</td><td>' + formatDate(d) + '</td><td>' + fmt(monthlyPrincipal) + '</td><td>' + fmt(interest) + '</td><td>' + fmt(total) + '</td></tr>';
  }
  rows += '<tr class="grand-total"><td colspan="2">Grand Total</td><td>' + fmt(totalP) + '</td><td>' + fmt(totalI) + '</td><td>' + fmt(totalT) + '</td></tr>';
  document.getElementById('table1').innerHTML = rows;
  makeSummary('summary1', totalP, totalI, totalT);
}

// Method 2: Reducing balance
function buildTable2(nameRow, startDate, amount, duration, rate) {
  var monthlyPrincipal = amount / duration;
  var remaining = amount;
  var rows = buildTableHeader(nameRow);
  var totalP = 0, totalI = 0, totalT = 0;

  for (var i = 1; i <= duration; i++) {
    var d = new Date(startDate);
    d.setMonth(d.getMonth() + i - 1);
    var interest = remaining * (rate / 100);
    var total = monthlyPrincipal + interest;
    totalP += monthlyPrincipal; totalI += interest; totalT += total;
    remaining -= monthlyPrincipal;
    rows += '<tr><td>' + i + '</td><td>' + formatDate(d) + '</td><td>' + fmt(monthlyPrincipal) + '</td><td>' + fmt(interest) + '</td><td>' + fmt(total) + '</td></tr>';
  }
  rows += '<tr class="grand-total"><td colspan="2">Grand Total</td><td>' + fmt(totalP) + '</td><td>' + fmt(totalI) + '</td><td>' + fmt(totalT) + '</td></tr>';
  document.getElementById('table2').innerHTML = rows;
  makeSummary('summary2', totalP, totalI, totalT);
}

// Method 3: Quarterly principal payment
function buildTable3(nameRow, startDate, amount, duration, rate) {
  var quarterlyPrincipal = (amount / duration) * 3;
  var remaining = amount;
  var rows = buildTableHeader(nameRow);
  var totalP = 0, totalI = 0, totalT = 0;

  for (var i = 1; i <= duration; i++) {
    var d = new Date(startDate);
    d.setMonth(d.getMonth() + i);
    var interest = remaining * (rate / 100);

    var principal = 0;
    if (i % 3 === 0) principal = Math.min(quarterlyPrincipal, remaining);
    else if (i === duration && remaining > 0) principal = remaining;

    var total = principal + interest;
    totalP += principal; totalI += interest; totalT += total;
    remaining -= principal;

    var pDisplay = principal === 0
      ? '<span class="zero-principal">—</span>'
      : fmt(principal);

    rows += '<tr><td>' + i + '</td><td>' + formatDate(d) + '</td><td>' + pDisplay + '</td><td>' + fmt(interest) + '</td><td>' + fmt(total) + '</td></tr>';
  }
  rows += '<tr class="grand-total"><td colspan="2">Grand Total</td><td>' + fmt(totalP) + '</td><td>' + fmt(totalI) + '</td><td>' + fmt(totalT) + '</td></tr>';
  document.getElementById('table3').innerHTML = rows;
  makeSummary('summary3', totalP, totalI, totalT);
}