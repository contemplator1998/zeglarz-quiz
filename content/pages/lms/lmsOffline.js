/*
 * Copyright © 1995-2012 by 4system Polska Sp. z o.o.
 * All Rights Reserved. v4
 */

LMSOffline = function()
{
	this.LMSCSA = LMSCSA;
	this.LMSCSA();
};

LMSOffline.prototype = new LMSCSA();
LMSOffline.prototype.name = "lmsOffline";

LMSOffline.prototype.closeCourse = function()
{
	top.window.close();
};

LMSManager = LMSOffline;

var lms = new LMSOffline();
