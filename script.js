const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");
const fromSearch = document.getElementById("from-search");
const toSearch = document.getElementById("to-search");

let exchangeRates = {};

// Country → Currency + Code Map
const countryCurrencyMap = {
  "United States": { code: "USD", flag: "US" },
  "India": { code: "INR", flag: "IN" },
  "United Kingdom": { code: "GBP", flag: "GB" },
  "European Union": { code: "EUR", flag: "EU" },
  "Japan": { code: "JPY", flag: "JP" },
  "Australia": { code: "AUD", flag: "AU" },
  "Canada": { code: "CAD", flag: "CA" },
  "Singapore": { code: "SGD", flag: "SG" },
  "China": { code: "CNY", flag: "CN" },
  "Brazil": { code: "BRL", flag: "BR" },
  "Russia": { code: "RUB", flag: "RU" },
  "South Africa": { code: "ZAR", flag: "ZA" },
  "United Arab Emirates": { code: "AED", flag: "AE" },
  "Saudi Arabia": { code: "SAR", flag: "SA" },
  "New Zealand": { code: "NZD", flag: "NZ" }
};

// Initialize currency dropdowns
fetch("https://api.exchangerate-api.com/v4/latest/USD")
  .then(res => res.json())
  .then(data => {
    exchangeRates = data.rates;
    const currencies = Object.keys(data.rates);

    currencies.forEach(currency => {
      const option1 = document.createElement("option");
      const option2 = document.createElement("option");
      option1.value = option2.value = currency;
      option1.textContent = option2.textContent = currency;
      fromCurrency.appendChild(option1);
      toCurrency.appendChild(option2);
    });

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);
    convertCurrency();
  });

// Convert currency
function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = "⚠️ Enter a valid amount.";
    return;
  }

  const rate = exchangeRates[to];
  if (!rate) {
    resultDiv.textContent = "❌ Rate not available.";
    return;
  }

  const converted = (amount * rate).toFixed(2);
  resultDiv.textContent = `${amount} ${from} = ${converted} ${to}`;
}

// Update when values change
amountInput.addEventListener("input", convertCurrency);
fromCurrency.addEventListener("change", () => updateRates("from"));
toCurrency.addEventListener("change", convertCurrency);

function updateRates(type) {
  fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`)
    .then(res => res.json())
    .then(data => {
      exchangeRates = data.rates;
      convertCurrency();
    });
}

// Update flag
function updateFlag(select, flag) {
  const currency = select.value;
  const entry = Object.values(countryCurrencyMap).find(c => c.code === currency);
  flag.src = entry ? `https://flagsapi.com/${entry.flag}/flat/64.png` : "";
}

// Search by country
fromSearch.addEventListener("input", () => handleSearch(fromSearch, fromCurrency, fromFlag));
toSearch.addEventListener("input", () => handleSearch(toSearch, toCurrency, toFlag));

function handleSearch(searchInput, selectElement, flagElement) {
  const query = searchInput.value.toLowerCase();
  const match = Object.entries(countryCurrencyMap).find(([country]) =>
    country.toLowerCase().includes(query)
  );

  if (match) {
    const { code, flag } = match[1];
    selectElement.value = code;
    flagElement.src = `https://flagsapi.com/${flag}/flat/64.png`;
    convertCurrency();
  }
}

