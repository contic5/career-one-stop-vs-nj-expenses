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
function graph_data(filtered_career_data:any,appartment_data:any)
{
  let labels=get_values(filtered_career_data,'Occupation');
  let values=get_values(filtered_career_data,'2025 Median Wages Annual')

  console.log(labels);
  console.log(values);

  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: values,
      borderWidth: 1
    }]
  };

  let results_canvas=document.getElementById("results_canvas") as HTMLCanvasElement;
  new Chart(
            results_canvas,
            {
              type: 'line',
              data: data as any,
              options:{
              },
            }
        );
}
async function main()
{
  career_data=await get_data("CareerOneStop_Data.xlsx");
  console.log(career_data);

  appartment_data=await get_data("New_Jersey_Expenses.xlsx","Appartments");
  console.log(appartment_data);

  let filtered_career_data=[...career_data];
  filtered_career_data.sort((a,b)=>a['Largest_Employment_Rank']-b['Largest_Employment_Rank']);
  filtered_career_data=filtered_career_data.slice(0,10);

  console.log(filtered_career_data);

  graph_data(filtered_career_data,appartment_data);
}

let career_data=[];
let appartment_data=[];
main();