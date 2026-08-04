import get_data from "./read_excel";
import Chart from 'chart.js/auto';
import { make_bar_chart, make_line_chart } from "./make_chart";

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

//Graph yearly wages and draw lines for the recommended yearly wages for apartment rents. 
function graph_yearly_wages_data(filtered_career_data:any)
{
  if(yearly_wages_chart!=null)
  {
    yearly_wages_chart.destroy();
  }

  let labels=get_values(filtered_career_data,'Occupation') as string[];
  labels=shorten_values(labels);

  //Get annual wages and round them.
  let values=get_values(filtered_career_data,'2025 Median Wages Annual');
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
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
    labels: labels,
    datasets: [{
      label: 'Annual Pay',
      data: values,
      borderWidth: 1
    }]
  };

  let yearly_wages_results_canvas=document.getElementById("yearly_wages_results_canvas") as HTMLCanvasElement;
  yearly_wages_chart=make_line_chart(yearly_wages_chart,yearly_wages_results_canvas,data,rent_spending_values,"2025 Median Annual Wages");
}

//Graph monthly wages and draw lines for the recommended yearly wages for apartment rents. 
function graph_monthly_wages_data(filtered_career_data:any)
{
  if(monthly_wages_chart!=null)
  {
    monthly_wages_chart.destroy();
  }

  let labels=get_values(filtered_career_data,'Occupation') as string[];
  labels=shorten_values(labels);

  //Get monthly wages and round them.
  let values=get_values(filtered_career_data,'2025 Median Wages Monthly');
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
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
    labels: labels,
    datasets: [{
      label: 'Monthly Pay',
      data: values,
      borderWidth: 1
    }]
  };
  let monthly_wages_results_canvas=document.getElementById("monthly_wages_results_canvas") as HTMLCanvasElement;
  monthly_wages_chart=make_line_chart(monthly_wages_chart,monthly_wages_results_canvas,data,rent_spending_values,"2025 Median Monthly Wages");
}
function graph_apartment_payment_data(filtered_career_data:any)
{
  if(apartment_payment_chart!=null)
  {
    apartment_payment_chart.destroy();
  }

  let labels=get_values(filtered_career_data,'Occupation') as string[];
  labels=shorten_values(labels);

  //Find target_percent * monthly wages. Round the result.
  let values=get_values(filtered_career_data,'2025 Median Wages Monthly');
  for(let i=0;i<values.length;i++)
  {
    values[i]*=target_percent;
    values[i]=Math.round(values[i]);
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
    labels: labels,
    datasets: [{
      label: `Apartment Payment (${target_percent_written})`,
      data: values,
      borderWidth: 1
    }]
  };

  let apartment_payment_results_canvas=document.getElementById("apartment_payment_results_canvas") as HTMLCanvasElement;
  apartment_payment_chart=make_line_chart(apartment_payment_chart,apartment_payment_results_canvas,data,rent_spending_values,`Apartment Payment (${target_percent_written})`);
}

//Create bar charts for different types of monthly rent
function graph_monthly_rent_data()
{
  if(monthly_rent_chart!=null)
  {
    monthly_rent_chart.destroy();
  }

  let labels=get_values(apartment_data,'Type') as string[];
  labels=shorten_values(labels);

  //Get monthly rent
  let values=get_values(apartment_data,'Monthly_Rent');

  //Get the minimum monthly wages to spend at most target_percent on rent.
  let values_recommended_monthly=values.map(value=>value/target_percent);
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
    values_recommended_monthly[i]=Math.round(values_recommended_monthly[i]);
  }

  //Set up bar chart data
  const data = {
    labels: labels,
    datasets: [
    {
      label: `Apartment Monthly Rent Costs`,
      data: values,
      borderWidth: 1
    },
    {
      label: `Recommended Monthly Income`,
      data: values_recommended_monthly,
      borderWidth: 1
    },
    ]
  };

  let monthly_rent_results_canvas=document.getElementById("monthly_rent_results_canvas") as HTMLCanvasElement;
  monthly_rent_chart=make_bar_chart(monthly_rent_chart,monthly_rent_results_canvas,data,'Apartment Rent and Recommended Monthly Income');
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
  let values=get_values(apartment_data,'Monthly_Rent');
  values=values.map(value=>value*12);

  //Get the minimum yearly wages to spend at most target_percent on rent.
  let values_recommended_yearly=values.map(value=>value/target_percent);
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
    values_recommended_yearly[i]=Math.round(values_recommended_yearly[i]);
  }

  //Set up bar chart data
  const data = {
    labels: labels,
    datasets: [
    {
      label: `Apartment Yearly Rent Costs`,
      data: values,
      borderWidth: 1
    },
    {
      label: `Recommended Yearly Income`,
      data: values_recommended_yearly,
      borderWidth: 1
    },
    ]
  };


  let yearly_rent_results_canvas=document.getElementById("yearly_rent_results_canvas") as HTMLCanvasElement;
  yearly_rent_chart=make_bar_chart(yearly_wages_chart,yearly_rent_results_canvas,data,'Apartment Rent and Recommended Yearly Income');
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
  graph_yearly_wages_data(filtered_career_data);
  graph_monthly_wages_data(filtered_career_data);
  graph_apartment_payment_data(filtered_career_data);
  
}
export async function main()
{
  //Get career data
  career_data=await get_data("CareerOneStop_Data.xlsx");
  for(let i=0;i<career_data.length;i++)
  {
    //Divide monthly wages by 12
    career_data[i]["2025 Median Wages Monthly"]=career_data[i]["2025 Median Wages Annual"]/12;
  }
  //Get apartment cost data
  apartment_data=await get_data("New_Jersey_Expenses.xlsx","Apartments_V2");

  update_values();
}

let career_data: Record<any, any>[]=[];
let apartment_data: Record<any, any>[]=[];

let target_percent=0.30;
let target_percent_written="30%";

let yearly_wages_chart: Chart | null = null;
let monthly_wages_chart: Chart | null = null;
let apartment_payment_chart: Chart | null = null;
let monthly_rent_chart: Chart | null=null;
let yearly_rent_chart: Chart | null=null;