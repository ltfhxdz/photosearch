var util = require('../../utils/util.js'); 
var foodTool = require('../../utils/food.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    hiddenmodalput: true,
    selectIndex: '-1',
    gram: 0,
    list: [],
    windowHeight: 0,
    delBtnWidth: 160,
  },

  gramInput: function(e) {
    this.setData({
      gram: e.detail.value
    })
  },

  gramCancel: function(e) {
    console.log("enter cancel");
    this.setData({
      hiddenmodalput: true
    });
  },

  gramConfirm: function(e) {
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

    let selectitem = this.data.list[this.data.selectIndex];
    let gram = this.data.gram;
    if (gram == 0) {
      gram = 100;
    }
    selectitem['gram'] = gram;
    selectitem['calorie'] = (selectitem['calorie'] * gram / 100).toFixed();
    foodlist.push(selectitem);

    let item = {};
    item["date"] = date;
    item["foodlist"] = foodlist;

    let food = [];
    food.push(item);

    breakfast = JSON.stringify(food);
    wx.setStorageSync('breakfast', breakfast);

    this.setData({
      hiddenmodalput: true,
      show: false,
      selectList: foodlist
    })

  },


  select: function(e) {
    let index = e.currentTarget.dataset.index;
    this.data.selectIndex = index;
    this.setData({
      hiddenmodalput: false
    });

  },



  upload: function(e) {
    this.data.gram = 0;
    this.data.selectIndex = '-1';
    var that = this;
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
      // 默认9张图片
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
              food['right'] = 0;
              if (food['has_calorie']) {
                newList.push(food);
              } else {
                if (food['name'] == "非菜") {
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



  test: function(e) {
    foodTool.test();
  },


  delete: function(e) {
    wx.removeStorageSync("breakfast");
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

  drawStart: function(e) {
    var touch = e.touches[0]

    for (var index in this.data.selectList) {
      var item = this.data.selectList[index]
      item.right = 0
    }
    this.setData({
      selectList: this.data.selectList,
      startX: touch.clientX,
    })

  },
  drawMove: function(e) {
    var touch = e.touches[0]
    var item = this.data.selectList[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        selectList: this.data.selectList
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        selectList: this.data.selectList
      })
    }
  },
  drawEnd: function(e) {
    var item = this.data.selectList[e.currentTarget.dataset.index];

    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        selectList: this.data.selectList,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        selectList: this.data.selectList,
      })
    }
  },

  deleteItem: function(e) {
    var date = util.formatTime(new Date());
    let foodlist = [];
    let breakfast = wx.getStorageSync('breakfast');
    if (breakfast != "") {
      let food = JSON.parse(breakfast);
      for (let x in food) {
        if (date == food[x]["date"]) {
          foodlist = food[x]["foodlist"];
          foodlist.splice(e.currentTarget.dataset.index, 1);
          break;
        }
      }
      breakfast = JSON.stringify(food);
      wx.setStorageSync('breakfast', breakfast);
    }

    this.data.selectList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      selectList: this.data.selectList
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    foodTool.deleteStorage("breakfast");
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
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    var date = util.formatTime(new Date());
    let foodlist = [];
    let breakfast = wx.getStorageSync('breakfast');
    console.log(breakfast);
    if (breakfast != "") {
      let food = JSON.parse(breakfast);
      for (let x in food) {
        if (date == food[x]["date"]) {
          foodlist = food[x]["foodlist"];
          break;
        }
      }
      console.log(foodlist);
      this.setData({
        selectList: foodlist,
        windowHeight: this.data.windowHeight
      })
    }
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