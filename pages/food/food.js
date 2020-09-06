var util = require('../../utils/util.js');
var foodTool = require('../../utils/food.js');
var fooddb = require('/../data/db.js');

Page({
  data: {
    skipFlag: false,
    show: false,
    basicShow: false,
    hiddenModal1: true,
    selectcHiddenModal: true,
    selectIndex: '-1',
    gram: 0,
    list: [],
    delBtnWidth: 160,
    calorieSelectFood: [],
    gramValue: '',
    gramFlag: false,
    nofindFlag: false,
    genderArray: ['女', '男'],
    ageArray: [
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],
    heightArray: [
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],
    weightArray: [
      [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],

  },


  getGenderIndex() {
    let genderIndex = 0;
    if (wx.getStorageSync('gender') == '男') {
      genderIndex = 1;
    } else {
      genderIndex = 0;
    }
    return genderIndex;
  },

  getAgeIndex() {
    let age = wx.getStorageSync('age');
    let a = parseInt(age / 10);
    let b = age % 10;
    let ageIndex = [];
    if (a == 0) {
      ageIndex = [3, 5];
    } else {
      ageIndex = [a, b];
    }
    return ageIndex;
  },

  getHeightIndex() {
    let height = wx.getStorageSync('height');
    let a = parseInt(height / 10);
    let b = height % 10;
    let heightIndex = [];
    if (a == 0) {
      heightIndex = [16, 5];
    } else {
      heightIndex = [a, b];
    }


    return heightIndex;
  },

  getweightIndex() {
    let weight = wx.getStorageSync('weight');
    let a = parseInt(weight / 100);
    let b = parseInt(weight % 100 / 10);
    let c = weight % 10;
    let weightIndex = [];
    if (a == 0) {
      weightIndex = [1, 5, 5];
    } else {
      weightIndex = [a, b, c];
    }
    return weightIndex;
  },

  getGoShow: function () {
    let basic = wx.getStorageSync('basic');

    let goShow = false;
    if (basic != 0) {
      goShow = true;
    }
    return goShow;
  },

  genderMethod: function (e) {
    if (e.detail.value == 0) {
      wx.setStorageSync('gender', '女');
    } else {
      wx.setStorageSync('gender', '男');
    }
    this.setBasic();

    this.setData({
      genderIndex: e.detail.value,
      gender: wx.getStorageSync('gender'),
      basic: wx.getStorageSync('basic'),
      goShow: this.getGoShow()
    })
  },


  setBasic() {
    let gender = wx.getStorageSync('gender');
    let age = wx.getStorageSync('age');
    let height = wx.getStorageSync('height');
    let weight = wx.getStorageSync('weight');

    let basic = 0
    if (age != "" && age > 0 && height > 0 && weight > 0) {
      if (gender == '男') {
        basic = 67 + 13.73 * ((weight / 2).toFixed()) + 5 * height - 6.9 * age
      } else if (gender == '女') {
        basic = 661 + 9.6 * (weight / 2).toFixed() + 1.72 * height - 4.7 * age
      }
    }

    basic = basic.toFixed();
    wx.setStorageSync('basic', basic);
  },


  ageMethod: function (e) {
    let ageArray = e.detail.value;
    let age = ageArray[0] * 10 + ageArray[1];
    wx.setStorageSync('age', age);

    this.setBasic();

    this.setData({
      age: wx.getStorageSync('age') + '岁',
      basic: wx.getStorageSync('basic'),
      goShow: this.getGoShow()
    })
  },


  heightMethod: function (e) {
    let heightArray = e.detail.value;
    let height = heightArray[0] * 10 + heightArray[1];
    wx.setStorageSync('height', height);

    this.setBasic();

    this.setData({
      height: wx.getStorageSync('height') + '厘米',
      basic: wx.getStorageSync('basic'),
      goShow: this.getGoShow()
    })
  },

  weightMethod: function (e) {
    let weightArray = e.detail.value;
    let weight = weightArray[0] * 100 + weightArray[1] * 10 + weightArray[2];
    wx.setStorageSync('weight', weight);

    this.setBasic();

    this.setData({
      weight: wx.getStorageSync('weight') + '斤',
      basic: wx.getStorageSync('basic'),
      goShow: this.getGoShow()
    })
  },


  calorieMethod: function () {
    this.setData({
      selectValue: '',
      selectcHiddenModal: false,
      selectFlag: false
    })
  },

  selectCancel: function () {
    this.setData({
      selectValue: '',
      selectcHiddenModal: true,
      selectFlag: false
    });
  },

  selectConfirm: function () {
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

    if (newList.length == 0) {
      let nofindItem = {};
      nofindItem["name"] = "抱歉，我用了洪荒之力都没有找到";
      nofindItem["image"] = "../images/cry.jpg";
      newList.push(nofindItem);
      this.setData({
        nofindFlag: false
      });
    } else {
      this.setData({
        nofindFlag: true
      });
    }

    this.setData({
      selectcHiddenModal: true,
      list: newList,
      show: true,
      probabilityFlag: false
    });

  },

  selectInput: function (e) {
    if (e.detail.value.length == 0) {
      this.selectClean();
    } else {
      this.setData({
        searchWord: e.detail.value,
        selectFlag: true
      })
    }
  },

  selectClean: function () {
    this.setData({
      selectValue: '',
      selectFlag: false
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //控制存储大小，超过90%，删除100条记录
    foodTool.deleteStorage("breakfast");
  },

  //美食按钮，输入卡路里
  gramInput: function (e) {
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
  gramCancel: function (e) {
    this.setData({
      hiddenModal1: true
    });
  },

  //美食按钮，提交卡路里输入
  gramConfirm: function (e) {
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

    let selectitem = {};
    let gram = this.data.gram;
    selectitem['name'] = this.data.list[this.data.selectIndex].name;
    selectitem['gram'] = gram;
    selectitem['image'] = this.data.list[this.data.selectIndex].image;
    selectitem['calorie'] = (this.data.list[this.data.selectIndex].calorie * gram / 100).toFixed();
    foodlist.push(selectitem);

    let item = {};
    item["date"] = date;
    item["foodlist"] = foodlist;
    item["basic"] = wx.getStorageSync('basic');
    foodbak.push(item);

    breakfast = JSON.stringify(foodbak);
    wx.setStorageSync('breakfast', breakfast);

    this.setData({
      hiddenModal1: true,
      show: false,
      selectList: foodlist,
      todayCalorie: this.getTodayCalorie(date),
      basic: wx.getStorageSync('basic')
    })
  },

  clean: function () {
    this.setData({
      gramValue: '',
      gramFlag: false
    })
  },

  //美食按钮，选择美食后，触发的方法
  selectMethod: function (e) {
    let index = e.currentTarget.dataset.index;
    let selectitem = this.data.list[index];
    if (selectitem["name"] == "非菜" || selectitem["name"] == "抱歉，我用了洪荒之力都没有找到") {
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
  upload: function (e) {
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
        access_token = res.data.access_token;
      }
    })
    wx.chooseImage({
      // 默认9张图片
      count: 1,
      // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
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
          success: function (res) {
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
                that.setData({
                  nofindFlag: true
                })
              } else {
                if (food['name'] == "非菜") {
                  newList.push(food);
                  that.setData({
                    nofindFlag: false
                  })
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

  test: function (e) {
    foodTool.test();
  },

  delete: function (e) {
    wx.removeStorageSync("breakfast");
    this.setData({
      show: false,
      selectList: []
    })
  },

  cancel: function (e) {
    this.setData({
      show: false
    })
  },

  drawStart: function (e) {
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

  drawMove: function (e) {
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
  drawEnd: function (e) {
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

  deleteItem: function (e) {
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
      selectList: this.data.selectList,
      todayCalorie: this.getTodayCalorie(date),
      basic: wx.getStorageSync('basic')
    })
  },


  getFoodList(date) {
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
    return foodlist;
  },


  getTodayCalorie: function (date) {
    let foodlist = this.getFoodList(date);
    let todayCalorie = 0;
    for (let x in foodlist) {
      todayCalorie = todayCalorie + parseInt(foodlist[x]["calorie"]);
    }
    return todayCalorie;
  },

  go: function () {
    this.setData({
      basicShow: false
    })
  },

  skip: function () {
    this.setData({
      basicShow: false,
      skipFlag: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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

    let basic = wx.getStorageSync('basic');
    if (basic == '' && ! this.data.skipFlag) {
      basic = 0;
      this.setData({
        basicShow: true,
        genderIndex: this.getGenderIndex(),
        ageIndex: this.getAgeIndex(),
        heightIndex: this.getHeightIndex(),
        weightIndex: this.getweightIndex(),
        todayCalorie: this.getTodayCalorie(date),
        basic: basic
      })
    } else {
      this.setData({
        basicShow: false,
        selectList: foodlist,
        todayCalorie: this.getTodayCalorie(date),
        basic: basic
      })
    }

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 允许用户右上角分享到朋友圈
   */
  onShareTimeline: function () {
    title: '吃美食，还要瘦'
  }
})