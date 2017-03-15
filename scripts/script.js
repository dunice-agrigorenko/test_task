var date= new Date()
alert(date)
$('#my_table .aaa').dblclick(function() {
  if( $(this).attr('contenteditable') !== undefined ){
    $(this).removeAttr('contenteditable');
  }else{
    $(this).attr('contenteditable', '');
  };
});