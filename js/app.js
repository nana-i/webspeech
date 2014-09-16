var recognition = new webkitSpeechRecognition();
recognition.lang = "ja-JP";
recognition.continuous = true;

var angle = [0, 90, 180, 270];
var size = [50, 100, 150, 200];

var ANGLE_RIGHT = '右';
var ANGLE_DOWN = '下';
var ANGLE_LEFT = '左';
var ANGLE_TOP = '上';

function WebSpeechCtrl($scope) {
	// 開始ボタン押下
	$scope.start = function() {

		// 初期表示のサイズと傾きを取得する
		var now_angle_index = get_random_index(angle.length);
		var now_size = size.length-1;
		landolt(size[now_size], angle[now_angle_index]);

		// OK結果総数
		var answerCount = 0;

		// 解析スタート
		recognition.start()

		//話し声の認識中
		recognition.onsoundstart = function(){
			$scope.state = "認識中";
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
				switch (angle[now_angle_index]) {
					// 右
					case angle[0]:
						if ($scope.recognizedText === ANGLE_RIGHT) {
							$scope.result = "OK";
							answerCount = answerCount+1;
						} else {
							$scope.result = "NG";
						}
						break;
					// 下
					case angle[1]:
						if ($scope.recognizedText === ANGLE_DOWN) {
							$scope.result = "OK";
							answerCount = answerCount+1;
						} else {
							$scope.result = "NG";
						}
						break;
					// 左
					case angle[2]:
						if ($scope.recognizedText === ANGLE_LEFT) {
							$scope.result = "OK";
							answerCount = answerCount+1;
						} else {
							$scope.result = "NG";
						}
						break;
					// 上
					case angle[3]:
						if ($scope.recognizedText === ANGLE_TOP) {
							$scope.result = "OK";
							answerCount = answerCount+1;
						} else {
							$scope.result = "NG";
						}
						break;
					default:
						$scope.result = "NG";
						break;
				}

				// 次の判定があれば表示
				if (now_size !== 0) {
					now_angle_index = get_random_index(angle.length);
					now_size = now_size-1;
					landolt(size[now_size], angle[now_angle_index]);
				} else {
					// 解析終了
					recognition.stop();
					$scope.state = "停止中";
					$scope.answerCount = size.length + "回中" +answerCount + "回成功しました。";
				}
				
				// 再バウンド
				$scope.$apply();

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
		// キャンバスをクリアした後描画する
		ctx.clearRect(0, 0 ,canvas.width, canvas.height);
		ctx.beginPath();
		ctx.arc(x, y, r, angle-Math.asin(1/5), angle+Math.asin(1/5), true);
		ctx.arc(x, y, 3*r/5, angle+Math.asin(1/3), angle-Math.asin(1/3), false);
		ctx.fill();
	}
}

// 0～指定数の乱数を返す
function get_random_index(index) {
	return Math.floor(Math.random()*index);
}
