//获取应用实例
const app = getApp()

Page({
  data: {
    array: ['男', '女'],
    index: 0,
    userInfo: {},
    //默认值
    age: 47,
    height: 177,
    weight: 171
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

  getConfig: function(name) {
    // wx.removeStorageSync(key);
    var value = wx.getStorageSync(name);
    console.log('value:' + value);
    if (value == '') {
      console.log('value == null');
    } else {
      console.log('value != null');
    }
  },

  genderMethod: function (e) {
    console.log('enter gender method');
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let gender = '男';
    if (e.detail.value == 0) {
      gender = '男';
    } else {
      gender = '女'
    }
    this.setData({
      index: e.detail.value,
      gender: gender
    })
  },

  onLoad: function() {
    wx.removeStorageSync('height');
    this.getConfig('height');

    var that = this;

    //获取用户信息
    wx.getUserInfo({
      success: function(res) {
        that.data.userInfo = res.userInfo;
        console.log(res.userInfo);
        console.log((that.data.weight / 2).toFixed());
        let gender = res.userInfo['gender'];

        // 男：67 + 13.73 * 体重 + 5 * 身高 - 6.9 * 年龄
        // 女：661 + 9.6 * 体重 + 1.72 * 身高 - 4.7 * 年龄
        let basic = 0
        if (gender == 1) {
          basic = 67 + 13.73 * ((that.data.weight / 2).toFixed()) + 5 * (parseInt(that.data.height)) - 6.9 * (parseInt(that.data.age))
        } else {
          basic = 661 + 9.6 * ((that.data.weight / 2).toFixed()) + 1.72 * (parseInt(that.data.height)) - 4.7 * (parseInt(that.data.age))
        }
        basic = basic.toFixed();
        let age = that.data.age + '岁';
        let height = that.data.height + '厘米';
        let weight = that.data.weight + '斤';
        let basicStr = basic + '千卡';
        that.setData({
          userInfo: that.data.userInfo,
          age: age,
          height: height,
          weight: weight,
          basic: basicStr
        })
      }
    })
  }
})