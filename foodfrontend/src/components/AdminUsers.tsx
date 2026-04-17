import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsers(){

const [users,setUsers]=useState([]);

useEffect(()=>{

 fetchUsers()

},[])


const fetchUsers = async ()=>{

 const res = await axios.get(
   "http://localhost:8000/api/admin-api/users/",
   {
     headers:{
       Authorization:`Bearer ${localStorage.getItem("adminToken")}`
     }
   }
 )

 setUsers(res.data)

}


return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-4">Users</h1>

<table className="w-full border">

<thead className="bg-gray-100">
<tr>
<th className="p-2 border">Username</th>
<th className="p-2 border">Email</th>
<th className="p-2 border">Role</th>
</tr>
</thead>

<tbody>

{users.map((u:any)=>(
<tr key={u.id} className="text-center">

<td className="border p-2">{u.full_name}</td>
<td className="border p-2">{u.email}</td>
<td className="border p-2">{u.role}</td>

</tr>
))}

</tbody>

</table>

</div>

)

}