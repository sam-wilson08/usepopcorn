import { useEffect, useState } from "react";

export default function CurrencyConverterApp() {
  const [amount, setAmount] = useState(100);
  const [exchangeData, setExchangeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [firstCurrency, setFirstCurrency] = useState("EUR");
  const [secondCurrency, setSecondCurrency] = useState("GBP");

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${firstCurrency}&to=${secondCurrency}`
        );
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        console.log(data);

        setExchangeData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExchangeRate(); // Call the function
  }, [amount, firstCurrency, secondCurrency]); // Include firstCurrency and secondCurrency in the dependency array

  let total = exchangeData.rates ? exchangeData.rates[secondCurrency] : 0;

  if(firstCurrency === secondCurrency){
    total = amount
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          value={firstCurrency}
          onChange={(e) => setFirstCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
        <select
          value={secondCurrency}
          onChange={(e) => setSecondCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          exchangeData && (
            <div>
              <h1>
                {secondCurrency}: {total}
              </h1>
            </div>
          )
        )}
      </div>
    </div>
  );
}
