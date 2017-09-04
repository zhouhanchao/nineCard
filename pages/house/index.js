var game = {
    personNum: 8 // 游戏有几个人
    , banker: 0 // 庄家
    , totalGame: 8 //总局数
    , nowGame: 1 // 现在是第几局
    , timing: 0 // 初始倒计时
    , card: [] // 牌数组    
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
        var _this = this;
        $.getJSON("house.json",function(data){ // 获取所有牌
            $.each(data.data,function(i,item){
                _this.card.push(item);
            });
        });
        $('.totalGame').text(this.totalGame);
        $('.nowGame').text(this.nowGame);
        this.banker = Math.floor(Math.random() * this.personNum); //每一把随机庄家
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
            , imgList = $('#cardBehind .group.g0>img'); // g0 为自己 
        $(imgList).addClass('rotateY');
        setTimeout(function () {
            for (let i = 0; i < imgList.length; i++) {
                let j = Math.floor(Math.random() * _this.card.length); // 随机循环出一个当前牌数组长度的值
                let card = _this.card.splice(j,1)[0]; // 切割一个值，当前牌数组长度减少
                imgList[i].src = card.src;
                imgList[i].setAttribute('data-id',card.id);
                imgList[i].setAttribute('data-dot',card.dot);
            }
            $(imgList).removeClass('rotateY');
            _this.betBtn(); // 调用下注
        }, 1500);
    }
    , betBtn: function () { // 下注
        var hidden = this.banker == 0 ? "hidden" : "block"; // 自己是庄家，则不能下注。
        var _this = this
            , betHtml = '<div class="btns score '+hidden+'">\
                            <button>1倍</button>\
                            <button>2倍</button>\
                            <button>3倍</button>\
                            <button>4倍</button>\
                        </div>';
        $('#table').append(betHtml);
        _this.countDown(3, 2);
        $(document).one('click', '#table .btns.score button', function (e) {
            $('#man .person1 .downScore').text($(e.target).text()).show();
            $(this).parent().hide();
        });
    }
    , allCardTurn: function () { // 所有人翻牌
        var _this = this
            , imgList = $('#cardBehind .group:not(.g0)>img');
        $(imgList).addClass('rotateY');
        setTimeout(function () {
            for (let i = 0; i < imgList.length; i++) {
                let j = Math.floor(Math.random() * _this.card.length); 
                let card = _this.card.splice(j,1)[0];
                imgList[i].src = card.src;
                imgList[i].setAttribute('data-id',card.id);
                imgList[i].setAttribute('data-dot',card.dot);
            }
            $(imgList).removeClass('rotateY');
            _this.compareNum(_this.personNum);
        }, 1500);
    }
    , compareNum: function(personNum){ // 调用计算函数计算牌值大小
        var list = [],result = [];
        for(let i=0;i<personNum;i++){
            let img = $('#cardBehind .group').eq(i).find('img');
            list[i] = [];
            for(let j=0;j<img.length;j++){
                list[i][j] = {};
                list[i][j].id = $(img)[j].getAttribute('data-id');
                list[i][j].dot = $(img)[j].getAttribute('data-dot');
            }
            result[i] = calculateNum(list[i]); //count.js 算法 ，对比权重
        }
        this.compareFun(result);
        

    }
    , compareFun: function(arr){ // 每个人与庄家比较大小
        var result = [];
        var bankerResult = arr.splice(0,1)[0]; // 庄家的结果
        var bankerScore = 0;
        var banker = $('.banker').parent().index();
        for(let i=0;i<arr.length;i++){
            let data = {};
            let j = (i + banker + 1)% this.personNum;
            let person = $('#man .person').eq(j);
            let personScore = parseInt($(person).find('.downScore').text());
            
            if(arr[i] > bankerResult){ //闲家大于庄家
                data.score = "+"+personScore;
            }else{
                data.score = "-"+personScore;
            }
            data.index = $(person).index();
            data.name = $(person).find('.name').text();
            bankerScore -= parseInt(data.score);
            result.push(data);
        }
        bankerScore = bankerScore>=0 ? ("+"+bankerScore.toString()) : bankerScore.toString();
        result.unshift({score: bankerScore,index: banker,name: $('.banker').siblings('.name').text()}); // 把庄家的得分放入结果第一位
//        console.log(result)
        this.countNum(this.personNum,result)
    }
    , countNum: function (personNum,arr) { // 一局所得分数
        var scoreHtml = '';
        var transform = null;
        transform = personNum <= 4 ? this.transform4 : this.transform8;
        
        arr.sort(function(val1,val2){ // 数组重新排序，自己在最前面
            if(val1.index>=0 && val2.index>=0){
                return val1.index - val2.index;
            }
        });
        $.each(arr,function(i,item){
           let name = $('#man .person').eq(item.index).find('.name').text();
            if(name == item.name){
                if(item.score >=0){
                    scoreHtml += '<div class="hidden">' + item.score + '</div>';
                }else {
                    scoreHtml += '<div class="hidden" style="color:red">' + item.score + '</div>';
                }
            }
        });
        $('#table #scoreNum').html(scoreHtml);
        for (let j = 0; j < personNum; j++) { // 得分出现样式
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
            if (_this.nowGame <= _this.totalGame) { // 是否超出总局数
                $(this).parent().remove();
                $('#cardBehind').html('<div class="group base"> <img src="../../image/card/behind.png"> <img src="../../image/card/behind.png"> </div>').hide(); // 新一局重新放两张基础背景牌
                $('#man div img.r1').show();
                $('#man .person .downScore').text('0').hide(); // 得分归0 并隐藏
                $('#scoreNum').html(''); // 清除分数
                _this.init();
            }
            else {
                location.href = "../ranking/ranking.html"; // 去结果页
            }
        });
    }
    , countDown: function (time, state) { // 倒计时
        var _this = this;
        var html = '<div id="timing">' + time + '</div>';
        $('#table').append(html);
        var interval = setInterval(function () {
            if (time == 0) { // 倒计时结束
                clearInterval(interval);
                interval = null;
                $("#table #timing").remove(); //删除倒计时
                $('#table #man .readyBtn').hide(); //清空准备状态
                if (state && state == 1) { //准备完毕
                    _this.cardDeal(_this.personNum, _this.banker, 0); //调用发牌函数;
                }
                else if (state == 2) { //下注完毕
                    var one = $("#table .btns.score button").eq(0).text(); // 最低倍数
                    $('#man .person').each(function(i,item){ // 没下注的都是最低数
                       var num = $(item).find('span.downScore').text();
                       if(num == 0){
                           $(item).find('span.downScore').text(one);
                           if($(item).find('.banker').length == 0){ // 庄家的倍数不显示
                                $(item).find('span.downScore').show();
                           }
                       }
                    });
                    $("#table .btns.score").remove();
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
                                    <p class="gold"><img src="../../image/gold.png" alt=""><span>' + data[i].gold + '</span></p>\
                                    <span class="downScore hidden">'+data[i].downScore+'</span>\
                                    <div><img src="../../image/ready.png" class="hidden readyBtn r' + j + '"></div>\
                                </div>';
            }
            $('#table #man').html(personHtml);
        }
        $('#table #man div.person').map(function(i,item){ // 清除上一把的庄家标识
            $(item).find('.banker').remove();
        });
        $('#table #man div.person').eq(this.banker).append('<span class="banker">庄</span>'); // 重新设置新庄家
        $('#table #man div>img.readyBtn').map(function (i, item) { //随机时间模拟准备状态
            setTimeout(function () {
                if (!$(item).hasClass('r1')) { //r1视为自己
                    $(item).show(); 
                }
            }, Math.random() * 4000 + 1000);
        });
        $(document).one('click', '#table .btns .ready', function () { // 准备按钮点击
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
                , downScore: 0
                , gold: '33'
                , avatar: '../../image/eg_avatar4.png'
            }
            , {
                id: 2
                , name: 'Mark'
                , downScore: 0
                , gold: '12'
                , avatar: '../../image/eg_avatar5.png'
            }
            , {
                id: 3
                , name: 'Tom3'
                , downScore: 0
                , gold: '33'
                , avatar: '../../image/eg_avatar2.png'
            }
            , {
                id: 4
                , name: 'Tom4'
                , downScore: 0
                , gold: '33'
                , avatar: '../../image/eg_avatar3.png'
            }
            , {
                id: 5
                , name: 'Tom5'
                , downScore: 0
                , gold: '33'
                , avatar: '../../image/eg_avatar5.png'
            }
            , {
                id: 6
                , name: 'Tom6'
                , downScore: 0
                , gold: '33'
                , avatar: '../../image/eg_avatar2.png'
            }
            , {
                id: 7
                , name: 'Tom7'
                , downScore: 0
                , gold: '33'
                , avatar: '../../image/eg_avatar.png'
            }
            , {
                id: 8
                , name: 'Tom8'
                , downScore: 0
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
                if ($(item).css('display') == "block") { // 准备一个，num+1
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