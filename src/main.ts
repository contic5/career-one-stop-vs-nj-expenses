import get_data from "./read_excel";

async function main()
{
  career_data=await get_data("CareerOneStop_Data.xlsx");
  console.log(career_data);
}

let career_data=[];
main();