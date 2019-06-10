var category = '',
    FAQpageNo = 1,
    FAQpageSize = 3,
    tbodyFaq = $('.tbodyFAQ'),
    FAQprevPageLi = $('#prevPageFaq'),
    FAQnextPageLi = $('#nextPageFaq'),
    FAQcurrSpan = $('#FAQcurrSpan'),
    FAQtemplateSrc = $('#tr-template-faq').html(); // script 태그에서 템플릿 데이터를 꺼낸다.

//Handlebars를 통해 템플릿 데이터를 가지고 최종 결과를 생성할 함수를 준비한다.
var FAQtrGenerator = Handlebars.compile(FAQtemplateSrc);

// JSON 형식의 데이터 목록 가져오기
function FAQList(category, pn) {
  
  $.getJSON('../../app/json/faq/list?category=' + category + '&pageNo=' + pn + '&pageSize=' + FAQpageSize, 
    function(data) {
      // 서버에 받은 데이터 중에서 페이지 번호를 글로벌 변수에 저장한다.
      FAQpageNo = data.faqpageNo;
      
      // TR 태그를 생성하여 테이블 데이터를 갱신한다.
      tbodyFaq.html(''); // 이전에 출력한 내용을 제거한다.
      
      // 템플릿 엔진을 실행하여 tr 태그 목록을 생성한다. 그리고 바로 tbody에 붙인다.
      $(FAQtrGenerator(data)).appendTo(tbodyFaq);
      
      // 현재 페이지의 번호를 갱신한다.
      FAQcurrSpan.html(String(FAQpageNo));
      
      // 1페이지일 경우 버튼을 비활성화 한다.
      if (FAQpageNo == 1) {
        FAQprevPageLi.addClass('disabled');
      } else {
        FAQprevPageLi.removeClass('disabled');
      } 
        
      // 마지막 페이지일 경우 버튼을 비활성화 한다.
      if (FAQpageNo == data.faqtotalPage) {
        FAQnextPageLi.addClass('disabled');
      } else {
        FAQnextPageLi.removeClass('disabled');
      }
      
      // 데이터 로딩이 완료되면 body 태그에 이벤트를 전송한다.
      $(document.body).trigger('FAQ-list');
      
    }); // Bitcamp.getJSON()
  
} // FAQList()

//페이지를 출력한 후 1페이지 목록을 로딩한다.
//FAQList('', 1);

$(document).ready(function(){
  $('select').formSelect();
});


$('#faq-categories').change(function () {
  category = $('#faq-categories option:selected').html();
 console.log($('#faq-categories option:selected').html());
 if(category == '전체') {
   category = '';
   FAQList(category, 1);
 } else {
// $.getJSON('../../app/json/faq/list?category=' + $('#faq-categories option:selected').html(),
//     function(obj) {
     FAQList(category, 1);
// });
 }
});

$('.FAQprevPageLink').click((e) => {
  e.preventDefault();
  FAQList(category, FAQpageNo - 1);
});

$('.FAQnextpageLink').click((e) => {
  e.preventDefault();
  FAQList(category, FAQpageNo + 1);
});



// 테이블 목록 가져오기를 완료했으면 제목 a 태그에 클릭 리스너를 등록한다. 
//$(document.body).bind('loaded-list', () => {
//  // 제목을 클릭했을 때 view.html로 전환시키기
//  $('.bit-view-link').click((e) => {
//    e.preventDefault();
//    window.location.href = 'view.html?no=' + 
//      $(e.target).attr('data-no');
//  });
//});

$(document.body).bind('FAQ-list', () => {
  $('.bit-faq-link').click((e) => {
    e.preventDefault();
    if($(e.target).attr('id') == 'fold') {
      $(e.target).attr('id', 'open');
      $.getJSON('../../app/json/faq/detail?no=' + $(e.target).attr('faq-no'),
          function(data2) {
        $(e.target).parent().parent().after('<tr><td></td><td>' + data2.content + '</td></tr>');
      });
      
    } else {
      $(e.target).attr('id', 'fold');
      $(e.target).parent().parent().next().remove();
    }
  });
  
})





