// threshold & bot behavior prevention
var db = firebase.database();
var start = Date.now();
var allowance = 100;
var valid = true;
var prevClickInterval = 0;
var nConsec = 0;
var intervalDiff, prevIntervalDiff;
var houseColor = {
  cks: "#16B0EE",
  ghk: "#DEB63A",
  lsg: "#C6C1B6",
  oldham: "#CC0033",
  svm: "#9933CC",
  tct: "#FF9900",
  thoburn: "#336633",
  tkk: "#444444"
}
var houseShort = {
  cks: "CKS",
  ghk: "GHK",
  lsg: "LSG",
  oldham: "OLD",
  svm: "SVM",
  tct: "TCT",
  thoburn: "THO",
  tkk: "TKK"
}
$(".housebtn").click(e => {
  var clickInterval = Date.now() - start;
  start = Date.now();
  intervalDiff = Math.abs(clickInterval - prevClickInterval);
  var diffIntervalDiff = Math.abs(intervalDiff - prevIntervalDiff);
  prevIntervalDiff = intervalDiff;
  // console.log(`diffIntervalDiff: ${diffIntervalDiff}`);
  if(diffIntervalDiff <= 5){
    ++nConsec;
  }else{
    nConsec = 0;
  }
  if(nConsec == 4){
    valid = false;
  }
  if(valid){
    if(clickInterval > allowance){
      // console.log(`valid clickInterval: ${clickInterval}`);
      var house = e.target.id;
      firebase.database().ref().child(house).set(firebase.database.ServerValue.increment(1));
    }
  }
});

db.ref().on('value', snapshot => {
  var values = snapshot.val();
  var arr = [];
  Object.keys(values).forEach(key => {
    arr.push({
      houseName: key,
      houseValue: values[key]
    });
  });
  arr.sort(function(a, b){return b.houseValue - a.houseValue});

  // edit html content
  // start template
  var content = ``;
  var startTemplate = `<table class="table table-borderless leaderboard">
  <thead>
    <tr style="background-color: white">
      <th scope="col">Pos.</th>
      <th scope="col">House</th>
      <th scope="col">No. of clicks</th>
    </tr>
  </thead>
  <tbody>
  `;
  content += startTemplate;

  // leaderboard ranks  
  for(var i = 0;i< arr.length;++i){
    var iHouseName = arr[i].houseName;
    var iHouseValue = arr[i].houseValue;
    var item = `<tr style=\"background-color: ` + houseColor[iHouseName] + " !important;\">";
    item += 
    `<th scope="row">${i+1}</th>
    <td>${houseShort[iHouseName]}</td>
    <td>${iHouseValue}</td>
  </tr>`;
    content += item;
  }

  // end template
  var endTemplate = `</tbody>
  </table>`;
  content += endTemplate;

  $(".leaderboardWrapperClass").html(content);
});