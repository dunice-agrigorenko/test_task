
function currentDate(){ //функция получения новой даты

	Number.prototype.padLeft = function(base,chr){//проверка на длину строки и добавление 0
    var  len = (String(base || 10).length - String(this).length)+1;
    	return len > 0? new Array(len).join(chr || '0')+this : this;
	}

	var time = new Date()
	var testdate = time.getDate().padLeft() + '.' +  ( time.getMonth() + 1).padLeft() + '.' +   time.getFullYear() + ' ' +time.getHours() + ':' + time.getMinutes().padLeft();
    return testdate;
}
$(document).ready(function(){
	//При загрузке DOM 
	


	var dataArray = JSON.parse(localStorage.getItem("data"));//переменная перевод массива из json'a в JS объект
    
    if(dataArray!==null){ //если массив не пустой, то создаем строку таблицы  с соотв. данными из local storage
    	for (var i = 0; i < dataArray.length; i++) {    		
        $('#my_table').append("<tr data-id="+dataArray[i].id+">\
        	<td><label><input class='checkbox_class' type='checkbox' "+(dataArray[i].done?"checked":"")+">done</input></label></td>\
    		<td class='editable_cell'>"+dataArray[i].title+"</td>\
    		<td class='editable_cell'>"+dataArray[i].author+"</td>\
    		<td>"+dataArray[i].updated+"</td>\
    		<td><button class='delete_button'>Delete</button></td>\
   		 </tr>");
	    }  
	}

	$('#clear_all').click(function () {
		localStorage.clear();
		location.reload();
	});

	//клик по кнопке добавить
    $('#add').click(function () {
    	temp_date = currentDate(); // переменная содержащая массив который будем передавать в хранилище
    	alert(Date.now())
    	var obj = {
		    id: Date.now(),
		    title: $('#title').val(),		   
		    author: $('#author').val(),
		    done: false,
		    updated: temp_date
		};		
		
		if ((document.getElementById('title').value != "")&&(document.getElementById('author').value != "")){
		//Если пришел null 
		if(dataArray===null){
			dataArray = [];//Создаем пустой массив
		}
		dataArray[dataArray.length] = obj;

		var serialObj = JSON.stringify(dataArray); //сериализуем его 
		localStorage.setItem("data", serialObj); //запишем его в хранилище
		
    	 $('#my_table').append("<tr data-id="+obj.id+">\
        	<td><label><input class='checkbox_class' type='checkbox'>done</input></label></td>\
    		<td class='editable_cell'>"+obj.title+"</td>\
    		<td class='editable_cell'>"+obj.author+"</td>\
    		<td>"+temp_date+"</td>\
    		<td><button class='delete_button'>Delete</button></td>\
   		 </tr>");   
    	 	location.reload();
    	 }
    	 else {
    	 	alert('The field can not be empty')
    	 }

    });


	//Удаление записи
	$('#my_table').on('click', '.delete_button', function() {

        var tr = $(this).closest('tr');
        
        //Удалить из local storage -----------------------------
	    //Ищем элемент в local storage по id
        for( i=0; i<dataArray.length; i++) {        	
		    if( dataArray[i].id == tr.attr('data-id')){
		    	dataArray.splice(i,1);//Удаляем
		    	break;
		    } 
		}
		var serialObj = JSON.stringify(dataArray); //сериализуем его 
		localStorage.setItem("data", serialObj); //запишем его в хранилище

        tr.css("background-color","#FF3700");
        tr.fadeOut(400, function(){
            tr.remove();
        });
        return false;
    });
	

    //КЛик на чекбокс 
    $(document).on('change', '.checkbox_class', function(){ 
	   var tr = $(this).closest('tr');

	   for( i=0; i<dataArray.length; i++) {
		    if( dataArray[i].id == tr.attr('data-id')){
		    	dataArray[i].done = $(this).prop('checked');
		    	dataArray[i].updated = currentDate();
		    	break;
		    } 
		}
		var serialObj = JSON.stringify(dataArray); //сериализуем его 
		localStorage.setItem("data", serialObj); //запишем его в хранилище
	});
    

	//Изменение ячейки строки
	$('#my_table').on('dblclick', '.editable_cell', function() {
  		var OriginalContent = $(this).text();
  		var tr = $(this).closest('tr');
  		//tr.children().eq(3).text(currentDate());//Меняем дату
	    var inputNewText = prompt("Enter new content for:", OriginalContent);

	    if(inputNewText==""){
	    	alert("Enter text, please!")
	    }else if (inputNewText!=null){
	    	//Меняем на форме
	    	$(this).text(inputNewText)
	    	//Меняем в local storage
	    	for( i=0; i<dataArray.length; i++) {
			    if( dataArray[i].id == tr.attr('data-id')){
			    	if($(this).index()==1){
			    		dataArray[i].title = inputNewText;
			    	}else if($(this).index()==2){
			    		dataArray[i].author = inputNewText;
			    	}
			    	dataArray[i].updated = currentDate();
			    	break;
			    } 
			}
			tr.children().eq(3).text(currentDate());//Меняем дату
			var serialObj = JSON.stringify(dataArray); //сериализуем его 
			localStorage.setItem("data", serialObj); //запишем его в хранилище по ключу "myKey"
			location.reload();
	    }      
	});
	
});




/* //реализация без промпт
$('#my_table .aaa').dblclick(function() {
  if( $(this).attr('contenteditable') !== undefined ){
    $(this).removeAttr('contenteditable');
  }else{
    $(this).attr('contenteditable', '');
  };
});*/