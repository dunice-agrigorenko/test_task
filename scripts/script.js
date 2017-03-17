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

  var dataArray = localStorage.data ? JSON.parse(localStorage.getItem("data")) : [];//переменная перевод массива из json'a в JS объект
//--------------------------------------------------------------------------------------------------------------------------------/\
    $('input[type=radio][name=rbtn]').change(function() {
        if (this.id == 'all') {
        	for( i=0; i<dataArray.length; i++) {          
          		if( (dataArray[i].done == true)||(dataArray[i].done == false)){
             		$("tr[data-id="+dataArray[i].id+"]").css("display","");  
         		}
        	}
        }
        else if (this.id == 'completed') {

        	for( i=0; i<dataArray.length; i++) {  
        	$("tr[data-id="+dataArray[i].id+"]").css("display","");          
          		if( dataArray[i].done == false){
             		$("tr[data-id="+dataArray[i].id+"]").css("display","none");  
         		}
        	}
        }
        else if(this.id == 'not_completed'){
        	for( i=0; i<dataArray.length; i++) { 
        	$("tr[data-id="+dataArray[i].id+"]").css("display","");           
          		if( dataArray[i].done == true){
             		$("tr[data-id="+dataArray[i].id+"]").css("display","none");  
         		}
        	}
        }
    });
//--------------------------------------------------------------------------------------------------------------------------------\/
    
    if(dataArray!==null){ //если массив не пустой, то создаем строку таблицы  с соотв. данными из local storage
      for (var i = 0; i < dataArray.length; i++) {        
        $('tbody').append("<tr data-id="+dataArray[i].id+">\
        <td><label><input class='checkbox_class' type='checkbox' "+(dataArray[i].done?"checked":"")+">done</input></label></td>\
        <td class='editable_cell'>"+dataArray[i].title+"</td>\
        <td class='editable_cell'>"+dataArray[i].author+"</td>\
        <td>"+dataArray[i].updated+"</td>\
        <td><button class='delete_button'>Delete</button></td>\
       </tr>");
      }  
  }

//--------------------------------------------------------------------------------------------------------------------------------\/

    $('#clear_all').click(function () {
         
        //Удалить из local storage
      //Ищем элемент в local storage по id
        for( i=dataArray.length; i>=0; i--) {          
          dataArray.splice(i,1);//Удаляем
          var serialObj = JSON.stringify(dataArray); //сериализуем его 
          localStorage.setItem("data", serialObj); //запишем его в хранилище
          $('tbody>tr').css("background-color","#FF3700");
          $('tbody>tr').fadeOut(400);
      }
    })

//--------------------------------------------------------------------------------------------------------------------------------/\

  //клик по кнопке добавить
    $('#add').click(function () {
      temp_date = currentDate();
      var obj = {
        id: +new Date(),
        title: $('#title').val(),      
        author: $('#author').val(),
        done: false,
        updated: temp_date
    };    
    
    if (($('#title').val()!=='')&&($('#author').val()!= "")){
    
    //Если массив отсутствует
    if(dataArray===null){
      dataArray = [];//Создаем пустой массив
    }
    dataArray[dataArray.length] = obj;

    var serialObj = JSON.stringify(dataArray); //сериализуем его 
    localStorage.setItem("data", serialObj); //запишем его в хранилище
       $('tbody').append("<tr data-id="+obj.id+">\
        <td><label><input class='checkbox_class' type='checkbox'>done</input></label></td>\
        <td class='editable_cell'>"+obj.title+"</td>\
        <td class='editable_cell'>"+obj.author+"</td>\
        <td>"+temp_date+"</td>\
        <td><button class='delete_button'>Delete</button></td>\
       </tr>"); 

       }
       else {
        alert('The field can not be empty')
       }

    });


  //Удаление записи
  $('tbody').on('click', '.delete_button', function() {
        var tr = $(this).closest('tr');
        
        //Удалить из local storage
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


//-------------------------------------------------------------------------------------------------------------------------------\/
  //Удаление записей с done=true
    $('#rm_completed').click(function () {
        //Ищем элемент в local storage по id
        for( i=0; i<dataArray.length; i++) {          
        	if( dataArray[i].done == true){
            	$("tr[data-id="+dataArray[i].id+"]").css("background-color","#FF3700"); 
        		$("tr[data-id="+dataArray[i].id+"]").fadeOut(400);
        		dataArray.splice(i,1);//Удаляем
        		i--
        	} 
        }	
      var serialObj = JSON.stringify(dataArray); //сериализуем его 
      localStorage.setItem("data", serialObj); //запишем его в хранилище
    });
//-------------------------------------------------------------------------------------------------------------------------------/\

  //Удаление записей с done=true
 
  //Изменение ячейки строки
  $('tbody').on('dblclick', '.editable_cell', function() {
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
      localStorage.setItem("data", serialObj); //запишем его в хранилище
      }      
  });//$('tbody').load("dataArray #block")
});






/* //реализация без промпт
$('#my_table .aaa').dblclick(function() {
  if( $(this).attr('contenteditable') !== undefined ){
    $(this).removeAttr('contenteditable');
  }else{
    $(this).attr('contenteditable', '');
  };
});*/