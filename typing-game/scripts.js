const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-valued');
const startButton = document.getElementById('start')

// 在开始前禁止用户向文本框内输入内容
typedValueElement.disabled = true;

startButton.addEventListener('click', ()=>{
  const quotesIndex = Math.floor(Math.random()*quotes.length);
  const quote = quotes[quotesIndex];
  // 拆分单词，存于数组中
  words = quote.split(' ');
  wordIndex = 0;

  // map方法对类型化数组中的元素调用提供的 callback函数，按照顺序，并且会从结果构造新的类型化数组。
  const spanWords = words.map(function(word){ return `<span>${word} </span>`});
  quoteElement.innerHTML = spanWords.join('');
  quoteElement.childNodes[0].className = 'highlight';
  messageElement.innerText = '';

  typedValueElement.value = '';
  typedValueElement.disabled = false;
  typedValueElement.focus();

  // 开放输入
  typedValueElement.disabled = false;
  startButton.textContent = 'Try again';

  startTime = new Date().getTime();
})

// 按下enter相当于点击开始按钮
window.addEventListener('keydown', function(event){
  if (event.key === 'Enter') {
    startButton.click();
  }
})

typedValueElement.addEventListener('input', ()=>{
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  if (typedValue === currentWord && wordIndex === words.length-1) {
    // 检查是否全部完成
    const elapsedTime = new Date().getTime()-startTime;
    const message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds.`;
    messageElement.innerText = message;
    typedValueElement.disabled = true;
  } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
    // 单个词汇检查
    typedValueElement.value = '';
    typedValueElement.className = '';
    wordIndex++;
    // 重设所有引文子元素的className
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = '';
    }
    // 标记新单词
    quoteElement.childNodes[wordIndex].className = 'highlight';
  } else if (currentWord.startsWith(typedValue)) {
    // 单词输入正确
    typedValueElement.className = '';
  } else {
    // 单词输入错误
    typedValueElement.className = 'error';
  }
})