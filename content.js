var debug = true;

readTextFile('moco/moco.xml');
//verifyForm();


function readTextFile(file)
{	
	var url = chrome.runtime.getURL(file);
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", url, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                fillFromXML(rawFile.responseText);
            }
        }
    }
    rawFile.send(null);
}

function editedMsg(elt){
	var parent = elt.parentElement.parentElement;
	parent.bgColor = "lightblue";
	// parent.innerHTML+="<td class='errorMsg'>"+msg+"</td>";
	var elt = document.createElement("td");
	elt.setAttribute("class",'errorMsg');
	//elt.innerHTML = "Field filled automatically.";
	parent.appendChild(elt);
}

function fillFromXML(xmlDoc){
	parser = new DOMParser();
	xmlDoc = parser.parseFromString(xmlDoc,"text/xml");
	var rowset1 = xmlDoc.getElementsByTagName("ROWSET1_ROW")[0].children;
	var rowset2 = xmlDoc.getElementsByTagName("ROWSET2_ROW");

	var domArr = [
			document.getElementsByName("[Lease_Term_Begins_Date]")[0],
			document.getElementsByName("[Lease_Term_Ends_Date]")[0],
			document.getElementsByName("[Month_to_Month_Begins_Date]")[0],
			document.getElementsByName("[Rental_Amount]")[0],
			document.getElementsByName("[Parking_Monthly_Rental_Amt]")[0],
			document.getElementsByName("[Pet_Rent_Amt]")[0],
			document.getElementsByName("[1st_Month_Rent]")[0],
			document.getElementsByName("[1st_Month_Rent_Start_Date]")[0],
			document.getElementsByName("[1st_Month_Rent_End_Date]")[0],
			document.getElementsByName("[2nd_Month_Rent]")[0],
			document.getElementsByName("[2nd_Month_Rent_Start_Date]")[0],
			document.getElementsByName("[2nd_Month_Rent_End_Date]")[0],
			document.getElementsByName("[Security_Deposit_Amt]")[0],
			document.getElementsByName("[Non-refundable_Fees_Amt]")[0],
			document.getElementsByName("[Pet_Deposit_Amt]")[0],
			document.getElementsByName("[Pet_Fee_Amt]")[0],
			document.getElementsByName("[Total_Rental_Amount]")[0],
			document.getElementsByName("[Prior_Pmt_Amt]")[0],
			document.getElementsByName("[Monthly_Water/Sewer/Garbage_Fee]")[0],
			document.getElementsByName("[Total_Deposits_Amt]")[0],
			document.getElementsByName("[Total_Fees]")[0],
			document.getElementsByName("[Total_Move-in_Charges]")[0],
			document.getElementsByName("[Storage_Monthly_Rental_Amt]")[0]
		];

	for(var i=0;i<domArr.length;i++){
		domArr[i].value = rowset1[i].innerHTML;
		editedMsg(domArr[i]);
	}


	var domArr2 = [
		document.getElementsByName("[RightSignature_Applicant_b_Name]")[0],
		document.getElementsByName("[RightSignature_Applicant_b_Email]")[0],
		document.getElementsByName("[RightSignature_Applicant_c_Name]")[0],
		document.getElementsByName("[RightSignature_Applicant_c_Email]")[0],
		document.getElementsByName("[RightSignature_Applicant_d_Name]")[0],
		document.getElementsByName("[RightSignature_Applicant_d_Email]")[0],
		document.getElementsByName("[RightSignature_Applicant_e_Name]")[0],
		document.getElementsByName("[RightSignature_Applicant_e_Email]")[0]
	]

	var dom_index = 0;
	for(var i=0;i<rowset2.length;i++){
		row = rowset2[i].children;
		name = row[0].innerHTML + " " + row[1].innerHTML;
		editedMsg(domArr2[dom_index])
		domArr2[dom_index++].value = name;
		editedMsg(domArr2[dom_index])
		domArr2[dom_index++].value = row[2].innerHTML;



	}
	
}

function verifyForm(){
	if(debug) console.log("start\n\n\n");
	clear();

	var approved = 0;

	var requiredArr = [
			document.getElementsByName("[Applicant_First_Name]")[0],
			document.getElementsByName("[Applicant_Last_Name]")[0],
			document.getElementsByName("[Apartment_Number]")[0],
			document.getElementsByName("[Month_to_Month_Begins_Date]")[0],
			document.getElementsByName("[Rental_Amount]")[0],
			document.getElementsByName("[Security_Deposit_Amt]")[0],
			document.getElementsByName("[RightSignature_Applicant_a_Email]")[0],
			document.getElementsByName("[RightSignature_Applicant_a_Name]")[0],
			document.getElementsByName("[RightSignature_Applicant_b_Email]")[0],
			document.getElementsByName("[RightSignature_Applicant_b_Name]")[0]
		];
	var len=requiredArr.length;
	for(var i=0; i<len; i++){
		approved += required(requiredArr[i]);
	}

	conditional();

	var blank1 = document.getElementsByName("[Last_Month_Rent_Deposit]")[0];
	var blank2 = document.getElementsByName("[Prior_Pmt_Amt]")[0];
	approved += blanks(blank1);
	approved += blanks(blank2);

	var calc1 = [
			document.getElementsByName("[Total_Rental_Amount]")[0],
			document.getElementsByName("[Rental_Amount]")[0],
			document.getElementsByName("[Parking_Monthly_Rental_Amt]")[0],
			document.getElementsByName("[Pet_Rent_Amt]")[0],
			document.getElementsByName("[Monthly_Water/Sewer/Garbage_Fee]")[0]
		];

	var calc2 = [
			document.getElementsByName("[Total_Fees]")[0],
			document.getElementsByName("[Non-refundable_Fees_Amt]")[0],
			document.getElementsByName("[Pet_Fee_Amt]")[0],
		];

	var calc3 = [
			document.getElementsByName("[Total_Deposits_Amt]")[0],
			document.getElementsByName("[Security_Deposit_Amt]")[0],
			document.getElementsByName("[Pet_Deposit_Amt]")[0],
		];


	approved += calculated(calc1," = rental amount + parking monthly rent amount + pet rent amount + monthly water/sewer/garbage fee");
	approved += calculated(calc2," = non-refundable fees amt + pet fee amt");
	approved += calculated(calc3," = Security Deposit amt + pet deposit amt");

	approved += duration();


	if(approved==0){
		document.querySelectorAll("table")[1].bgColor = "green";
	}

}


function errorMsg(elt,msg){
	var parent = elt.parentElement.parentElement;
	parent.bgColor = "red";
	// parent.innerHTML+="<td class='errorMsg'>"+msg+"</td>";
	var elt = document.createElement("td");
	elt.setAttribute("class",'errorMsg');
	elt.innerHTML = msg;
	parent.appendChild(elt);
}

function required(elt){
	if(elt.value==""){
		errorMsg(elt,"This field is required.")
		return true;
	}
	return false;
}

function blanks(elt){
	if(elt.value!=""){
		errorMsg(elt,"This field must be blank.")
		return true;
	}
	return false;

}

function conditional(){
	var amt = document.getElementsByName("[Non-refundable_Fees_Amt]")[0];
	var desc = document.getElementsByName("[Non-refundable_Fees_Desc]")[0];
	if(amt.value!="") {
		required(desc);
	}
}

function calculated(arr,msg){
	var elt = arr[0];
	var inputed = elt.value;

	if(debug) console.log(inputed+"inputed");
	if(debug) console.log(arr);
	var sum = 0;
	var i;
	for(i=1;i<arr.length;i++){
		sum+=Number(arr[i].value);
	}
	
	if(inputed!=sum){
		elt.value = sum;
		if(inputed=="") inputed = 0;
		errorMsg(elt,"Changed from "+inputed+" to "+sum+msg);
		if(debug) console.log(sum+"calculatedwrong");
		return true;

	}
	return false;

}

function duration(){
	var lease_begin = document.getElementsByName("[Lease_Begin_Date]")[0];
	var lease_end = document.getElementsByName("[Lease_End_Date]")[0];
	var completed = !required(lease_begin);
	completed = !required(lease_end) && completed; 
	if(completed) { 
		var begin_date = new Date(lease_begin.value);
		var end_date = new Date(lease_end.value);
		if(debug) console.log("date");
		if(debug) console.log(end_date-begin_date);
		var duration_days = (end_date-begin_date)/(1000*60*60*24);
		if(duration_days<0) {
			errorMsg(lease_begin,"The lease must begin before it ends");
			errorMsg(lease_end,"The lease must begin before it ends");
			return true;
		} else if(duration_days>364){
			errorMsg(lease_begin,"The lease duration must be less than 12 months");
			errorMsg(lease_end,"The lease duration must be less than 12 months");
			return true;
		}
		return false;
	}
	return !completed;
}

function clear(){
	var elts = document.getElementsByClassName("errorMsg");
	var length,parent;
	length = elts.length;
	for(var i=0;i<length;i++){
		parent = elts[i].parentElement;
		parent.bgColor = "";
	}
	for(var i=0;i<length;i++){
		elts[0].remove();
	}

	document.querySelectorAll("table")[1].bgColor = "";

	if(debug && elts.length==0) console.log("allclear");


}








