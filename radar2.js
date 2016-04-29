RadarChart.defaultConfig.color = function() {};
RadarChart.defaultConfig.radius = 3;
RadarChart.defaultConfig.w = 600;
RadarChart.defaultConfig.h = 600;

var table = {
	group: function(rows, fields) {
		var view = {}
		var pointer = null

		for(var i in rows) {
			var row = rows[i]

			pointer = view
			for(var j = 0; j < fields.length; j++) {
				var field = fields[j]

				if(!pointer[row[field]]) {
					if(j == fields.length - 1) {
						pointer[row[field]] = []
					} else {
						pointer[row[field]] = {}
					}
				}

				pointer = pointer[row[field]]
			}

			pointer.push(row)
		}

		return view
	},

	maxCount: function(view) {
		var largestName = null
		var largestCount = null

		for(var i in view) {
			var list = view[i]

			if(!largestName) {
				largestName = i
				largestCount = list.length
			} else {
				if(list.length > largestCount) {
					largestName = i
					largestCount = list.length
				}
			}
		}

		return {
			name: largestName,
			count: largestCount
		}
	},

	filter: function(view, callback) {
		var data = []

		for(var i in view) {
			var list = view[i]
			if(callback(list, i)) {
				data = data.concat(list)
			}
		}

		return data
	}
}

var data = [
  {
    className: 'germany', // optional can be used for styling
    axes: [
      {axis: "strength", value: 13}, 
      {axis: "intelligence", value: 6}, 
      {axis: "charisma", value: 5},  
      {axis: "dexterity", value: 9},  
      {axis: "luck", value: 2}
    ]
  },
  {
    className: 'argentina',
    axes: [
      {axis: "strength", value: 6}, 
      {axis: "intelligence", value: 7}, 
      {axis: "charisma", value: 10},  
      {axis: "dexterity", value: 13},  
      {axis: "luck", value: 9}
    ]
  }
];
d3.csv("crossCityComparison_short.csv", function(error,data){
    if (error) throw error;
    
	var byCity = table.group(data, ["income"])
        var formatedCity = []
    for(var c in byCity){
        var cityName = byCity[c][0].income
        var cityData = byCity[c]
        var byIncome = table.group(cityData,["city"])
        var currentCity = []
        for(var i in byIncome){
            var entry = {}
            var className = byIncome[i][0].city
            var axis1 ={axis:byIncome[i][0].intensity,value:byIncome[i][0].mean}
            var axis2 ={axis:byIncome[i][1].intensity,value:byIncome[i][1].mean}
            var axis3 ={axis:byIncome[i][2].intensity,value:byIncome[i][2].mean}
            
            entry["className"]=className
            entry["axes"]=[]
            entry["axes"].push(axis1)
            entry["axes"].push(axis2)
            entry["axes"].push(axis3)
        currentCity.push(entry)
        }
       // console.log(currentCity)
        drawChart(currentCity,cityName)
        formatedCity.push(currentCity)
    }
})

var key = d3.select('body').append('svg').attr("width",300).attr("height",300)
var keyData = {"low income":"#FFD700","medium income":"#E13F29","high income":"#549EC4"}
var cityColors = {"chicago":"#C95892","denver":"#6FC440", "washington":"#BC72D1", "sanJose":"#CAA432", "portland":"#7484C5", "pittsburg":"#C9622F", "orlando":"#43A2B3", "milwaukee":"#D34E5B","lasVegas":"#48AD73", "LA":"#6A852E"}
var index = 0
for(var i in cityColors){
        console.log(cityColors[i])
    key.append("rect").attr("x",20).attr("y",index*30+30).attr("width",20).attr("height",20)
    .attr("fill",cityColors[i])
    key.append("text").attr("x",45).attr("y",index*30+45)
    .attr("fill",cityColors[i]).text(i)
    index+=1
}

function drawChart(data,city){
    console.log(city)
var chart = RadarChart.chart();
//var cfg = chart.config(); // retrieve default config
var svg = d3.select('body').append('svg').attr("width",600).attr("height",600)
svg.append("text").text(city).attr("x",20).attr("y",20)
//  .attr('width', cfg.w + cfg.w + 50)
 // .attr('height', cfg.h + cfg.h / 4);
svg.append('g').classed('single', 1).datum(data).call(chart);
}