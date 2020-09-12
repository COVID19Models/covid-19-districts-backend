#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Aug 13 17:50:57 2020

@author: samarth
"""


import pandas as pd
from matplotlib import pyplot as plt
import os
from datetime import datetime as dt
from datetime import timedelta
import matplotlib.dates as mdates
import numpy as np

projection_length = 67
final_date = dt(year = 2020, month = 8, day = 15)

plt.figure(figsize = (6,4), dpi=300)
districts_df = pd.read_csv("entry_data_test.csv", names = ['State', 'District', 'Population', 'Rows'])

size = len(districts_df)

for i in range(size):

    state      = districts_df.iloc[i]['State']
    district   = districts_df.iloc[i]['District']
    population = districts_df.iloc[i]['Population']

    dates_1 = pd.date_range(end   = final_date, periods=districts_df.iloc[i]['Rows'])
    dates_2 = pd.date_range(start =final_date+timedelta(days=1), periods=projection_length)
    
    dates_1 = [d.strftime('%d-%b') for d in dates_1]
    dates_2 = [d.strftime('%d-%b') for d in dates_2]
    
    df_1 = pd.DataFrame()
    df_1['Date'] = dates_1
    
    df_2 = pd.DataFrame()
    df_2['Date'] = dates_2
    
    dates_df = pd.concat([df_1, df_2])
    dates_df = dates_df.reset_index(drop=True)
    dates_df['new_index'] = dates_df.index
    start_index = (len(dates_df)-1)%40
    dates_df = dates_df[start_index::40]
    dates_df['new_Date'] = dates_df['Date']

    index_ticks = dates_df['new_index'].tolist()
    dates_ticks = dates_df['new_Date'].tolist()

    filename  = "./data/"+state+"/"+district+"_actual.csv"
    actual_df = pd.read_csv(filename)
    
    filename  = "./data/"+state+"/"+district+"_fit.csv"
    preds_df  = pd.read_csv(filename)
    
    filename  = "./data/"+state+"/"+district+"_projections.csv"
    projections_df = pd.read_csv(filename)
    projections_df = projections_df[:projection_length]
    
    size_1 = len(preds_df)
    size_2 = len(projections_df)
    #size_3 = len(latest_df)
    
    init_date = dt(2020, 4, 26)
    mid_date  = init_date + timedelta(days=size_1)
    end_date  = mid_date  + timedelta(days=size_2)
    
    #x     = [0, size_1, (size_1+size_2)]
    #ticks = [str(init_date.date()), str(mid_date.date()), str(end_date.date())]
    
    preds_df['IA_cumulative'] = 1 - (preds_df['Susceptible']/population)
    projections_df['IA_cumulative'] = 1 - (projections_df['Susceptible']/population)
        
    parent_folder = "./plots/"+state+"/"+district

    if not os.path.exists(parent_folder):
        os.makedirs(parent_folder)

    
    plt.scatter(range(0, size_1, 5), actual_df[::5]['Infected'], label = 'Actual', color = 'red')
    #plt.scatter(range(size_1, size_1+size_3), latest_df['Active_I'], color = 'red')
    plt.plot(range(size_1), preds_df['Infected'], label = 'Fit', color = 'blue')
    plt.plot(range(size_1, size_1+size_2), projections_df['Infected'], label = 'Projections', color = 'green', linestyle = '--')
    plt.xticks(index_ticks,dates_ticks)
    plt.title("Projections for active infections for "+district, fontsize = 10)
    plt.axvline(size_1, color = 'black', linestyle='--')
    plt.legend()
    plt.grid()
    filename = parent_folder+"/active_infs_projections.png"
    plt.savefig(filename, format='png')
    plt.clf()
    
    plt.scatter(range(0, size_1, 5), actual_df[::5]['Deceased'], label = 'Actual', color = 'red')
    #plt.scatter(range(size_1, size_1+size_3), latest_df['Deceased'], color = 'red')
    plt.plot(range(size_1), preds_df['Deceased'], label = 'Fit', color = 'blue')
    plt.plot(range(size_1, size_1+size_2), projections_df['Deceased'], label = 'Projections', color = 'green', linestyle = '--')
    plt.xticks(index_ticks,dates_ticks)
    plt.title("Projections for total Deceased for "+district, fontsize = 10)
    plt.axvline(size_1, color = 'black', linestyle='--')
    plt.legend()
    plt.grid()
    filename = parent_folder+"/deaths_projections.png"
    plt.savefig(filename, format='png')
    plt.clf()
    
    plt.scatter(range(0, size_1, 5), actual_df[::5]['Recovered'], label = 'Actual', color = 'red')
    #plt.scatter(range(size_1, size_1+size_3), latest_df['Recovered'], color = 'red')
    plt.plot(range(size_1), preds_df['Recovered'], label = 'Fit', color = 'blue')
    plt.plot(range(size_1, size_1+size_2), projections_df['Recovered'], label = 'Projections', color = 'green', linestyle = '--')
    plt.xticks(index_ticks,dates_ticks)
    plt.title("Projections for total Recovered for "+district, fontsize = 10)
    plt.axvline(size_1, color = 'black', linestyle='--')
    plt.legend()
    plt.grid()
    filename = parent_folder+"/recoveries_projections.png"
    plt.savefig(filename, format='png')
    plt.clf()
    
    plt.scatter(range(0, size_1, 5), actual_df[::5]['I_c'], label = 'Actual', color = 'red')
    #plt.scatter(range(size_1, size_1+size_3), latest_df['Confirmed'], color = 'red')
    plt.plot(range(size_1), preds_df['I_c'], label = 'Fit', color = 'blue')
    plt.plot(range(size_1, size_1+size_2), projections_df['I_c'], label = 'Projections', color = 'green', linestyle = '--')
    plt.xticks(index_ticks,dates_ticks)
    plt.title("Projections for cumulative infections for "+district, fontsize = 10)
    plt.axvline(size_1, color = 'black', linestyle='--')
    plt.legend()
    plt.grid()
    filename = parent_folder+"/cumulative_infs_projections.png"
    plt.savefig(filename, format='png')
    plt.clf()
    
    
    plt.plot(range(size_1), preds_df['IA_cumulative'], label = 'Past', color = 'blue')
    plt.plot(range(size_1, size_1+size_2), projections_df['IA_cumulative'], label = 'Projections', color = 'green', linestyle = '--')
    plt.xticks(index_ticks,dates_ticks)
    plt.title("I+A for "+district, fontsize = 10)
    plt.axvline(size_1, color = 'black', linestyle='--')
    plt.legend()
    plt.grid()
    filename = parent_folder+"/I+A.png"
    plt.savefig(filename, format='png')
    plt.clf()
    
    plt.plot(range(size_1), preds_df['Asymptomatic']/preds_df['Infected'], label = 'Past', color = 'blue')
    plt.plot(range(size_1, size_1+size_2), projections_df['Asymptomatic']/projections_df['Infected'], label = 'Projections', color = 'green', linestyle = '--')
    plt.xticks(index_ticks,dates_ticks)
    plt.title("I+A ratio for "+district, fontsize = 10)
    plt.axvline(size_1, color = 'black', linestyle='--')
    plt.legend()
    plt.grid()
    filename = parent_folder+"/ratio.png"
    plt.savefig(filename, format='png')
    plt.clf()