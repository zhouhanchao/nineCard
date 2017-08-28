var game = {
    personNum: 8 //游戏有几个人
    , banker: 0 //庄家
    , totalGame: 8
    , nowGame: 1
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
    , init: function () { // 游戏初始化
        $('.totalGame').text(this.totalGame);
        $('.nowGame').text(this.nowGame);
        this.banker = Math.floor(Math.random() * this.personNum); //模拟随机庄家
        this.falseData(this.personNum);
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
            transform = personNum <= 4 ? _this.transform4 : _this.transform8;
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
    , cardTurn: function () { // 自己翻牌
        var _this = this
            , imgList = $('#cardBehind .group.g0>img');
        $(imgList).addClass('rotateY');
        setTimeout(function () {
            for (let i = 0; i < imgList.length; i++) {
                imgList[i].src = "../../image/card/p" + (Math.floor(Math.random() * 20 + 1)) + ".png";
            }
            $(imgList).removeClass('rotateY');
            _this.betBtn(); // 调用下注
        }, 1500);
    }
    , allCardTurn: function () { // 所有人翻牌
        var _this = this
            , imgList = $('#cardBehind .group:not(.g0)>img');
        $(imgList).addClass('rotateY');
        setTimeout(function () {
            for (let i = 0; i < imgList.length; i++) {
                imgList[i].src = "../../image/card/p" + (Math.floor(Math.random() * 20 + 1)) + ".png";
            }
            $(imgList).removeClass('rotateY');
            _this.countNum(_this.personNum);
        }, 1500);
    }
    , betBtn: function () { // 下注
        var _this = this
            , betHtml = '<div class="btns score">\
                            <button>1倍</button>\
                            <button>2倍</button>\
                            <button>3倍</button>\
                            <button>4倍</button>\
                        </div>';
        $('#table').append(betHtml);
        _this.countDown(1, 2);
        $(document).one('click', '#table .btns.score button', function () {
            $(this).parent().remove();
        });
    }
    , countNum: function (personNum) { // 一局所得分数
        var scoreHtml = '';
        var transform = null;
        transform = personNum <= 4 ? this.transform4 : this.transform8;
        for (let i = 0; i < personNum; i++) {
            scoreHtml += '<div class="hidden">+' + (Math.floor(Math.random() * 100)) + '</div>';
        }
        $('#table #scoreNum').html(scoreHtml);
        for (let j = 0; j < personNum; j++) {
            $('#table #scoreNum>div').eq(j).css(transform[j]);
            $('#table #scoreNum>div').eq(j).fadeIn('fast').animate({
                marginTop: 0
            }, 'slow');
        }
        this.clearTable();
    }
    , clearTable: function () { // 重新开始游戏
        var _this = this;
        var btn = this.nowGame < this.totalGame ? "准备" : "查看排行榜";
        var betHtml = '<div class="btns">\
                        <!--<button>申请上庄</button>-->\
                        <button class="ready">'+btn+'</button>\
                    </div>';
        $('#table').append(betHtml);
        $(document).one('click', '#table .btns .ready', function () { // one确保点击只执行一次
            ++_this.nowGame;
            if (_this.nowGame <= _this.totalGame) {
                $(this).parent().remove();
                $('#cardBehind').html('<div class="group base"> <img src="../../image/card/behind.png"> <img src="../../image/card/behind.png"> </div>').hide();
                $('#man div img.r1').show();
                $('#scoreNum').html('');
                _this.init();
            }
            else {
                location.href = "../ranking/ranking.html";
            }
        });
    }
    , countDown: function (time, state) { // 倒计时
        var _this = this;
        var html = '<div id="timing">' + time + '</div>';
        $('#table').append(html);
        var interval = setInterval(function () {
            if (time == 0) {
                clearInterval(interval);
                interval = null;
                $("#table #timing").remove(); //删除倒计时
                $('#table #man .readyBtn').hide(); //清空准备状态
                if (state && state == 1) { //准备完毕
                    _this.cardDeal(_this.personNum, _this.banker, 0); //调用发牌函数;
                }
                else if (state == 2) { //下注完毕
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
    , forPerson: function (personNum, data) { // 每个人的位置
        if (this.nowGame <= 1) {
            var personHtml = "";
            for (let i = 0; i < data.length; i++) {
                var j = i + 1;
                personHtml += '<div class="person person' + j + '">\
                                    <p class="avatar"><img src="' + data[i].avatar + '" alt=""></p>\
                                    <p class="name">' + data[i].name + '</p>\
                                    <p class="gold"><img src="../../image/gold.png" alt=""><span>' + data[i].gold + '</span></p>';
                
                personHtml += '<div><img src="../../image/ready.png" class="hidden readyBtn r' + j + '"></div>';
                personHtml += '</div>';
            }
            $('#table #man').html(personHtml);
        }
        console.log(this.banker);
        $('#table #man div.person').map(function(i,item){
            $(item).find('.banker').remove();
            
        });
        $('#table #man div.person').eq(this.banker).append('<span class="banker">庄</span>');
        $('#table #man div>img.readyBtn').map(function (i, item) { //随机时间模拟准备状态
            setTimeout(function () {
                if (!$(item).hasClass('r1')) { //r1视为自己
                    $(item).show(); 
                }
            }, Math.random() * 4000 + 1000);
        });
        $(document).one('click', '#table .btns .ready', function () {
            $('#man div img.r1').show();
            $(this).parent().remove();
        });
        if (personNum <= 4) {
            this.personIndex();
        }
    }
    , falseData: function (personNum) {
        var _this = this;
        var data = [
            {
                id: 1
                , name: 'ZHOU'
                , gold: '33'
                , avatar: '../../image/eg_avatar4.png'
            }
            , {
                id: 2
                , name: 'Mark'
                , gold: '12'
                , avatar: '../../image/eg_avatar5.png'
            }
            , {
                id: 1
                , name: 'Tom3'
                , gold: '33'
                , avatar: '../../image/eg_avatar2.png'
            }
            , {
                id: 1
                , name: 'Tom4'
                , gold: '33'
                , avatar: '../../image/eg_avatar3.png'
            }
            , {
                id: 1
                , name: 'Tom5'
                , gold: '33'
                , avatar: '../../image/eg_avatar5.png'
            }
            , {
                id: 1
                , name: 'Tom6'
                , gold: '33'
                , avatar: '../../image/eg_avatar2.png'
            }
            , {
                id: 1
                , name: 'Tom7'
                , gold: '33'
                , avatar: '../../image/eg_avatar.png'
            }
            , {
                id: 1
                , name: 'Tom8'
                , gold: '33'
                , avatar: '../../image/eg_avatar.png'
            }
        , ];
        this.forPerson(personNum, data);
    }
    , isAllReady: function (personNum) { // 检测每个人是否准备好
        var _this = this;
        var interval = setInterval(function () {
            var num = 0;
            $('#table #man div>img.readyBtn').map(function (i, item) {
                if ($(item).css('display') == "block") {
                    ++num;
                }
            });
            if (num == personNum) {
                clearInterval(interval);
                interval = null;
                _this.countDown(_this.timing, 1);
            }
        }, 1000);
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
        $('#table .readyBtn.r3').css({
            top: "115%"
            , left: "50%"
            , marginLeft: "-18px"
        });
        $('#table .readyBtn.r4').css({
            left: "120%"
        });
    }
}
game.init();