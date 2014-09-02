var recognition = new webkitSpeechRecognition();
recognition.lang = "ja-JP";
recognition.continuous = true;

var angle = [0, 90, 180, 270];
var size = [30, 60, 90, 120];
var ANGLE_TOP = '上';
var ANGLE_RIGHT = '右';
var ANGLE_DOWN = '下';
var ANGLE_LEFT = '左';

function WebSpeechCtrl($scope) {
	// 開始ボタン押下
	$scope.start = function() {

		// 傾きを取得
		var now_angle_index = get_random_index(angle.length);
		landolt(size[get_random_index(size.length)], angle[now_angle_index]);

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
				
				switch (angle[now_angle_index]) {
					// 上
					case angle[0]:
						// TODO 音声認識($scope.recognizedText)の補正
						if ($scope.recognizedText === ANGLE_TOP) {
							console.log('OK');
						}
						break;
					// 右
					case angle[1]:
						if ($scope.recognizedText === ANGLE_RIGHT) {
							console.log('OK');
						}
						break;
					// 下
					case angle[2]:
						if ($scope.recognizedText === ANGLE_DOWN) {
							console.log('OK');
						}
						break;
					// 左
					case angle[3]:
						if ($scope.recognizedText === ANGLE_LEFT) {
							console.log('OK');
						}
						break;
					default:
						console.log('NG');
						break;
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
