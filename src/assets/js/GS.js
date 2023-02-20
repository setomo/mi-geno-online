/*
| GSページ関連の処理
| author: myamada@kazusa
| ES6(ES2015)ベースで書いています
| Laravelでサポートされている axios (^0.18) ライブラリを使います。https://github.com/axios/axios
*/
/*
| DOMが読まれたら、ファイルドロップイベントを取り付けます
*/
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('selectGenoFileName').
	addEventListener('change',k_handleFileSelect,false);
    document.getElementById('selectPhenoFileName').
	addEventListener('change',k_handleFileSelect,false);
        // HTMLcollectionをarrayにします。ドラッグドロップ枠以外のuploadクラス全体に意図的に指定してます
    let arr = Array.prototype.slice.call(document.getElementsByClassName('upload'));
    arr.forEach((ele) =>{
	ele.addEventListener('dragover', k_handleDragOver, false);
	ele.addEventListener('drop', k_handleDrop, false);
    });

});

/***** DataTransfer オブジェクトは、iOSのsafariでは動きません
| ドラッグドロップ領域にドラッグしたときの定義です
*/
function k_handleDragOver(evt) {
    evt.stopPropagation(); // 上層のイベントリスナーを呼ばなくします
    evt.preventDefault();  // イベント自体を止めます
    evt.dataTransfer.dropEffect = 'copy'; // コピー動作であると定義します。代入文字列は任意でなく、決められています。
}
/*
| ドロップ
*/
function k_handleDrop(evt){
    evt.stopPropagation(); // 上層のイベントリスナーを呼ばなくします
    evt.preventDefault();  // イベント自体を止めます
    k_ExecUpload(evt,evt.dataTransfer.files); // イベントとファイルオブジェクトを送ります
}  
/*
| ファイルセレクタから選択した場合
*/
function k_handleFileSelect(evt){
    evt.stopPropagation(); // 上層のイベントリスナーを呼ばなくします
    evt.preventDefault();  // イベント自体を止めます
    k_ExecUpload(evt,this.files); // イベントとファイルオブジェクトを送ります
}
/*
| multipart/form-dataとしてlaravelで作ったAPIへデータを打ち込みます。
|
| evt イベント
| fileObj FileList型object
*/
function k_ExecUpload(evt,fileObj){
    let file = fileObj[0];
    let ele = evt.target.parentElement ;
    if ( ele.className != 'upload' ){ /* と、言う名前のclass名でなかったら */
	ele = evt.target.parentElement.parentElement;
    }
    let progress = ele.getElementsByTagName('output')[0] /* div内の最初の<output ...> */
    let output = [];
    output.push (file.name,' (',file.type || 'n/a' , ') -' ,file.size, ' bytes');
    progress.innerText = output.join ('');
    let csrfToken = document.querySelector('meta[name="csrf-token"]').content; /* Laravel用に埋め込んだCSRFトークンを取得 */
    /* CSRFトークンとクレデンシャル(認証情報)を持たせます。ヘッダ名はCSRFではなくX-XSRF-Token
     */
    const axiosInstance = axios.create({
	xsrfHeaderName: 'X-XSRF-Token',
	withCredentials: true
    });
    let formdata = new FormData();
    // 第1引数はJSON keyで、第2引数はformの中身
    formdata.append ("sendfile",file,file.name);
    formdata.append ("filename",file.name);
    
    axiosInstance.post('filePost',formdata)
	.then(ok =>{
	    output=[];// 表示文字列初期化
	    output.push (file.name,'の、サーバーへの転送が終わりました。')
	    progress.innerText = output.join ('');
	    /* submitする時に送るファイル名をhiddenに書き込む */
	    ele.querySelector('input[type="hidden"]').value=file.name;
	}).catch(error => {
	    new Error(error)
	});
}


function ExecUpload($droppedfile) {
    console.log ('ExecUpload:'+$droppedfile);
    var file1 = $droppedfile;

    var formdata = new FormData();
    formdata.append("file", file1);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            alert(xmlhttp.responseText);
        }
    };
    xmlhttp.open('POST', '{{ URL::current()."filePost"}}', true);
    xmlhttp.setRequestHeader('X-CSRF-TOKEN','{{csrf_token()}}');
    xmlhttp.send(formdata);
}


