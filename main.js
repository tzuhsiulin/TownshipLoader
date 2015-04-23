var Q = require('q');
var DBFReader = require('./DBFReader');
var MongoClient = require('mongodb').MongoClient;
var dbUri = 'mongodb://name:pwd@ip:27017/db';

MongoClient.connect(dbUri, function(err, db) {
	if (err) {
		console.log(err);
	}
	else {
		var townshipInfo = getTownshipInfo();
		db.collection('Township').insert(townshipInfo, function(err, result) {
			if (err) {
				console.log(err);
			}
			else {
				console.log(result);
			}
		});
	}
	process.exit(1);
});

function getTownshipInfo() {
	var countyReader = new DBFReader('./county.dbf');
	var counties = countyReader.parse();

	var townshipReader = new DBFReader('./township.dbf');
	var townships = townshipReader.parse();

	for (var i = 0; i < counties.length; i++) {
		counties[i]['townships'] = []; 

		for (var j = 0; j < townships.length; j++) {
			if (counties[i]['County_ID'] == townships[j]['County_ID']) {
				counties[i]['townships'].push({
					Town_ID: townships[j]['Town_ID'],
					T_Name: townships[j]['T_Name'],
					Area: townships[j]['Area']
				});
			}
		}

		delete counties[i]['OBJECTID'];
		delete counties[i]['Add_Date'];
		delete counties[i]['Add_Accept'];
		delete counties[i]['Remark'];
	}

	return counties;
};