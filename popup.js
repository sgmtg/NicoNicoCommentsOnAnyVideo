document.getElementById("btn").addEventListener("click", function () {
    
    fectchNicoComment().then(commentsData=>{
        console.log("ok")
        console.log(commentsData);
        console.log("ok")
        
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log(tabs);
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: displayCommentsOnVideo(commentsData),
            });
        });
    });
    
});

async function fectchNicoComment() {
    var videoId = "sm40667019";
    var headers1 = {
        "X-Frontend-Id": "6",
        "X-Frontend-Version": "0"
    };
    
    var actionTrackId = Math.random().toString(36).substring(2, 12) + "_" + Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    
    var url1 = "https://www.nicovideo.jp/api/watch/v3_guest/" + videoId + "?actionTrackId=" + actionTrackId;
    console.log(url1)
    
    const response1 = await fetch(url1, { method: 'POST', headers: headers1 });
    const videoInfo = await response1.json();
    
    ParamsNecessaryToFetchComment = videoInfo["data"]["comment"]["nvComment"]
    console.log(ParamsNecessaryToFetchComment);
    
    const url2 = ParamsNecessaryToFetchComment["server"] + "/v1/threads"
    var headers2 = {
        "X-Frontend-Id": "6",
        "X-Frontend-Version": "0",
        "Content-Type": "application/json"
    };
    var params = {
        "params": ParamsNecessaryToFetchComment["params"],
        "additionals": {},
        "threadKey": ParamsNecessaryToFetchComment["threadKey"]
    }
    
    const response2 = await fetch(url2, {method: 'POST', headers: headers2, body: JSON.stringify(params)});
    const commentsInfo = await response2.json();
    
    var videoType = 1;
    commentsData = commentsInfo['data']['threads'][videoType]['comments']
    console.log(commentsData);
    
    // 昇順にソート
    const sortedCommentsData = await commentsData.sort((a, b) => a.vposMs - b.vposMs);
    console.log(sortedCommentsData);
    
    return sortedCommentsData;
}







function displayCommentsOnVideo(commentsData) {
    document.body.style.backgroundColor = "#fcc";var videoElement = document.getElementsByTagName("body")[0];//HTMLドキュメント内の最初の <video> 要素を取得
    console.log("ng");
    console.log(commentsData);
    console.log("ng");


    var textOverlays = [];
    
    for (let i = 0; i < Object.keys(commentsData).length; i++) {
        let textOverlay = document.createElement("div");
        textOverlay.innerHTML = commentsData[i].body;
        textOverlay.style.position = "absolute";//ブラウザウィンドウ全体を基準にした位置となる
        textOverlay.style.right = "-100%";//要素の右端と親要素の右端の距離(親要素の大きさを基準にする)
        textOverlay.style.top = "0%";
        textOverlay.style.transform = `translate(0%, ${100 + (i % 7) * 100}%)`;//(x%, y%)と指定すると、テキストボックス大きさを基準にして、右にx%、下にy%だけ移動する。要素の中央位置を親要素の中央に合わせることができます。
        textOverlay.style.display = "block";
        textOverlay.style.zIndex = "9999";//作成した <div> 要素の CSS スタイルプロパティ z-index を "9999" に設定します。これにより、要素が他の要素の上に表示されるようになります。
        textOverlay.style.whitespace = "nowrap";// 要素のテキストが自動的に折り返されないようにする
        textOverlay.style.wordBreak = "keep-all";//折り返さない
        textOverlay.style.fontSize = "3em";//3em" に設定することは、要素内のテキストのフォントサイズを、親要素のフォントサイズの3倍に設定することを意味します。
        textOverlay.style.color = "white";
        textOverlay.style.textShadow = "0px 0px 4px #000000";//ふちの色を黒色に設定。最初の値がX方向のずれ、2つ目の値がY方向のずれ、3つ目の値がぼかしの量、最後の値がふちの色を表します。
        videoElement.parentElement.appendChild(textOverlay);//作成した <div> 要素を <video> 要素の親要素に追加します。これにより、ビデオの上にテキストが表示されるようになります。
    
        var elementWidth = textOverlay.offsetWidth;
        var parentWidth = videoElement.parentElement.offsetWidth;
        var widthPercentage = (elementWidth / parentWidth) * 100;//動画画面サイズに対するテキストボックスの横幅
    
        console.log(widthPercentage);
        textOverlays.push({
            textOverlay,
            vposMs: commentsData[i].vposMs,
            id: i,
            textWidthPercentage: widthPercentage,
            e: elementWidth,
            p: parentWidth
    
    
        });
    }
    
    console.log(textOverlays[1])
    console.log(textOverlays[2])
    
    // console.log(textOverlays[1].vposMs)
    // console.log(textOverlays[2]["textOverlay"].innerHTML)
    
    
    
    // このコードは、HTML5 ビデオプレーヤーの再生中に、ビデオの現在の時間を常に監視するために使用されます。loadedmetadata イベントが発生したときに、ビデオの現在の時間を変数に設定し、requestAnimationFrame（）を使用して連続的に時間を監視します。
    // その後、再帰的に呼び出される関数me() は、現在の時間が以前の時間と異なる場合に、ビデオが時間を更新したことを示すtimeupdate イベントを発行します。そして、再度 requestAnimationFrame（）を呼び出し、次のフレームで同じプロセスを繰り返します。
    // このコードは、ビデオの再生中に特定のアクションを実行する必要がある場合に便利です。例えば、ビデオが再生されている間にビデオの時間を更新して、進行状況バーを更新したり、キャプションを表示したりすることができます。
    videoElement.addEventListener('loadedmetadata', function (e) {
        var time = videoElement.currentTime;
        requestAnimationFrame(function me () {
            if (time !== videoElement.currentTime) {
                time = videoElement.currentTime;
                videoElement.dispatchEvent(new CustomEvent("timeupdate"));
            }
            requestAnimationFrame(me);
        });
    });
    
    
    // 動画が読み込まれたら、テキストを表示する
    videoElement.addEventListener('timeupdate', () => {
        textOverlays.forEach(item => {
            // 時間に応じてテキストをアニメーション表示する
            var startTime = item.vposMs / 1000;
            var duration = 4;
    
    
            var currentTime = videoElement.currentTime;//現在の再生時間を取得
            if (currentTime >= startTime && currentTime < startTime + duration) {
    
                item["textOverlay"].style.display = "block";
                var widthPercentage = item["textWidthPercentage"];
                textPos = (100 + widthPercentage) * (currentTime - startTime) / duration;
    
                item["textOverlay"].style.right = `${textPos - widthPercentage}%`;
                item["textOverlay"].style.transform = `translateY(${100 + (item["id"] % 7) * 100}%)`;
            } else {
                item["textOverlay"].style.display = "none";
            }
        });
    });
}