import get_data from "./read_excel";

async function main()
{
  career_data=await get_data("CareerOneStop_Data.xlsx");
  console.log(career_data);

  appartment_data=await get_data("New_Jersey_Expenses.xlsx","Appartments");
  console.log(appartment_data);
}

let career_data=[];
let appartment_data=[];
main();