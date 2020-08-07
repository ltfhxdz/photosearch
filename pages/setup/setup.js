var util = require('../../utils/util.js');

Page({
  data: {
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

  heightMethod: function(e) {
    let heightArray = e.detail.value;
    let height = heightArray[0] * 10 + heightArray[1];
    wx.setStorageSync('height', height);

    this.setBasic();

    this.setData({
      height: wx.getStorageSync('height') + '厘米',
      basic: wx.getStorageSync('basic')
    })
  },

  weightMethod: function(e) {
    let weightArray = e.detail.value;
    let weight = weightArray[0] * 100 + weightArray[1] * 10 + weightArray[2];
    wx.setStorageSync('weight', weight);

    this.setBasic();

    this.setData({
      weight: wx.getStorageSync('weight') + '斤',
      basic: wx.getStorageSync('basic')
    })
  },

  genderMethod: function(e) {
    if (e.detail.value == 0) {
      wx.setStorageSync('gender', '女');
    } else {
      wx.setStorageSync('gender', '男');
    }
    this.setBasic();
    this.setData({
      genderIndex: e.detail.value,
      gender: wx.getStorageSync('gender'),
      basic: wx.getStorageSync('basic')
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


  ageMethod: function(e) {
    let ageArray = e.detail.value;
    let age = ageArray[0] * 10 + ageArray[1];
    wx.setStorageSync('age', age);

    this.setBasic();

    this.setData({
      age: wx.getStorageSync('age') + '岁',
      basic: wx.getStorageSync('basic')
    })
  },

  //设置默认值
  setDefault() {
    if (wx.getStorageSync('gender') == '') {
      wx.setStorageSync('gender', '男');
    }
    if (wx.getStorageSync('age') == '') {
      wx.setStorageSync('age', 47);
    }
    if (wx.getStorageSync('height') == '') {
      wx.setStorageSync('height', 177);
    }
    if (wx.getStorageSync('weight') == '') {
      wx.setStorageSync('weight', 171);
    }
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

  onLoad: function() {
    //设置默认值
    // this.setDefault();

  },

  onShow: function() {
    //设置基础代谢
    this.setBasic();

    this.setData({
      genderIndex: this.getGenderIndex(),
      ageIndex: this.getAgeIndex(),
      heightIndex: this.getHeightIndex(),
      weightIndex: this.getweightIndex(),
      gender: wx.getStorageSync('gender'),
      age: wx.getStorageSync('age') + '岁',
      height: wx.getStorageSync('height') + '厘米',
      weight: wx.getStorageSync('weight') + '斤',
      basic: wx.getStorageSync('basic')
    })
  },

  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

    /**
   * 允许用户右上角分享到朋友圈
   */
  onShareTimeline: function () {
    title: '吃美食，还要瘦'
  }
  
})