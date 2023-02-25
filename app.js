const table = document.getElementById("tbdy");
const thead = document.getElementById("thead");

var lst,sortlst,pageStart=0,pageEnd=5,bts=0,bte=5;

const jumpTo= (e)=>{
    // console.log(e.target.id);
    let size= parseInt(document.getElementById('pagesize').value);
    pageStart= (e.target.id - 1)*size;
    pageEnd = pageStart + size;
    if(pageEnd>sortlst.length)pageEnd= sortlst.length;
    constructTable(sortlst,pageStart,pageEnd);
}

const pageUp = ()=>{
    let size = parseInt(document.getElementById('pagesize').value);
    pageStart+= size;
    pageEnd+= size;
    document.getElementById('previous').disabled= false;
    if(pageEnd>=sortlst.length){
        document.getElementById('next').disabled=true;
       
    }
    else{
        document.getElementById('next').disabled= false;
    }

    // console.log(pageStart+" ,, "+pageEnd+" "+size);
    if(pageEnd> sortlst.length){
        // pageStart-=size;
        pageEnd = sortlst.length;
    }
    if(pageStart>sortlst.length)pageStart-= size;
    if(pageStart>(bte-1)*size && pageEnd<(bte*size)){
        bte++;
        bts++;
    }
    // console.log(pageStart+" ,, "+pageEnd+" "+size);
    constructTable(sortlst,pageStart,pageEnd);
}
const pageDown = ()=>{
    let size = parseInt(document.getElementById('pagesize').value);
    pageStart-= size;
    pageEnd= pageStart+ size;
    document.getElementById('next').disabled= false;
    if(pageStart<=0){
        document.getElementById('previous').disabled=true;   
        pageStart =0;
        pageEnd= size;
    }
    else{
        document.getElementById('previous').disabled= false;
    }
    if(pageStart==(bts-1)*size){
        bts--;
        if(!(bts<0))bte--;
    }
    constructTable(sortlst,pageStart,pageEnd);
}

const updateSize= ()=>{
    let s= parseInt(document.getElementById('pagesize').value);
    pageStart =0;
    // if(pageStart<0)pageStart=0;

    pageEnd= pageStart+s;
    if(pageEnd>sortlst.length)pageEnd= sortlst.length;
    constructTable(sortlst,pageStart,pageEnd);
}


const toggle =()=>{
    let but= document.getElementById('sortBut');
    let inn= but.dataset.order;
    if(inn=='desc'){
        but.dataset.order= 'asc';
        but.innerHTML = '&#9650';
    }
    else{
        but.dataset.order= 'desc';
        but.innerHTML = '&#9660';
    }
}

const sortCol = function(event){

    let column= '-';
    if(event!=undefined){column = event.target.value;}
    let orderBut =  document.getElementById('sortBut');
    let order = orderBut.dataset.order;
    if(column=='-') column= orderBut.dataset.value;
    else orderBut.dataset.value = column;
    if(order=='desc'){
        if(/^[0-9]+$/.test(lst[0][column])){
            sortlst.sort((a,b)=> parseInt(a[column])- parseInt(b[column]) );
        } 
        else{
            sortlst.sort((a,b)=>a[column] > b[column] ? 1: -1 );
        }
    }
    else{
        if(/^[0-9]+$/.test(lst[0][column])){
            sortlst.sort((a,b)=> parseInt(b[column])- parseInt(a[column]) );
        } 
        else{
            sortlst.sort((a,b)=>a[column] < b[column] ? 1: -1 );
        }
    }
    constructTable(sortlst,pageStart,pageEnd);

}

const searchCol = function(event){
    let val= document.getElementById('searchbar').value;
    val= val.toLowerCase();
    let col= document.getElementById('selectForSearch').value;
    let filtered= [];
    if(col=='all'){
       filtered= lst.filter(obj => Object.keys(obj).some(key => ((obj[key]+"").toLowerCase()).includes(val)));
    }
    else{
        filtered = lst.filter(obj=> (obj[col]+"").toLowerCase().includes(val));
        // for(let i=0;i<lst.length;i++){
        //     let obj = lst[i][col]+"";
        //     if(((obj.toLowerCase()).includes(val))){
        //         filtered.push(lst[i]);
        //     }
        // }

    }
    sortlst= filtered;
    pageStart=0;
    pageEnd= parseInt(document.getElementById('pagesize').value);
    if(pageEnd>filtered.length)pageEnd= filtered.length;
    bts=0;
    bte= filtered.length;
    if(bte>5)bte=5;
    constructTable(filtered,pageStart,pageEnd);
}

const fetchData =  async() => {

    //fetching data from api
    // const l= await fetch("https://run.mocky.io/v3/fc871279-c75c-420b-8b22-ac702c26b8bf");
    // const l= await fetch("https://run.mocky.io/v3/f9fae952-02b0-4305-ab4c-9b48eac96259");
    const l= await fetch("https://run.mocky.io/v3/f65508a3-ba43-4cdd-b53d-be73b548d41e");
    
     lst= await l.json();
     sortlst=lst;
    constructHead(lst[0]);
    constructTable(lst,0,5);
}
const constructHead = function(lst){
    let keys= Object.keys(lst);
    // adding options in select tag
    let ssearch = document.getElementById('selectForSearch');
    let ssort = document.getElementById('selectForSort');
    ssort.addEventListener("change",sortCol);
    ssort.dataset.order= 'desc';

    for(let i=0;i< keys.length;i++){
        let hh= document.createElement('th');
        let h4= document.createElement('h4');
        let optsearch= document.createElement('option');
        let optsort= document.createElement('option');
        optsearch.innerHTML= keys[i];
        optsort.innerHTML= keys[i];
        h4.dataset.order= 'desc';
        h4.dataset.col= keys[i];
        h4.innerHTML= keys[i];
       
        hh.appendChild(h4);
        thead.appendChild(hh);
        ssearch.appendChild(optsearch);
        ssort.appendChild(optsort); 
    }
}

const constructTable = function(lst,start,end){
    // adding buttons in pagination bottom navigation
    let div= document.getElementById('bottomButtons');
    div.innerHTML='';
    let size= parseInt(document.getElementById('pagesize').value);
    let buttonCount= lst.length/size;
    // console.log(buttonCount);
    if(buttonCount<=1){
        document.getElementById('previous').disabled= true;
        document.getElementById('next').disabled= true;
    }
    else{
        document.getElementById('next').disabled= false;
    }
    if(buttonCount<bte)bte= buttonCount;
    if(bts<0)bts=0;
    // console.log(buttonCount+" "+size);
    for(let i=bts;i<bte;i++){
        let button = document.createElement('button');
        button.id= i+1;
        button.style.width= '50px';
        button.style.height= '30px';
        if(((i)*size===pageStart)){
            button.style.backgroundColor= '#4285F4';
            button.style.color= 'white';
        }    
        button.innerHTML = i+1;
        button.addEventListener('click',jumpTo);
        div.appendChild(button);
    }


    // console.log(start+" "+end);
    table.innerHTML = '';
    if(end>lst.length) end= lst.length;
    for(let i=start;i< end ; i++){
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
