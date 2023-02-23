// const div1= document.getElementById("table-container");
const table = document.getElementById("tbdy");
const thead = document.getElementById("thead");

var lst;

const sortCol = function(event){
    // console.log(event.target.dataset.column);
    let column = event.target.dataset.col;
    let order =  event.target.dataset.order;
    // console.log(column+" "+order);
    let text = event.target.innerHTML;
    // console.log(text);
    text= text.substring(0, text.length -1);
    
    if(order=='desc'){
        event.target.dataset.order= 'asc';
        if(/^[0-9]+$/.test(lst[0][column])){
            console.log("hii");
            lst.sort((a,b)=> parseInt(a[column])- parseInt(b[column]) );
        } 
        else{
            lst.sort((a,b)=>a[column] > b[column] ? 1: -1 );
        }
        event.target.innerHTML= text+"&#9660";

    }
    else{
        event.target.dataset.order= 'desc';
        if(/^[0-9]+$/.test(lst[0][column])){
            lst.sort((a,b)=> parseInt(b[column])- parseInt(a[column]) );
        } 
        else{
            lst.sort((a,b)=>a[column] < b[column] ? 1: -1 );
        }
        event.target.innerHTML= text+"&#9650";
    }
    constructTable(lst);

}

const searchCol = function(event){
    let val= event.target.value;
    val= val.toLowerCase();
    let col= event.target.id;
    let filtered= [];
    for(let i=0;i<lst.length;i++){
        let obj = lst[i][col]+"";
        if(((obj.toLowerCase()).includes(val))){
            filtered.push(lst[i]);
        }
    }
    
    constructTable(filtered);
}

const fetchData =  async() => {

    //fetching data from api
    // const l= await fetch("https://run.mocky.io/v3/fc871279-c75c-420b-8b22-ac702c26b8bf");
    const l= await fetch("https://run.mocky.io/v3/f9fae952-02b0-4305-ab4c-9b48eac96259");
     lst= await l.json();
    // console.log(lst.length);
    constructHead(lst);
    constructTable(lst);
}
const constructHead = function(lst){
    let keys= Object.keys(lst[0]);
    for(let i=0;i< keys.length;i++){
        let hh= document.createElement('th');
        
        let h4= document.createElement('h4');
        h4.addEventListener("click",sortCol);
        h4.dataset.order= 'desc';
        h4.dataset.col= keys[i];
        let input= document.createElement('input');
        input.addEventListener("keyup",searchCol);
        input.id= keys[i];
        h4.innerHTML= keys[i] +" &#9650";
       
        hh.appendChild(h4);
        hh.appendChild(input);
        thead.appendChild(hh);
    }
}

const constructTable = function(lst){
    table.innerHTML = '';
    for(let i=0;i< lst.length; i++){
        let hh= document.createElement('tr');
        for(let prop in lst[i]){
            let rr= document.createElement('td');
            rr.innerHTML= lst[i][prop];
            hh.appendChild(rr);
        }
        table.appendChild(hh);            
    }

 }
fetchData();
