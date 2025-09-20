document.addEventListener('DOMContentLoaded', () => {
  function calculateTax(income, age, medicalMembers) {
    let tax = 0;
    if (income <= 237100) tax = income * 0.18;
    else if (income <= 370500) tax = 42678 + (income - 237100) * 0.26;
    else if (income <= 512800) tax = 77362 + (income - 370500) * 0.31;
    else if (income <= 673000) tax = 121475 + (income - 512800) * 0.36;
    else if (income <= 857900) tax = 179147 + (income - 673000) * 0.39;
    else if (income <= 1817000) tax = 251258 + (income - 857900) * 0.41;
    else tax = 644489 + (income - 1817000) * 0.45;

    let rebate = 17235;
    if (age >= 65) rebate += 9444;
    if (age >= 75) rebate += 3145;

    const medCredit = medicalMembers > 0 ? (364 * 12) + ((medicalMembers - 1) * 246 * 12) : 0;
    const uif = Math.min(income * 0.01, 2125);
    tax = Math.max(0, tax - rebate - medCredit);

    return { tax, uif };
  }

  function formatR(value) {
    return "R" + value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  const btn = document.getElementById('calcBtn');
  btn.addEventListener('click', () => {
    const income = Number(document.getElementById('income').value);
    const age = Number(document.getElementById('age').value);
    const medical = Number(document.getElementById('medical').value);

    if (!income || income < 0 || age < 0 || medical < 0) {
      alert('Please enter valid positive numbers for all fields.');
      return;
    }

    const { tax, uif } = calculateTax(income, age, medical);
    const net = income - (tax + uif);

    document.getElementById('taxRes').textContent = formatR(tax);
    document.getElementById('netRes').textContent = formatR(net);
    document.getElementById('rateRes').textContent = ((tax / income) * 100).toFixed(2) + '%';

    const ctx = document.getElementById('chart').getContext('2d');
    if (window.myChart instanceof Chart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Tax', 'UIF', 'Net Income'],
        datasets: [{
          data: [tax, uif, net],
          backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
        }]
      }
    });
  });
});