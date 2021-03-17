/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */

function Initialize() {
  var value = 1000;
  var ticker = "AAPL"
  var inv_startdate = `2018-10-19`
  var  inv_enddate = `2020-02-05`
  
  
  buildPlot(ticker, inv_startdate, inv_enddate, value)
 
  //console.log(`Initialise is running`)
};
Initialize();

function buildPlot(ticker, inv_startdate, inv_enddate, value) {
  var apiKey = "wJwp9NFb-QWNy3d1f9_w";

  var ticker_url = `https://www.quandl.com/api/v3/datasets/EOD/${ticker}/data.json?api_key=wJwp9NFb-QWNy3d1f9_w&start_date=${inv_startdate}&end_date=${inv_enddate}&order=asc`
  var gold_url = `https://www.quandl.com/api/v3/datasets/LBMA/GOLD/data.json?api_key=wJwp9NFb-QWNy3d1f9_w&column_index=2&start_date=${inv_startdate}&end_date=${inv_enddate}&order=asc`
  d3.json(ticker_url).then(function(data_ticker) {

    // column_names: [
    //  0 "Date",
    //  1 "Open",
    //  2 "High",
    //  3 "Low",
    //  4 "Close",
    //  5 "Volume",
    //  6 "Dividend",
    //  7 "Split",
    //  8 "Adj_Open",
    //  9 "Adj_High",
    //  10 "Adj_Low",
    //  11 "Adj_Close",
    //  12 "Adj_Volume"
    //   ],


    // Grab values from the response json object to build the plots
    // var name = data.dataset.name;
    // var stock = data.dataset.dataset_code;
    // var startDate = data.dataset.start_date;
    // var endDate = data.dataset.end_date;
    // var dates = unpack(data.dataset.data, 0);
    // var openingPrices = unpack(data.dataset.data, 1);
    // var highPrices = unpack(data.dataset.data, 2);
    // var lowPrices = unpack(data.dataset.data, 3);
    // var closingPrices = unpack(data.dataset.data, 4);


    //var dates = data_gold.dataset_data.data.map(d => d[0]);
    //var closingPrices_gold = data_gold.dataset_data.data.map(d => d[1]);

    var dates_ticker = data_ticker.dataset_data.data.map(d => d[0]);
    var closingPrices_ticker = data_ticker.dataset_data.data.map(d => d[4]);
    var highPrices_ticker = data_ticker.dataset_data.data.map(d => d[2]);;
    var lowPrices_ticker = data_ticker.dataset_data.data.map(d => d[3]);;
    var openingPrices_ticker = data_ticker.dataset_data.data.map(d => d[1]);;
   

    //=====Investment values=====
    //var gold_qty = value / closingPrices_gold[0]
    //var ticker_qty = value / closingPrices_ticker[0]


   // var gold_inv = closingPrices_gold.map(d => d * gold_qty)
   // var ticker_inv = closingPrices_ticker.map(d => d * ticker_qty)

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: `${ticker} volatility`,
      x: dates_ticker,
      y: closingPrices_ticker,
      line: {
        color: "#17BECF"
      }
    };

    // Candlestick Trace
    var trace2 = {
      type: "candlestick",
      x: dates_ticker,
      name: 'Gain/Loss',
      high: highPrices_ticker,
      low: lowPrices_ticker,
      open: openingPrices_ticker,
      close: closingPrices_ticker
    };

    var data = [trace1, trace2];

    var layout = {
      //title: `${ticker} closing prices`,
      xaxis: {
        range: [inv_startdate, inv_enddate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: true,
      legend: {"orientation": "h",
      x: 0.15,
      y: 1.2,}
    };

    Plotly.newPlot("candle_plot", data, layout);
  });
}

/*=================================================================
          ON CHANGE PROCESSING
===================================================================*/
function processSubmit() {
  // console.log('test');

  ticker = document.getElementsByClassName('token-input-token')[0].innerText.replace('×', '').replace('\n', '').trim();
  daterange = document.getElementsByClassName('drp-selected')[0].innerText.split(" - ")
  start_split_date = daterange[0].split("/")
  startdate = `${start_split_date[2]}-${start_split_date[0]}-${start_split_date[1]}`

  end_split_date = daterange[1].split("/")
  enddate = `${end_split_date[2]}-${end_split_date[0]}-${end_split_date[1]}`

  amount = document.getElementById('val-number').value
 

  
  buildPlot(ticker, String(startdate), String(enddate), amount)


  console.log(`ProcessSubmit is running`)




}

document.getElementById('submit').addEventListener('click', processSubmit);

/*=================================================================
           ON CHANGE PROCESSING ---- ENDS
 ===================================================================*/


