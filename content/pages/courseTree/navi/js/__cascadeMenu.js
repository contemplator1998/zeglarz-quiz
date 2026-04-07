/*
* Copyright © 1995-2012 by 4system Polska Sp. z o.o.
* All Rights Reserved.
*/

function cascadeMainMenu(gID)
{
	this.globalID = gID;
	/////////////////////////////// FUNCKJE MENU
	this.delayHide		= 400;
	this.timerID		= null;
	this.previousMenu	= null;

	//----------------------------------------------------------- TRYB MENU
	this.VERTICAL	= 1;
	this.HORIZONTAL	= 0;
	this.menuMode	= page.all[this.globalID].CASCADE_MenuType;
	this.mouseOverActive = false;

	// ----------------------------------------------------------- STYLE TABELI
	this.mainTableLPos	= 0;				// pozycja X głównego menu
	this.mainTableTPos	= 0;				// pozycja Y głwnego menu
	
	this.mainTableColorOver = page.all[this.globalID].CASCADE_ElementAfterBgColor;
	this.mainTableColorOut = page.all[this.globalID].CASCADE_ElementBeforeBgColor;
	this.mainTableBgColor = page.all[this.globalID].CASCADE_MenuBgColor;
	
	this.tdOffsetX = page.all[this.globalID].CASCADE_SubMenuOffsetX;
	this.tdOffsetY = page.all[this.globalID].CASCADE_SubMenuOffsetY;
	
	this.paddingLeft = page.all[this.globalID].CASCADE_CellPaddingLeft;
	this.paddingTop = page.all[this.globalID].CASCADE_CellPaddingTop;
	this.cellspacing = page.all[this.globalID].CASCADE_CellSpacing;
	this.elementOnClick = page.all[this.globalID].CASCADE_onClick;
	
	this.is3DMenu = page.all[this.globalID].CASCADE_3DMenu;
	this.is3DElement = page.all[this.globalID].CASCADE_3DElement;
	this.type3DMenu = page.all[this.globalID].CASCADE_3DDirectionMenu;
	this.type3DElement = page.all[this.globalID].CASCADE_3DDirectionElement;
	this.strength3DMenu = (255 * page.all[this.globalID].CASCADE_3DStrengthMenu) / 100;
	this.strength3DElement = (255 * page.all[this.globalID].CASCADE_3DStrengthElement) / 100;
	this.image = page.all[this.globalID].CASCADE_imageSrc;

	this.borderColor = page.all[this.globalID].CASCADE_TableBorderColor;
	this.tdBorder	= page.all[this.globalID].CASCADE_BorderWidth;
	
	this.componentPosX = page.all[this.globalID].x;
	this.componentPosY = page.all[this.globalID].y;
	
	this.tdBorderColor 		= page.all[this.globalID].CASCADE_TdBorderColor;
	this.tdElementBorder	= page.all[this.globalID].CASCADE_TdBorderWidth;
	
	this.font			= page.all[this.globalID].CASCADE_Font;
	this.fontSize		= page.all[this.globalID].CASCADE_FontSize;
	this.fontColor		= page.all[this.globalID].CASCADE_FontColor;
	this.fontBold		= page.all[this.globalID].CASCADE_FontBold;
	this.fontItalic		= page.all[this.globalID].CASCADE_FontItalic;
	
	this.fontStyle = "style='";
	
	this.fontStyle += "font-family:"+this.font+";";
	this.fontStyle += "font-size:"+this.fontSize+"pt;";
	this.fontStyle += "color:"+this.fontColor+";";
	
	if (this.fontBold)	this.fontStyle += "font-weight:bold;";
	if (this.fontItalic)	this.fontStyle += "font-style:italic;";
	
	this.fontStyle += "'";
	
	// ----------------------------------------------------------- KOMÓRKA/STYL ELEMENTU PODMENU
	if (this.menuMode == this.HORIZONTAL)
	{
		this.tdW		= page.all[this.globalID].CASCADE_TDwidth;
		this.tdH		= page.all[this.globalID].CASCADE_TDheight;
	}
	else 
	{
		this.tdW		= page.all[this.globalID].CASCADE_TDwidth;
		this.tdH		= page.all[this.globalID].CASCADE_TDheight;
	}
	
	this.mainElCount = 0;
	
	if (this.menuMode == this.HORIZONTAL)
	{
		this.mainTableHeight	= page.all[this.globalID].CASCADE_TDheight;		// wysokość głwnego menu
		this.offset				= 0;											// Przesunięcie podmenu
	}
	else
	{
		this.mainTableHeight	= this.tdH * this.mainElCount;					// wysokość głwnego menu
		this.offset				= 0;											// Przesunięcie podmenu
	}


	// ----------------------------------------------------------- KOMÓRKA/STYL ELEMENTU PODMENU
	this.noPx			= document.childNodes ? 'px' : 0;

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
	
	this.componentWidth  = 0;
	this.componentHeight = 0;
}

/////////////////////////////// FUNCKJE MENU

// ----------------------------------------------------------- USTAWIENIA STYLÓW CSS
cascadeMainMenu.prototype.setCSS = function()
{
	var objMenu = page.all[this.globalID];
	var mainTable				= document.getElementById(this.globalID+"MAINTABLE");
	mainTable.style.top			= this.mainTableTPos			+ this.noPx;
	mainTable.style.left		= this.mainTableLPos			+ this.noPx;					   
	if (this.menuMode == this.HORIZONTAL)
	{
		this.componentWidth  = this.tdW * this.mainElCount                 + 
							   this.tdElementBorder * 2 * this.mainElCount + 
							   this.tdBorder * 2                           + 
							   (this.mainElCount + 1) * this.cellspacing   + 
							   this.paddingLeft * this.mainElCount; 
		this.componentHeight = this.tdH             +
							   this.tdBorder * 2    + 
							   this.cellspacing * 2 ;
	}
	else
	{
		this.componentWidth  = this.tdW                                    + 
							   this.tdElementBorder * 2                    + 
							   this.tdBorder * 2                           + 
							   this.cellspacing * 2                        + 
							   this.paddingLeft;		   
		this.componentHeight = this.tdH * this.mainElCount                 +
							   this.tdBorder * 2                           + 
							   (this.mainElCount + 1) * this.cellspacing;
	}
	mainTable.style.width = this.componentWidth + this.noPx;
	mainTable.style.height = this.componentHeight + this.noPx;
}
cascadeMainMenu.prototype.showMenu  = function(menu, elementsCount)
{
	if (this.mouseOverActive || this.elementOnClick == 0)
	{
		clearTimeout(this.timerID);
		var subMenu		= document.getElementById(menu);
		var position	= parseInt(menu.replace(/(.*)(\.)([0-9]*)$/,"$3"));
		var actualMenu 	= menu.split(".");
		actualMenu.shift();
		if (subMenu)
		{
			if (this.menuMode == this.HORIZONTAL)
			{
				subMenu.style.top	= this.mainTableTPos + this.tdH + this.tdOffsetY + (this.cellspacing * 2) + (this.tdBorder*2) + this.noPx;
				
				if (this.componentPosY + parseInt(subMenu.style.top) + (elementsCount * this.tdH) + (this.cellspacing * 2) + this.tdOffsetY > this.screenHeight())
					subMenu.style.top = this.mainTableTPos - (elementsCount * this.tdH) - (this.cellspacing * (elementsCount + 1)) - (this.tdBorder * 2) - (this.tdOffsetY) + this.noPx;
				
				subMenu.style.left	= this.mainTableLPos + (position * this.tdW) + (this.tdElementBorder * 2 * position) + this.tdOffsetX + (this.cellspacing * position) + (this.paddingLeft * position) + this.noPx;
			}
			else
			{
				subMenu.style.left	= this.tdW + (this.tdBorder * 2) + (this.tdElementBorder * 2) + (this.paddingLeft) + (this.cellspacing * 2) + this.tdOffsetX + this.noPx;
				
				if (this.componentPosX + parseInt(subMenu.style.left) + this.tdW + (this.cellspacing * 2) + this.tdOffsetX > this.screenWidth())
				{
					subMenu.style.left = this.mainTableLPos - this.tdOffsetX - this.tdW - this.paddingLeft - (this.cellspacing * 2) - (this.tdBorder * 2) - (this.tdElementBorder * 2) + this.noPx;
					subMenu.style.top = (position * this.tdH) - this.tdOffsetY - (this.cellspacing * position);
				}
				else
					subMenu.style.top	= (position * this.tdH) + this.tdOffsetY + (this.cellspacing * position) + this.noPx;
			}
			subMenu.style.visibility = "visible";
		}
		else actualMenu.pop();

		// EWENTUALNE CHOWANIE EWENTUALNEGO POPRZEDNIEGO MENU
		if ( this.previousMenu != null )
		{
			if ( actualMenu.length <= this.previousMenu.length )
			{
				var strMenuToHide = this.globalID+"sub.";
				for (var i=0; i < this.previousMenu.length; i++)
				{
					if (i != this.previousMenu.length-1) strMenuToHide += this.previousMenu[i]+"."
					else strMenuToHide += this.previousMenu[i];
				}
				this.hideMenu(actualMenu, strMenuToHide);
			}
		}
		this.previousMenu = actualMenu;
	}
}

cascadeMainMenu.prototype.focus  = function(index, bckgColor, titleColor)
{
	var item = null;
	for (var i = 0; i < this.tree.childNodes.length; i++)
	{
		item = this.tree.childNodes[i];
		if (item.idx == index) {
			var htmlObj = document.getElementById(this.globalID+"_"+index);
			if (htmlObj){
				if (bckgColor != 'transparent') 
					htmlObj.style.background = bckgColor;
				if (titleColor != 'transparent') 
					htmlObj.style.color = titleColor;
				return;
			}
		}
	}
}

// ----------------------------------------------------------- POKAZ SUBMENU
cascadeMainMenu.prototype.showSubMenu  = function(menu, name, elementsCount)
{
	clearTimeout(this.timerID);
	
	// POKAZYWANIE NOWEGO MENU
	var parentMenu	= document.getElementById(menu.parentNode.parentNode.parentNode.id);
	var subMenu		= document.getElementById(name);
	var actualMenu 	= name.split(".");
	actualMenu.shift();
	var parentL		= parseInt(parentMenu.style.left.substr(0,parentMenu.style.left.length-2));
	var parentT		= parseInt(parentMenu.style.top.substr(0,parentMenu.style.top.length-2));
	var position	= 0;

	position += parseInt(actualMenu[actualMenu.length - 1]);

	if (subMenu)
	{
		subMenu.style.borderWidth = this.tdBorder;
		
		if (this.menuMode == this.HORIZONTAL)
		{
			log.info("MENU",position);
			subMenu.style.top = parentT + (this.tdH * position) + this.tdOffsetY;
			subMenu.style.left = parentL + this.tdW + (this.tdBorder*2) + this.tdElementBorder*2 + this.paddingLeft + this.tdOffsetX + (this.cellspacing * 2) + this.noPx;
			
			if (this.componentPosX + parseInt(subMenu.style.left) + this.tdW + this.tdOffsetX + (this.cellspacing * 2) > this.screenWidth())
			{
				subMenu.style.left = parentL - this.tdW - (this.tdBorder * 2) - this.tdOffsetX - (this.cellspacing * 2) - this.paddingLeft - (this.tdElementBorder * 2) + this.noPx;
				subMenu.style.top = parseInt(subMenu.style.top) - (2 * this.tdOffsetX);
			}
		}
		else
		{
			subMenu.style.top = parentT + (this.tdH * position) + this.tdOffsetY + (this.cellspacing * position) + this.noPx;
			subMenu.style.left = parentL + this.tdW + (this.cellspacing * 2) + (this.tdBorder * 2) + (this.tdElementBorder*2) + this.tdOffsetX + this.paddingLeft + this.noPx;
			
			if (this.componentPosX + parseInt(subMenu.style.left) + this.tdOffsetX + this.tdW + (this.cellspacing * 2) > this.screenWidth())
			{
				subMenu.style.left = parentL - this.tdW - this.tdOffsetX - this.paddingLeft - (this.cellspacing * 2) - (this.tdBorder * 2) - (this.tdElementBorder * 2) + this.noPx;
				subMenu.style.top = parseInt(subMenu.style.top) - (2 * this.tdOffsetY);
			}
		}
		subMenu.style.visibility = "visible";
	}
	else actualMenu.pop();

	// EWENTUALNE CHOWANIE EWENTUALNEGO POPRZEDNIEGO MENU
	if ( this.previousMenu != null )
	{
		if ( actualMenu.length <= this.previousMenu.length )
		{
			var strMenuToHide = this.globalID+"sub.";
			for (var i=0; i < this.previousMenu.length; i++)
				if (i != this.previousMenu.length-1) strMenuToHide += this.previousMenu[i]+"."
				else strMenuToHide += this.previousMenu[i];
			
			if (!this.equalArrays(actualMenu, this.previousMenu))
				this.hideMenu(actualMenu, strMenuToHide);
		}
	}
	this.previousMenu = actualMenu;
}

// ----------------------------------------------------------- ROZMIAR OKNA KLIENTA
cascadeMainMenu.prototype.screenWidth = function()
{
	if (self.innerWidth)
		return self.innerWidth;
	else if (document.documentElement && document.documentElement.clientWidth)
		return document.documentElement.clientWidth;
	else if (document.body)
		return document.body.clientWidth;
	else return false;
}

cascadeMainMenu.prototype.screenHeight = function()
{
	if (self.innerHeight)
		return self.innerHeight;
	else if (document.documentElement && document.documentElement.clientHeight)
		return document.documentElement.clientHeight;
	else if (document.body)
		return document.body.clientHeight;
	else return false;
}

// ----------------------------------------------------------- UKRYWANIE SUBMENU
cascadeMainMenu.prototype.hideMenu = function(actualMenu, strMenu)
{

	if (this.mouseOverActive || this.elementOnClick == 0)
	{
		var subMenu = null;

		// NA JAKIM ZAGŁĘBIENIU JEST RÓŻNICA
		var theSame = true;
		for (var i=0; i < actualMenu.length; i++)
		{
			if (actualMenu[i] != this.previousMenu[i])
			{
				theSame = false;
				break;
			}
		}

		if (!theSame || actualMenu.length < this.previousMenu.length) 
		{
			var strPreviousMenu = this.globalID+"sub.";
			for (var j=0; j<this.previousMenu.length; j++)
			{
				strPreviousMenu += this.previousMenu[j];
				if (j >= i)
				{
					subMenu = document.getElementById(strPreviousMenu);
					if (subMenu) subMenu.style.visibility = "hidden";
				}
				if (j != this.previousMenu.length) strPreviousMenu += ".";
			}
		}
	}
}

// ----------------------------------------------------------- PORÓWNANIE DWÓCH TABLIC
cascadeMainMenu.prototype.hideAll = function()
{
	var actualMenu = new Array("-");
	var length = actualMenu.length;
	this.hideMenu(actualMenu,"");
	this.mouseOverActive = false;
}
cascadeMainMenu.prototype.hideMenus = function()
{
	clearTimeout(this.timerID);
	this.timerID = setTimeout("page.all['"+this.globalID+"'].objCascadeMenu.hideAll()",this.delayHide);
}
// ----------------------------------------------------------- PORÓWNANIE DWÓCH TABLIC
cascadeMainMenu.prototype.equalArrays = function(arr1, arr2)
{
	if (arr1.length < arr2.length) return false;
	else for (var i=0; i<arr1.length; i++)
		if (arr1[i] != arr2[i]) return false;
	return true;
}

// ----------------------------------------------------------- UKRYWANIE MENU PO DANYM CZASIE
cascadeMainMenu.prototype.delayHideMenu = function(menu)
{
	this.delayhide = setTimeout("page.all['"+this.globalID+"'].objCascadeMenu.hideMenu('"+menu+"')",50)
}
/////////////////////////////// FUNCKJE MENU
cascadeMainMenu.prototype.findTreeItem = function(idx)
{
	for (var i in this.TreeHandler.all)
	{
		if (this.TreeHandler.all[i].idx == idx) return this.TreeHandler.all[i];
	}
	return this.tree;
}

cascadeMainMenu.prototype.insertTree = function(struct)
{	
	var item	= struct.rootItem();
	this.tree		= new Tree(item["title"], this.TreeHandler, this.TreeConfig, this.globalID, this);
	this.tree.idx	= item["index"];
	this.tree.pidx	= item["parent"];

	for (var i = 0; i < struct.length(); i++)
	{
		if (struct.item(i)["visible"] == "1")
		{
			var item	= struct.item(i);
			var o		= new TreeItem(	item["title"], this.findTreeItem(item["parent"]), 
										this.TreeHandler, this.TreeConfig, this.globalID, this
									  );
			o.idx		= item["index"];
			o.gix		= item["gix"];
			o.pidx		= item["parent"];
		}
	}
}
cascadeMainMenu.prototype.Math_MAX = function(n1, n2)
{
	return (n1 > n2) ? n1 : n2;
}
cascadeMainMenu.prototype.Math_MIN = function(n1, n2)
{
	return (n1 < n2) ? n1 : n2;
}
cascadeMainMenu.prototype.DEC_to_HEX = function(DEC)
{
	var HEX = '0123456789ABCDEF';
	return HEX.charAt( (DEC >> 4) & 0xf ) + HEX.charAt( DEC & 0xf );
}
cascadeMainMenu.prototype.HEX_to_DEC = function(HEX)
{
	return parseInt(HEX,16);
}

cascadeMainMenu.prototype.RGB_to_HSL = function(RGB)
{
	var HSL = { H:0, S:0, L:0 };
	var var_R = ( RGB.R / 255 )                     //Where RGB values = 0 ÷ 255
	var var_G = ( RGB.G / 255 )
	var var_B = ( RGB.B / 255 )

	var var_Min = this.Math_MIN( this.Math_MIN(var_R, var_G), var_B )    //Min. value of RGB
	var var_Max = this.Math_MAX( this.Math_MAX(var_R, var_G), var_B )    //Max. value of RGB
	var del_Max = var_Max - var_Min             //Delta RGB value

	HSL.L = ( var_Max + var_Min ) / 2

	if ( del_Max == 0 )                     //This is a gray, no chroma...
	{
	   HSL.H = 0                                //HSL results = 0 ÷ 1
	   HSL.S = 0
	}
	else                                    //Chromatic data...
	{
	   if ( HSL.L < 0.5 ) HSL.S = del_Max / ( var_Max + var_Min )
	   else               HSL.S = del_Max / ( 2 - var_Max - var_Min )

	   del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max
	   del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max
	   del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max

	   if      ( var_R == var_Max ) HSL.H = del_B - del_G
	   else if ( var_G == var_Max ) HSL.H = ( 1 / 3 ) + del_R - del_B
	   else if ( var_B == var_Max ) HSL.H = ( 2 / 3 ) + del_G - del_R

	   if ( HSL.H < 0 ) HSL.H += 1
	   if ( HSL.H > 1 ) HSL.H -= 1
	}
	
	
	HSL.H = Math.floor(HSL.H * 255);
	HSL.S = Math.floor(HSL.S * 255);
	HSL.L = Math.floor(HSL.L * 255);
	
	return HSL;
}
cascadeMainMenu.prototype.HSL_to_RGB = function(HSL)
{
	
	var H = HSL.H / 255;
	var S = HSL.S / 255;
	var L = HSL.L / 255;
	
	var RGB = { R:0, G:0, B:0 };
	
	
	if ( S == 0 )                       //HSL values = 0 ÷ 1
	{
	   RGB.R = L * 255                      //RGB results = 0 ÷ 255
	   RGB.G = L * 255
	   RGB.B = L * 255
	}
	else
	{
	   if ( L < 0.5 ) var_2 = L * ( 1 + S )
	   else           var_2 = ( L + S ) - ( S * L )

	   var_1 = 2 * L - var_2

	   RGB.R = 255 * this.Hue_2_RGB( var_1, var_2, H + ( 1 / 3 ) ) 
	   RGB.G = 255 * this.Hue_2_RGB( var_1, var_2, H )
	   RGB.B = 255 * this.Hue_2_RGB( var_1, var_2, H - ( 1 / 3 ) )
	}
	
	return RGB;
}
cascadeMainMenu.prototype.Hue_2_RGB = function( v1, v2, vH )
{
   if ( vH < 0 ) vH += 1;
   if ( vH > 1 ) vH -= 1;

   if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH );
   if ( ( 2 * vH ) < 1 ) return ( v2 );
   if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );
   return v1;
}
cascadeMainMenu.prototype.make3DBorder = function(sunkenStrength, color, sunken) 
{
	
	var RGB = {
		R : this.HEX_to_DEC(color.substr(0,2)),
		G : this.HEX_to_DEC(color.substr(2,2)),
		B : this.HEX_to_DEC(color.substr(4,2))
	};
	var HSL = {
		H : 0,
		S : 0,
		L : 0
	};

	HSL = this.RGB_to_HSL(RGB);

	var lightHSL = { H:HSL.H, S:HSL.S, L:HSL.L };
	var darkHSL = { H:HSL.H, S:HSL.S, L:HSL.L };

	lightHSL.L = (lightHSL.L + sunkenStrength < 255) ? lightHSL.L += sunkenStrength : lightHSL.L = 255;
	darkHSL.L  = (darkHSL.L - sunkenStrength > 0)     ? darkHSL.L  -= sunkenStrength  : darkHSL.L  = 0;

	var lightRGB = this.HSL_to_RGB(lightHSL);

	var darkRGB = this.HSL_to_RGB(darkHSL);

	if (sunken) // WKLĘSŁE
	{
		var darkHex = "#"+this.DEC_to_HEX(darkRGB.R)+this.DEC_to_HEX(darkRGB.G)+this.DEC_to_HEX(darkRGB.B);
		var lightHex = "#"+this.DEC_to_HEX(lightRGB.R)+this.DEC_to_HEX(lightRGB.G)+this.DEC_to_HEX(lightRGB.B);

		return " "+darkHex+" "+darkHex+" "+lightHex+" "+lightHex;
	}
	else // WYPUKŁE
	{

		var darkHex = "#"+this.DEC_to_HEX(darkRGB.R)+this.DEC_to_HEX(darkRGB.G)+this.DEC_to_HEX(darkRGB.B);
		var lightHex = "#"+this.DEC_to_HEX(lightRGB.R)+this.DEC_to_HEX(lightRGB.G)+this.DEC_to_HEX(lightRGB.B);

		return lightHex+" "+lightHex+" "+darkHex+" "+darkHex;
	}
	
}
/////////////////////////////// FUNCKJE MENU
/*
 * Tree class
 */

function Tree(sText, TreeHandler, TreeConfig, gID, parentObject)
{
	this.targetWindow = 'MainFrame';
	this.childNodes					= [];
	this.id							= TreeHandler.getId();
	this.text						= sText;
	this.targetWindow				= TreeConfig.defaultTarget;
	this._last						= false;
	this.globalID 					= gID;
	TreeHandler.all[this.id]		= this;
	this.parentObject = parentObject;
}

Tree.prototype.isInArray = function (arr, value) 
{
	for (var i = 0; i < arr.length; i++){
		if (arr[i] == value){
			return true;
		};
	};
	return false;
}

Tree.prototype.toString = function()
{
	var chaptersNames = page.all[this.globalID].chaptersNames.split('||');
	var str = "";
	var borderStyle = "";
	
	if (this.parentObject.is3DMenu)
	{
		if (this.parentObject.type3DMenu == 0)
		{
			borderStyle = "style='border-color: "+this.parentObject.make3DBorder(this.parentObject.strength3DMenu, this.parentObject.borderColor.substring(1), false)+"'";
		}
		else borderStyle = "style='border-color: "+this.parentObject.make3DBorder(this.parentObject.strength3DMenu, this.parentObject.borderColor.substring(1), true)+"'";
	}
	else
	{
		borderStyle += "style='border-color: "+this.parentObject.borderColor+"'";
	}

	str += "<TABLE style=\"background-color:"+this.parentObject.mainTableBgColor+"; border-width:"+this.parentObject.tdBorder+"px\" id=\""+this.globalID+"MAINTABLE\" cellspacing=\""+this.parentObject.cellspacing+"\" cellpadding=\"0\" class=\"MAINMENU\" "+borderStyle+" onMouseOut=\"page.all['"+this.globalID+"'].objCascadeMenu.hideMenus(); \"><TBODY>";

	var style = "";
	style += "this.style.backgroundColor = '"+this.parentObject.mainTableColorOver+"';";

	var styleOut = "";
	styleOut += "this.style.backgroundColor = '"+this.parentObject.mainTableColorOut+"';";

	var borderStyle		= "";
	var border3Dover	= "";
	var border3Dout		= "";
	var Border3D		= "";
	
	if (this.parentObject.is3DElement)
	{
		if (this.parentObject.type3DElement == 0)
		{
		// WKLESLY
			
			Border3D = this.parentObject.make3DBorder(this.parentObject.strength3DElement, this.parentObject.tdBorderColor.substring(1), false);

			if (this.parentObject.mouseOver3D == 0)
			{
				borderStyle += "style='border-color: "+Border3D+"'";
			}
			else 
			{
				borderStyle += "style='border-color: "+this.parentObject.mainTableColorOut+"'";
				border3Dover = "this.style.borderColor='"+Border3D+"';";
				border3Dout  = "this.style.borderColor='"+this.parentObject.mainTableColorOut+"';";
			}
		}
		else 
		{
			// WYPUKLY
			Border3D = this.parentObject.make3DBorder(this.parentObject.strength3DElement, this.parentObject.tdBorderColor.substring(1), true);

			if (this.parentObject.mouseOver3D == 0)
			{
				borderStyle += "style='border-color: "+Border3D+"'";
			}
			else 
			{
				borderStyle += "style='border-color: "+this.parentObject.mainTableColorOut+"'";
				border3Dover = "this.style.borderColor='"+Border3D+"';";
				border3Dout  = "this.style.borderColor='"+this.parentObject.mainTableColorOut+"';";
			}			
		}
	}
	else
	{
		borderStyle += "style='border-color: "+this.parentObject.tdBorderColor+"'";
	}
	
	this.parentObject.mainElCount = this.childNodes.length;
	for (var i = 0; i < this.childNodes.length; i++)
	{
		if (!this.isInArray(chaptersNames, this.childNodes[i].text)){
			if (this.parentObject.menuMode == this.parentObject.HORIZONTAL)
			{
				if (this.parentObject.elementOnClick == 0) str += "<TD id='"+this.globalID+"_"+this.childNodes[i].idx+"' style='height:"+this.parentObject.tdH+"px; width: "+this.parentObject.tdW+"px; background-color:"+this.parentObject.mainTableColorOut+"; padding-left:"+this.parentObject.paddingLeft+"px; padding-top:"+this.parentObject.paddingTop+"px; border-width:"+this.parentObject.tdElementBorder+"px' "+borderStyle+" "+this.parentObject.fontStyle+" onMouseOver=\""+border3Dover+" this.className='over'; "+style+" page.all['"+this.globalID+"'].objCascadeMenu.showMenu('"+this.globalID+"sub."+i+"');\"  onClick=\"PlayerInterface.Execute('gotoPage', "+this.childNodes[i].gix+");\" onMouseOut=\"this.className=''; "+styleOut+" "+border3Dout+"\">"+this.childNodes[i].text+"</TD>";
				else str += "<TD id='"+this.globalID+"_"+this.childNodes[i].idx+"' style='height:"+this.parentObject.tdH+"px; width: "+this.parentObject.tdW+"px; background-color:"+this.parentObject.mainTableColorOut+"; padding-left:"+this.parentObject.paddingLeft+"px; padding-top:"+this.parentObject.paddingTop+"px; border-width:"+this.parentObject.tdElementBorder+"px' "+borderStyle+" "+this.parentObject.fontStyle+" onMouseOver=\""+border3Dover+" this.className='over'; "+style+" page.all['"+this.globalID+"'].objCascadeMenu.showMenu('"+this.globalID+"sub."+i+"')\"  onClick=\"page.all['"+this.globalID+"'].objCascadeMenu.mouseOverActive = true; page.all['"+this.globalID+"'].objCascadeMenu.showMenu('"+this.globalID+"sub."+i+"')\" onMouseOut=\"this.className=''; "+styleOut+" "+border3Dout+"\">"+this.childNodes[i].text+"</TD>";
			}
			else
			{
				if (this.childNodes[i].childNodes.length != 0)
				{

					var image = "<img src='../resources/"+this.parentObject.image+"' border='0'>";
					var img = new Image();
					img.src = "../resources/"+this.parentObject.image;
					imgWidth = img.width+4;
				}
				else 
				{
					imgWidth = 0;
					var image = "";
				}
				
				if (this.parentObject.elementOnClick == 0) str += "<TR><TD id='"+this.globalID+"_"+this.childNodes[i].idx+"' style='height:"+this.parentObject.tdH+"px; width: "+this.parentObject.tdW+"px; background-color:"+this.parentObject.mainTableColorOut+"; padding-left:"+this.parentObject.paddingLeft+"px; padding-top:"+this.parentObject.paddingTop+"px; border-width:"+this.parentObject.tdElementBorder+"px' "+borderStyle+" "+this.parentObject.fontStyle+" onMouseOver=\""+border3Dover+" this.className='over'; "+style+" page.all['"+this.globalID+"'].objCascadeMenu.showMenu('"+this.globalID+"sub."+i+"'); \"  onClick=\"PlayerInterface.Execute('gotoPage', "+this.childNodes[i].gix+");\" onMouseOut=\"this.className=''; "+styleOut+" "+border3Dout+"\"><div style='position: relative; float: left'>"+this.childNodes[i].text+"</div><div style='position: relative; align: right; float: right; align: right; width: "+imgWidth+"'>"+image+"</div></TD></TR>";
				else str += "<TR><TD id='"+this.globalID+"_"+this.childNodes[i].idx+"' style='height:"+this.parentObject.tdH+"px; width: "+this.parentObject.tdW+"px; background-color:"+this.parentObject.mainTableColorOut+"; padding-left:"+this.parentObject.paddingLeft+"px; padding-top:"+this.parentObject.paddingTop+"px; border-width:"+this.parentObject.tdElementBorder+"px' "+borderStyle+" "+this.parentObject.fontStyle+" onMouseOver=\""+border3Dover+" this.className='over'; "+style+" page.all['"+this.globalID+"'].objCascadeMenu.showMenu('"+this.globalID+"sub."+i+"');\"  onClick=\"page.all['"+this.globalID+"'].objCascadeMenu.mouseOverActive = true; page.all['"+this.globalID+"'].objCascadeMenu.showMenu('"+this.globalID+"sub."+i+"');\" onMouseOut=\"this.className=''; "+styleOut+" "+border3Dout+"\"><div style='position: relative; float: left'>"+this.childNodes[i].text+"</div><div style='position: relative; align: right; float: right; align: right; width: "+imgWidth+"'>"+image+"</div></TD></TR>";
			}
		}
	}
		
	str += "</TBODY></TABLE>";

	for (var i = 0; i < this.childNodes.length; i++)
		str += this.childNodes[i].toString(i, this.childNodes.length, i);
	
	return str;
};

Tree.prototype.add = function (node)
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

function TreeItem(sText, eParent, TreeHandler, TreeConfig, gID, parentObject)
{
	this.parentObject				= parentObject;
	this.childNodes					= [];
	this.id							= TreeHandler.getId();
	this.text						= sText;
	this.targetWindow				= TreeConfig.defaultTarget;
	this._last						= false;
	this.globalID 					= gID;
	TreeHandler.all[this.id]		= this;
	if (eParent) { eParent.add(this); }
}

TreeItem.prototype.isInArray = function (arr, value) 
{
	for (var i = 0; i < arr.length; i++){
		if (arr[i] == value){
			return true;
		};
	};
	return false;
}

TreeItem.prototype.add = function (node)
{
	var chaptersNames = page.all[this.globalID].chaptersNames.split('||');
	
	if (!this.isInArray(chaptersNames, node.text)){
		node.parentNode = this;
		this.childNodes[this.childNodes.length] = node;
		var root = this;
		if (this.childNodes.length >=2)
		{
			this.childNodes[this.childNodes.length -2]._last = false;
		}
		while (root.parentNode) { root = root.parentNode; }
	}
	return node;
}

TreeItem.prototype.toString = function (nItem, nItemCount, path) 
{
	var chaptersNames = page.all[this.globalID].chaptersNames.split('||');
	
	var label = this.text;
	var str   = "";

	if (this.childNodes.length != 0) 
	{	
		var borderStyle = "";
		if (this.parentObject.is3DMenu)
		{
			if (this.parentObject.type3DMenu == 0)
				borderStyle = "style='border-color: "+this.parentObject.make3DBorder(this.parentObject.strength3DMenu, this.parentObject.borderColor.substring(1), false)+"'";
			else borderStyle = "style='border-color: "+this.parentObject.make3DBorder(this.parentObject.strength3DMenu, this.parentObject.borderColor.substring(1), true)+"'";
		}
		else
		{
			borderStyle += "style='border-color: "+this.parentObject.borderColor+"'";
		}
	
		str = "<TABLE id=\""+this.globalID+"sub."+path+"\" cellspacing=\""+this.parentObject.cellspacing+"\" cellpadding=\"0\" class=\"FLOATINGMENU\" style=\"background-color:"+this.parentObject.mainTableBgColor+"; border-width:"+this.parentObject.tdBorder+"px\" "+borderStyle+" onMouseOut=\"page.all['"+this.globalID+"'].objCascadeMenu.hideMenus()\">";
		
		var style = "";
		style += "this.style.height = '"+this.parentObject.tdH+"px';";
		style += "this.style.backgroundColor = '"+this.parentObject.mainTableColorOver+"';";

		var styleOut = "";
		styleOut += "this.style.backgroundColor = '"+this.parentObject.mainTableColorOut+"';";
		
		var borderStyle = "";
		
		var border3Dover = '';
		var border3Dout  = '';
		var Border3D = '';
	
		if (this.parentObject.is3DElement)
		{
			if (this.parentObject.type3DElement == 0)
			{
				// WKLESLLY
				
				Border3D = this.parentObject.make3DBorder(this.parentObject.strength3DElement, this.parentObject.tdBorderColor.substring(1), false);

				if (this.parentObject.mouseOver3D == 0)
				{
					borderStyle += "style='border-color: "+Border3D+"'";
				}
				else 
				{
					borderStyle += "style='border-color: "+this.parentObject.mainTableColorOut+"'";
					border3Dover = "this.style.borderColor='"+Border3D+"';";
					border3Dout  = "this.style.borderColor='"+this.parentObject.mainTableColorOut+"';";
				}
			}
			else 
			{
				// WYPUKLY
				Border3D = this.parentObject.make3DBorder(this.parentObject.strength3DElement, this.parentObject.tdBorderColor.substring(1), true);

				if (this.parentObject.mouseOver3D == 0)
				{
					borderStyle += "style='border-color: "+Border3D+"'";
				}
				else 
				{
					borderStyle += "style='border-color: "+this.parentObject.mainTableColorOut+"'";
					border3Dover = "this.style.borderColor='"+Border3D+"';";
					border3Dout  = "this.style.borderColor='"+this.parentObject.mainTableColorOut+"';";
				}			
			}
		}
		else
		{
			borderStyle += "style='border-color: "+this.parentObject.tdBorderColor+"'";
		}
		
		var imgWidth = 0;
		for (var i = 0; i < this.childNodes.length; i++) 
		{
			if (this.childNodes[i].childNodes.length != 0 && !this.isInArray(chaptersNames, this.childNodes[i].text))
			{
				var image = "<img src='../resources/"+this.parentObject.image+"' border='0'>";
				var img = new Image();
				img.src = "../resources/"+this.parentObject.image;
				imgWidth = img.width+4;
			}
			else 
			{
				imgWidth = 0;
				var image = "";
			}
			
			if (!this.isInArray(chaptersNames, this.childNodes[i].text)){
				str += "<TR><TD id='"+this.globalID+"_"+this.childNodes[i].idx+"' style='height: "+this.parentObject.tdH+"px; width: "+this.parentObject.tdW+"px; background-color:"+this.parentObject.mainTableColorOut+"; padding-left:"+this.parentObject.paddingLeft+"px; padding-top:"+this.parentObject.paddingTop+"px; border-width:"+this.parentObject.tdElementBorder+"px' "+borderStyle+" "+this.parentObject.fontStyle+" onClick=\"PlayerInterface.Execute('gotoPage', "+this.childNodes[i].gix+");\" onMouseOver=\""+border3Dover+" this.className='over'; "+style+" page.all['"+this.globalID+"'].objCascadeMenu.showSubMenu(this,'"+this.globalID+"sub."+path+"."+i+"');\" onMouseOut=\"this.className=''; "+styleOut+" "+border3Dout+"\"><div style='position: relative; float: left'>"+this.childNodes[i].text+"</div><div style='position: relative; align: right; float: right; align: right; width: "+imgWidth+"'><div style='position: relative;' >"+image+"</div></div></TD></TR>";
			}				
		}
		str += "</TABLE>";
	}
	this.visible = 1;
	for (var i = 0; i < this.childNodes.length; i++) str += this.childNodes[i].toString(i,this.childNodes.length,path+"."+i);
	return str;
}
