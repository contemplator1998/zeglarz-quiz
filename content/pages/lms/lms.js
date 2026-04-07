/*
 * Copyright © 1995-2012 by 4system Polska Sp. z o.o.
 * All Rights Reserved. v4
 */

var E_NOTIMPL = -1;
var S_OK = 1;
var S_FALSE = 0;
var lms = null;
var LMSManager = null;

dummyLMSManager = function()
{
	this.STATUS_NOT_ATTEMPTED = "not attempted";
	this.STATUS_BROWSED = "browsed";
	this.STATUS_INCOMPLETE = "incomplete";
	this.STATUS_FAILED = "failed";
	this.STATUS_COMPLETED = "completed";
	this.STATUS_PASSED = "passed";
	this.STATUS_UNKNOWN = "unknown";
	
	return(S_OK);
};

dummyLMSManager.prototype.name = "lmsNull";

dummyLMSManager.prototype.initialize = function()
{
};

dummyLMSManager.prototype.setPoints = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.getPoints = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.free = function()
{
	return (S_OK);
};

dummyLMSManager.prototype.sendTime = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.setTime = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.getTime = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.setStatus = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.getStatus = function()
{
  return (this.STATUS_NOT_ATTEMPTED);
};

dummyLMSManager.prototype.setExercisePassed = function(points)
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.setExerciseFailed = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.checkAnswer = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.getValue = function(name)
{
  return (eval('parent.__'+name));
};

dummyLMSManager.prototype.setValue = function(name, value)
{
  eval('parent.__'+name+'="'+value+'"');
  return (S_OK);
};

dummyLMSManager.prototype.elapsedTime = function(seconds)
{
   return (S_OK);
};

dummyLMSManager.prototype.updateTimer = function(seconds)
{
   return (S_OK);
};

dummyLMSManager.prototype.startTimer = function(seconds)
{
   return (S_OK);
};

dummyLMSManager.prototype.gotoPage = function(indexPage)
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.nextPage = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.prevPage = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.nextSCO = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.prevSCO = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.mediaStatus = function()
{
  return ("online");
};

dummyLMSManager.prototype.mediaURL = function()
{
  return (resourcesURL);
};

dummyLMSManager.prototype.resourcesStatus = function()
{
  return (this.mediaStatus());
};

dummyLMSManager.prototype.resourcesURL = function()
{
  return (this.mediaURL());
};

dummyLMSManager.prototype.pageReady = function()
{
  return (E_NOTIMPL);
};

dummyLMSManager.prototype.calculateTimeToString = function(dateStart, dateEnd)
{
  var dd = Math.abs( dateEnd.getTime() - dateStart.getTime() );
  var ts = Math.floor( ( ( (dd % (60 * 60 * 1000 * 24) ) % (60 * 60 * 1000) ) % ( 60 * 1000 ) ) / 1000 * 1 );
  var tm = Math.floor( (dd % (60 * 60 * 1000 * 24)) % ((60 * 60 * 1000)) / (60 * 1000) );
  var th = Math.floor( (dd % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) );

  var sh = ((th < 10) ? "0" : "") + th;
  var sm = ((tm < 10) ? "0" : "") + tm;
  var ss = ((ts < 10) ? "0" : "") + ts;

  return ("" + sh + ":" + sm + ":" + ss);
};

dummyLMSManager.prototype.timeToString = function(cDate)
{
  var dd = Math.abs( cDate.getTime() );
  var ts = Math.floor( ( ( (dd % (60 * 60 * 1000 * 24) ) % (60 * 60 * 1000) ) % ( 60 * 1000 ) ) / 1000 * 1 );
  var tm = Math.floor( (dd % (60 * 60 * 1000 * 24)) % ((60 * 60 * 1000)) / (60 * 1000) );
  var th = Math.floor( (dd % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) );

  var sh = ((th < 10) ? "0" : "") + th;
  var sm = ((tm < 10) ? "0" : "") + tm;
  var ss = ((ts < 10) ? "0" : "") + ts;

  return ("" + sh + ":" + sm + ":" + ss);
};


dummyLMSManager.prototype.externalFileInCache = function(v)
{
	return "";
};

dummyLMSManager.prototype.getData = function(name)
{
	return "";
};

dummyLMSManager.prototype.setData = function(name, value)
{
};

dummyLMSManager.prototype.getCourseData = function(name)
{
	return "";
};

dummyLMSManager.prototype.setCourseData = function(name, value)
{
};

dummyLMSManager.prototype.clearData = function()
{
	return E_NOTIMPL;
};

dummyLMSManager.prototype.getLastUserAnswer = function()
{
	return "";
};

dummyLMSManager.prototype.setLastUserAnswer = function(ans)
{
};

dummyLMSManager.prototype.getSID = function()
{
	return (E_NOTIMPL);
};

dummyLMSManager.prototype.useExternalLexicon = function()
{
	return false;
};

dummyLMSManager.prototype.useExternalWindowOpen = function()
{
	return false;
};

dummyLMSManager.prototype.setLightVersion = function(b)
{
	return false;
};

dummyLMSManager.prototype.getLightVersion = function()
{
	return false;
};

dummyLMSManager.prototype.closeCourse = function()
{
	return (E_NOTIMPL);
};

dummyLMSManager.prototype.getTryNumber = function()
{
	return (E_NOTIMPL);
};

dummyLMSManager.prototype.setTryNumber = function(value)
{
	return (E_NOTIMPL);
};

dummyLMSManager.prototype.getStudentName = function()
{
	return "";
};

dummyLMSManager.prototype.getComputerName = function()
{
	return "";
};
dummyLMSManager.prototype.getPassingScore = function()
{
	return 100;
};

LMSManager = dummyLMSManager;
