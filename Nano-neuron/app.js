const log = console.log;

//Tf = Tc * 1.8 + 32
// y = w*x+b

function NanoNeuron(w,b) {
	this.w = w;
	this.b = b;
	this.predict = (x) => {
		return x*this.w+this.b;
	}
}

function celsiusToFahrenheit(c) {
	const w = 1.8;
	const b = 32;
	const f = c*w+b;
	return f;
}

function generateDataSets() {
	//xTrain -> [0,1,2,3,4...],
	//yTrain -> [32,33.8, 35.6, ...]
	const xTrain = [];
	const yTrain = [];
	for (let x = 0; x < 100; x++) {
		const y = celsiusToFahrenheit(x);
		xTrain.push(x);
		yTrain.push(y);
	}
	
	//xTest -> [0.5, 1.5, 2.5, ...],
	//yTest -> [32.9, 34.7, 36.5,...]
	const xTest = [];
	const yTest = [];
	for (let x = 0.5; x < 100; x++) {
		const y = celsiusToFahrenheit(x);
		xTest.push(x);
		yTest.push(y);
	}
	
	return [xTrain, yTrain, xTest, yTest];
}

// predictionCost = (y - prediction)^2 * 0.5
function predictionCost(y, prediction) {
	return (y - prediction)**2/2; // i.e -> 235.6
}

// averageCost = 1/m * sum(predictionCost(i))
function forwardPropagation(model, xTrain, yTrain) {
	const m = xTrain.length;
	const predictions = [];
	let cost = 0;
	for (let i = 0; i < m; i++) {
		const prediction = nanoNeuron.predict(xTrain[i]);
		cost += predictionCost(yTrain[i], prediction);
		predictions.push(prediction);
	}
	// average value of fault
	cost /=m;
	return [predictions, cost];
}

// d/dw averageCost = Sum(y(i) - prediction(i))*x(i)
// d/db averageCost = Sum(y(i) - prediction(i))
function backwardPropagation(predictions, xTrain, yTrain) {
	const m = xTrain.length;
	//  В начале мы не знаем насколько мы должны изменить параметры 'w' и 'b'.
	//  Поэтому размер шага пока равен 0.
	let dW = 0;
	let dB = 0;
	for (let i = 0; i < m; i++) {
		dW += (yTrain[i] - predictions[i]) * xTrain[i];
		dB += yTrain[i] -  predictions[i];
	}
	// Нас интересуют средние значения
	dW /= m;
	dB /= m;
	return [dW,  dB];
}

// Мы будем обновлять параметры нашей модели w и b следующим образом:
// w := w + alpha * dW
// b := b + alpha * dB
// тренировка будет выглядеть так:
function trainModel({model, epochs, alpha, xTrain, yTrain}) {
	//Это история обучения нашего нано-нейрона. Дневник успеваимости
	const constHistory = [];

	// Начнем считать дни (эпохи) обучения
	for (let epoch = 0; epoch < epochs; epoch++) {
		//Прямое распространение сигнала
		const [predictions, cost] =  forwardPropagation(model,xTrain,yTrain);
		constHistory.push(cost);

		//Обратное распространение сигнала
		const [dW, dB]= backwardPropagation(predictions,  xTrain, yTrain);

		//Корректируем параметры модели нано-нейрона, чтобы улучшить точность предсказаний
		nanoNeuron.w += alpha * dW;
		nanoNeuron.b += alpha * dB;
	}

	return constHistory;
}

//  установим w и b случайным образом
const w = Math.random(); //i.e ->  0.9492
const b = Math.random(); //i.e ->  0.4570
const nanoNeuron = new NanoNeuron(w, b);

// генерируем тренировочный и тестовый наборы данных
const [xTrain, yTrain, xTest, yTest] = generateDataSets();

const epochs = 70000;
const alpha = 0.0005;
const trainingCostHistory = trainModel({model: nanoNeuron, epochs,  alpha, xTrain,yTrain});

log('Ошибка до тренировки', trainingCostHistory[0]);
log('Ошибка после тренировки', trainingCostHistory[epochs-1]);
log('Параметры нано-нейрона',  {w: nanoNeuron.w, b: nanoNeuron.b});

[testPredictions, testCost] =  forwardPropagation(nanoNeuron, xTest,  yTest);
console.log('Ошибка на новых данных', testCost);

const tempInCelsius = 70;
const customPrediction = nanoNeuron.predict(tempInCelsius);
log(`Нано-нейрон "думает", что ${tempInCelsius} C в Фаренгейтах будет:`, customPrediction);
log('А правильный ответ:', celsiusToFahrenheit(tempInCelsius));