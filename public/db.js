var db = firebase.database();
var houseColor = {
  cks: "#16B0EE",
  ghk: "#DEB63A",
  lsg: "#C6C1B6",
  oldham: "#CC0033",
  svm: "#9933CC",
  tct: "#EED0AE",
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
  var house = e.target.id;
  console.log(house);
  firebase.database().ref().child(house).set(firebase.database.ServerValue.increment(1));
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