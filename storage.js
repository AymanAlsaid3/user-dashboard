import fs from 'fs/promises';
export async function saveUserData(filename, data) 
{
    try
    { 
        let jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(filename, jsonData, 'utf-8');
        console.log(`Successfully saved data to ${filename}`);

    }
    catch (error)
    {

        console.error("Error saving file:",error.message);
    }
}
export async function loadUserData(filename) 
{
 try 
 {
   let rawData = await fs.readFile (filename,'utf-8');
   return JSON.parse(rawData);
 }  
 catch (error)
 {

  console.error("Error reading file:",error.message);
  return [];

 } 
}