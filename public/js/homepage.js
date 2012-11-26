 function go(el){
   $('html, body').animate({
     scrollTop: ($(el).offset().top -10)
   }, 300);
   
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


$(document).ready(function(){

    $('section').hide().removeClass('hidden');//hidden class is just used to hide while loading JS...
    
    
   $('.main > h1').click(function(ev){
     //console.log(this);
     if(! $(this).hasClass('open')) go(this); //scroll to section if we open it…
     
     $(this).toggleClass('open').next('section').slideToggle(300);
   });
   
   //load a static animation!
   $.getJSON('json/test2.json', function(data) {
     console.log(data.length +' animation frames!');
     asciicam.playSequence(data);
   });
   
   
   //ascii color change
   colorInterval = setInterval(function() { 
     var col = get_random_color(); 
    // console.log(col);
     $('#asciiText').css('color', col);
     }, 2200);
   
   
   
   $('#contact_form').submit(function(ev){
     ev.preventDefault();
     //alert(this);
     var msg = $('#contact_msg').val();
     
     $('.contact_thanks').removeClass('hidden').slideDown(500);
     $('#contact_form').slideUp(100);
     console.log(msg);
     
     
     $.ajax({
       type: 'POST',
       url: 'email.php',
       data: { msg:msg } 
     });
     
     
     
     return false;
   })
   
   
   
   
   
   
   
});
