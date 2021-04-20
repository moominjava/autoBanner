//window객체는 웹 브라우저의 창을 나타내는 객체로, 대부분의 웹 브라우저에서지원하고 있다
//window객체는 객체의 계층 구조에서 최상의에 존재하며 가장 기본적으면서도 중요한 객체
//addEventListener 이벤트를 등록하는 가장 권장되는 방식, 여러개의 이벤트 핸들러를 등록할 수 있다
//addEventListener ie8이하 호환 되지 않는다
window.addEventListener('load', function(){

	//var 변수 선언시 작성한다.
	//var 선언과 생략의 차이: 선언시 메소드안에서만 사용가능함 / 선언하지 않을경우 전역변수로 어디서든 사용가능
    var MOVING_BANNER = 5,
        AUTO_TIME = 3000,
    
        //getElementById는 해당 ID가 선언된 함수를 찾는다.
        slide = document.getElementById('slide'),
        slide_num = document.getElementById('slide_num'),
        //getElementsByClassName는 클래스속성을 사용하여 접근한다.
        slide_UL = slide.getElementsByClassName('cnt'),
        //[0].getElementsByTagName특정 태그명을 가지고 있는 element의 집합을 가져오는 함수이다.
        slide_Li_item = slide_UL[0].getElementsByTagName('li'),
        prevBtn = slide.getElementsByClassName('prev'),
        nextBtn = slide.getElementsByClassName('next'),
        before = 0,
        after = 0,
        moveIng = false;

    //init_number_button
    //숫자버튼을 초기화하여 모두 회색버튼의 이미지를 부여한다.
    function init_number_button(){
    	//querySelector는 특정name이나 id를 제한하지 않고 css선택자를 서용해서 요소를 찾는다.
    	//setAttribute는 선택한 element(요소)의 속성값을 정한다.
    	document.querySelector(".num_img0").setAttribute("src", "img_banner/text_1.png");
		document.querySelector(".num_img1").setAttribute("src", "img_banner/text_2.png");
		document.querySelector(".num_img2").setAttribute("src", "img_banner/text_3.png");
		document.querySelector(".num_img3").setAttribute("src", "img_banner/text_4.png");
		document.querySelector(".num_img4").setAttribute("src", "img_banner/text_5.png");
		
    }
    //숫자버튼이 선택되었을 때 해당 버튼을 핑크이미지로 변경한다
    //target: 선택된 버튼의 숫자, 0부터 시작
    function select_number_button(target){
    	switch (target) {
		case 0:
			document.querySelector(".num_img0").setAttribute("src", "img_banner/text_1_on.png");
			break;
		case 1:
			document.querySelector(".num_img1").setAttribute("src", "img_banner/text_2_on.png");
			break;
		case 2:
			document.querySelector(".num_img2").setAttribute("src", "img_banner/text_3_on.png");
			break;
		case 3:
			document.querySelector(".num_img3").setAttribute("src", "img_banner/text_4_on.png");
			break;
		case 4:
			document.querySelector(".num_img4").setAttribute("src", "img_banner/text_5_on.png");
			break;
		default:
			break;
		}
    }
    
    // initEvent
    //처음시작시 style.left.값을 0으로 변경하여 시작
    slide_Li_item[0].style.left  = 0;
    //slide_num의 속성을 가지고 있는 element의 클래스에 ON을 부여한다, 배경을 핑크로 바꾼다
    slide_num.children[0].classList.add('on');
    //num_img0의 속성을 가지고 있는 element의 이미지주소(src)를 핑크이미지로 바꾼다, 핑크 숫자 적용
    document.querySelector(".num_img0").setAttribute("src", "img_banner/text_1_on.png");
    
    //숫자버튼의 갯수만큰 반복하면서 클릭여부를 확인한다.
    for(var j = 0;j < slide_num.children.length;j++){
        slide_numClick(j);
    };

    //nextBtn[0]한정 이벤트 리스너
    //nextBtn[0]버튼을 클릭할 경우 이벤트 실행, nextBtn[1]이 있다면 따로 지정해주어야 한다.
    nextBtn[0].addEventListener('click', function(e){
        if(!moveIng){
        	//after 다음 나올 배너순서를 지정한다
            after++;
            if(after >= slide_Li_item.length){
            	//after가 슬라이드의 갯수보다 커지면 다시 0을 부여함으로서 제일 처음의 배너를 가져올 수 있도록 한다.
                after = 0;
            };
            //move함수를 호출한다.
            move(after, before, 'next');
            before = after;
        };
    });

    //prevButton
    prevBtn[0].addEventListener('click', function(e){
        if(!moveIng){
        	//이전배너를 호출하기 위해 after에서 1을 빼준다
            after--;
            if(after < 0){
            	//after가 점점 작아져 0보다 작아지면 제일 처음의 배너까지 간 것이므로 
            	//다시 배너길이에서 1을 빼주어 맨 뒤의 배너를 호출한다.
                after = slide_Li_item.length - 1;
            };
            move(after, before);
            before = after;
        };
    });
    
    //autoPlay
    //지정시간마다 플레이 
    playSet = setInterval(function(){
        if(!moveIng){
        	//after를 1씩 증가 , 배너수보다 커질경우 다시 0을부여 
            after++;
            if(after >= slide_Li_item.length){
                after = 0;
            };
            move(after, before, 'next');
            before = after;
        };
    }, AUTO_TIME);

    //numbersButton
    function slide_numClick(target){
        slide_num.children[target].addEventListener('click', function(){
        	init_number_button();
        	select_number_button(target);
        	
            if(!moveIng){
                after = target;
                if(after > before){
                    move(after, before, 'next');
                }else if(after < before){
                    move(after, before);
                };
                before = after;
            };
        });
    }

    //slideBanner
    function move(after, before, type){
        var nextX = type === 'next' ? slide.offsetWidth : slide.offsetWidth * -1,
            prevX = 0,
            set = null;
        set = setInterval(function(){
            moveIng = true;
            if(type === 'next'){
                nextX -= MOVING_BANNER;
                slide_Li_item[after].style.left = nextX + 'px';
                if(nextX <= 0){
                    clearInterval(set);
                    nextX = slide.offsetWidth;
                    moveIng = false;
                };
                prevX -= MOVING_BANNER;
            }else{
                nextX += MOVING_BANNER;
                slide_Li_item[after].style.left = nextX + 'px';
                if(nextX >= 0){
                    clearInterval(set);
                    nextX = slide.offsetWidth * -1;
                    moveIng = false;
                };
                prevX += MOVING_BANNER;
            };
            slide_Li_item[before].style.left = prevX + 'px';
        });
        slide_num.children[before].classList.remove('on');
        init_number_button();
        slide_num.children[after].classList.add('on');
        select_number_button(after);
    }
});