var param = location.href.split('?')[1];

if (param) {
  $('h1').html('회원가입을 축하합니다');
  
  var el = $('.bit-standby-item');
  for (e of el) {
    e.style.display = 'none';
  }
} else {
  $('h1').html('이메일 인증을 부탁합니다.');
  
  var el = $('.bit-success-item');
  for (e of el) {
    e.style.display = 'none';
  }
}



$('#reEamil').click (() => {
  $.getJSON('../../app/json/signup/reeamil?email='+window.localStorage.standby, 
      function(data) {
    $("#reEamil").hide();
    alert(data.status);
    if(data.status == 'success') {
      location.href = 'success.html';  
    } else {
      alert('재 전송 실패 입니다.\n' + data.message);
    }
  });
});

