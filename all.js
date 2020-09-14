// 設計稿參考https://challenge.thef2e.com/user/2259?schedule=4452#works-4452
// 設定地圖位置及zoom
let map = {};
map = L.map('map', {
  center: [25.0526898, 121.5182023],
  zoom: 16,
  zoomControl: false,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
// 設定zoom的位置
L.control.zoom({
  position: 'topright',
}).addTo(map);

// 自訂圖標
const greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const goldIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 新增圖層,並把marker作群組化,記得要引入markercluster CSS及JS資料
const markers = new L.MarkerClusterGroup().addTo(map);
// 轉換星期寫法
const chineseDay = function () {
  const date = new Date();
  const getDay = date.getDay();
  switch (getDay) {
    case 0:
      return '日';
    case 1:
      return '一';
    case 2:
      return '二';
    case 3:
      return '三';
    case 4:
      return '四';
    case 5:
      return '五';
    case 6:
      return '六';
  }
};
// 取得時間
function renderDate() {
  const date = new Date();
  const day = new Date().getDay();
  // 判斷月份+0
  const addZero = function (month, digit) {
    let monthString = String(month); // 轉成字串
    if (monthString.length < digit) {
      monthString = `0${monthString}`;
    }
    return monthString;
  };
  const checkDay = addZero(date.getMonth() + 1, 2);

  const today = `${date.getFullYear()}-${checkDay}-${date.getDate()}`;

  const judgeDay = chineseDay(date.getDay());
  document.querySelector('.date').textContent = `星期${judgeDay}`;
  document.querySelector('.today').textContent = today;
  // 判斷身分證號
  if (day === 0) {
    document.querySelector('.IdInfoAll').style.display = 'block';
  } else if (day % 2 === 1) {
    document.querySelector('.IdInfoOdd').style.display = 'block';
  } else if (day % 2 === 0) {
    document.querySelector('.IdInfoEven').style.display = 'block';
  }
}

let data = [];
// 取得資料及在地圖上顯示marker資訊
function getData() {
  const xhr = new XMLHttpRequest();
  xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');
  xhr.send(null);
  xhr.onload = function () {
    data = JSON.parse(xhr.responseText);
    const ary = data.features;
    for (let i = 0; ary.length > i; i += 1) {
      let mask;
      if (ary[i].properties.mask_adult === 0 && ary[i].properties.mask_child === 0) {
        mask = redIcon;
      } else {
        mask = greenIcon;
      }
      markers.addLayer(L.marker([ary[i].geometry.coordinates[1], ary[i].geometry.coordinates[0]], { icon: mask }).bindPopup(`<p class="name">${ary[i].properties.name}</p>  <p class="address">${ary[i].properties.address}</p> <p class="phone">${ary[i].properties.phone}</p> <p class="adult mask">成人口罩數量${ary[i].properties.mask_adult}個</p> <p class="mask child">兒童口罩數量${ary[i].properties.mask_child}個</p>`));
    }
    map.addLayer(markers);
  };
}
// 取得使用者位置
function getUserPosition() {
  if (navigator.geolocation) {
    const showPosition = function (position) {
      L.marker([position.coords.latitude, position.coords.longitude], { icon: goldIcon }).addTo(map).bindPopup('目前的位置').openPopup();
      map.setView([position.coords.latitude, position.coords.longitude], 16); // setView設定地圖圖面的範圍
    };
    const showError = function () {
      alert('抱歉，現在無法取的您的地理位置。');
    };
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert('抱歉，現在無法取的您的地理位置。');
  }
}
// 初始化
function init() {
  renderDate();
  getData();
  getUserPosition();
}
init();


// 顯示藥局資訊及自定義data-屬性
function renderList() {
  const ary = data.features;
  const value = document.querySelector('.search').value;
  let str = ' ';
  for (let i = 0; i < ary.length; i++) {
    if (value === ary[i].properties.county || value === ary[i].properties.town || value === ary[i].properties.name) {
      str += `
            <li class="drogstore">
            <h3 class="name">${ary[i].properties.name}</h3>
            <p class="address">${ary[i].properties.address}</p>
            <p class="phone">${ary[i].properties.phone}</p>
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" alt="marker" class="marker_icon"
            data-location="${[ary[i].geometry.coordinates[1], ary[i].geometry.coordinates[0]]}"
            data-info="<h2 class='name'>藥局名稱:${ary[i].properties.name}</h2>
            <p class='phone'>${ary[i].properties.phone}</p>
            <p class='address'>${ary[i].properties.address}</p>
            <p class='adult mask'>成人口罩 ${ary[i].properties.mask_adult}</p>
            <p class='child mask'>兒童口罩${ary[i].properties.mask_child}</p>
            ">
            <a href='https://www.google.com.tw/maps/place/${ary[i].properties.name}' target='_blank' class='googlemap'>前往藥局</a>
            <a href='${ary[i].properties.phone}' class='call'>撥打電話</a>
            <span class="adult mask">成人口罩<span class="number">${ary[i].properties.mask_adult}</span>個</span>
            <span class="child mask">兒童口罩<span class="number">${ary[i].properties.mask_child}</span>個</span>
            </li>
             `;
    } else if (value === '') {
      str = '';
    }
  }
  document.querySelector('.list').innerHTML = str;
}

// DOM點&搜尋事件
const search = document.querySelector('.search');
const debounce = _.debounce(renderList, 2000);
search.addEventListener('input', () => {
  debounce();
}, false);


// 按下標誌跳到指定位置
const list = document.querySelector('.list');
function updateMap(e) {
  if (e.target.nodeName === 'IMG') {
    const locationInfo = e.target.dataset.location;
    const dataInfo = e.target.dataset.info;
    const strAry = locationInfo.split(','); // 將字串切割並回傳字串陣列
    const numA = parseFloat(strAry[0]);// 字串轉換成浮點數
    const numB = parseFloat(strAry[1]);
    const location = [numA, numB];
    map.setView(location, 18);
    L.marker(location)
      .addTo(map)
      .bindPopup(dataInfo)
      .openPopup();
  }
}

list.addEventListener('click', updateMap, false);
