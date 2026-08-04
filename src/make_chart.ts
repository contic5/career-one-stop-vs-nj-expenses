import Chart from 'chart.js/auto';

export function make_line_chart(target_chart:Chart | null,target_canvas: HTMLCanvasElement,data:any,rent_spending_values:number[],chart_title:string)
{
  if (target_chart != null) {
    target_chart.destroy();
  }

  let max_val=0;
  //Loop through dataset points. Track highest point on graph.
  for(let value of data.datasets[0].data)
  {
    max_val=Math.max(max_val,parseInt(value));
  }

  let line_plugins=[];

  //Loop through rent spending values to create line plugins. Also track the highest point on the graph.
  for(let rent_spending_value of rent_spending_values)
  {
    //Track highest point on the graph
    max_val=Math.max(max_val,rent_spending_value);

    const line_plugin = 
      {
          id: 'horizontalLine',
          afterDraw: (chart:any) => {
              const yValue = chart.scales.y.getPixelForValue(rent_spending_value);
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

  //Make the y endpoint 1.1 * the maximum value so the maximum value is shown on the graph.
  max_val*=1.1;
  max_val=Math.ceil(max_val/1000)*1000;

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
                max: max_val,
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
export function make_bar_chart(target_chart:Chart | null,target_canvas: HTMLCanvasElement,data:any,chart_title:string)
{
    if (target_chart != null) {
    target_chart.destroy();
    }

    let max_val=0;

    //Loop through dataset points. Track highest point on graph.
    for(let i=0;i<data.datasets.length;i++)
    {
        for(let value of data.datasets[i].data)
        {
            max_val=Math.max(max_val,parseInt(value));
        }
    }

    //Make the y endpoint 1.1 * the maximum value so the maximum value is shown on the graph.
    max_val*=1.1;
    max_val=Math.ceil(max_val/1000)*1000;

    target_chart=new Chart(
            target_canvas,
            {
              type: 'bar',
              data: data as any,
              options:
              {
                scales: 
                {
                  y: {
                    min: 0,
                    max: max_val,
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
            }
        );

    return target_chart;
}