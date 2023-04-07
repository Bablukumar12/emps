let express = require("express");
let mysql = require("mysql");
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

let connData = {
	host: "localhost",
	user: "root",
	password: "",
	database: "testDB",
};

let connection = mysql.createConnection(connData);

app.get("/employees", (req, res) => {
    let {designation,department,gender} = req.query;
    let sql = "select * from employees where 1=1 ";
    let params = []
    if(designation){
        sql += "and designation=?";
        params.push(designation);
    }
    if(department){
        sql+= "and department=?";
        params.push(department);
    }
    if(gender){
        sql += "and gender=?";
        params.push(gender);
    }
	connection.query(sql,params ,(err, result) => {
		if (err) throw err;
		else res.send(result);
	});
});

app.get("/employees/:empCode", (req, res) => {
	let empCode = req.params.empCode;
	connection.query(
		"select * from employees where empCode= ?",
		empCode,
		(err, result) => {
			if (err) throw err;
			else res.send(result[0]);
		}
	);
});

app.post("/employees", (req, res) => {
	let employee = req.body;
	connection.query("insert into employees set ? ", employee, (err, result) => {
		if (err) throw err;
		else res.send("Employee Inserted");
	});
});
app.get("/employees/designation/:designation", (req, res) => {
	let designation = req.params.designation;
	connection.query(
		"select * from employees where designation=?",
		designation,
		(err, result) => {
			if (err) throw err;
			else res.send(result);
		}
	);
});

app.get("/employees/department/:department", (req, res) => {
	let department = req.params.department;
	connection.query(
		"select * from employees where department=?",
		department,
		(err, result) => {
			if (err) throw err;
			else res.send(result);
		}
	);
});

app.put("/employees/:empCode", (req, res) => {
	let empCode = +req.params.empCode;
	let body = req.body;
	connection.query(
		"UPDATE employees SET ?  WHERE empCode = ?",
		[body, empCode],
		(err, result) => {
			if (err) throw err;
			else res.send(req.body);
		}
	);
});

app.delete("/employees/:empCode",(req,res)=>{
    let empCode = +req.params.empCode;
    connection.query("delete from employees where empCode=?",empCode,(err,result)=>{
        if(err) throw err;
        else res.send("deleted");
    })
})
