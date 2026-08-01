import get_data from "./read_excel";
import Chart from 'chart.js/auto';

function get_values(arr:any,key:string)
{
  let res=[];
  for(let item of arr)
  {
    console.log(item);
    res.push(item[key as any]);
  }
  return res;
}
function get_min_and_max(arr:any,key:string)
{
  let res=[Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER];
  for(let item of arr)
  {
    res[0]=Math.min(res[0],item[key]);
    res[1]=Math.max(res[1],item[key]);
  }
  return res;
}
function graph_payment_data(filtered_career_data:any,appartment_data:any)
{
  if(chart_created)
  {
    payment_chart.destroy();
  }
  chart_created=true;

  let labels=get_values(filtered_career_data,'Occupation');
  let values=get_values(filtered_career_data,'2025 Recommended Appartment Payment');
  for(let i=0;i<values.length;i++)
  {
    values[i]=Math.round(values[i]);
  }
  console.log(labels);
  console.log(values);

  let line_plugins=[]
  for(let i=1;i<appartment_data.length;i++)
  {
    const appartment_type=appartment_data[i];
    const line_plugin = 
    {
        id: 'horizontalLine',
        afterDraw: (chart:any) => {
            const yValue = chart.scales.y.getPixelForValue(appartment_type['Monthly_Rent']);
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

  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: values,
      borderWidth: 1
    }]
  };

  y_range=get_min_and_max(filtered_career_data,"2025 Recommended Appartment Payment");
  y_range[1]=Math.max(y_range[1],appartment_data[appartment_data.length-1]['Monthly_Rent']);
  y_range[1]=Math.ceil(y_range[1]/1000)*1000;
  let payment_results_canvas=document.getElementById("payment_results_canvas") as HTMLCanvasElement;
  payment_chart=new Chart(
        payment_results_canvas,
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
                text: "2025 Recommended Appartment Payment"
              }
            }
          },
          plugins: line_plugins
        }
    );
}
export function update_values()
{
  const target_education_level_element=document.getElementById("education_level") as HTMLInputElement;
  const target_education_level=target_education_level_element.value;

  let filtered_career_data=[...career_data];
  filtered_career_data.sort((a,b)=>a['Largest_Employment_Rank']-b['Largest_Employment_Rank']);
  if(target_education_level!="*")
  {
    filtered_career_data=filtered_career_data.filter(career=>career["Education_Level"]==target_education_level)
  }
  filtered_career_data=filtered_career_data.slice(0,10);

  console.log(filtered_career_data);

  graph_payment_data(filtered_career_data,appartment_data);
}
export async function main()
{
  career_data=await get_data("CareerOneStop_Data.xlsx");
  for(let i=0;i<career_data.length;i++)
  {
    career_data[i]["2025 Median Wages Monthly"]=career_data[i]["2025 Median Wages Annual"]/12;
    career_data[i]["2025 Recommended Appartment Payment"]=career_data[i]["2025 Median Wages Monthly"]*0.28;
  }
  console.log(career_data);

  appartment_data=await get_data("New_Jersey_Expenses.xlsx","Appartments");
  console.log(appartment_data);

  update_values();
}

let career_data: Record<any, any>[]=[];
let appartment_data: Record<any, any>[]=[];

let y_range=[0,0];
let chart_created=false;
let payment_chart:Chart;