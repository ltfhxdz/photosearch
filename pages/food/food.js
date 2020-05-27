var util = require('../../utils/util.js');
var foodTool = require('../../utils/food.js');
var fooddb = require('/../data/db.js');

Page({
  data: {
    show: false,
    hiddenModal1: true,
    selectcHiddenModal: true,
    selectIndex: '-1',
    gram: 0,
    list: [],
    delBtnWidth: 160,
    calorieSelectFood: [],
    gramValue: '',
    gramFlag: false
  },

  calorie: function() {
    this.setData({
      selectValue: '',
      selectcHiddenModal: false,
      selectFlag: false
    })
  },

  selectCancel: function() {
    this.setData({
      selectValue: '',
      selectcHiddenModal: true,
      selectFlag: false
    });
  },

  selectConfirm: function() {
    let searchWord = this.data.searchWord;
    let foodList = fooddb.foodList;
    let item;
    let newList = [];
    for (let x in foodList) {
      item = foodList[x];
      if (item.name.indexOf(searchWord) != -1) {
        newList.push(item);
      }
    }

    this.setData({
      selectcHiddenModal: true,
      list: newList,
      show: true,
      probabilityFlag:false
    });

  },

  selectInput: function(e) {
    if (e.detail.value.length == 0) {
      this.selectcClean();
    } else {
      this.setData({
        searchWord: e.detail.value,
        selectFlag: true
      })
    }
  },

  selectcClean: function() {
    this.setData({
      selectValue: '',
      selectFlag: false
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //控制存储大小，超过90%，删除100条记录
    foodTool.deleteStorage("breakfast");
  },

  //美食按钮，输入卡路里
  gramInput: function(e) {
    if (e.detail.value.length == 0) {
      this.clean();
    } else {
      this.setData({
        gram: e.detail.value,
        gramFlag: true
      })
    }
  },

  //美食按钮，取消卡路里输入
  gramCancel: function(e) {
    this.setData({
      hiddenModal1: true
    });
  },

  //美食按钮，提交卡路里输入
  gramConfirm: function(e) {
    var date = util.formatTime(new Date());
    let foodbak = [];
    let foodlist = [];
    let breakfast = wx.getStorageSync('breakfast');
    if (breakfast != "") {
      let food = JSON.parse(breakfast);
      for (let x in food) {
        if (date == food[x]["date"]) {
          foodlist = food[x]["foodlist"];
        } else {
          foodbak.push(food[x]);
        }
      }
    }

    let selectitem = this.data.list[this.data.selectIndex];
    let gram = this.data.gram;
    selectitem['gram'] = gram;
    selectitem['calorie'] = (selectitem['calorie'] * gram / 100).toFixed();
    foodlist.push(selectitem);

    let item = {};
    item["date"] = date;
    item["foodlist"] = foodlist;
    foodbak.push(item);

    breakfast = JSON.stringify(foodbak);
    wx.setStorageSync('breakfast', breakfast);

    this.setData({
      hiddenModal1: true,
      show: false,
      selectList: foodlist
    })
  },

  clean: function() {
    this.setData({
      gramValue: '',
      gramFlag: false
    })
  },

  //美食按钮，选择美食后，触发的方法
  select: function(e) {
    let index = e.currentTarget.dataset.index;
    let selectitem = this.data.list[index];
    if (selectitem["name"] == "非菜") {
      this.cancel();
    } else {
      this.data.selectIndex = index;
      this.setData({
        hiddenModal1: false,
        gramValue: '',
        gramFlag: false
      });
    }
  },

  //上传美食图片
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

        wx.saveImageToPhotosAlbum({
          filePath: tempFilePaths,
          success(res) {
            console.log("save success");
          }
        })

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
              show: true,
              probabilityFlag: true
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
    var touch = e.touches[0];
    for (var index in this.data.selectList) {
      var item = this.data.selectList[index]
      item.right = 0;
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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