// pages/home/list.js
let url = "https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=r"
Page({

  /**
   * 页面的初始数据
   * 数据先行
   */
  data: {
    word:"猫", //搜索的内容
    page:1,//请求的页数
    row:30,//请求多少条
    list:3,
    origin:[], 
    // imgs:{ //存放图片的对象
    //   left:[],
    //   right:[]
    // },
    imgs:[],
    height:[]
    // height:{//存放图片高度的对象
    //   left:0,
    //   right:0
    // }

  },
  createContainer(){
    this.data.height = new Array(this.data.list).fill(0);
    this.data.imgs = new Array(this.data.list).fill(0).map(() => [])
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.createContainer()
    this.data.word = options.q
    this.showPage()
    let title = this.data.word
    wx.setNavigationBarTitle({
      title
    })
  },
  //打包url 保持接口的粒度 一个功能是由多个方法实现
  codeUrl(){
    let codeUrl = url + 
    "&word=" + this.data.word + 
    "&pn=" + (this.data.page * this.data.row -this.data.row) +
     "&rn=" + this.data.row;
    return codeUrl
  },
  //查询数据
  query(){
    //显示加载动画
    wx.showNavigationBarLoading()
    //请求的url
    let queryUrl = this.codeUrl();
     //开始请求数据
     return new Promise((reslove,reject) => {
       wx.request({
         url: queryUrl,
         success:reslove,
         fail: reject
       })
     })
  },
  more(){
    this.data.page++;
    this.showPage()
  },
  showPage(){
   this.query()
   .then(res => {
     let codeData = this.codeData(res.data.data)
     this.showData(codeData)
   })
  },
  
  zoom(img){
    let zoom = 100 / img.width;
    return {
      width: img.width * zoom,
      height: img.height* zoom
    }
  },
  //打包数据
  codeData(data){
    let codeData = [];
    data.forEach(img => {
      if (img.objURL){
        codeData.push(Object.assign({
          thumb: img.thumbURL,
          middle: img.middleURL,
          obj: img.objURL
        }, this.zoom(img)))
      }
    })
    return codeData
  },
  download(e){
  
    let url = e.currentTarget.dataset.src
    
    wx.downloadFile({
      url,
      success(res){
       
        wx.saveImageToPhotosAlbum({filePath:res.tempFilePath})
      }
    })
  },
  showImg(e){
    let current = e.currentTarget.dataset.src;
    let urls = this.data.origin.map(item => item.middle)
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls// 需要预览的图片http链接列表
    })
  },
  showData(data){
    this.data.origin.push(...data)
    data.forEach(item => {
      let min = Math.min(...this.data.height)
      let index = this.data.height.findIndex(item => min === item)
      this.data.imgs[index].push(item);
      this.data.height[index] += item.height
    })
      // data.forEach(img => {
      //   if(this.data.height.left <= this.data.height.right){
      //     this.data.imgs.left.push(img)
      //     this.data.height.left += img.height
      //   }else{
      //     this.data.imgs.right.push(img)
      //     this.data.height.right += img.height
      //   }
      // })
     //数据更新
      this.setData({
        imgs:this.data.imgs
      })
    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})