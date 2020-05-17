var util = require('../../utils/util.js');
var foodTool = require('../../utils/food.js');
var fooddb = require('/../data/db.js');

Page({

  data: {
    show: false,
    hiddenModal1: true,
    hiddenModal2: true,
    selectIndex: '-1',
    gram: 0,
    gram2: 0,
    list: [],
    calorieArray: [],
    calorieIndex: [0, 0],
    windowHeight: 0,
    delBtnWidth: 160,
    calorieSelectFood: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //控制存储大小，超过90%，删除100条记录
    foodTool.deleteStorage("breakfast");
    //初始化卡路里
    this.initCalorie();
  },


  calorie: function(e) {
    this.data.gram2 = 0;
  },

  getCalorieArray(index) {
    let foodList = fooddb.foodList;

    let typeArray = [];
    for (let x in foodList) {
      typeArray.push(foodList[x]["type"]);
    }

    let nameArray = [];
    let calorieString = '';
    for (let x in foodList[index]["foodlist"]) {
      calorieString = foodList[index]["foodlist"][x]["name"] + "(" + foodList[index]["foodlist"][x]["calorie"] + "千卡/100克)"
      nameArray.push(calorieString);
    }

    let calorieArray = [];
    calorieArray.push(typeArray);
    calorieArray.push(nameArray);
    return calorieArray;
  },


  //初始化卡路里
  initCalorie() {
    this.setData({
      calorieArray: this.getCalorieArray(0)
    })
  },

  //卡路里：选择食品之后的确定按钮触发
  calorieMethod: function (e) {
    console.log("enter calorieMethod");
    let selectIndex = e.detail.value;
    console.log(selectIndex[0]);
    console.log(selectIndex[1]);
    let foodList = fooddb.foodList;
    let oneIndex = selectIndex[0];
    let twoIndex = selectIndex[1];
    let oneList = foodList[oneIndex];
    let twoList = oneList["foodlist"];
    let calorieSelectFood = twoList[twoIndex];
    console.log(calorieSelectFood);

    this.setData({
      hiddenModal2: false,
      calorieSelectFood: calorieSelectFood
    })
  },

  calorieColumnChange: function(e) {
    if (e.detail.column == 0) { //第1列
      if (e.detail.value == 0) {
        this.setData({
          calorieArray: this.getCalorieArray(0),
          calorieIndex: [0, 0]
        })
      } else if (e.detail.value == 1) {
        this.setData({
          calorieArray: this.getCalorieArray(1),
          calorieIndex: [1, 0]
        })
      } else if (e.detail.value == 2) {
        this.setData({
          calorieArray: this.getCalorieArray(2),
          calorieIndex: [2, 0]
        })
      } else if (e.detail.value == 3) {
        this.setData({
          calorieArray: this.getCalorieArray(3),
          calorieIndex: [3, 0]
        })
      } else if (e.detail.value == 4) {
        this.setData({
          calorieArray: this.getCalorieArray(4),
          calorieIndex: [4, 0]
        })
      } else if (e.detail.value == 5) {
        this.setData({
          calorieArray: this.getCalorieArray(5),
          calorieIndex: [5, 0]
        })
      } else if (e.detail.value == 6) {
        this.setData({
          calorieArray: this.getCalorieArray(6),
          calorieIndex: [6, 0]
        })
      }
    }
  },

  gramInput: function(e) {
    this.setData({
      gram: e.detail.value
    })
  },


  gramInput2: function(e) {
    this.setData({
      gram2: e.detail.value
    })
  },

  gramCancel: function(e) {
    this.setData({
      hiddenModal1: true
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
      hiddenModal1: true,
      show: false,
      selectList: foodlist
    })
  },

  gramCancel2: function(e) {
    this.setData({
      hiddenModal2: true
    });
  },

  //卡路里热量提交
  gramConfirm2: function(e) {
    console.log("enter gramConfirm2");
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

    console.log(foodlist);
    console.log(this.data.gram2);


    let gram2 = this.data.gram2;
    if (gram2 == 0) {
      gram2 = 100;
    }
    let selectitem = this.data.calorieSelectFood;
    selectitem['gram'] = gram2;
    selectitem['calorie'] = (selectitem['calorie'] * gram2 / 100).toFixed();
    selectitem['has_calorie'] = true;
    selectitem['right'] = 0;
    foodlist.push(selectitem);

    let item = {};
    item["date"] = date;
    item["foodlist"] = foodlist;

    let food = [];
    food.push(item);

    breakfast = JSON.stringify(food);
    wx.setStorageSync('breakfast', breakfast);

    this.setData({
      hiddenModal2: true,
      selectList: foodlist
    });

  },

  select: function(e) {
    console.log("enter select");
    let index = e.currentTarget.dataset.index;
    let selectitem = this.data.list[index];
    if (selectitem["name"] == "非菜") {
      this.cancel();
    } else {
      this.data.selectIndex = index;
      this.setData({
        hiddenModal1: false
      });
    }
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
    if (breakfast != "") {
      let food = JSON.parse(breakfast);
      for (let x in food) {
        if (date == food[x]["date"]) {
          foodlist = food[x]["foodlist"];
          break;
        }
      }
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