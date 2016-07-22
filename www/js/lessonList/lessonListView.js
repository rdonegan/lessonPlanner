function toMonth(month){
	if (month=="01") {
		return "Jan"
	}
	else if (month=="02") {
		return "Feb"
	}
	else if (month=="03") {
		return "March"
	}
	else if (month=="04") {
		return "April"
	}
	else if (month=="05") {
		return "May"
	}
	else if (month=="06") {
		return "June"
	}
	else if (month=="07") {
		return "July"
	}
	else if (month=="08") {
		return "August"
	}
	else if (month=="09") {
		return "Sept"
	}
	else if (month=="10") {
		return "Oct"
	}
	else if (month=="11") {
		return "Nov"
	}
	else if (month=="12") {
		return "Dec"
	}

}

//remove leading 0, if exists, and return
function toDay(date){
	if(date.substr(0,1) == "0"){
		return (date.substr(1))
	}
	else{
		return date
	}
}