let express = require("express");
let mysql = require("mysql");
const  { Client } = require("pg");





let app = express();
app.use(express.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin,X-Requested-With,Content-Type,Accept"
	);
	next();
});

var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}`));

let { employees } = require("./employeesData.js");

const connection = new Client({
    user : "postgres",
    password : "ABabluKumar",
    database : "postgres",
    port : 5432,
    host : "db.lwjkdhdkfsmentvysimf.supabase.co",
    ssl : {rejectUnauthorized: false}
});
connection.connect(function(res,error){
    console.log(`Connected!!!`);
})

let connData = {
	host: "localhost",
	user: "root",
	password: "",
	database: "testDB",
};

// let connection = mysql.createConnection(connData);


// app.get("/users",(req,res,next)=>{
//     console.log("Inside/users get api");
//     client.query ("select * from users",(err,result)=>{
//         if(err) {res.status(400).send(err)};
//         res.send(result.rows);
//         client.end();
//     })
// })

// app.post("/users",(req,res,next)=>{
//     console.log("Inside port of user");
//     var values = Object.values(req.body);
//     console.log(values);
//     client.query(`insert into users (email,firstname,lastname,age) values($1,$2,$3,$4)`,values,(err,result)=>{
//         if(err) res.status(400).send(err)
//         res.send(`${result.rowCount} insertion successful`);
//     })
// })


app.get("/employees", (req, res) => {
    let {designation, department, gender} = req.query;
    let params = [];
    let queryString = "SELECT * FROM employees";
    let conditions = [];
    
    if (designation) {
        conditions.push("designation = $1");
        params.push(designation);
    }
    
    if (department) {
        conditions.push("department = $"+(params.length+1));
        params.push(department);
    }
    
    if (gender) {
        conditions.push("gender = $"+(params.length+1));
        params.push(gender);
    }
    
    if (conditions.length > 0) {
        queryString += " WHERE " + conditions.join(" AND ");
    }
    
    connection.query(queryString, params, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error fetching employees");
        } else {
            res.send(result.rows);
        }
    });
});


app.get("/employees/:empcode", (req, res) => {
	let empcode = +req.params.empcode;
	connection.query(
		"select * from employees where empcode= $1",
		[empcode],
		(err, result) => {
			if (err) console.log(err.message);
			else res.send(result.rows[0]);
           
		}
	);
});

app.post("/employees", (req, res) => {
    var employee = Object.values(req.body)
	connection.query("insert into employees(empcode,name,department,designation,salary,gender) values($1,$2,$3,$4,$5,$6)", employee, (err, result) => {
		if (err) console.log(err);
		else res.send("Employee Inserted");
	});
});
app.get("/employees/designation/:designation", (req, res) => {
	let designation = req.params.designation;
	connection.query(
		`select * from employees where designation = $1`,
		[designation],
		(err, result) => {
			if (err) console.log(err);
			else res.send(result.rows);
		}
	);
});

app.get("/employees/department/:department", (req, res) => {
	let department = req.params.department;
	connection.query(
		`select * from employees where department=$1`,
		[department],
		(err, result) => {
			if (err) console.log(err);
			else res.send(result.rows);
		}
	);
});

app.put("/employees/:empcode", (req, res) => {
    let empcode = +req.params.empcode;
    let values = Object.values(req.body);
    values.push(empcode);
    connection.query(
        "UPDATE employees SET empcode = $1, name = $2, department = $3, designation = $4, salary = $5, gender = $6 WHERE empcode = $7",
        values,
        (err, result) => {
            if (err) console.log(err);
            else res.send(req.body);
        }
    );
});


app.delete("/employees/:empcode",(req,res)=>{
    let empcode = +req.params.empcode;
    connection.query("delete from employees where empcode=$1",[empcode],(err,result)=>{
        if(err) res.status(400).send(err);
        else res.send("deleted");
    })
})
