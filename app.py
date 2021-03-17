import json
from flask import Flask, render_template, jsonify
import pandas as pd
import os
import requests
import datetime
# import geopandas as gpd
import re
# SQL Alchemy
from sqlalchemy import create_engine
# PyMySQL 
import pymysql
pymysql.install_as_MySQLdb()
# Config variables
from config import remote_db_endpoint, remote_db_port
from config import remote_db_name, remote_db_user, remote_db_pwd

#======MEAKIN STARTS=======
import quandl
from config import API_key
#=====MEAKIN ENDS==========
from config import api_key
# %%
# Cloud MySQL Database Connection on AWS
pymysql.install_as_MySQLdb()
cloud_engine = create_engine(f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}:{remote_db_port}/{remote_db_name}")
# Create a remote database engine connection
cloud_conn = cloud_engine.connect()
# %%
app = Flask(__name__)

@app.route("/")
def index():

    # use render_template to serve up the index.html
    return render_template('index.html')

# =========== VERA STARTS =========
@app.route("/tickerlist")
def tickerlist(): 
    
    cwd = os.getcwd()
    
    tickerlist = pd.read_csv("static/data/tickerlist_industries.csv")
    tickerlist_json = tickerlist.to_json(orient='records')   #orient='columns'
    
    return tickerlist_json

    #=======MEAKIN STARTS==========

@app.route("/ticker_returns")
def ticker_returns():
    quandl.ApiConfig.api_key = API_key
    start_date = '2008-01-01'
    EOD = quandl.get('EOD/AAPL', start_date = start_date).reset_index()
    EOD['Returns'] =EOD['Close'].pct_change(1)
    EOD["Cum_returns"] = (EOD['Returns']+1).cumprod()
    EOD.head()

    EOD =EOD[['Date','Open', 'High', 'Low', 'Returns', 'Cum_returns']]
    EOD['Date'] = EOD['Date'].dt.strftime('%Y-%m-%d')

    data_data = EOD.to_json(orient="records")
    
    return data_data   

@app.route("/gold_returns")
def gold_returns():
    quandl.ApiConfig.api_key = API_key
    start_date = '2008-01-01'
    gold = quandl.get('LBMA/GOLD', start_date='2008-01-01').reset_index()
    
    gold['Returns'] =gold['USD (PM)'].pct_change(1)
    gold["Cum_returns"] = (gold['Returns']+1).cumprod()
   
    gold =gold[['Date','USD (AM)','USD (PM)', 'Returns', 'Cum_returns']]
    gold['Date'] = gold['Date'].dt.strftime('%Y-%m-%d')
   
    data_data= gold.to_json(orient="records") 

    return data_data 

    #=======MEAKIN ENDS============
   


if __name__ == "__main__":
    app.run(debug=True)