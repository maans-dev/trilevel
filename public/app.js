document.getElementById('simulate').addEventListener('click', async ()=>{
  const buyer = document.getElementById('buyer').value;
  const amount = Number(document.getElementById('amount').value) || 0;
  const status = document.getElementById('status');
  const output = document.getElementById('output');
  status.textContent = 'Simulating...';
  try{
    const res = await fetch('/tri-level-demo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({buyerId:buyer,amount})});
    if (!res.ok) throw new Error('server '+res.status);
    const data = await res.json();
    output.textContent = JSON.stringify(data,null,2);
    status.textContent = 'Done';
  }catch(err){
    output.textContent = 'Error: '+err.message;
    status.textContent = 'Error';
  }
});