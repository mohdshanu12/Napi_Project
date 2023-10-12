//REST API -- JSON
// GET /api/USER -- LIST ALL THE USERS
//GET /api/USER/1 -- GET THE USER WITH ID 1
//GET /api/USER/2 -- GET THE USER WITH ID 2
//POST /api/USER -- CREATE THE USER
//PATCH /api/USER/1 --EDIT THE USER WITH ID 1
// DELETE /api/USER/1 -- DELETETHE USE ID 1

//dynamic path parameter
/// GET -- api/users/:id  where 'id' is the variable




const express=require("express")
const app=express();
const port=8000
const users=require("./MOCK_DATA.json")
const fs=require("fs")

// Middleware /plugin
app.use(express.urlencoded({extended: false}))
app.use((req,res,next)=>{
    console.log("Hello from middleware 1")
    fs.appendFile("Logs.txt",`\n${Date.now()}:${req.method},${req.path}`,(err,data)=>{   next()})
   // return res.json({Meg:"Hello from Middleware 1"})
   //next()
})
app.use((req,res,next)=>{
    console.log("Hello from middleware 2")
    next()
})
//Routes


app.get("/api/users",(req,res)=>{
    return res.json(users)
    // res.setHeader("x-myName","Mohammad Shanu") // custom Header
    // console.log(res.header)
})
// the mobile users
app.get("/users",(req,res)=>{
    const html=`
    <ul>${users.map((user)=>`<li> ${user.first_name}</li>`).join('') }
    </ul>  `;
    res.send(html)
})
app.route("/api/users/:id").get((req,res)=>{
         const id=Number(req.params.id)
        const user=users.find((user)=>user.id===id)
         return res.json(user)
    //     //console.log(res.json(user))
 })
//  .post((req,res)=>{
//     //Create the users
//     return res.json({Status:"pending"})
//  })
 app.put("/api/users/:id",(req,res)=>{
    //Edit the user with idapp.put("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id); // Get the user ID from the URL parameter
    const updatedData = req.body; // Get the updated data from the request body

    // Find the user with the given ID in the 'users' array
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        // If the user with the specified ID doesn't exist, return an error
        return res.status(404).json({ Status: "Error", message: "User not found" });
    }

    // Update the user data with the new data
    users[userIndex] = { ...users[userIndex], ...updatedData };

    // Save the updated 'users' array to a file (assuming 'fs' is properly configured)
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ Status: "Error", message: "Failed to update user" });
        }

        return res.json({ Status: "Success", message: "User updated successfully" });
    });
});

//     return res.json({Status:"pending"})
//  })


//detete the data from the json file

app.delete("/api/users/:id", (req, res) => {
    // Extract the ID from the request parameters
    const userId = parseInt(req.params.id);
  
    // Find the index of the user with the given ID in the users array
    const index = users.findIndex((user) => user.id === userId);
  
    // Check if the user with the given ID exists
    if (index === -1) {
      return res.status(404).json({ Status: "Error", message: "User not found" });
    }
  
    // Remove the user from the users array
    users.splice(index, 1);
  
    // Write the updated users array to the file (assuming you want to persist changes)
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      if (err) {
        return res.status(500).json({ Status: "Error", message: "Internal server error" });
      }
      return res.json({ Status: "Success", message: "User deleted successfully" });
    });
  });
  
//  .delete((req,res)=>{
//     //Create the user with id
//     return res.json({Status:"pending"})
//  })
// app.get("/api/users/:id",(req,res)=>{
//     const id=Number(req.params.id)
//     const user=users.find((user)=>user.id===id)
//     return res.json(user)
//     //console.log(res.json(user))
// })
app.post("/api/users",(req,res)=>{
    const body = req.body;
users.push({...body, id:users.length+1});
fs.writeFile("./MOCK_DATA",JSON.stringify(users),(err,data)=>{
    return res.status(201).json({Status:"Success",id:users.length});  
})
    //console.log("Body",body)
    //return res.json({Status:"Pending"});
});
app.listen(port,()=>{
    console.log(`Server is started on port ${port}`)
})