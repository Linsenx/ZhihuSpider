class taskBasic {
  constructor(T = 1000) {
    // -2: 初始化中
    // -1: 放弃任务 (任务将无法恢复)
    //  0: 暂停任务 (任务将在nextStep停止，可通过runTask恢复)
    //  1:   任务中 
    //  2: 抓取完成
    //  3: 数据处理
    this.T = T       //任务周期(MS)
    this.state = -2   //任务状态
    this.step = 0    //任务当前Tick数
    this.maxStep = 0 //最大任务Tick数
  }
  //获取进度
  getTaskProgress() {
    return '0%'
  }

  //设置最大Tick
  setMaxStep(maxStep = 0) {
    this.maxStep = maxStep
  }

  //开始任务
  runTask() {
    if (this.state == -1) return
    this.state = 1
    this.nextStep() //执行下一步
  }

  //停止任务
  dropTask() {
    if (this.state >= 1) return 
    this.state = -1
  }

  //暂停任务
  pauseTask() {
    this.task = 0
  }

  //数据抓取完成
  finishFetch() {
    this.state = 2
    console.log('finish fetch data-length: '+this.saves.length)
    setTimeout(() => {
      this.analyzeData()
    }, 1000)
  }

  //数据处理
  analyzeData() {
    this.state = 3
    console.log('start analyze data......')
  }

  //执行下个Tick
  nextStep() {
    if (this.step >= this.maxStep) this.finishFetch()
    if (this.state == 1) {
      let self = this
      this.taskTick(
        function(){
          //任务成功，循环运行nextStep
          self.step++
          setTimeout(self.nextStep.bind(self), self.T)
        }, 
        function() {
          //任务失败，处理错误信息，再循环运行nextStep
          self.step++
          setTimeout(self.nextStep.bind(self), self.T)
        }
      )   
      
    }
  }

  //任务每Tick的逻辑
  taskTick(suc, err) {

   }
}
module.exports = taskBasic