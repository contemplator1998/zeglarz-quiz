/*
 * Copyright © 1995-2012 by 4system Polska Sp. z o.o.
 * All Rights Reserved.
 */
 
function comboMenu(gID, pGix)
{
	this.globalID = gID;

	/////////////////////////////// BUDOWANIE DRZEWKA 1

	this.tree = null;

	/////////////////////////////// BUDOWANIE DRZEWKA 2

	this.TreeConfig = {
		defaultText     : 'Tree Item',
		defaultTarget   : '_self',
		defaultBehavior : 'classic'
	};

	this.TreeHandler = {
		idCounter : 0,
		idPrefix  : "tree-object-",
		all       : new Array(),
		getId     : function() { return this.idPrefix + this.idCounter++; }
	};
	this.openPageID = pGix;
}

/////////////////////////////// FUNCKJE MENU

comboMenu.prototype.findTreeItem = function(idx)
{
	for (var i in this.TreeHandler.all)
	{
		if (this.TreeHandler.all[i].idx == idx) return this.TreeHandler.all[i];
	}
	return this.tree;
}

comboMenu.prototype.insertTree = function(struct)
{
	var item	= struct.rootItem();
	this.tree		= new ComboTree(item["title"], this.TreeHandler, this.TreeConfig, this.globalID, this.openPageID );
	this.tree.idx	= item["index"];
	this.tree.pidx	= item["parent"];

	for (var i = 0; i < struct.length(); i++)
	{
		if (struct.item(i)["visible"] == "1")
		{
			var item	= struct.item(i);
			var o		= new ComboTreeItem( item["title"], this.findTreeItem(item["parent"]), 
											 this.TreeHandler, this.TreeConfig, this.globalID  
											);
			o.idx		= item["index"];
			o.gix		= item["gix"];
			o.pidx		= item["parent"];
		};
	};
};

comboMenu.prototype.selectGotoPage = function(obj)
{
	if (this.openPageID == obj.options[obj.selectedIndex].id) return;
	
	var gix = parseInt(obj.options[obj.selectedIndex].id.replace("itemgix_", ""));	
	
	PlayerInterface.Execute("gotoPage", gix);
};

comboMenu.prototype.focus = function(index, bckgColor, titleColor)
{
	var item = null;
	var htmlObj = document.getElementById(this.globalID+"treeChildNodes");
	var opt = null;
	
	for (var i = 0; i < htmlObj.options.length; i++)
	{
		opt	= htmlObj.options[i];
		if (index == opt.label){
			if (bckgColor != 'transparent') 
				opt.style.background = bckgColor;
			if (titleColor != 'transparent') 
				opt.style.color = titleColor;
			return;
		}
	}
}
/////////////////////////////// FUNCKJE MENU
/*
 * Tree class
 */

function ComboTree(sText, TreeHandler, TreeConfig, gID, pGix)
{
	this.targetWindow = 'MainFrame';
	this.childNodes					= [];
	this.id							= TreeHandler.getId();
	this.text						= sText;
	this.targetWindow				= TreeConfig.defaultTarget;
	this._last						= false;
	this.globalID 					= gID;
	this.openPageID 					= pGix;
	TreeHandler.all[this.id]		= this;
}

ComboTree.prototype.isInArray = function (arr, value) 
{
	for (var i = 0; i < arr.length; i++){
		if (arr[i] == value){
			return true;
		};
	};
	return false;
}

ComboTree.prototype.toString = function()
{
	this.openPageID = page.p_globalIndex;
	var width = page.all[this.globalID].comboWidth;
	var size = page.all[this.globalID].comboHeight;
	var borderWidth = page.all[this.globalID].borderWidth;
	var compWidth = page.all[this.globalID].w;
	var font = page.all[this.globalID].comboFont;
	var fontSize = page.all[this.globalID].comboFontSize;
	var fontColor = page.all[this.globalID].comboFontColor;
	var chaptersNames = page.all[this.globalID].chaptersNames.split('||');
	var fontStyles = "";

	if (page.all[this.globalID].comboFontBold)
		fontStyles += " font-weight: bold;";
	if (page.all[this.globalID].comboFontItalic)
		fontStyles += " font-style: italic;";
		
	var selectedInd = 0;
	var str = "";
	str += "<select size=\""+size+"\" id=\""+this.globalID+"treeChildNodes\" onChange=\"page.all['"+this.globalID+"'].objComboMenu.selectGotoPage(this)\" style=\"width:"+eval(compWidth-2*borderWidth)+"px; font-family:"+font+"; font-size:"+fontSize+"px; color:"+fontColor+";"+fontStyles+"\" >";
	
	for (var i = 0; i < this.childNodes.length; i++)
	{	
		if (!this.isInArray(chaptersNames, this.childNodes[i].text)){
			str += this.childNodes[i].toString(i, this.childNodes.length, this.openPageID);
		}
	};
	str += "</select>";
	
	return str;
}; 

ComboTree.prototype.add = function (node)
{
	node.parentNode = this;
	this.childNodes[this.childNodes.length] = node;
	var root = this;
	if (this.childNodes.length >= 2)
	{
		this.childNodes[this.childNodes.length -2]._last = false;
	}
	while (root.parentNode) { root = root.parentNode; }
	return node;
}
/*
 * TreeItem class
 */

function ComboTreeItem(sText, eParent, TreeHandler, TreeConfig, gID)
{
	this.childNodes					= [];
	this.id							= TreeHandler.getId();
	this.text						= sText;
	this.targetWindow				= TreeConfig.defaultTarget;
	this._last						= false;
	this.globalID 					= gID;
	TreeHandler.all[this.id]		= this;
	if (eParent) { eParent.add(this); }
}

ComboTreeItem.prototype.add = function (node)
{
	node.parentNode = this;
	this.childNodes[this.childNodes.length] = node;
	var root = this;
	if (this.childNodes.length >=2)
	{
		this.childNodes[this.childNodes.length -2]._last = false;
	}
	while (root.parentNode) { root = root.parentNode; }
	return node;
}

ComboTreeItem.prototype.isInArray = function (arr, value) 
{
	for (var i = 0; i < arr.length; i++){
		if (arr[i] == value){
			return true;
		};
	};
	return false;
}

ComboTreeItem.prototype.toString = function (nItem, nItemCount, pGix) 
{
	var pageBackg = page.all[this.globalID].pageBackg;
	var bgcolor = page.all[this.globalID].comboBackgroundColor;
	var submenuPrefix = page.all[this.globalID].comboSubmenuPrefix;
	var chaptersNames = page.all[this.globalID].chaptersNames.split('||');

	var i = 0;
	var foo = this.parentNode;
	while (foo.parentNode) { foo = foo.parentNode; i++; }

	var label = this.text;
	var sel = '';
	if (pGix == this.gix) {
		var color = pageBackg;
		sel = 'selected';
	}else var color = bgcolor;	
	var str = "<option id=\"itemgix_" + this.gix + "\" style=\"background-color:"+color+"\" "+sel+">";
	for (var j = 0; j < i; j++) 
		label = submenuPrefix + label;
	str += label + "</option>";	
	for (var i = 0; i < this.childNodes.length; i++){
		if (!this.isInArray(chaptersNames, this.childNodes[i].text)){
			str += this.childNodes[i].toString(i, this.childNodes.length, pGix);
		}
	}
	return str;
};













