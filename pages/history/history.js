var util = require('../../utils/util.js');

Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
  },
  init: function() {
    let food = [];
    let foodlist = [];
    let selectitem = {};
    let item1 = {};
    selectitem['calorie'] = 100;
    selectitem['has_calorie'] = true;
    selectitem['name'] = "烤鳗鱼2020-05-21";
    selectitem['probability'] = "18.85%";
    selectitem['image'] = "../images/fruit.jpg";
    selectitem['right'] = 0;
    selectitem['gram'] = 100;
    foodlist.push(selectitem);
    item1["date"] = "2020-05-21";
    item1["foodlist"] = foodlist;
    food.push(item1);

    let foodlist2 = [];
    let selectitem2 = {};
    selectitem2['calorie'] = 100;
    selectitem2['has_calorie'] = true;
    selectitem2['name'] = "烤鳗鱼2020-04-01";
    selectitem2['probability'] = "18.85%";
    selectitem2['image'] = "../images/meat.jpg";
    selectitem2['right'] = 0;
    selectitem2['gram'] = 100;
    foodlist2.push(selectitem2);
    let item2 = {};
    item2["date"] = "2020-04-01";
    item2["foodlist"] = foodlist2;
    food.push(item2);

    let foodlist3 = [];
    let selectitem3 = {};
    selectitem3['calorie'] = 100;
    selectitem3['has_calorie'] = true;
    selectitem3['name'] = "烤鳗鱼2020-06-01";
    selectitem3['probability'] = "18.85%";
    selectitem3['image'] = "../images/vegetable.jpg";
    selectitem3['right'] = 0;
    selectitem3['gram'] = 100;
    foodlist3.push(selectitem3);
    let item3 = {};
    item3["date"] = "2020-06-01";
    item3["foodlist"] = foodlist3;
    food.push(item3);

    let foodlist4 = [];
    let selectitem4 = {};
    selectitem4['calorie'] = 100;
    selectitem4['has_calorie'] = true;
    selectitem4['name'] = "烤鳗鱼2020-03-01";
    selectitem4['probability'] = "18.85%";
    selectitem4['image'] = "../images/staplefood.jpg";
    selectitem4['right'] = 0;
    selectitem4['gram'] = 100;
    foodlist4.push(selectitem4);
    let item4 = {};
    item4["date"] = "2020-03-01";
    item4["foodlist"] = foodlist4;
    food.push(item4);

    let foodlist5 = [];
    let selectitem5 = {};
    selectitem5['calorie'] = 100;
    selectitem5['has_calorie'] = true;
    selectitem5['name'] = "烤鳗鱼2020-02-01";
    selectitem5['probability'] = "18.85%";
    selectitem5['image'] = "../images/other.jpg";
    selectitem5['right'] = 0;
    selectitem5['gram'] = 100;
    foodlist5.push(selectitem5);
    let item5 = {};
    item5["date"] = "2020-02-01";
    item5["foodlist"] = foodlist5;
    food.push(item5);

    let foodlist6 = [];
    let selectitem6 = {};
    selectitem6['calorie'] = 100;
    selectitem6['has_calorie'] = true;
    selectitem6['name'] = "烤鳗鱼2020-07-01";
    selectitem6['probability'] = "18.85%";
    selectitem6['image'] = "../images/drink.jpg";
    selectitem6['right'] = 0;
    selectitem6['gram'] = 100;
    foodlist6.push(selectitem6);
    let item6 = {};
    item6["date"] = "2020-07-01";
    item6["foodlist"] = foodlist6;
    food.push(item6);

    let foodlist7 = [];
    let selectitem7 = {};
    selectitem7['calorie'] = 100;
    selectitem7['has_calorie'] = true;
    selectitem7['name'] = "烤鳗鱼2020-05-01";
    selectitem7['probability'] = "18.85%";
    selectitem7['image'] = "../images/fruit.jpg";
    selectitem7['right'] = 0;
    selectitem7['gram'] = 100;
    foodlist7.push(selectitem7);
    let item7 = {};
    item7["date"] = "2020-05-01";
    item7["foodlist"] = foodlist7;
    food.push(item7);

    wx.removeStorageSync("breakfast");
    let breakfast = JSON.stringify(food);
    wx.setStorageSync('breakfast', breakfast);
  },

  formatDay(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  selectDay: function(e) {
    let year = e.currentTarget.dataset.year;
    let month = e.currentTarget.dataset.month;
    let day = e.currentTarget.dataset.datenum;
    let isToday = '' + year + this.formatDay(month) + this.formatDay(day);
    let date = year + '-' + this.formatDay(month) + '-' + this.formatDay(day);
    let foodlist = this.getFoodList(date);

    this.setData({
      selectList: foodlist,
      isToday: isToday
    })
  },

  onLoad: function() {
 
  },

  dateInit: function(setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay(); //目标月1号对应的星期

    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        let isToday = '' + year + this.formatDay(month + 1) + this.formatDay(num);
        obj = {
          isToday: isToday,
          dateNum: num
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },

  /**
   * 上月切换
   */
  lastMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    let isToday = '' + year + this.formatDay(month + 1) + this.formatDay(1);
    let foodlist = this.getFoodList(year + '-' + this.formatDay(month + 1) + '-' + this.formatDay(1));
    this.setData({
      year: year,
      month: (month + 1),
      isToday: isToday,
      selectList: foodlist,
    })
    this.dateInit(year, month);
  },

  /**
   * 下月切换
   */
  nextMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    let isToday = '' + year + this.formatDay(month + 1) + this.formatDay(1);
    let foodlist = this.getFoodList(year + '-' + this.formatDay(month + 1) + '-' + this.formatDay(1));
    this.setData({
      year: year,
      month: (month + 1),
      isToday: isToday,
      selectList: foodlist,
    })
    this.dateInit(year, month);
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let date = util.formatTime(new Date());
    let foodlist = this.getFoodList(date);
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    this.dateInit();
    let isToday = '' + year + this.formatDay(month) + this.formatDay(day);
    this.setData({
      year: year,
      month: month,
      isToday: isToday,
      selectList: foodlist
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
  }

})