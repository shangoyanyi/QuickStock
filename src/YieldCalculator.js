import simplePercentFormat from './SimplePercentFormat';

// 計算殖利率
export default function (price, cash, stock) {
    var localPrice = price;
    var localCash = cash;
    var localStock = stock;

    // 計算殖利率
    var result = (localCash + localPrice * localStock * 0.1) / (localPrice - localCash);

    // 轉換成百分比再回傳
    return simplePercentFormat(result);
}





