import pandas as pd

def calculate_education_level(row,education_level_df):
    for index,education_row in education_level_df.iterrows():
        if education_row["Education"]==row["Education"]:
            return education_row["Education_Level"]
    return "ERROR"

def main():
    education_level_df=pd.read_excel("Original_Data/EducationLevels.xlsx")

    largest_employment_df=pd.read_excel("Original_Data/CareerswithLargestEmploymentResults.xlsx",sheet_name="Data")
    largest_employment_df=largest_employment_df.rename(columns={"Rank":"Largest_Employment_Rank"})

    highest_paying_careers_df=pd.read_excel("Original_Data/HighestPayingCareersResults.xlsx",sheet_name="Data")
    highest_paying_careers_df=highest_paying_careers_df.rename(columns={"Rank":"Highest_Paying_Rank"})

    most_openings_df=pd.read_excel("Original_Data/CareerswithMostOpeningsResults.xlsx",sheet_name="Data")
    most_openings_df=most_openings_df.rename(columns={"Rank":"Most_Openings_Rank"})

    fastest_growing_df=pd.read_excel("Original_Data/FastestGrowingCareersResults.xlsx",sheet_name="Data")
    fastest_growing_df=fastest_growing_df.rename(columns={"Rank":"Fastest_Growing_Rank"})

    merged_df=largest_employment_df
    merged_df=pd.merge(merged_df,highest_paying_careers_df,on=["Occupation","Typical Education"])
    merged_df=pd.merge(merged_df,most_openings_df,on=["Occupation","Typical Education"])
    merged_df=pd.merge(merged_df,fastest_growing_df,on=["Occupation","Typical Education"])

    print(merged_df.columns)
    print(len(merged_df))
    merged_df=merged_df[['Largest_Employment_Rank', 'Occupation', '2022 Employment_x',
       'Earnings_x', 'Typical Education', 'Highest_Paying_Rank',
       '2025 Median Wages Hourly', '2025 Median Wages Annual',
       'Most_Openings_Rank',
       'Projected Annual Job Openings', 'Fastest_Growing_Rank',
       '2024 Employment', '2034 Employment', 'Percent Change', 'Earnings']]
    
    merged_df=merged_df.rename(columns={"Earnings_x":"Earnings",'2022 Employment_x':'2022 NJ Employment','Typical Education':'Education','2024 Employment':'2024 US Employment','2034 Employment':'2034 US Employment'})

    print(merged_df.columns)

    merged_df["Education_Level"]=merged_df.apply(calculate_education_level,axis=1,education_level_df=education_level_df)

    merged_df.to_excel("public/CareerOneStop_Data.xlsx",index=False,sheet_name="Data")


if __name__=="__main__":
    main()