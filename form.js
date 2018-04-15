function myFunction() 
{
	var email = document.getElementById("userEmail").value;
	var mesg = document.getElementById("Message").value
	var sub = document.getElementById("userSubject").value;
	
	alert("Your email is "+ email +" and your subject is "+ sub +" with the message :: "+ mesg );
}

function tempAnimation() {
  var elem = document.getElementById("myAnimation");   
  var pos = 0;
  var id = setInterval(frame, 10);
  function frame() {
    if (pos == 350) {
      clearInterval(id);
    } else {
      pos++; 
      elem.style.top = pos + 'px'; 
      elem.style.left = pos + 'px'; 
    }
  }
}