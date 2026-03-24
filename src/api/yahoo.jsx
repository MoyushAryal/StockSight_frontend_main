// fetchStockData.js
// Dummy/static data for UI design

// import axios from "axios"; // when real api using 

const API_KEY = "" // Empty for now, we'll use dummy data

// Example dummy data mimicking Yahoo Finance API response
const dummyData = {
  symbol: "AAPL",
  timeseries: {
    price: [
      { timestamp: 1677628800, close: 150.12, open: 148.50, high: 151.00, low: 147.80, volume: 12000000 },
      { timestamp: 1677715200, close: 152.30, open: 150.20, high: 153.00, low: 149.90, volume: 13000000 },
      { timestamp: 1677801600, close: 149.80, open: 152.50, high: 153.50, low: 148.70, volume: 14000000 },
    ]
  },
  news: [
    {
      title: "Apple Announces New Product Line",
      publisher: "TechCrunch",
      link: "https://techcrunch.com/apple-new-product",
      publishedDate: "2026-03-10"
    },
    {
      title: "Stock Market Update: AAPL Hits New High",
      publisher: "CNBC",
      link: "https://cnbc.com/apple-stock-update",
      publishedDate: "2026-03-09"
    },
    {
      title: "Analyst Predicts Growth for Apple in Q2",
      publisher: "Reuters",
      link: "https://reuters.com/apple-q2-growth",
      publishedDate: "2026-03-08"
    }
  ]
};

const fetchStockData = async (symbol) => {
  console.log("USING DUMMY DATA FOR:", symbol);
  return dummyData; // always return dummy data for UI
  /*
  // Real API call is commented out for now
  try {
    const response = await axios.get(
      `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-timeseries`,
      {
        params: { symbol: symbol, region: "US" },
        headers: {
          "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
          "x-rapidapi-key": API_KEY
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return dummyData; // fallback
  }
  */
};

export default fetchStockData;