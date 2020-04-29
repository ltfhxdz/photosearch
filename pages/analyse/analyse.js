//获取应用实例
const app = getApp()

Page({
  data: {
    array: ['女', '男'],
    index: 0,
    userInfo: {},

  },

  ageMethod: function () {
    console.log('enter age method');
  },

  heightMethod: function () {
    console.log('enter height method');
  },

  weightMethod: function () {
    console.log('enter weight method');
  },

  genderMethod: function (e) {
    if (e.detail.value == 0) {
      wx.setStorageSync('gender', '女');
    } else {
      wx.setStorageSync('gender', '男');
    }
    this.setBasic();
    this.setData({
      index: e.detail.value,
      gender: wx.getStorageSync('gender'),
      basic: wx.getStorageSync('basic') + '千卡'
    })
  },

  setBasic(){
    let gender = wx.getStorageSync('gender');
    let age = wx.getStorageSync('age');
    let height = wx.getStorageSync('height');
    let weight = wx.getStorageSync('weight');

    let basic = 0
    if (gender == '男') {
      basic = 67 + 13.73 * ((weight / 2).toFixed()) + 5 * height - 6.9 * age
    } else {
      basic = 661 + 9.6 * (weight / 2).toFixed() + 1.72 * height - 4.7 * age
    }
    basic = basic.toFixed();
    wx.setStorageSync('basic', basic);
  },

  onLoad: function() {
    wx.setStorageSync('gender', '男');
    wx.setStorageSync('age', 47);
    wx.setStorageSync('height', 177);
    wx.setStorageSync('weight', 171);
    this.setBasic();

    let index = 0;
    if (wx.getStorageSync('gender') == '男'){
      index = 1;
    }else{
      index = 0;
    }
    this.setData({
      index: index,
      gender: wx.getStorageSync('gender'),
      age: wx.getStorageSync('age') + '岁',
      height: wx.getStorageSync('height') + '厘米',
      weight: wx.getStorageSync('weight') + '斤',
      basic: wx.getStorageSync('basic') + '千卡'
    })
  }
})