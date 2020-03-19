import request from 'request';
import {proxy} from './Config';

/*
 * 取得所有股票股價
 */
export default function(codes) {
    return new Promise( function(resolve, reject) {
        // 2019/9/5 改成用 push 到 localCodes 的方式處理避免汙染外部傳入的資料
        var localCodes = [];
        codes.forEach((item) => {
            localCodes.push('tse_' + item + '.tw');
        });
        // [DEBUG]
        // console.log(localCodes);

        var queryStr = localCodes.join('|');
        console.log(queryStr);        

        // var proxy   = ''; import from Config.js
        var url     = 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=' + queryStr;

        request.defaults({'proxy': proxy}).get(url, function (error, response, body) {            
            if (!error && response.statusCode == 200) {
                // [DEBUG]
                // console.log(body);

                var data = JSON.parse(body);

                // [DEBUG]
                // console.log(data.msgArray[0].c); // 代號
                // console.log(data.msgArray[0].n); // 名稱
                // console.log(data.msgArray[0].z); // 成交價

                var stockItems = data.msgArray.map(function(item){                    
                    return {'code':item.c, 'name':item.n, 'price':item.z};
                });

                resolve(stockItems);                

            } else {
                reject(error);
            }
        });
    })
}