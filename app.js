var recognition = new webkitSpeechRecognition();
recognition.lang = "ja-JP";
recognition.continuous = true;

var angle = [0, 90, 180, 270];
var size = [30, 60, 90, 120];

function WebSpeechCtrl($scope) {
	// 初期canvas表示
	// TODO あとでランダム取得する
	landolt(size[3], angle[1]);

	// 開始ボタン押下
	$scope.start = function() {
		recognition.start()

		//話し声の認識中
		recognition.onsoundstart = function(){
			$scope.state = "認識中";
		};

		//マッチする認識が無い
		recognition.onnomatch = function(){
			$scope.recognizedText = "もう一度試してください";
		};

		//エラー
		recognition.onerror= function(){
			$scope.recognizedText = "エラー";
		};

		//話し声の認識終了
		recognition.onsoundend = function(){
			$scope.state = "停止中";
		};

		//認識が終了したときのイベント
		recognition.onresult = function(event){
			var results = event.results;
			for (var i = event.resultIndex; i<results.length; i++){
				$scope.recognizedText = results[i][0].transcript;
				// 再バウンド
				$scope.$apply();
				// TODO 判定処理を追加する
				// landolt(size[3], angle[2]);
			}
		};
	};

	// 終了ボタン押下
	$scope.stop = function() {
		recognition.stop();
		$scope.state = "停止中";
	};
}

//ランドルト環表示
function landolt(r, angle) {
	var canvas = document.getElementById('canvasArea');
	angle = (angle%360)*Math.PI/180;

	if(canvas.getContext){
		var x = canvas.width/2;
		var y = canvas.height/2;
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.arc(x, y, r, angle-Math.asin(1/5), angle+Math.asin(1/5), true);
		ctx.arc(x, y, 3*r/5, angle+Math.asin(1/3), angle-Math.asin(1/3), false);
		ctx.fill();
	}
}