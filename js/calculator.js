; (function (doc) {
  function Calculator() {
    //显示计算过程与结果的盒子
    this.showBox = doc.getElementsByClassName('show_box')[0];
    // 输入按钮
    this.inputtedBtns = doc.getElementsByClassName('inputtedBtns')[0];
    this.equalsBtn = doc.getElementsByClassName('equals_btn')[0];
    this.result = this.showBox.querySelector('.result');
    this.resultChild = this.result.querySelector('span');
    this.show = this.showBox.querySelector('.show');
    this.showChild = this.show.querySelector('span');
    this.clean = this.inputtedBtns.querySelector('#clean');
    this.ul = this.inputtedBtns.querySelector('ul');
    this.fontSizeUl = parseInt(window.getComputedStyle(this.ul).fontSize);
    this.flag = true;
  }
  //初始化方法
  Calculator.prototype.init = function () {
    this.BindEvent();
  }
  //事件方法
  Calculator.prototype.BindEvent = function () {
    this.inputtedBtns.addEventListener('click', this.onClickObtain.bind(this), false);
    this.equalsBtn.addEventListener('click', this.onClickResult.bind(this));
    this.clean.addEventListener('click', this.onClickClean.bind(this))
  }
  //利用事件委托，获取点击元素（关于事件委托：https://blog.csdn.net/m0_46217225/article/details/115328572?spm=1001.2014.3001.5501）
  Calculator.prototype.onClickObtain = function (e) {
    let elemLi = e.target;
    //调用字体变化动画方法
    Calculator.sizeAnimation(elemLi, this.fontSizeUl);
    //调用溢出处理方法
    if (this.flag && this.showChild.clientWidth >= this.show.clientWidth) {
      Calculator.valOverflow(this.show);
      this.flag = false;
    }
    //只把li显示在计算过程中
    if (elemLi.tagName.toLowerCase() === 'li' && elemLi.id != "clean") {
      this.displayProcess(elemLi.innerText);
    }
  }
  //字体变化动画方法（这里造成了回调地狱，可以使用promise来改写） 
  Calculator.sizeAnimation = function (elem, size) {
    let raise = setInterval(() => {
      elem.style.fontSize = size + 1 + 'px'
      size++;
      if (size >= 34) {
        clearInterval(raise);
        let decline = setInterval(() => {
          elem.style.fontSize = size - 1 + 'px';
          size--;
          if (size <= 25) {
            elem.style.fontSize = 25 + 'px';
            clearInterval(decline);
          }
        }, 15);
      }
    }, 15);
  }
  // 显示计算过程
  Calculator.prototype.displayProcess = function (elem) {
    this.showChild.innerText += elem;
  }
  //点击出结果
  Calculator.prototype.onClickResult = function () {
    if (this.showChild.innerHTML != "") {
      this.resultChild.style.fontSize = this.showChild.style.fontSize;
      this.resultChild.innerHTML = eval(this.show.innerText);
    }
  }
  //点击清除
  Calculator.prototype.onClickClean = function () {
    //清除子元素
    let showChild = this.showChild;
    showChild.innerText = "";
    showChild.style.fontSize = '32px'
    this.flag = true;
    //清除结果
    this.resultChild.innerText = "";
  }
  //数值溢出处理
  Calculator.valOverflow = function (elem) {
    //设置观察者的选项，需要观察的 变化（观察目标节点的子节点的新增和删除）
    let config = { childList: true, subtree: true }
    //设置观察者的回调函数
    function callback(records) {//记录变化的数组
      let rs = records[0].target;
      //观察节点的子节点可视宽度 大于等于 观察节点可视宽度时
      if (rs.clientWidth >= elem.clientWidth) {
        rs.style.fontSize = parseInt(window.getComputedStyle(rs).fontSize) - 5 + 'px';
        //清除突变观察者
        if (parseInt(elem.children[0].style.fontSize) <= 12) {
          observer.disconnect();
        }
      }
    }
    //创建突变观察者MutationObserver的实例对象
    let observer = new MutationObserver(callback);
    //添加需要观察的 元素 和 变化
    observer.observe(elem, config);
  }
  window.Calculator = Calculator;
})(document);