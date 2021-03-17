// Endpoint for data
var apiKey = "wJwp9NFb-QWNy3d1f9_w";
// var ticker = "AAPL"
// var value = 1000;
var start_date = '2005-01-01'
var gold_url = `https://www.quandl.com/api/v3/datasets/LBMA/GOLD/data.json?api_key=wJwp9NFb-QWNy3d1f9_w&column_index=2&start_date=${start_date}&order=asc`

var ferd_url = `https://www.quandl.com/api/v3/datasets/FED/RIFSPFF_N_D.json?api_key=KqktrbxvFdVxc81KAHb6&order=asc`
var BTC_url = `https://www.quandl.com/data.json?api_key=wJwp9NFb-QWNy3d1f9_w/CUR/CAD&order=asc`
var app_gold = "/gold_returns"
var app_ticker = "/ticker_returns"
// Initialise the web page with county1 and county 2 default comparisons
function Initialize() {
  var value = 1000;
  var ticker = "AAPL"
  var inv_startdate = `2018-10-19`
  var  inv_enddate = `2020-02-05`
  prices(ticker)
  //gold(ticker, inv_startdate, inv_enddate, value)
  decline(ticker, inv_startdate, inv_enddate, value)
  volatility(ticker)
  //console.log(`Initialise is running`)
};
Initialize();


function prices(ticker){
  var ticker_url = `https://www.quandl.com/api/v3/datasets/EOD/${ticker}/data.json?api_key=wJwp9NFb-QWNy3d1f9_w&column_index=2&start_date=${start_date}&order=asc`
  d3.json(gold_url).then(function (data_gold) {

    /*===============================
           GOLD 
     ===============================*/

    // Grab values from the data json object to build the plots
    var name = `London Bullion Market Association <hl> Closing Gold Price `;
    var stock = 'Closing Gold Price';
    var startDate = data_gold.dataset_data.start_date;
    var endDate = data_gold.dataset_data.end_date;
    var dates = data_gold.dataset_data.data.map(d => d[0]);
    var closingPrices_gold = data_gold.dataset_data.data.map(d => d[1]);

    /*===============================
          STOCK CHOICE
    ===============================*/

    d3.json(ticker_url).then(function (data_ticker) {

      var dates_ticker = data_ticker.dataset_data.data.map(d => d[0]);
      var closingPrices_ticker = data_ticker.dataset_data.data.map(d => d[1]);

      /*========Share price plot id=share_price =======STARTS*/
      var selectorOptions = {
        buttons: [{
          step: 'month',
          stepmode: 'backward',
          count: 1,
          label: '1m'
        }, {
          step: 'month',
          stepmode: 'backward',
          count: 6,
          label: '6m'
        }, {
          step: 'year',
          stepmode: 'todate',
          count: 1,
          label: 'YTD'
        }, {
          step: 'year',
          stepmode: 'backward',
          count: 1,
          label: '1y'
        }, {
          step: 'year',
          stepmode: 'backward',
          count: 5,
          label: '5y'
        }, {
          step: 'all',
        }],
        y: 1.1,
      };

      var trace1 = {
        type: "scatter",
        mode: "lines",
        name: `Gold`,
        x: dates,
        y: closingPrices_gold,
        line: {
          color: "#17BECF"
        }

      };

      var trace2 = {
        type: "scatter",
        mode: "lines",
        name: `${ticker}`,
        yaxis: 'y2',
        x: dates_ticker,
        y: closingPrices_ticker,
        line: {
          color: "black"
        }
      };

      var data = [trace1, trace2];

      var duallayout = {
      
        xaxis: {
          rangeselector: selectorOptions,
          rangeslider: {},
          tickfont: {
            size: 10,
            color: '#7f7f7f'
          }
        },
        yaxis: {
          title: {text: 'Gold Price/Ounce',
          font: {
            size: 10,
            color: '#7f7f7f'}},
          ixedrange: true,
          tickfont: {
            size: 10,
            color: '#7f7f7f'
          }
        },
        yaxis2: {
          title: {text: `${ticker} Share Price`,
          font: {
            size: 10,
            color: '#7f7f7f'}},
          overlaying: 'y',
          side: 'right',
          tickfont: {
            size: 10,
            color: '#7f7f7f'
          }
        },
        showlegend: true,
	      legend: {"orientation": "h",
        x: 0.15,
        xanchor: 'bottom',
        y: 1.1,}
        

      };

      Plotly.newPlot("prices_plot", data, duallayout);
    });
  });

};

//==========TRACK YOUR INVESTMENT========================
function decline(ticker, inv_startdate, inv_enddate, value){
  var ticker_url = `https://www.quandl.com/api/v3/datasets/EOD/${ticker}/data.json?api_key=wJwp9NFb-QWNy3d1f9_w&column_index=2&start_date=${inv_startdate}&end_date=${inv_enddate}&order=asc`
  var gold_url = `https://www.quandl.com/api/v3/datasets/LBMA/GOLD/data.json?api_key=wJwp9NFb-QWNy3d1f9_w&column_index=2&start_date=${inv_startdate}&end_date=${inv_enddate}&order=asc`
  d3.json(gold_url).then(function (data_gold) {
    d3.json(ticker_url).then(function (data_ticker) {
     
      var dates = data_gold.dataset_data.data.map(d => d[0]);
      var closingPrices_gold = data_gold.dataset_data.data.map(d => d[1]);

      var dates_ticker = data_ticker.dataset_data.data.map(d => d[0]);
      var closingPrices_ticker = data_ticker.dataset_data.data.map(d => d[1]);

      //=====Investment values=====
      var gold_qty = value / closingPrices_gold[0]
      var ticker_qty = value / closingPrices_ticker[0]


      var gold_inv = closingPrices_gold.map(d => d * gold_qty)
      var ticker_inv = closingPrices_ticker.map(d => d * ticker_qty)

       /*========Share price plot id=share_price =======STARTS*/
       var selectorOptions = {
        buttons: [{
          step: 'month',
          stepmode: 'backward',
          count: 1,
          label: '1m'
        }, {
          step: 'month',
          stepmode: 'backward',
          count: 6,
          label: '6m'
        }, {
          step: 'year',
          stepmode: 'todate',
          count: 1,
          label: 'YTD'
        }, {
          step: 'year',
          stepmode: 'backward',
          count: 1,
          label: '1y'
        }, {
          step: 'year',
          stepmode: 'backward',
          count: 5,
          label: '5y'
        }, {
          step: 'all',
        }],
        y: 1.1,
       };

      var trace1 = {
        type: "scatter",
        mode: "lines",
        name: `Gold`,
        x: dates,
        y: gold_inv,
        line: {
          color: "#17BECF"
        }

      };

      var trace2 = {
        type: "scatter",
        mode: "lines",
        name: `${ticker}`,
        
        x: dates_ticker,
        y: ticker_inv,
        line: {
          color: "black"
        }
      };

      var data = [trace1, trace2];

      var layout = {
      
        xaxis: {
          rangeselector: selectorOptions,
          rangeslider: {},
          tickfont: {
            size: 10,
            color: '#7f7f7f'
          }
        },
        yaxis: {
          title: {text: 'Gold Investment',
          font: {
            size: 10,
            color: '#7f7f7f'}},
          ixedrange: true,
          tickfont: {
            size: 10,
            color: '#7f7f7f'
          }
        },
        yaxis2: {
          title: {text: `${ticker} Investment`,
          font: {
            size: 10,
            color: '#7f7f7f'}},
          
          
        },
        showlegend: true,
	      legend: {"orientation": "h",
        x: 0.15,
       
        y: 1.1,}
        

      };

      Plotly.newPlot("investment_plot", data, layout);
    });
  });
}


//=============================

function volatility(ticker){
       /*========Box plot id=box_plot =======STARTS*/
       d3.json(app_gold).then(function (app_gold_data) {

        d3.json(app_ticker).then(function (app_ticker_data) {

          var app_gold_dates = app_gold_data.map(d => d.Date)
          var app_gold_Returns = app_gold_data.map(d => d.Returns)

          var app_ticker_dates = app_ticker_data.map(d => d.Date)
          var app_ticker_Returns = app_ticker_data.map(d => d.Returns)

          // console.log(app_gold_Returns)
          // console.log(app_ticker_Returns)

          var xData = ['Gold Returns (%)', `${ticker} Returns %`];


          var yData = [
            app_gold_Returns,
            app_ticker_Returns
          ];
          var colors = ['rgba(44, 160, 101, 0.5)', 'rgba(255, 144, 14, 0.5)'];

          var data2 = [];

          for (var i = 0; i < xData.length; i++) {
            var result = {
              type: 'box',
              y: yData[i],
              name: xData[i],
              boxpoints: 'all',
              jitter: 2,
              // whiskerwidth: 0.2,
              // fillcolor: 'cls',
              marker: {
                size: 2
              },
              // line: {
              //     width: 0.5
              // }
            };
            data2.push(result);
          };

          layout2 = {
            
            yaxis: {
              autorange: true,
              showgrid: true,
              zeroline: true,
              dtick: 2,
              gridcolor: '#7f7f7f',
              gridwidth: 5,
              zerolinecolor: '#7f7f7f',
              zerolinewidth: 2,
              tickfont: {
                size: 10,
                color: '#7f7f7f'
              },
              

            },

            xaxis: {
             
              tickfont: {
                size: 10,
                color: '#7f7f7f'
              }
              
            },
            margin: {
              l: 40,
              r: 30,
              b: 80,
              t: 100
            },
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            
            showlegend: true,
            legend: {"orientation": "h",
            x: 0.15,
            y: 1.1,}
          };

         
          Plotly.newPlot('box_plot', data2, layout2);



        });
      });


      /*========Box plot id=box_plot =======ENDS*/
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
 

  
  prices(ticker)
  decline(ticker, String(startdate), String(enddate), amount)


  console.log(`ProcessSubmit is running`)




}

document.getElementById('submit').addEventListener('click', processSubmit);

/*=================================================================
           ON CHANGE PROCESSING ---- ENDS
 ===================================================================*/


/* STRESS TEST*/









