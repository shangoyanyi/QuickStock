import request from 'request';
import twStockPrice from './TwStockPrice';
import twCashAndStockDividend from './TwCashAndStockDividend';
import yieldCalculator from './YieldCalculator'


async function main(){
    // 設定要追蹤的台股股票代號
    let codes = ['2884', '2886', '2887', '0050', '0056', '00692'];
    

    /*
     * 取得代號清單中所有股票的代號、名稱與成交價
     */
    var priceItems = await twStockPrice(codes);
    
    // [DEBUG] 印出所有股價
    // priceItems.forEach(function(item){
    //     console.log('code:'+ item.code + ', name:'+ item.name + ', price:'+ item.price);
    // });


    /*
     * 取得代號清單中所有股票的代號、現金股利、股票股利
     */
    var dividendItems = await twCashAndStockDividend(codes);
    
    // [DEBUG] 印出所有股利資料
    // dividendItems.forEach(function(item){
    //     console.log('code:'+ item.code + ', cash:'+ item.cash + ', stock:'+ item.stock);
    // });

    
    /*
     * 依據股價 & 股利計算殖利率
     */
    var yieldItems = [];
    codes.forEach((code) => {
        // 可能為 undefined
        var pItem = priceItems.find((pItem) => {
            return pItem.code == code;
        });

        // 可能為 undefined
        var dItem = dividendItems.find((dItem) => {
            return dItem.code == code;
        });

        // 需處理 pItem undefined 跟 dItem undefined 狀況
        var yieldItem = {};
        if(pItem == undefined){            
            yieldItem.code  = code;
            yieldItem.name  = '此代號查無資料';
            yieldItem.price = '--';
            yieldItem.cash  = '--';
            yieldItem.stock = '--';
            yieldItem.yield = '--';

        }else if(dItem == undefined){
            yieldItem.code  = code;
            yieldItem.name  = pItem.name;
            yieldItem.price = pItem.price;
            yieldItem.cash  = '--';
            yieldItem.stock = '--';
            yieldItem.yield = '--';

        }else{            
            yieldItem.code  = code;
            yieldItem.name  = pItem.name;
            yieldItem.price = pItem.price;
            yieldItem.cash  = dItem.cash;
            yieldItem.stock = dItem.stock;
            yieldItem.yield = yieldCalculator(yieldItem.price, yieldItem.cash, yieldItem.stock);           
        }
        
        // [DEBUG]
        // console.log(yieldItem);

        // 加入 list 中
        yieldItems.push(yieldItem);
    });

    // [DEBUG]
    console.log(JSON.stringify(yieldItems));

    /*
     * TODO: 顯示股票與殖利率資訊
     */
    // do something...
}

// run
main();
   


    
