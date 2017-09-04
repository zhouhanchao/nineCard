function calculateNum(poker) {
    var card = [poker[0].id, poker[1].id];
    var dot = [poker[0].dot, poker[1].dot];
    //poker.sort((arr1,arr2) => {return arr1-arr2});//es6
    card.sort(function(arr1, arr2){
        return arr1 - arr2
    });
    //至尊宝
    if (card[0] == 2 && card[1] == 9) {
        return 99;
    }
    //天牌
    if (card[0] == 21 && card[1] == 21) {
        return 98;
    }
    //地牌
    if (card[0] == 1 && card[1] == 1) {
        return 97;
    }
    //人牌
    if (card[0] == 14 && card[1] == 14) {
        return 96;
    }
    //和牌
    if (card[0] == 3 && card[1] == 3) {
        return 95;
    }
    //梅花牌18
    if (card[0] == 18 && card[1] == 18) {
        return 94;
    }
    //长三牌
    if (card[0] == 7 && card[1] == 7) {
        return 93;
    }
    //板凳牌
    if (card[0] == 4 && card[1] == 4) {
        return 92;
    }
    //斧头牌
    if (card[0] == 20 && card[1] == 20) {
        return 91;
    }
    //红头牌
    if (card[0] == 19 && card[1] == 19) {
        return 90;
    }
    //高脚
    if (card[0] == 11 && card[1] == 11) {
        return 89;
    }
    //铜锤
    if (card[0] == 8 && card[1] == 8) {
        return 88;
    }
    //杂九
    if (card[0] == 16 && card[1] == 17) {
        return 87;
    }
    //杂八
    if (card[0] == 13 && card[1] == 15) {
        return 86;
    }
    //杂七
    if (card[0] == 10 && card[1] == 12) {
        return 85;
    }
    //杂五
    if (card[0] == 5 && card[1] == 6) {
        return 84;
    }
    //天王
    if (card[1] == 21 && (card[0] == 16 || card[0] == 17)) {
        return 83;
    }
    //地王
    if (card[0] == 1 && (card[1] == 16 || card[1] == 17)) {
        return 82;
    }
    //天杠
    if (card[1] == 21 && (card[0] == 13 || card[0] == 15)) {
        return 81;
    }
    //地杠
    if (card[0] == 1 && (card[1] == 13 || card[1] == 15)) {
        return 80;
    }
    //天高九
    if (card[0] == 12 && card[1] == 21) {
        return 79;
    }
    //地高九
    if (card[0] == 1 && card[1] == 11) {
        return 78;
    }
    //计算个位数
    var count = parseInt(dot[0]) + parseInt(dot[1]);
    return count.toString().slice(-1);
}