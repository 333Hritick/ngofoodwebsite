import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDonations(){

const [donations,setDonations] = useState<any[]>([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{
 fetchDonations();
},[])


const fetchDonations = async ()=>{

 try{

  const res = await axios.get(
    "https://ngofoodwebsite.onrender.com/api/admin-api/donations/",
    {
      headers:{
        Authorization:`Bearer ${localStorage.getItem("adminToken")}`
      }
    }
  );

  console.log(res.data);

  // handle both cases (array OR paginated response)
  setDonations(res.data.results || res.data);

 }catch(err){
  console.error("Error fetching donations",err);
 }finally{
  setLoading(false);
 }

};


if(loading){
 return <div className="p-6">Loading donations...</div>
}


return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-4">
Donations
</h1>

<table className="w-full border">

<thead className="bg-gray-100">
<tr>
<th className="p-2 border">Donor</th>
<th className="p-2 border">Food</th>
<th className="p-2 border">Quantity</th>
<th className="p-2 border">Status</th>
</tr>
</thead>

<tbody>

{donations.map((d:any)=>(
<tr key={d.id} className="text-center">

<td className="border p-2">
{d.donor_name}
</td>

<td className="border p-2">
{d.food_type || d.title}
</td>

<td className="border p-2">
{d.quantity}
</td>

<td className="border p-2">
{d.status}
</td>

</tr>
))}

</tbody>

</table>

</div>

)

}