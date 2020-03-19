// 轉換成百分比表示(取小數兩位)
export default function(num) {    
    var _num = num * 100;
    return (Math.round(_num * 100) / 100) + '%';
}