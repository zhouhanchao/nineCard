(function () {
    $(function () {
        var data = { // 模拟后台传入数据
            id: 12138
            , time: '2017-8-24'
            , gameNum: 12
            , score: [{
                id: 1
                , name: "Tom"
                , num: '+1'
                , state: 1
            }, {
                id: 1
                , name: "Tony"
                , num: '+555'
                , state: 1
            }, {
                id: 1
                , name: "发"
                , num: '+10'
                , state: 1
            }, {
                id: 1
                , name: "法师打发"
                , num: '-109'
                , state: 0
            }, {
                id: 1
                , name: "Mark"
                , num: '-3'
                , state: 0
            }, {
                id: 1
                , name: "Gritly"
                , num: '-2'
                , state: 0
            }, {
                id: 1
                , name: "Lindalys"
                , num: '-1'
                , state: 0
            }, {
                id: 1
                , name: "xiaoZhou"
                , num: '0'
                , state: 0
            },{
                id: 1
                , name: "Tom"
                , num: '+1'
                , state: 1
            }, {
                id: 1
                , name: "Tony"
                , num: '+555'
                , state: 1
            }, {
                id: 1
                , name: "发"
                , num: '+10'
                , state: 1
            }, {
                id: 1
                , name: "法师打发"
                , num: '-109'
                , state: 0
            }, {
                id: 1
                , name: "Mark"
                , num: '-3'
                , state: 0
            }, {
                id: 1
                , name: "Gritly"
                , num: '-2'
                , state: 0
            }, {
                id: 1
                , name: "Lindalys"
                , num: '-1'
                , state: 0
            }, {
                id: 1
                , name: "xiaoZhou"
                , num: '0'
                , state: 0
            }, ]
        }
        const canvas = document.getElementById('canvas');
        canvas.width = $('.container').width() * 0.9;
        canvas.height = $('.container').height() * 0.7;
        const width = canvas.width, height = canvas.height;
        const ctx = canvas.getContext('2d');
        
        
        
        function isChinese(word){  //判断是否未中文
            var reg = /[^\u4e00-\u9fa5]/;  
            if(reg.test(word)) return false;  
            return true;  
        }  
        function drawLine(color, beginX, endX, beginY, endY) { //绘图----线条
            ctx.strokeStyle = color;
            ctx.moveTo(width * beginX, height * beginY);
            ctx.lineTo(width * endX, height * endY);
            ctx.stroke();
        }
        function drawTitleWord(text,x,y){ //绘图----标题文字
            ctx.font = "4vw Microsoft Yahei";
            ctx.fillStyle = "#fff";
            ctx.fillText(text,width*x,height*y);
        }
        function drawPersonWord(color,text,num,x,y){ //绘图----文字
            ctx.font = "4vw Microsoft Yahei";
            ctx.fillStyle = color;
            if(text.length > 0){
                text = isChinese(text) ? text.substring(0,3) : text.substring(0,6);
            }
            if(text && !num){
                ctx.textAlign = "left";
                ctx.fillText(text,width*x,height*y);
            }else if(!text && num){
                ctx.textAlign = "right";
                ctx.fillText(num,width*x,height*y);
            }
        }
        function drawCanvas() { // 0.07 0.93     0.32 0.97
            let img = new Image();
            let score = data.score,num = 3,x = 0,y = 0;
            img.src = '../../image/ranking_img.png';
            img.onload = function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                for(let i=0;i<2;i++){ // 循环竖线
                    let j = 0.28 * i;
                    drawLine('#361a76', 0.36+j, 0.36+j, 0.33, 0.95);
                }
                for(let i=0;i<7;i++){ // 循环横线
                    let j = 0.08 * i;
                    drawLine('#361a76', 0.1, 0.9, 0.40+j, 0.40+j);
                }
                
                drawTitleWord( "房间号："+data.id ,0.1,0.3);
                drawTitleWord( data.time ,0.5,0.3);
                drawTitleWord( data.gameNum+"局" ,0.8,0.3);
                
                
                for(let i=0;i<score.length;i++){ // 循环文字
                    let color = score[i].state == 1 ? "gold" : "white"; // win->gold or lose->white
                    if(i >= num){
                        num += 3;
                        x = 0;
                        y = 0.08* (i/3);
                    }else {
                        x = 0.28 * (i%3);
                    }
                    drawPersonWord(color,score[i].name,'',0.1+x,0.37+y);
                    drawPersonWord(color,'',score[i].num,0.34+x,0.37+y);
                }
            }
        }
        drawCanvas();
        
        document.getElementById('btn').addEventListener('click',function(){
            console.log(canvas)
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            alert("保存成功");
        },false);
    });
})();