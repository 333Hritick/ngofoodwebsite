import { useEffect, useState } from "react";
import axios from "axios";


export default function AdminPickups(){

const [pickups,setPickups]=useState([]);

useEffect(()=>{

 fetchPickups()

},[])


const fetchPickups = async ()=>{

 const res = await axios.get(
   "https://ngofoodwebsite.onrender.com/api/admin-api/pickups/",
   {
     headers:{
       Authorization:`Bearer ${localStorage.getItem("adminToken")}`
     }
   }
 )

 setPickups(res.data)

}
const getStatusColor = (status) => {
  switch (status) {
    case "claimed":
      return "bg-green-100 text-green-700";
    case "delivered":
      return "bg-red-100 text-red-700";
    case "picked_up":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};


return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-4">
Pickups
</h1>

<table className="w-full border">

<thead className="bg-gray-100">

<tr>
<th className="border p-2">Donation</th>
<th className="border p-2">Donor</th>
<th className="border p-2">NGO</th>
<th className="border p-2">Status</th>
</tr>

</thead>

<tbody>

{pickups.map((p:any)=>(
<tr key={p.id} className="text-center">

<td className="border p-2">{p.donation?.title}</td>
<td className="border p-2">{p.donor_name}</td>
<td className="border p-2">{p.ngo_name}</td>   {/* NGO removed */}
<td className="border p-2">
  <span className={`px-2 py-1 rounded ${getStatusColor(p.status)}`}>
    {p.status}
  </span>
</td>

</tr>
))}

</tbody>

</table>

</div>

)

}