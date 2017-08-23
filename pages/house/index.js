var game = {
    personNum: 4 //游戏有几个人
    , banker: 0 //庄家
    , totalGame: 2
    , nowGame: 1
    , isHidden: "hidden"
    , timing: 3 // 初始倒计时
    , transform4: [{ // 4人时位置
        top: "85%"
    }, {
        top: "50%"
        , left: "75%"
    }, {
        top: "15%"
    }, {
        top: "50%"
        , left: "25%"
    }]
    , transform8: [{ // 8人时位置
        top: "85%"
    }, {
        top: "75%"
        , left: "75%"
    }, {
        top: "50%"
        , left: "75%"
    }, {
        top: "25%"
        , left: "75%"
    }, {
        top: "15%"
    }, {
        top: "25%"
        , left: "25%"
    }, {
        top: "50%"
        , left: "25%"
    }, {
        top: "75%"
        , left: "25%"
    }]
    , init: function () {// 游戏初始化
        $('.totalGame').text(this.totalGame);
        $('.nowGame').text(this.nowGame++);
        this.banker = Math.floor(Math.random()*8); //模拟随机庄家
        this.forPerson(this.personNum);
        this.forReadyState(this.personNum);
        if (this.personNum == 4) {
            this.personIndex();
        }
        this.isAllReady(this.personNum);
    }
    , cardDeal: function (personNum, i, index) { // 发牌动画
        var _this = this;
        $('#cardBehind').show();
        var argu = arguments;
        var transform = null;
        if (index < personNum) {
            i = i > personNum - 1 ? 0 : i;
            var cardHtml = '<div class="group g' + i + '">\
                                <img src="../../image/card/behind.png">\
                                <img src="../../image/card/behind.png">\
                            </div>';
            if (personNum == 4) {
                transform = _this.transform4;
            }
            else if (personNum == 8) {
                transform = _this.transform8;
            }
            $('#cardBehind').append(cardHtml);
            $('#cardBehind .g' + i + '').animate(transform[i], "fast", function () {
                argu.callee.call(_this, personNum, ++i, ++index); //递归调用，绑定this
            });
        }
        else {
            $('#cardBehind .group.base').fadeOut("slow", function () {
                $(this).remove();
                _this.cardTurn();
                
            });
        }
    }
    , cardTurn: function(){ // 自己翻牌
        var _this = this,
            imgList = $('#cardBehind .group.g0>img');
        $(imgList).addClass('rotateY');
        setTimeout(function(){
            for(let i=0;i<imgList.length;i++){
                imgList[i].src = "../../image/card/p"+(Math.floor(Math.random()*20+1))+".png";
            }
            $(imgList).removeClass('rotateY');
            _this.betBtn(); // 调用下注
        },1500);
    }
    , allCardTurn: function(){ // 所有人翻牌
        var _this = this,
            imgList = $('#cardBehind .group:not(.g0)>img');
        $(imgList).addClass('rotateY');
        setTimeout(function(){
            for(let i=0;i<imgList.length;i++){
                imgList[i].src = "../../image/card/p"+(Math.floor(Math.random()*20+1))+".png";
            }
            $(imgList).removeClass('rotateY');
            _this.countNum(_this.personNum);
        },1500);
    }
    , betBtn: function(){ // 下注
        var _this = this,
            betHtml = '<div class="btns score">\
                            <button>1倍</button>\
                            <button>2倍</button>\
                            <button>3倍</button>\
                            <button>4倍</button>\
                        </div>';
        $('#table').append(betHtml);
        _this.countDown(3,2);
        $(document).one('click','#table .btns.score button',function(){
            $(this).parent().remove();
        });
        
    }
    , countNum: function(personNum){ // 一局所得分数
        var scoreHtml = '';
        var transform = null;
        if (personNum == 4) {
            transform = this.transform4;
        }
        else if (personNum == 8) {
            transform = this.transform8;
        }
        for (let i = 0; i < personNum; i++) {
            scoreHtml += '<div class="hidden">+'+(Math.floor(Math.random()*100))+'</div>';
        }
        $('#table #scoreNum').html(scoreHtml);
        for (let j = 0; j < personNum; j++) {
            $('#table #scoreNum>div').eq(j).css(transform[j]);
            $('#table #scoreNum>div').eq(j).fadeIn('fast').animate({marginTop:0},'slow');
        }
        this.clearTable();
    }
    , clearTable: function(){ // 重新开始游戏
        var _this = this,
            betHtml = '<div class="btns">\
                            <button>申请上庄</button>\
                            <button class="ready">准备</button>\
                        </div>';
        $('#table').append(betHtml);
        
        $(document).one('click','#table .btns .ready',function(){ // one确保点击只执行一次
            if(_this.nowGame <= _this.totalGame){
                $(this).parent().remove();
                $('#cardBehind').html('<div class="group base"> <img src="../../image/card/behind.png"> <img src="../../image/card/behind.png"> </div>').hide();
                $('#readyBtn').html('<div><img src="../../image/ready.png" class="block readyBtn r1"></div>');
                $('#scoreNum').html('');
                _this.init();
            }else{
                alert('Game Over');
            }
        });
    }
    , countDown: function (time,state) { // 倒计时
        var _this = this;
        var html = '<div id="timing">' + time + '</div>';
        $('#table').append(html);
        var interval = setInterval(function () {
            if (time == 0) {
                clearInterval(interval);
                interval = null;
                $("#table #timing").remove(); //删除倒计时
                $('#table #readyBtn').html(''); //清空准备状态
                if(state && state==1){ //准备完毕
                    _this.cardDeal(_this.personNum, _this.banker, 0); //调用发牌函数;
                }else if(state==2){ //下注完毕
                    $("#table .btns").remove();  
                   _this.allCardTurn();
                }
            }
            else {
                time--;
                $("#table #timing").text(time);
            }
        }, 1000);
    }
    , forPerson: function (personNum) { // 每个人的位置
        var personHtml = "";
        for (let i = 0; i < personNum; i++) {
            var j = i + 1;
            personHtml += '<div class="person person' + j + '">\
                                <p class="avatar"><img src="../../image/eg_avatar.png" alt=""></p>\
                                <p class="name">第' + j + '个人</p>\
                                <p class="gold"><img src="../../image/gold.png" alt=""><span>' + j + '</span></p>';
            if(i == this.banker){
                personHtml += '<span class="banker">庄</span>';
            }
            personHtml += '</div>';
        }
        $('#table #man').html(personHtml);
    }
    , forReadyState: function(personNum){ // 每个人对应的准备状态
        var readyHtml = "";
        var len = $('#table #readyBtn div img.r1').length;
        for (let i = 0; i < personNum; i++) {
            var j = i + 1;
            if(len>0){
                len = 0;
            }else{
                readyHtml += '<div><img src="../../image/ready.png" class="' + this.isHidden + ' readyBtn r' + j + '"></div>';
            }
        }
        $('#table #readyBtn').append(readyHtml);
        $('#table #readyBtn div>img').map(function(i,item){ //随机时间模拟准备状态
            setTimeout(function(){
                if(!$(item).hasClass('r1')){
                    $(item).show(); //r1视为自己
                }
            },Math.random()*4000+1000);
        });
        $(document).one('click','#table .btns .ready',function(){
            $('#readyBtn div img.r1').show();
            $(this).parent().remove();
        });
    }
    , isAllReady: function(personNum){ // 检测每个人是否准备好
        var _this = this;
        var interval = setInterval(function(){
            var num = 0;
            $('#table #readyBtn div>img').map(function(i,item){
                if($(item).css('display') == "block"){
                    ++num;
                }
            });
            if(num == personNum){
                clearInterval(interval);
                interval = null;
                _this.countDown(_this.timing,1);
            }
        },1000);
    }
    , personIndex: function () { // 初始如果是4人，则改变位置
        $('#table .person.person1').css({
            bottom: "-50px"
            , left: "50%"
            , marginLeft: "-30px"
        });
        $('#table .person.person2').css({
            top: "50%"
            , right: "-10px"
            , marginTop: "-40px"
        });
        $('#table .person.person3').css({
            top: "-10px"
            , left: "50%"
            , marginLeft: "-30px"
        });
        $('#table .person.person4').css({
            top: "50%"
            , left: "-10px"
            , marginTop: "-40px"
        });
        $('#table .readyBtn.r1').css({
            bottom: "15%"
            , left: "50%"
            , marginLeft: "-18px"
        });
        $('#table .readyBtn.r2').css({
            top: "50%"
            , right: "20%"
        });
        $('#table .readyBtn.r3').css({
            top: "10%"
            , left: "50%"
            , marginLeft: "-18px"
        });
        $('#table .readyBtn.r4').css({
            top: "50%"
            , left: "20%"
        });
    }
}



game.init();