import get_data from "./read_excel";
import Chart from 'chart.js/auto';
import { make_bar_chart, make_line_chart } from "./make_chart";
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

function shorten_values(values:string[])
{
  let res=[];
  for(let value of values)
  {
    if(value.length>=18)
    {
      res.push(value.slice(0,15)+"...");
    }
    else
    {
      res.push(value);
    }
  }
  return res;
}
function graph_yearly_wages_data(filtered_career_data:any)
{
  if(yearly_wages_chart!=null)
  {
    yearly_wages_chart.destroy();
  }

  let labels=get_values(filtered_career_data,'Occupation') as string[];
  labels=shorten_values(labels);
  let values=get_values(filtered_career_data,'2025 Median Wages Annual');
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
  }

  let plugin_values=[];
  for(let i=0;i<apartment_data.length;i++)
  {
    const apartment_type=apartment_data[i];
    plugin_values.push(apartment_type['Monthly_Rent']*12/target_percent);
  }

  const data = {
    labels: labels,
    datasets: [{
      label: 'Annual Pay',
      data: values,
      borderWidth: 1
    }]
  };

  let yearly_wages_results_canvas=document.getElementById("yearly_wages_results_canvas") as HTMLCanvasElement;
  yearly_wages_chart=make_line_chart(yearly_wages_chart,yearly_wages_results_canvas,data,plugin_values,"2025 Median Annual Wages");
}
function graph_monthly_wages_data(filtered_career_data:any)
{
  if(monthly_wages_chart!=null)
  {
    monthly_wages_chart.destroy();
  }

  let labels=get_values(filtered_career_data,'Occupation') as string[];
  labels=shorten_values(labels);
  let values=get_values(filtered_career_data,'2025 Median Wages Monthly');
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
  }
  
  let plugin_values=[];
  for(let i=0;i<apartment_data.length;i++)
  {
    const apartment_type=apartment_data[i];
    plugin_values.push(apartment_type['Monthly_Rent']/target_percent);
  }

  const data = {
    labels: labels,
    datasets: [{
      label: 'Monthly Pay',
      data: values,
      borderWidth: 1
    }]
  };
  let monthly_wages_results_canvas=document.getElementById("monthly_wages_results_canvas") as HTMLCanvasElement;
  monthly_wages_chart=make_line_chart(monthly_wages_chart,monthly_wages_results_canvas,data,plugin_values,"2025 Median Monthly Wages");
}
function graph_apartment_payment_data(filtered_career_data:any)
{
  if(apartment_payment_chart!=null)
  {
    apartment_payment_chart.destroy();
  }

  let labels=get_values(filtered_career_data,'Occupation') as string[];
  labels=shorten_values(labels);
  let values=get_values(filtered_career_data,'2025 Recommended Apartment Payment');
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
  }

  let plugin_values=[];
  for(let i=0;i<apartment_data.length;i++)
  {
    const apartment_type=apartment_data[i];
    plugin_values.push(apartment_type['Monthly_Rent']);
  }

  const data = {
    labels: labels,
    datasets: [{
      label: `Apartment Payment (${target_percent_written})`,
      data: values,
      borderWidth: 1
    }]
  };

  let apartment_payment_results_canvas=document.getElementById("apartment_payment_results_canvas") as HTMLCanvasElement;
  apartment_payment_chart=make_line_chart(apartment_payment_chart,apartment_payment_results_canvas,data,plugin_values,`Apartment Payment (${target_percent_written})`);
}
function graph_monthly_rent_data()
{
  if(monthly_rent_chart!=null)
  {
    monthly_rent_chart.destroy();
  }

  let labels=get_values(apartment_data,'Type') as string[];
  labels=shorten_values(labels);
  let values=get_values(apartment_data,'Monthly_Rent');
  let values_recommended_monthly=values.map(value=>value/target_percent);
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
    values_recommended_monthly[i]=Math.round(values_recommended_monthly[i]);
  }

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
function graph_yearly_rent_data()
{
  if(yearly_rent_chart!=null)
  {
    yearly_rent_chart.destroy();
  }

  let labels=get_values(apartment_data,'Type') as string[];
  labels=shorten_values(labels);
  let values=get_values(apartment_data,'Monthly_Rent');
  values=values.map(value=>value*12);
  let values_recommended_yearly=values.map(value=>value/target_percent);

  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
    values_recommended_yearly[i]=Math.round(values_recommended_yearly[i]);
  }

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

export function update_values()
{
  const target_education_level_element=document.getElementById("education_level") as HTMLInputElement;
  const target_education_level=target_education_level_element.value;

  const target_percent_element=document.getElementById("target_percent") as HTMLInputElement;
  target_percent=parseInt(target_percent_element.value)/100.0;
  target_percent_written=target_percent_element.value+"%";
  document.getElementById("target_percent_display")!.innerHTML=`${target_percent_element.value}%`;

  let filtered_career_data=[...career_data];
  filtered_career_data.sort((a,b)=>a['Largest_Employment_Rank']-b['Largest_Employment_Rank']);
  if(target_education_level!="*")
  {
    filtered_career_data=filtered_career_data.filter(career=>career["Education_Level"]==target_education_level)
  }
  filtered_career_data=filtered_career_data.slice(0,10);

  graph_monthly_rent_data();
  graph_yearly_rent_data();
  graph_yearly_wages_data(filtered_career_data);
  graph_monthly_wages_data(filtered_career_data);
  graph_apartment_payment_data(filtered_career_data);
  
}
export async function main()
{
  career_data=await get_data("CareerOneStop_Data.xlsx");
  for(let i=0;i<career_data.length;i++)
  {
    career_data[i]["2025 Median Wages Monthly"]=career_data[i]["2025 Median Wages Annual"]/12;
    career_data[i]["2025 Recommended Apartment Payment"]=career_data[i]["2025 Median Wages Monthly"]*target_percent;
  }
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