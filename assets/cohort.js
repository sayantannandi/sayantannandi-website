const button=document.querySelector('#copy-company-email');
button?.addEventListener('click',async()=>{
 const text=document.querySelector('#company-email').textContent,status=document.querySelector('#copy-email-status');
 try{await navigator.clipboard.writeText(text);status.textContent='Copied. Add your manager’s name and adapt the request before sending.';}
 catch{status.textContent='Select and copy the text above. Clipboard access was unavailable.';}
});

// Stop directing new registrations to a past cohort after the advertised deadline.
if(Date.now()>Date.parse('2027-01-06T23:59:59+05:30')){
 for(const link of document.querySelectorAll('a[href="https://rzp.io/rzp/Jan27TSUTSL"]')){link.href='#next-cohort';link.textContent='Ask about the next cohort';}
}
