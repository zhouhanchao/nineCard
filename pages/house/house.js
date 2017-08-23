(function () {
    const personNum = 4; //游戏有几个人
    var isHidden = "block";
    var timing = 3; // 倒计时
    $(function () {
        if (personNum == 4) {
            forPerson(personNum);
            personIndex();
            var transform = [{top:"85%"},{top:"50%",left:"75%"},{top:"15%"},{top:"50%",left:"25%"}];
        }
        else if (personNum == 8) {
            forPerson(personNum);
            var transform = [{top:"85%"},{top:"75%",left:"75%"},{top:"50%",left:"75%"},{top:"25%",left:"75%"},{top:"15%"},{top:"25%",left:"25%"},{top:"50%",left:"25%"},{top:"75%",left:"25%"}];
        }
        
        
        function cardDeal (personNum,i,index){ // 发牌
            $('#cardBehind').show();
            var argu = arguments;
            if(index < personNum){
            i = i > personNum-1 ? 0 : i;
            var cardHtml = '<div class="group g'+i+'">\
                                <img src="../../image/card/behind.png">\
                                <img src="../../image/card/behind.png">\
                            </div>';
            $('#cardBehind').append(cardHtml);
                $('#cardBehind .g'+i+'').animate(transform[i],"fast",function(){
                    argu.callee(personNum,++i,++index)
                });
            }else {
                $('#cardBehind .group.base').fadeOut("fast",function(){
                    $(this).remove();
                });
            }
        }
        function personIndex(){ //四个人时准备按钮的位置
            $('#table .person.person1').css({bottom: "-50px",left: "50%",marginLeft:"-30px"});
            $('#table .person.person2').css({top:"50%",right:"-10px",marginTop:"-40px"});
            $('#table .person.person3').css({top: "-10px",left: "50%",marginLeft:"-30px"});
            $('#table .person.person4').css({top:"50%",left:"-10px",marginTop:"-40px"});
            $('#table .readyBtn.r1').css({bottom:"15%",left:"50%",marginLeft:"-18px"});
            $('#table .readyBtn.r2').css({top:"50%",right:"20%"});
            $('#table .readyBtn.r3').css({top:"10%",left:"50%",marginLeft:"-18px"});
            $('#table .readyBtn.r4').css({top:"50%",left:"20%"});
        }
        function forPerson(personNum) { //每个人以及对应的准备按钮
            var personHtml = "";
            var readyHtml = "";
            for (let i = 0; i < personNum; i++) {
                var j = i + 1;
                personHtml += '<div class="person person' + j + '">\
                                    <p class="avatar"><img src="../../image/eg_avatar.png" alt=""></p>\
                                    <p class="name">第' + j + '个人</p>\
                                    <p class="gold"><img src="../../image/gold.png" alt=""><span>' + j + '</span></p>\
                                </div>';
                readyHtml += '<div><img src="../../image/ready.png" class="'+isHidden+' readyBtn r' + j + '" alt=""></div>';
            }
            $('#table #man').html(personHtml);
            $('#table #readyBtn').html(readyHtml);
            
        }
        function countDown(time){ //倒计时
            var html = '<div id="timing">'+time+'</div>';
            $('#table').append(html);
            var interval = setInterval(function(){
                if(time == 0){
                    clearInterval(interval);
                    $("#table #timing").remove();//删除倒计时
                    $('#table #readyBtn').remove();//删除准备按钮
                    cardDeal(personNum,0,0); //调用发牌函数;
                }else{
                    time--;
                    $("#table #timing").text(time);
                }
            },1000);
        }
//        countDown(timing);
        
        
        $('.btns .ready').on('click',function(){
           $('#readyBtn .r1').show();
            $(this).hide();
//            cardDeal(personNum,0,0);
        });
    });
})();