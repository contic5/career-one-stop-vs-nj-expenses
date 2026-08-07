import get_data from "./read_excel";
import Chart from 'chart.js/auto';
import { make_rent_chart, make_income_chart } from "./make_chart";

//Get all values of specific key in dictionary array
function get_values(arr:any,key:string)
{
  let res=[];
  for(let item of arr)
  {
    res.push(item[key as any]);
  }
  return res;
}
/*
function get_min_and_max_dictionary(arr:any,key:string)
{
  let res=[Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER];
  for(let item of arr)
  {
    res[0]=Math.min(res[0],item[key]);
    res[1]=Math.max(res[1],item[key]);
  }
  return res;
}
*/

//Shorten values so they take up less space when printed out
function shorten_values(values:string[],max_length=18)
{
  let res=[];
  for(let value of values)
  {
    if(value.length>=max_length)
    {
      res.push(value.slice(0,max_length-3)+"...");
    }
    else
    {
      res.push(value);
    }
  }
  return res;
}

//Graph yearly incomes and draw lines for the recommended yearly incomes for apartment rents. 
function graph_yearly_incomes_data(filtered_career_data:any)
{
  if(yearly_incomes_chart!=null)
  {
    yearly_incomes_chart.destroy();
  }

  let occupatons=get_values(filtered_career_data,'Occupation') as string[];
  occupatons=shorten_values(occupatons);

  //Get annual incomes and round them.
  let annual_incomes=get_values(filtered_career_data,'2025 Median Incomes Annual');
  for(let i=0;i<annual_incomes.length;i++)
  {
    annual_incomes[i]=Math.round(annual_incomes[i]);
  }

  //Find how much money someone needs to make yearly to spend at most target percent on rent.
  let rent_spending_values=[];
  for(let i=0;i<apartment_data.length;i++)
  {
    const apartment_type=apartment_data[i];
    rent_spending_values.push(apartment_type['Monthly_Rent']*12/target_percent);
  }

  //Set up chart data
  const data = {
    labels: occupatons,
    datasets: [{
      label: 'Annual Income',
      data: annual_incomes,
      borderWidth: 1
    }]
  };

  let yearly_incomes_results_canvas=document.getElementById("yearly_incomes_results_canvas") as HTMLCanvasElement;
  yearly_incomes_chart=make_income_chart(yearly_incomes_chart,yearly_incomes_results_canvas,data,rent_spending_values,appartment_types,"2025 Median Annual Incomes");
}

//Graph monthly incomes and draw lines for the recommended yearly incomes for apartment rents. 
function graph_monthly_incomes_data(filtered_career_data:any)
{
  if(monthly_incomes_chart!=null)
  {
    monthly_incomes_chart.destroy();
  }

  let occupatons=get_values(filtered_career_data,'Occupation') as string[];
  occupatons=shorten_values(occupatons);

  //Get monthly incomes and round them.
  let monthly_incomes=get_values(filtered_career_data,'2025 Median Incomes Monthly');
  for(let i=0;i<monthly_incomes.length;i++)
  {
    monthly_incomes[i]=Math.round(monthly_incomes[i]);
  }

  //Find how much money someone needs to make monthly to spend at most target percent on rent.
  let rent_spending_values=[];
  for(let i=0;i<apartment_data.length;i++)
  {
    const apartment_type=apartment_data[i];
    rent_spending_values.push(apartment_type['Monthly_Rent']/target_percent);
  }

  //Set up chart data
  const data = {
    labels: occupatons,
    datasets: [{
      label: 'Monthly Income',
      data: monthly_incomes,
      borderWidth: 1
    }]
  };
  let monthly_incomes_results_canvas=document.getElementById("monthly_incomes_results_canvas") as HTMLCanvasElement;
  monthly_incomes_chart=make_income_chart(monthly_incomes_chart,monthly_incomes_results_canvas,data,rent_spending_values,appartment_types,"2025 Median Monthly Incomes");
}
function graph_apartment_payment_data(filtered_career_data:any)
{
  if(apartment_payment_chart!=null)
  {
    apartment_payment_chart.destroy();
  }

  let occupatons=get_values(filtered_career_data,'Occupation') as string[];
  occupatons=shorten_values(occupatons);

  //Find target_percent * monthly incomes. Round the result.
  let appartment_payments=get_values(filtered_career_data,'2025 Median Incomes Monthly');
  for(let i=0;i<appartment_payments.length;i++)
  {
    appartment_payments[i]*=target_percent;
    appartment_payments[i]=Math.round(appartment_payments[i]);
  }

  //Find monthly rent amounts for different apartment types.
  let rent_spending_values=[];
  for(let i=0;i<apartment_data.length;i++)
  {
    const apartment_type=apartment_data[i];
    rent_spending_values.push(apartment_type['Monthly_Rent']);
  }

  //Set up chart data
  const data = {
    labels: occupatons,
    datasets: [{
      label: `Apartment Payment (${target_percent_written})`,
      data: appartment_payments,
      borderWidth: 1
    }]
  };

  let apartment_payment_results_canvas=document.getElementById("apartment_payment_results_canvas") as HTMLCanvasElement;
  apartment_payment_chart=make_income_chart(apartment_payment_chart,apartment_payment_results_canvas,data,rent_spending_values,appartment_types,`Apartment Payment (${target_percent_written})`);
}

//Create bar charts for different types of monthly rent
function graph_monthly_rent_data()
{
  if(monthly_rent_chart!=null)
  {
    monthly_rent_chart.destroy();
  }

  let long_labels=get_values(apartment_data,'Type') as string[];
  let labels=shorten_values(long_labels);

  //Get monthly rent
  let monthly_rents=get_values(apartment_data,'Monthly_Rent');

  //Get the minimum monthly incomes to spend at most target_percent on rent.
  let recommended_monthly_incomes=monthly_rents.map(monthly_rent=>monthly_rent/target_percent);
  for(let i=0;i<monthly_rents.length;i++)
  {
    monthly_rents[i]=Math.round(monthly_rents[i]);
    recommended_monthly_incomes[i]=Math.round(recommended_monthly_incomes[i]);
  }

  //Set up bar chart data
  const data = {
    labels: labels,
    datasets: [
    {
      label: `Apartment Monthly Rent Costs`,
      data: monthly_rents,
      borderWidth: 1
    },
    {
      label: `Recommended Monthly Income`,
      data: recommended_monthly_incomes,
      borderWidth: 1
    },
    ]
  };

  let monthly_rent_results_canvas=document.getElementById("monthly_rent_results_canvas") as HTMLCanvasElement;
  monthly_rent_chart=make_rent_chart(monthly_rent_chart,monthly_rent_results_canvas,data,'Apartment Rent and Recommended Monthly Income');
}

//Create bar charts for different types of yearly rent
function graph_yearly_rent_data()
{
  if(yearly_rent_chart!=null)
  {
    yearly_rent_chart.destroy();
  }

  let labels=get_values(apartment_data,'Type') as string[];
  labels=shorten_values(labels);

  //Get the monthly rent and multiply by 12 to get the yearly rent
  let yearly_rents=get_values(apartment_data,'Monthly_Rent');
  yearly_rents=yearly_rents.map(monthly_rent=>monthly_rent*12);

  //Get the minimum yearly income to spend at most target_percent on rent.
  let recommended_yearly_incomes=yearly_rents.map(yearly_rent=>yearly_rent/target_percent);
  for(let i=0;i<yearly_rents.length;i++)
  {
    yearly_rents[i]=Math.round(yearly_rents[i]);
    recommended_yearly_incomes[i]=Math.round(recommended_yearly_incomes[i]);
  }

  //Set up bar chart data
  const data = {
    labels: labels,
    datasets: [
    {
      label: `Apartment Yearly Rent Costs`,
      data: yearly_rents,
      borderWidth: 1
    },
    {
      label: `Recommended Yearly Income`,
      data: recommended_yearly_incomes,
      borderWidth: 1
    },
    ]
  };

  let yearly_rent_results_canvas=document.getElementById("yearly_rent_results_canvas") as HTMLCanvasElement;
  yearly_rent_chart=make_rent_chart(yearly_incomes_chart,yearly_rent_results_canvas,data,'Apartment Rent and Recommended Yearly Income');
}

//Get updated input values
export function update_values()
{
  const target_education_level_element=document.getElementById("education_level") as HTMLInputElement;
  const target_education_level=target_education_level_element.value;

  const target_percent_element=document.getElementById("target_percent") as HTMLInputElement;
  //Convert target_percent from number to decimal
  target_percent=parseInt(target_percent_element.value)/100.0;
  target_percent_written=target_percent_element.value+"%";
  document.getElementById("target_percent_display")!.innerHTML=`${target_percent_element.value}%`;

  let filtered_career_data=[...career_data];
  //Sort jobs by most employment
  filtered_career_data.sort((a,b)=>a['Largest_Employment_Rank']-b['Largest_Employment_Rank']);

  //Filter by education level unless we are getting all education levels
  if(target_education_level!="*")
  {
    filtered_career_data=filtered_career_data.filter(career=>career["Education_Level"]==target_education_level)
  }

  /*
  Get the top 10 jobs
  TODO: Add page system that lets people select more jobs
  */
  filtered_career_data=filtered_career_data.slice(0,10);

  graph_monthly_rent_data();
  graph_yearly_rent_data();
  graph_yearly_incomes_data(filtered_career_data);
  graph_monthly_incomes_data(filtered_career_data);
  graph_apartment_payment_data(filtered_career_data);
  
}
export async function main()
{
  //Get career data
  career_data=await get_data("CareerOneStop_Data.xlsx");
  for(let i=0;i<career_data.length;i++)
  {
    //Divide monthly incomes by 12
    career_data[i]["2025 Median Incomes Monthly"]=career_data[i]["2025 Median Incomes Annual"]/12;
  }
  //Get apartment cost data
  apartment_data=await get_data("New_Jersey_Expenses.xlsx","Apartments_V2");
  appartment_types=get_values(apartment_data,"Type");

  update_values();
}

let career_data: Record<any, any>[]=[];
let apartment_data: Record<any, any>[]=[];
let appartment_types:string[]=[];

let target_percent=0.30;
let target_percent_written="30%";

let yearly_incomes_chart: Chart | null = null;
let monthly_incomes_chart: Chart | null = null;
let apartment_payment_chart: Chart | null = null;
let monthly_rent_chart: Chart | null=null;
let yearly_rent_chart: Chart | null=null;