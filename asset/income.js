

var budgetController=(function(){

    let Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
    let Expenses=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    }
    Expenses.prototype.calculatePercentage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=(this.value/totalIncome)*100;

        }else{
            this.percentage=-1;
        }
        
    };
    Expenses.prototype.getPercentage=function(){
        return this.percentage;
    };
    let data={
        allitems:{
            exp:[],
            inc:[]
        },
        totalls:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };

    let calculateTotals=function(type){
        let sum=0;
        data.allitems[type].forEach(function(curr){
         sum+=curr.value;
        });
        data.totalls[type]=sum;
    };
    /*let calculateTotals=function(type){
        let sum=0;

        data.allitems[type].foreach(function(curr){
            sum+=curr.value;
        });
        data.totalls[type]=sum;
    };*/

    return{
        addItem:function(type,desc,value){
             let ID,newItem;
             //gernerate New ID
             //[1,2,3,4] next ID=5
            if(data.allitems[type].length>0){
              ID=data.allitems[type][data.allitems[type].length-1].id+1;
            }else{
                ID=0;
            }
            if(type==='exp'){
              newItem=new Expenses(ID,desc,value);
            }else if(type==='inc'){
                newItem=new Income(ID,desc,value);
            }
            //push newitem into dataStructure
            data.allitems[type].push(newItem);
            //return newItem
            return newItem;
        },
        deleteItem:function(type,id){
            let ids,index;
            //ids=[1,2,3,4];
            ids=data.allitems[type].map(function(curr){
                return curr.id;

            });
            index=ids.indexOf(id);

            if(index!==-1){
                console.log(data.allitems[type].splice(index,1));
            }

        },
        calculateBudget:function(){
            //1.Calculate total income and expenses
            calculateTotals('exp');
            calculateTotals('inc');
            data.budget=data.totalls.inc-data.totalls.exp;
            console.log(data.budget);
            //2.calculate percentage
            if(data.totalls.inc>0){
                data.percentage=Math.round((data.totalls.exp/data.totalls.inc)*100);
            }else{
                data.percentage=-1;
            }
            
            //3.display percentage

        },

        calculateExpPercentage:function(){

            //a=20
            //b=30
            //c=40
            //d=50
            //a=20/totalincome=--%
            //...
               data.allitems.exp.forEach(function(curr){
                 curr.calculatePercentage(data.totalls.inc);

            });

        },
        getPercentages:function(){
            let allPercentage;
            allPercentage=data.allitems.exp.map(function(curr){

                return curr.getPercentage();

            });
            return allPercentage;

        },
        getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totalls.inc,
                totalExp:data.totalls.exp,
                percentage:data.percentage

            };
        },
        testing:function(){
            console.log(data);
        }
    };


})();


let UiController=(function(){

    let DomString={
        inputType:'.add_type',
        inputdescription:'.add_description',
        inputValue:'.add_value',
        inputBtn:'.add_btn',
        incomeContainer:'.income_list',
        expensesContainer:'.expenses_list',
        budget:'.budget_value',
        budgetIncome:'.budget_income_value',
        budgetExpenses:'.budget_expense_value',
        budget_expense_percentage:'.budget_expense_percentage',
        item__percentage:'.item__percentage',
        container:'.container',
        month:'.budget_title_month'

    };

    let formateNum=function(num,type){
        let splitNum,int,dec;
        num=Math.abs(num);
        num=num.toFixed(2);

        splitNum=num.split('.');
        int=splitNum[0];
        dec=splitNum[1];
        if(int.length>3){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
        }
       return(type==='exp'?'-':'+')+' '+int+'.'+dec;
    };

    let NodeForEach=function(list,callback){
        for(let i=0;i<list.length;i++){
            callback(list[i],i);
        }
    };

    return{
        getInput:function(){

            return{
                type:document.querySelector(DomString.inputType).value,//either inc or exp
                desc:document.querySelector(DomString.inputdescription).value,
                value:parseFloat(document.querySelector(DomString.inputValue).value)
            };
           
        },
       
        addLisItem:function(obj,type){
            var html,newHtml,element;
            //create html string
            console.log(type);
            if(type==='inc'){
                element=DomString.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"><div class="item_description">%description%</div><div class="right"><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete_btn"><i class="fa fa-close"></i></button></div></div></div>';
            }else if(type==='exp'){
                element=DomString.expensesContainer;
                html='<div class="item clearfix" id="exp-%id%"> <div class="item_description">%description%</div><div class="right"><div class="item_value">%value%</div><div class="item__percentage">%45</div><div class="item_delete"><button class="item_delete_btn"><i class="fa fa-close"></i></button></div></div></div>';
            }

            //replace actual html string
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formateNum(obj.value,type));
            //Insert into Dom
           document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        deleteListItem:function(selectID){
            let el;
            el=document.getElementById(selectID);
            el.parentNode.removeChild(el);///Dom RemoveChild syntax::Node.parentNode.removeChild(node)

        },
        clearField:function(){
            let fields,fieldsArry;
            fields=document.querySelectorAll(DomString.inputdescription+','+DomString.inputValue);
            fieldsArry=Array.prototype.slice.call(fields);

            fieldsArry.forEach(function(current,index,array){
                current.value="";

            });
            fieldsArry[0].focus();


        },
        displayBudget:function(obj){
            let type;
            obj.budget>0?type='inc':type='exp';
            document.querySelector(DomString.budget).textContent=formateNum(obj.budget,type);
            document.querySelector(DomString.budgetIncome).textContent=formateNum(obj.totalInc,'inc');
            document.querySelector(DomString.budgetExpenses).textContent=formateNum(obj.totalExp,'exp');


            if(obj.percentage>0){
                document.querySelector(DomString.budget_expense_percentage).textContent=obj.percentage+'%';
            }else{
                document.querySelector(DomString.budget_expense_percentage).textContent='--';
            }
            
            
        },
        displayPercentages:function(percentages){
            let fields;
            fields=document.querySelectorAll(DomString.item__percentage);

            NodeForEach(fields,function(current,index){
                if(percentages[index]>0){
                    current.textContent=percentages[index]+'%';
                }else{
                    current.textContent='---';
                }

            });
        },

        changeType:function(){
            let fields=document.querySelectorAll(DomString.inputType+','+DomString.inputdescription+','+DomString.inputValue);
          
            NodeForEach(fields,function(current){

                current.classList.toggle('red-focus');

            });
            document.querySelector(DomString.inputBtn).classList.toggle('red');

        },
        displaymonth:function(){

            let months=['January','February','March','Aprill','May','June','July','August','September','October','November','December'];
            let now=new Date();
            let year=now.getFullYear();
            let month=now.getMonth();

            document.querySelector(DomString.month).textContent=months[month]+' '+year;

        },
        getDomString:function(){
            return DomString;
        },
       
    };
    

})();
let controller=(function(budgetCtrl,uiCtrl){

    let Dom=uiCtrl.getDomString();
    let setEventListener=function(){
    document.querySelector(Dom.inputBtn).addEventListener('click',ctrlAddItem);
    document.addEventListener('keypress',function(event){

        if(event.keyCode===13||event.which===13){
          ctrlAddItem();
        }
        
    });

    document.querySelector(Dom.container).addEventListener('click',ctrldeleteItem);
    document.querySelector(Dom.inputType).addEventListener('change',uiCtrl.changeType);

    };

    let updateBudget=function(){
        //1.calculate budget
        budgetCtrl.calculateBudget();

        //2.return budget
        let budget=budgetCtrl.getBudget();

        //2.display budget in Ui
        uiCtrl.displayBudget(budget);
    };

    let updatePercentage=function(){
        //1.calculate percentage

        budgetCtrl.calculateExpPercentage();
        //2.read percentage from ui controller
        var j=budgetCtrl.getPercentages();
        console.log(j);
        //3.update the ui percentage
        uiCtrl.displayPercentages(j);

    };

    let ctrldeleteItem=function(event){
        let itemID,splitId,type,ID;
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitId=itemID.split('-');
            type=splitId[0];
            ID=parseInt(splitId[1]);

            //1. delete item from data Structure
              budgetCtrl.deleteItem(type,ID);

            //2.delete item from ui
            uiCtrl.deleteListItem(itemID);

            //3.update budget and show new budget
            updateBudget();
            //4.calculate and update percentage
            updatePercentage();

        }
        
        
    };

    let  ctrlAddItem=function(){
        var input,getNewItem;
         //1.get input
         input=uiCtrl.getInput();

         if(input.desc!=='' && !isNaN(input.value) && input.value>0){
              //2.add in budget
        getNewItem=budgetCtrl.addItem(input.type,input.desc,input.value);
        //3.add item in UI
        console.log(getNewItem.id+''+getNewItem.description,getNewItem.value);
        uiCtrl.addLisItem(getNewItem,input.type);
        //4.clear the fields
        uiCtrl.clearField();
        //5.calculate and update budget
        updateBudget();

        //6.calculate and update percentage
        updatePercentage();
        
         }
       
    }
    
  return{
      init:function(){
          uiCtrl.displaymonth();
          uiCtrl.displayBudget({
            budget:0,
            totalInc:0,
            totalExp:0,
            percentage:-1
          });
          setEventListener();
      }
  }

})(budgetController,UiController);
controller.init();