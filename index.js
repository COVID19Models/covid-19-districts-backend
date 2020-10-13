const express = require('express');
const cors = require('cors');
const fs = require('fs');
const stream = require('stream');
	var path = require('path');
	// const csv =  require('csv-parser');
	const csv = require('csvtojson');





const app = express();
app.use(cors());
app.use(express.json());

var server = app.listen(process.env.PORT || 3000);



// app.use(express.static(__dirname + '/public'));
// app.use("/data", express.static(path.join(__dirname, "public")));

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });
// app.get('/', function (req, res) {	
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });
// app.use(express.static(path.join(__dirname, "/public")));

Array.prototype.contains = function(v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function() {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (!arr.contains(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
}

async function get_entries(){

csvFilePath = 'entry_data_test.csv' 
// console.log(csvFilePath);
const states = [];
const database = [];


// const array = csv().fromFile(csvFilePath);
// console.log(array);	
	const array = await csv().fromFile(csvFilePath);
	array.forEach((element) => {
		states.push(element['State']);
	});
	var unique_states = states.unique().sort();
	// console.log(unique_states);
	// return array;
	unique_states.forEach((state) => {

		const districts=[];
		const population=[];

		array.forEach((element)=>{
			if(element['State'] === state){
				districts.push(element['District']);
				population.push(element['Population']);				
			}
		})
		database.push({'state':state,'district':districts,'population':population});
	});
	return database;
}

app.get('/',async(req, res) => {


data = await get_entries();
res.send({'entries':data});


});

app.post('/csv',async (req,res) => {

	var state = req.body.state;
	var district = req.body.district;

	// console.log("req body =", req.body);

	csv_actual = path.join(__dirname + '/webpage' + '/data' + '/'+state + '/'+district + '_actual.csv');
	csv_fit = path.join(__dirname + '/webpage' + '/data' + '/'+state + '/'+district + '_fit.csv');
	csv_projections = path.join(__dirname + '/webpage' + '/data' + '/'+state + '/'+district + '_projections.csv');
	may_15 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_15May.csv');
	may_31 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_31May.csv');
	jun_15 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_15Jun.csv');
	jun_30 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_30Jun.csv');
	jul_15 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_15Jul.csv');
	jul_31 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_31Jul.csv');
	aug_15 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_15Aug.csv');
	aug_31 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_31Aug.csv');
	sep_15 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_15Sep.csv');
	sep_30 =  path.join(__dirname + '/webpage' + '/15day_details' + '/3_30Sep.csv');


	var array = await csv().fromFile(csv_actual);
	var pd1 = [],pd2 = [], pd3 =[], pd4=[];
	array.forEach((element) => {
		pd1	.push(parseFloat(element['Recovered']));
		pd2	.push(parseFloat(element['Deceased']));
		pd3	.push(parseFloat(element['Infected']));
		pd4	.push(parseFloat(element['I_c']));
	});
	actual = {'Recovered': pd1,'Deceased':pd2,'Infected':pd3,'I_c':pd4};

	array = await csv().fromFile(csv_fit);
	pd1 = [],pd2 = [], pd3 =[], pd4=[], pd5=[],pd6=[];
	array.forEach((element) => {
		pd1	.push(parseFloat(element['Susceptible']));
		pd2	.push(parseFloat(element['Asymptomatic']));
		pd3	.push(parseFloat(element['Infected']));
		pd4	.push(parseFloat(element['Recovered']));
		pd5	.push(parseFloat(element['Deceased']));
		pd6	.push(parseFloat(element['I_c']));
	});
	fit = {'Susceptible': pd1,'Asymptomatic':pd2,'Infected':pd3,'Recovered':pd4,'Deceased':pd5,'I_c':pd6};

	array = await csv().fromFile(csv_projections);
	// console.log(array);
	pd1 = [],pd2 = [], pd3 =[], pd4=[], pd5=[],pd6=[];
	array.forEach((element) => {
		// console.log(element)
		pd1	.push(parseFloat(element['Susceptible']));
		pd2	.push(parseFloat(element['Asymptomatic']));
		pd3	.push(parseFloat(element['Infected']));
		pd4	.push(parseFloat(element['Recovered']));
		pd5	.push(parseFloat(element['Deceased']));
		pd6	.push(parseFloat(element['I_c']));
	});
	projections = {'Susceptible': pd1,'Asymptomatic':pd2,'Infected':pd3,'Recovered':pd4,'Deceased':pd5,'I_c':pd6};
	// console.log(projections.Susceptible.length);



	pd1= [];
	array = await csv().fromFile(may_15);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,4,15),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,4,15),y:0});
		else 
			pd1	.push({x:new Date(2020,4,15),y:value});
	};
	});

	array = await csv().fromFile(may_31);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,4,30),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,4,30),y:0});
		else 
			pd1	.push({x:new Date(2020,4,30),y:value});
	};
	});
	
	array = await csv().fromFile(jun_15);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,5,15),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,5,15),y:0});
		else 
			pd1	.push({x:new Date(2020,5,15),y:value});
	};
	});

	array = await csv().fromFile(jun_30);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,5,30),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,5,30),y:0});
		else 
			pd1	.push({x:new Date(2020,5,30),y:value});
	};
	});

	array = await csv().fromFile(jul_15);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,6,15),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,6,15),y:0});
		else 
			pd1	.push({x:new Date(2020,6,15),y:value});
	};
	});

	array = await csv().fromFile(jul_31);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,6,31),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,6,31),y:0});
		else 
			pd1	.push({x:new Date(2020,6,31),y:value});
	};
	});

	array = await csv().fromFile(aug_15);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,7,15),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,7,15),y:0});
		else 
			pd1	.push({x:new Date(2020,7,15),y:value});
	};
	});

	array = await csv().fromFile(aug_31);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,7,31),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,7,31),y:0});
		else 
			pd1	.push({x:new Date(2020,7,31),y:value});
	};
	});

	array = await csv().fromFile(sep_15);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,8,15),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,8,15),y:0});
		else 
			pd1	.push({x:new Date(2020,8,15),y:value});
	};
	});

	array = await csv().fromFile(sep_30);	
	array.forEach((element) => {
	var value = parseFloat(element['repr_ratio']);
	if(element['State'] == state && element['District'] == district){
		if(value > 4)
			pd1	.push({x:new Date(2020,8,30),y:4});
		else if(value<0)
			pd1	.push({x:new Date(2020,8,30),y:0});
		else 
			pd1	.push({x:new Date(2020,8,30),y:value});
	};
	});

	res.json({
		// message:'recieved data',
		'state': state,
		'district':district,	
		'actual' : actual,
		'fit'    : fit,
		'projections' : projections,
		'repr_ratio': pd1,
	});

});	