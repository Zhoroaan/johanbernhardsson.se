var through = require("through"),
	gutil = require("gulp-util"),
	request = require("request"),
	progress = require("request-progress"),
	col = gutil.colors;

module.exports = function(youtubeids){
	var stream = through(function(file,enc,cb){
		this.push(file);
		cb();
	});


	var ids = typeof youtubeids === 'string' ? [youtubeids] : youtubeids;
	var downloadsLeft = ids.length
	var currentQuality = 0
	var currentFile = 0
	var youtubeQualities = [
		"maxresdefault",
		"sddefault",
		"mqdefault",
		"hqdefault",
		"default",
		"3",
		"2",
		"1",
		"0"
	]
	var maxQualities = youtubeQualities.length;
	
	function download() {
		var fileName
		
		fileName = ids[currentFile] + ".jpg";
		var url = "http://img.youtube.com/vi/" + ids[currentFile] + "/" + youtubeQualities[currentQuality] + ".jpg"
		progress(
			request({url:url,encoding:null},downloadHandler),
			{throttle:1000,delay:1000}
		)

		function downloadHandler(err, res, body){
			if(err || res.statusCode >= 400) {
				if(currentQuality >= maxQualities) {
					gutil.log("Failed to download any thumbnails for " + ids[currentFile]);
					downloadsLeft--;
					currentQuality = 0;
					currentFile++;
				} else {
					currentQuality++;
				}
			} else {
				var file = new gutil.File( {path:fileName, contents: new Buffer(body)} );
				stream.queue(file);
				gutil.log("Downloaded " + fileName + " with quality " + youtubeQualities[currentQuality])
				currentFile++;
				downloadsLeft--;
				currentQuality = 0;
			}
			if(downloadsLeft != 0){
				download();
			} else{
				stream.emit('end');
				gutil.log("end")
			}
		}
	}
	download();

	return stream;
};