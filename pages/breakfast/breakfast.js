// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    list: [],
  },

  upload: function(e) {
    var that = this
    let access_token = '';
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=oitYwV15rb3YMv4aU1M651Dz&client_secret=9BIOTE9uwetZBrDPbb9UC5noUbuBiQHv',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.access_token)
        access_token = res.data.access_token
      }
    })

    wx.chooseImage({
      // 默认9
      count: 1,
      // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'],
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64')
        //上传操作
        wx.uploadFile({
          url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish',
          filePath: tempFilePaths[0],
          name: 'xyz.jpg',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          formData: {
            'access_token': access_token,
            'image': base64,
            'top_num': 5
          },
          success: function(res) {
            console.log(res.data);

            let jsonResult = JSON.parse(res.data);
            let result = jsonResult['result'];

            for (var k in result) {
              var food = result[k];
              food['probability'] = ((parseFloat(food['probability']).toFixed(4)) * 100).toFixed(2) + "%";
              food['image'] = tempFilePaths[0];
            }
            console.log(JSON.stringify(result));
            that.setData({
              list: result,
              show: true
            })
          }
        })
      }
    })
  },


  select: function(e) {
    let xList = [];
    let breakfast = wx.getStorageSync('breakfast');
    if (breakfast != "") {
      let newList = JSON.parse(breakfast);
      for (let x in newList) {
        xList.push(newList[x]);
      }
    }

    let index = e.currentTarget.dataset.index;
    let item = this.data.list[index];
    xList.push(item);

    breakfast = JSON.stringify(xList);
    wx.setStorageSync('breakfast', breakfast);

    this.setData({
      show: false,
      newList: xList
    })
  },



  store: function(e) {
    console.log('enter store');
    wx.removeStorageSync('breakfast');
    this.setData({
      show: false,
      newList: []
    })
  },

  cancel: function(e) {
    console.log('enter cancel');

    wx.getStorageInfoSync({
      success(res) {
        console.log('-----------------')
        console.log(res.keys);
        console.log(res.currentSize);
        console.log(res.limitSize);
        console.log('-----------------')
      }
    });

    this.setData({
      show: false
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.removeStorageSync("breakfast");
    let breakfast = wx.getStorageSync('breakfast');
    if (breakfast != "") {
      this.setData({
        newList:JSON.parse(breakfast)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})