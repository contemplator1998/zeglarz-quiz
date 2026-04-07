/*function findWBTServerTop(win) //pg2-removed, converted to a method of LMSCSA - at the end of the file
{
	try {
		if (win && win.isWBTServer != null) return win;
	} catch(e) {}
		
	if (win && win.length > 0 ) {
		for (var i = 0; i < win.length; i++) {
			var o = this.findWBTServerTop(win.frames[i]);
			if (o != null) {
				return o;
			}
		}
	}   
	return null;
}

function getWBTServerTop() //pg2-removed, converted to a method of LMSCSA - at the end of the file
{
	var o = this.findWBTServerTop(parent);
	var isOpener=false;
	if (o == null) o = this.findWBTServerTop(window.top);
	if (o == null){		
		//var tempWin = window.parent.opener;
		var tempWin = top.opener; //pg2-new win close
		if(tempWin != null) isOpener = true;
		while(isOpener){
			if(tempWin.top) o = this.findWBTServerTop(tempWin.top);
			if (o != null) break;
			tempWin = tempWin.parent.opener;
			if(tempWin != null) isOpener = true;
			else isOpener = false;
		}
	}
	return o;
}*/

LMSCSA = function()
{
	this.dummyLMSManager = dummyLMSManager;
	this.dummyLMSManager();
	
	this.csa = this.getCSA();
	this.isWBTServer = false;
	var topWin = this.getWBTServerTop();
	if (topWin) this.isWBTServer = (topWin.isWBTServer == true);
	this.csa = this.getCSA();
}
LMSCSA.prototype = new dummyLMSManager();
LMSCSA.prototype.name = "lmsCSA";
LMSCSA.prototype.setPoints = function(points)
{
	if (this.csa) this.csa.setScore(points);
}
LMSCSA.prototype.getPoints = function()
{
	return (this.csa) ? this.csa.getScore() : 0;
}
LMSCSA.prototype.setStatus = function(status)
{
	if (this.csa) {
		var csaStatus = "n";
		if (status == lms.STATUS_NOT_ATTEMPTED) csaStatus = "n";
		if (status == lms.STATUS_INCOMPLETE) csaStatus = "i";
		if (status == lms.STATUS_FAILED) csaStatus = "f";
		if (status == lms.STATUS_COMPLETED) csaStatus = "c";
		if (status == lms.STATUS_PASSED) csaStatus = "p";
		return this.csa.setStatus(csaStatus);
	}	
};
LMSCSA.prototype.getStatus = function()
{
	var csaStatus = "";
	if (this.csa) csaStatus = this.csa.getStatus().toLowerCase();
	if (csaStatus == "n") return lms.STATUS_NOT_ATTEMPTED;
	if (csaStatus == "i") return lms.STATUS_INCOMPLETE;
	if (csaStatus == "f") return lms.STATUS_FAILED;
	if (csaStatus == "c") return lms.STATUS_COMPLETED;
	if (csaStatus == "p") return lms.STATUS_PASSED;
	return lms.STATUS_NOT_ATTEMPTED;
};
LMSCSA.prototype.getCMIValue = function(name)
{
	return (this.csa) ? this.csa.getCMIValue(name) : "";
}
LMSCSA.prototype.setExercisePassed = function(points)
{
	if (this.csa) {
		this.csa.setScore(points);
		this.csa.setStatus("p");
	}	
}
LMSCSA.prototype.setExerciseFailed = function()
{
	if (this.csa) {
		this.csa.setScore(0);
		this.csa.setStatus("f");
	}	
}
LMSCSA.prototype.gotoPage = function(indexPage)
{
	if (this.csa) this.csa.gotoPage(indexPage);
}
LMSCSA.prototype.gotoEncyclopedia = function(wordToSearch)
{
	if (this.csa) this.csa.gotoEncyclopedia(wordToSearch);
}
LMSCSA.prototype.nextPage = function()
{
	if (this.csa) this.csa.nextPage();
}
LMSCSA.prototype.getUEDO = function()
{
	if (this.csa && this.csa.cmi) return this.csa.cmi;
}
LMSCSA.prototype.getCourseData = function(name)
{
	return (this.csa) ? this.csa.getData(name) : null;
}
LMSCSA.prototype.setCourseData = function(name, value)
{
	if (this.csa) this.csa.setData(name, value);
}
LMSCSA.prototype.prevPage = function()
{
	if (this.csa) this.csa.previousPage();
}
LMSCSA.prototype.findCSA = function(win)
{
	try {
		if (win && win.csa != null) return win.csa;
	} catch(e) {}
		
	if (win && win.length > 0 ) {
		for (var i = 0; i < win.length; i++) {
			var theCSA = this.findCSA(win.frames[i]);
			if (theCSA != null) {
				return theCSA;
			}
		}
	}   
	return null;
}
LMSCSA.prototype.getCSA = function()
{
	var obj = window.parent;
	while (obj) {
		try {
			if (obj.csa) return obj.csa;
		} catch(e) {};		
		if (obj == window.top) break;
		obj = obj.parent;
	}
	
	var o = this.findCSA(parent);
	if (o == null) {
		if (typeof(opener) != "undefined") {
			if (opener != null) 
			{
				var wind = window;
				while (wind.opener && !o) {
					o = this.findCSA(wind.opener.top);
					if (o != null) break;
					wind = wind.opener;
				}
			}
		}
	}	
	framesTable = new Array();
	return o;
}
LMSCSA.prototype.getSID = function()
{
	if (this.csa) {
		return this.csa.getSID();
	}
	return "";
};
LMSCSA.prototype.mediaStatus = function()
{
	try {
		var topWin = this.getWBTServerTop();
		var csa = this.getCSA();
		//var doc = (csa) ? csa.doc : document; //pg2-audioOnOff_new-removed
		if (typeof(this.isWBTServer) == "undefined") this.isWBTServer = false; //pg2-scope problems during polimorph.
		if (!this.isWBTServer) {
			
			//pg2-audioOnOff_new
			if (!top.mediaStatus) {
				top.mediaStatus = "online";
			};
			return top.mediaStatus;
			
			/*if (cookie && cookie.get != 'undefined') { //pg2-audioOnOff_new-removed
				var ms = cookie.get("mediaStatus", doc);
				if (ms != null && ms != "") {
					if (ms.match(/^off$/i)) {
						return("off");
					} else
					if (ms.match(/^offline$/i)) {
						return("offline");
					} else
					if (ms.match(/^textOnly$/i)) {
						return("textOnly");
					}				
				}
			}*/
		} else 
		if (topWin) {
			var vs = topWin.getCookie("videoSelected");		
			if (vs.match(/^off$/i)) {
				return("off");
			} else
			if (vs.match(/^offline$/i)) {
				return("offline");
			} else
			if (vs.match(/^textOnly$/i)) {
				return("textOnly");
			}
		}
	} catch(e) {
		if (typeof(log) != 'undefined') log.error("LMSCSA.mediaStatus - " + e.description); //pg2-condition
	};
	return("online");
};

LMSCSA.prototype.setMediaStatus = function(status)
{
	try { //pg2
		var topWin = this.getWBTServerTop();
		var csa = this.getCSA();
		//var doc = (csa) ? csa.doc : document; //pg2-audioOnOff_newremoved
		
		if (typeof(this.isWBTServer) == "undefined") this.isWBTServer = false; //pg2-scope problems during polimorph.
		if (!this.isWBTServer) {
			
			//pg2-audioOnOff_new
			top.mediaStatus = status;
			
			/*if (cookie && cookie.set != 'undefined') { //pg2-audioOnOff_new-removed
				cookie.set("mediaStatus", status, 365, doc);
			}*/
		} else
		if (topWin) {
			topWin.setCookie("videoSelected", status);
		}
	} catch(e) {
		if (typeof(log) != 'undefined') log.error("LMSCSA.setMediaStatus() - " + e.description); //pg2-condition
	};
};

LMSCSA.prototype.mediaURL = function()
{
	var topWin = this.getWBTServerTop();
	
	if (typeof(this.isWBTServer) == "undefined") this.isWBTServer = false; //pg2-scope problems during polimorph.
	if (!this.isWBTServer) {
		if (this.mediaStatus() == "offline") {
			var p = cookie.get("mediaURL");
			if (p != null && p != "") {
				var lc = p.charAt(p.length-1);
				if (lc != "\\" && lc != "/" ) {
					p += (is.platform == "win32") ? "\\":"/";
				}
				return(p);
			}
		}
	} else
	if (this.mediaStatus() == "offline") {
		if (topWin) {
			var p = topWin.getCookie("pathToVideos");
			if (p != "") {
				var lc = p.charAt(p.length-1);
				if (lc != "\\" && lc != "/" ) {
					p += (is.platform == "win32") ? "\\":"/";
				}
				return(p);
			}
		}
	}
	return(resourcesURL);
};
LMSCSA.prototype.setMediaURL = function(url)
{
	try { //pg2
		var topWin = this.getWBTServerTop();
		if (typeof(this.isWBTServer) == "undefined") this.isWBTServer = false; //pg2-scope problems during polimorph.
		if (!this.isWBTServer) {
			if (cookie && cookie.set != 'undefined') {
				cookie.set("mediaURL", url);
			}
		} else
		if (topWin) {
			topWin.setCookie("pathToVideos", status);
		}
	} catch(e) {
		if (typeof(log) != 'undefined') log.error("LMSCSA.setMediaURL() - " + e.description); //pg2-condition
	};
}
LMSCSA.prototype.getLastUserAnswer = function()
{
	var result = ""; //null;
	if (this.getCourseData) {
		var val = this.getCourseData("_ua" + project.pageRealGlobalIndex);
		if (val != null && typeof(val) != "undefined") {
			result = unescape(val);
		}
	}
	return (result) ? result : "";
};
LMSCSA.prototype.setLastUserAnswer = function(ans, id)
{
	try {
		if (id == null || typeof(id) == "undefined" || id == "") id = project.pageRealGlobalIndex;
		if (ans == null) return;
		
		ans = ans.toString();
		ans = ans.replace(/,/g, "%2C");
		ans = ans.replace(/#/g, "%23");
		ans = ans.replace(/=/g, "%3D");
		ans = ans.replace(/\|/g, "%7C");
		
		if (this.setCourseData) this.setCourseData("_ua" + id, ans);
	} catch (e) {
		if (typeof(log) != 'undefined') log.error("LMSCSA.setLastUserAnswer - " + e.description); //pg2-condition
	}
};
LMSCSA.prototype.setLightVersion = function(b)
{
	if (this.csa) {
		this.csa.setLightVersion(b);
	}
};
LMSCSA.prototype.getLightVersion = function()
{
	if (this.csa) {
		return this.csa.getLightVersion();
	}
};
LMSCSA.prototype.closeCourse = function()
{
	try {
		if (typeof(this.isWBTServer) == "undefined") this.isWBTServer = false; //pg2-scope problems during polimorph.
		if (this.isWBTServer) {
			var topWin = this.getWBTServerTop();
			if (topWin) {
				if (topWin.quit) {
					topWin.quit();
					if (top.opener != null) top.window.close(); //pg2-new win close
				} else {
					var s = 'LMS Platform does not support this property or method: "%s".';
					s = s.toString().replace('%s', 'quit()');
					alert(s);
				}
			}
		} else {
			if (top.window.opener != null) { //pg2-BV
				if (typeof(top.window.opener.closeme) != 'undefined') {
					var uelo = getUELO();
					if (uelo) uelo.sendSubDataToServerAtOnce();
					try {
						top.window.opener.closeme();
					} catch(e) {};
				};
			};
		};
	} catch(e) {
		if (typeof(log) != 'undefined') log.error("LMSCSA.closeCourse() - " + e.description); //pg2-condition
	}
};

LMSCSA.prototype.nextSCO = function()
{
	var player = getPlayer();
	if (player) player.nextSCO();
};
LMSCSA.prototype.prevSCO = function()
{
	var player = getPlayer();
	if (player) player.prevSCO();
};
LMSCSA.prototype.getUserPrivilege = function()
{
	try {
		if (typeof(this.isWBTServer) == "undefined") this.isWBTServer = false; //pg2-scope problems during polimorph.
		if (this.isWBTServer) {
			var topWin = this.getWBTServerTop();
			if (topWin) {
				if (topWin.getUserPrivilege) {
					return topWin.getUserPrivilege();
				} else {
					/*
					var s = 'LMS Platform does not support this property or method: "%s".';
					s = s.toString().replace('%s', 'getUserPrivilege()');
					alert(s);
					*/
				}
			}
		}
	} catch(e) {
		if (typeof(log) != 'undefined') log.error("LMSCSA.getUserPrivileges - " + e.description); //pg2-condition
	}
	return null;
};
LMSCSA.prototype.getDynamicContent = function()
{
	try {
		if (typeof(this.isWBTServer) == "undefined") this.isWBTServer = false; //pg2-scope problems during polimorph.
		if (this.isWBTServer) {
			var topWin = this.getWBTServerTop();
			if (topWin) {
				if (topWin.getDynamicContent) {
					return topWin.getDynamicContent();
				}
			}
		}
	} catch(e) {
		if (typeof(log) != 'undefined') log.error("LMSCSA.getDynamicContent - " + e.description); //pg2-condition
	}
	return null;
};
LMSCSA.prototype.getStudentName = function()
{
	if (this.csa && this.csa.getStudentName) return this.csa.getStudentName();
	return "";
};
LMSCSA.prototype.getPassingScore = function()
{
	if (this.csa && this.csa.getPassingScore) return this.csa.getPassingScore();
	return 100;
}

LMSCSA.prototype.findWBTServerTop = function(win) //pg2
{
	try {
		if (win && win.isWBTServer != null) return win;
	} catch(e) {}
		
	if (win && win.length > 0 ) {
		for (var i = 0; i < win.length; i++) {
			var o = this.findWBTServerTop(win.frames[i]);
			if (o != null) {
				return o;
			}
		}
	}   
	return null;
}

LMSCSA.prototype.getWBTServerTop = function() //pg2
{
	var o = this.findWBTServerTop(parent);
	var isOpener=false;
	if (o == null) o = this.findWBTServerTop(window.top);
	if (o == null){		
		//var tempWin = window.parent.opener;
		var tempWin = top.opener; //pg2-new win close
		if(tempWin != null) isOpener = true;
		while(isOpener){
			if(tempWin.top) o = this.findWBTServerTop(tempWin.top);
			if (o != null) break;
			tempWin = tempWin.parent.opener;
			if(tempWin != null) isOpener = true;
			else isOpener = false;
		}
	}
	return o;
}

LMSManager = LMSCSA;
