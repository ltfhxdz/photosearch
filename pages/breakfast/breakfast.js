var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    list: [],
    gramArray: [
      [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500,
      1600,1700,1800,1900,2000,2100,2200,2300,2400,2500,2600,2700,2800,2900,3000],
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],
  },


  gramMethod: function (e) {
    let gramArray = e.detail.value;
    let gram = gramArray[0] * 100 + gramArray[1] * 10 + gramArray[2];
    console.log(gram);

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
            let newList = [];
            for (var k in result) {
              var food = result[k];
              food['probability'] = ((parseFloat(food['probability']).toFixed(4)) * 100).toFixed(2) + "%";
              food['image'] = tempFilePaths[0];
              if (food['has_calorie']) {
                newList.push(food);
              } else {
                if (food['name'] == "非菜"){
                  newList.push(food);
                }
              }
            }
            that.setData({
              list: newList,
              show: true
            })
          }
        })
      }
    })
  },


  select: function(e) {

    var date = util.formatTime(new Date());
    let foodlist = [];
    let breakfast = wx.getStorageSync('breakfast');
    if (breakfast != "") {
      let food = JSON.parse(breakfast);
      for (let x in food) {
        if (date == food[x]["date"]) {
          foodlist = food[x]["foodlist"];
          break;
        }
      }
    }

    let index = e.currentTarget.dataset.index;
    let selectitem = this.data.list[index];
    foodlist.push(selectitem);

    let item = {};
    item["date"] = date;
    item["foodlist"] = foodlist;

    let food = [];
    food.push(item);

    breakfast = JSON.stringify(food);
    wx.setStorageSync('breakfast', breakfast);

    this.setData({
      show: false,
      gramsShow:true,
      selectList: foodlist
    })

  },



  test: function(e) {

    let breakfast = wx.getStorageSync('breakfast');
    console.log(breakfast);
  },


  store: function(e) {
    wx.removeStorageSync('breakfast');
    this.setData({
      show: false,
      selectList: []
    })
  },

  cancel: function(e) {


    this.setData({
      show: false
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var date = util.formatTime(new Date());
    let foodlist = [];
    let breakfast = wx.getStorageSync('breakfast');
    if (breakfast != "") {
      let food = JSON.parse(breakfast);
      for (let x in food) {
        if (date == food[x]["date"]) {
          foodlist = food[x]["foodlist"];
          break;
        }
      }
      this.setData({
        selectList: foodlist
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