var pageNo = 1,
    pageSize = 7,
    tbody = $('tbody'),
    prevPageLi = $('#prevPage'),
    nextPageLi = $('#nextPage'),
    currSpan = $('#currPage > a'),
    search = '',
    searchCategory = '',
    templateSrc = $('#tr-template').html(); // script 태그에서 템플릿 데이터를 꺼낸다.

//Handlebars를 통해 템플릿 데이터를 가지고 최종 결과를 생성할 함수를 준비한다.
var trGenerator = Handlebars.compile(templateSrc);





// JSON 형식의 데이터 목록 가져오기
function loadList(pn, searchCategory, search) {
  var citys =  Array.apply(null, new Array(9)).map(Number.prototype.valueOf,0);
  if($('#city').val()!=0){
   citys = $('#city').val();
  }
  
  $.getJSON('../../app/json/freereview/list?pageNo=' + pn + '&pageSize=' + pageSize+ '&searchCategory=' + searchCategory + '&search=' +search,{
    
    citys : citys
    
  } ,
    function(obj) {

    
    // 서버에 받은 데이터 중에서 페이지 번호를 글로벌 변수에 저장한다.
      pageNo = obj.pageNo;
      
      // TR 태그를 생성하여 테이블 데이터를 갱신한다.
      tbody.html(''); // 이전에 출력한 내용을 제거한다.
      
      // 템플릿 엔진을 실행하여 tr 태그 목록을 생성한다. 그리고 바로 tbody에 붙인다.
      $(trGenerator(obj)).appendTo(tbody);
      
      // 현재 페이지의 번호를 갱신한다.
      currSpan.html(String(pageNo));
      
      // 1페이지일 경우 버튼을 비활성화 한다.
      if (pageNo == 1) {
        prevPageLi.addClass('disabled');
      } else {
        prevPageLi.removeClass('disabled');
      } 
        
      // 마지막 페이지일 경우 버튼을 비활성화 한다.
      if (pageNo == obj.totalPage) {
        nextPageLi.addClass('disabled');
      } else {
        nextPageLi.removeClass('disabled');
      }
      
      // 데이터 로딩이 완료되면 body 태그에 이벤트를 전송한다.
      $(document.body).trigger('loaded-list');
      
    }); // Bitcamp.getJSON()
  
} // loadList()

$('#prevPage > a').click((e) => {
  e.preventDefault();
  loadList(pageNo - 1,searchCategory, search);
});



$("#city").on("propertychange change keyup paste input", function() {
    loadList(1,searchCategory, search);

});

$('#nextPage > a').click((e) => {
  e.preventDefault();
  loadList(pageNo + 1,searchCategory, search);
});


//페이지를 출력한 후 1페이지 목록을 로딩한다.
loadList(1,searchCategory, search);

// 테이블 목록 가져오기를 완료했으면 제목 a 태그에 클릭 리스너를 등록한다. 
$(document.body).bind('loaded-list', () => {
  // 제목을 클릭했을 때 view.html로 전환시키기
  $('.bit-view-link').click((e) => {
    e.preventDefault();
    window.location.href = 'view.html?no=' + 
      $(e.target).attr('data-no');
  });
});

$('#add-btn').click(function () {
  if (!sessionStorage.getItem('loginUser')) {
     location.href = '/bitcamp-fit-tour/html/auth/login.html'
       return;
  }
  location.href = 'add.html'
});

$(document).ready(function() {
  $.get('/bitcamp-fit-tour/app/json/tour/autocomplete',function(obj){
    var autoCompleteData = new Array();
    for (var city of obj.cityList) {
      var auto = {};
      auto['id'] = city.no;
      auto['text'] = city.cityName;
      
     // if(city.no=='5'){
    //    auto['selected'] = true;
    //  }
      autoCompleteData.push(auto);
    }
    $('.selectCity').select2({
            
            width: "100%",
            data :  autoCompleteData,
            maximumSelectionLength: 8,
            language: "ko",
            placeholder: '도시를 선택하세요(최대 8개)'
    });
  });
});
 

