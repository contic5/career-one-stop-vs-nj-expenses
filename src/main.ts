import get_data from "./read_excel";
import Chart from 'chart.js/auto';

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
function make_chart(target_chart:Chart | null,target_canvas: HTMLCanvasElement,data:any,plugin_values:number[],chart_title:string)
{
  if (target_chart != null) {
    target_chart.destroy();
  }

  y_range[1]=0;
  for(let value of data.datasets[0].data)
  {
    console.log(value);
    y_range[1]=Math.max(y_range[1],parseInt(value));
  }
  let line_plugins=[];
  for(let plugin_value of plugin_values)
  {
    y_range[1]=Math.max(y_range[1],plugin_value);

    const line_plugin = 
      {
          id: 'horizontalLine',
          afterDraw: (chart:any) => {
              const yValue = chart.scales.y.getPixelForValue(plugin_value);
              const ctx = chart.ctx;
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(chart.chartArea.left, yValue);
              ctx.lineTo(chart.chartArea.right, yValue);
              ctx.strokeStyle = "black";
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.restore();
          }
    };
    line_plugins.push(line_plugin);
  }
  y_range[1]*=1.1;
  y_range[1]=Math.ceil(y_range[1]/1000)*1000;


  target_chart=new Chart(
        target_canvas,
        {
          type: 'line',
          data: data as any,
          options:
          {
            scales: 
            {
              y: {
                min: 0,
                max: y_range[1],
                ticks: 
                {
                  // Appends % symbol to the y-axis grid text
                  callback: function(value) 
                  {
                    return "$ "+value;
                  }
                }
              }
            },
            plugins:
            {
              title:{
                display: true,
                text: chart_title
              }
            }
          },
          plugins: line_plugins
        }
    );
    return target_chart;
}
function graph_yearly_data(filtered_career_data:any)
{
  if(yearly_chart!=null)
  {
    yearly_chart.destroy();
  }

  let labels=get_values(filtered_career_data,'Occupation') as string[];
  labels=shorten_values(labels);
  let values=get_values(filtered_career_data,'2025 Median Wages Annual');
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
  }

  let plugin_values=[];
  for(let i=1;i<appartment_data.length;i++)
  {
    const appartment_type=appartment_data[i];
    plugin_values.push(appartment_type['Monthly_Rent']*12/target_percent);
  }

  const data = {
    labels: labels,
    datasets: [{
      label: 'Annual Pay',
      data: values,
      borderWidth: 1
    }]
  };

  let yearly_results_canvas=document.getElementById("yearly_results_canvas") as HTMLCanvasElement;
  yearly_chart=make_chart(yearly_chart,yearly_results_canvas,data,plugin_values,"2025 Median Annual Wages");
}
function graph_monthly_data(filtered_career_data:any)
{
  if(monthly_chart!=null)
  {
    monthly_chart.destroy();
  }

  let labels=get_values(filtered_career_data,'Occupation') as string[];
  labels=shorten_values(labels);
  let values=get_values(filtered_career_data,'2025 Median Wages Monthly');
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
  }
  
  let plugin_values=[];
  for(let i=1;i<appartment_data.length;i++)
  {
    const appartment_type=appartment_data[i];
    plugin_values.push(appartment_type['Monthly_Rent']/target_percent);
  }

  const data = {
    labels: labels,
    datasets: [{
      label: 'Monthly Pay',
      data: values,
      borderWidth: 1
    }]
  };
  let monthly_results_canvas=document.getElementById("monthly_results_canvas") as HTMLCanvasElement;
  
  monthly_chart=make_chart(monthly_chart,monthly_results_canvas,data,plugin_values,"2025 Median Monthly Wages");
}
function graph_appartment_payment_data(filtered_career_data:any)
{
  if(payment_chart!=null)
  {
    payment_chart.destroy();
  }

  let labels=get_values(filtered_career_data,'Occupation') as string[];
  labels=shorten_values(labels);
  let values=get_values(filtered_career_data,'2025 Recommended Appartment Payment');
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
  }

  let plugin_values=[];
  for(let i=1;i<appartment_data.length;i++)
  {
    const appartment_type=appartment_data[i];
    plugin_values.push(appartment_type['Monthly_Rent']);
  }

  const data = {
    labels: labels,
    datasets: [{
      label: `Appartment Payment (${target_percent_written})`,
      data: values,
      borderWidth: 1
    }]
  };

  let payment_results_canvas=document.getElementById("payment_results_canvas") as HTMLCanvasElement;
  payment_chart=make_chart(payment_chart,payment_results_canvas,data,plugin_values,`Appartment Payment (${target_percent_written})`);
}
function graph_rent_data()
{
  if(rent_chart!=null)
  {
    rent_chart.destroy();
  }

  let labels=get_values(appartment_data,'Type') as string[];
  labels=shorten_values(labels);
  let values=get_values(appartment_data,'Monthly_Rent');
  let values_recommended_monthly=values.map(value=>value/target_percent);
  let values_recommended_yearly=values.map(value=>12*value/target_percent);
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
    values_recommended_monthly[i]=Math.round(values_recommended_monthly[i]);
    values_recommended_yearly[i]=Math.round(values_recommended_yearly[i]);
  }

  const data = {
    labels: labels,
    datasets: [
    {
      label: `Appartment Monthly Rent Costs`,
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

  y_range[1]=values_recommended_monthly[values_recommended_monthly.length-1];
  y_range[1]*=1.1;
  y_range[1]=Math.ceil(y_range[1]/1000)*1000;

  let rent_results_canvas=document.getElementById("rent_results_canvas") as HTMLCanvasElement;
  rent_chart=new Chart(
        rent_results_canvas,
        {
          type: 'bar',
          data: data as any,
          options:
          {
            scales: 
            {
              y: {
                min: 0,
                max: y_range[1],
                ticks: 
                {
                  // Appends % symbol to the y-axis grid text
                  callback: function(value) 
                  {
                    return "$ "+value;
                  }
                }
              }
            },
            plugins:
            {
              title:{
                display: true,
                text: `Appartment Rent and Recommended Monthly Income`
              }
            }
          },
        }
    );
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

  graph_yearly_data(filtered_career_data);
  graph_monthly_data(filtered_career_data);
  graph_appartment_payment_data(filtered_career_data);
  graph_rent_data();
}
export async function main()
{
  career_data=await get_data("CareerOneStop_Data.xlsx");
  for(let i=0;i<career_data.length;i++)
  {
    career_data[i]["2025 Median Wages Monthly"]=career_data[i]["2025 Median Wages Annual"]/12;
    career_data[i]["2025 Recommended Appartment Payment"]=career_data[i]["2025 Median Wages Monthly"]*target_percent;
  }
  appartment_data=await get_data("New_Jersey_Expenses.xlsx","Appartments");

  update_values();
}

let career_data: Record<any, any>[]=[];
let appartment_data: Record<any, any>[]=[];

let target_percent=0.30;
let target_percent_written="30%";

let y_range=[0,0];
let yearly_chart: Chart | null = null;
let monthly_chart: Chart | null = null;
let payment_chart: Chart | null = null;
let rent_chart: Chart | null=null;