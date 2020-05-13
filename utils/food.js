//控制存储大小，超过90%，删除100条记录
function deleteStorage(name) {
  let storeInfo = wx.getStorageInfoSync();
  let currentSize = storeInfo['currentSize'];
  let limitSize = storeInfo['limitSize'];

  //test: currentSize / limitSize >0.00009
  if (currentSize / limitSize > 0.9) {
    let breakfast = wx.getStorageSync(name);
    if (typeof (breakfast) == "undefined" || breakfast == "") {
      console.log('null');
    } else {
      console.log('!null');
      let food = JSON.parse(breakfast);
      food.splice(0, 100);
      wx.setStorageSync(name, JSON.stringify(food));
    }
  }
}


function test() {
    console.log(wx.getStorageInfoSync());
    wx.removeStorageSync("age");
    wx.removeStorageSync("gender");
    wx.removeStorageSync("height");
    wx.removeStorageSync("weight");
    wx.removeStorageSync("basic");
    wx.removeStorageSync("logs");
  }


  module.exports = {
    deleteStorage: deleteStorage,
    test: test
  }