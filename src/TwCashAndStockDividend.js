import request from 'request';
import iconv from 'iconv-lite';
import {proxy, apiKey} from './Config';

/*
 * 取得所有股票股利資料
 * return [{code, cash, stock},...]
 */
export default function(codes) {
    return new Promise( function(resolve, reject) {        
        var localCodes = codes; // 複製一份 localCodes 避免汙染外部傳入的資料
        
        // var apiKey = ''; // set your apikey here, import from Config.js
        var queryStr = localCodes.join(',');
        console.log(queryStr);

        // var proxy   = ''; // import from Config.js
        var url     = 'https://api.tej.com.tw/api/datatables/TRAIL/TAMT.json?api_key=' + apiKey + '&opts.columns=coid,mt_div,mt_mer&coid='+ queryStr;

        // 2019/9/4 因server端回傳資料有做gzip，因此增加 gzip 參數讓 request 自動對 response 解壓縮
        request.defaults({'proxy': proxy, 'gzip':true}).get(url, function (error, response, body) {            
            if (!error && response.statusCode == 200) {
                // [DEBUG]
                // console.log(body);

                var data = JSON.parse(body);
                // [DEBUG]
                // console.log((data.datatable.data[0])[0]); // 代號
                // console.log((data.datatable.data[0])[1]); // 現金股利
                // console.log((data.datatable.data[0])[2]); // 股票股利

                var dividendItems = data.datatable.data.map(function(item){                    
                    return {'code':item[0], 'cash':item[1], 'stock':item[2]};
                });

                resolve(dividendItems);

            } else {
                reject(error);
            }
        });
    })
}