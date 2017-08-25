(function () {
    $(function () {
        $('#close').on('click', function () { // 关闭弹窗
            $('#fix').hide();
        });
        $('.btn').on('click', function () { // 只能点击推牌九
            var parentType = $(this).parent().attr('data-type');
            if (parentType == 1) {
                $('#fix').show();
            }
            else {
                alert('正在开发此游戏，敬请期待!');
            }
        });
        var data = {
            houseMode: "固定抢庄",
            houseType: "",
            score: "",
            game: "",
            sz: ""
        }
        $(document).on('click', '#chooseMode>span', function (e) { // 固定抢庄和自由抢庄区分
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings().removeClass('active');
                if ($(this).attr('data-type') == 2) {
                    $('.select .option:last-child').hide();
                    data.houseMode = "自由抢庄";
                }
                else {
                    $('.select .option:last-child').show();
                    data.houseMode = "固定抢庄";
                }
                $('.select .option .choose .yes').html('');
                data.houseType = data.score = data.game = data.sz = "";
            }
        });
        $(document).on('click', '.select .option .choose', function () { //  选项选择
            var yesBtn = $(this).find('.yes');
            var other = $(this).siblings();
            var label = $(this).parent().prev().html();
            var img = new Image();
            img.src = "../../image/yes.png";
            
            function dataValue(_this){
                var result = "";
                if ($(_this).find('.yes').children().length == 0) {
                    $(yesBtn).html(img);
                    result = $.trim($(_this).text());
                }
                else {
                    $(yesBtn).html('');
                    result = "";
                }
                return result;
            }
            for (let i = 0; i < other.length; i++) {
                if ($(other[i]).find('.yes').html()) {
                    $(other[i]).find('.yes').html('');
                    console.log($(other[i]).parent().prev().html())
                }
            }
            
            switch (label) {
                case "房型：":
                    data.houseType = dataValue(this);
                    break;
                case "底分：":
                    data.score = dataValue(this);
                    break;
                case "局数：":
                    data.game = dataValue(this);
                    break;
                case "上庄：":
                    data.sz = dataValue(this);
                    break;
            }
            
        });
        $('#success>img').on('click', function () {
            console.log(data);
        });
    });
})();
//    var btn = document.querySelectorAll('.btn');
//    var fix = document.getElementById('fix');
//    var close = document.getElementById('close');
//    var chooseMode = document.getElementById('chooseMode');
//        close.addEventListener('click',function(){
//            fix.setAttribute('class','hidden');
//        },false);
//        chooseMode.addEventListener('click',function(e){
//            e = e || window.event;
//            if(this.children.length>0){
//                for(let i=0;i<this.children.length;i++){
//                    if(e.target.innerHTML != this.children[i].innerHTML){
//                        this.children[i].setAttribute('class','');
//                    }
//                }
//            }
//            if(e.target.getAttribute('class') != 'active'){
//                e.target.setAttribute('class','active');
//            }
//            if(e.target.getAttribute('data-type') == 2){
//                console.info(document.querySelector('.select .option:last-child').getAttribute('class'))
//            }else if(e.target.getAttribute('data-type') == 1){
//                document.querySelector('.select .option:last-child').className += " hidden";
//            }
//        },false);
//        for(let i=0;i<btn.length;i++){
//            btn[i].addEventListener('click',btnClick,false);
//        }
//        function btnClick(){
//            var parentType = this.parentNode.getAttribute('data-type');
//            if(parentType == 1){
//                fix.setAttribute('class','block')
//            }else {
//                alert('正在开发此游戏，敬请期待!');
//            }
//        }