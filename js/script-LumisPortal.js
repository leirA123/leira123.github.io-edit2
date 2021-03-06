// $Revision: 20754 $ $Date: 2017-11-17 16:31:07 +0000 (Fri, 17 Nov 2017) $
var LumisPortal = new LumisPortal();
document.onkeydown = LumisPortal.onKeyDown;

function LumisPortal()
{
	var arrHtmlProcessorCallbacks = [];
	this.HtmlProcessor = 
	{
		register: function(callback)
		{
			arrHtmlProcessorCallbacks.push(callback);
		}
		,
		process: function(node)
		{
			if(node === undefined)
				node = document.documentElement;
			
			for(var i = 0; i < arrHtmlProcessorCallbacks.length; i++)
			{
				try
				{
					arrHtmlProcessorCallbacks[i](node);
				}
				catch(e)
				{
					if(window.console && window.console.error)
					{
						window.console.error(e);
					}
				}
			}
		}
	}
	;
	this.onKeyDown = onKeyDown;
	this.onRefresh = onRefresh;
	this.onSubmitForm = onSubmitForm;
	this.onPrint = onPrint;
	this.getCookie = getCookie;
	this.addMessage = addMessage;
	this.onBodyLoad = onBodyLoad;
	this.checkForMessages = checkForMessages;
	this.gotoPage = gotoPage;
	this.htmlEncode = htmlEncode;
	this.mainName = "main.jsp";
	this.pageParameterChannelIdName = "lumChannelId";
	this.pageParameterPageIdName = "lumPageId";
	this.isSubmitting = false;
	this.renderInterfaceInstance = renderInterfaceInstance;
	this.renderInterfaceInstance_internal = renderInterfaceInstance_internal;
	this.getXmlHttpObject = getXmlHttpObject;
	this.lumisEncodeURIComponent = lumisEncodeURIComponent;
	this.bindReady = bindReady;
	this.switchAutoAdministrationChannel = switchAutoAdministrationChannel;
	this.closeInterfaceInstance = closeInterfaceInstance;
	this.opener = getOpenerWindow();
	this.xmlEncode = xmlEncode;
	this.xmlDecode = xmlDecode;
	
	bindReady(onBodyLoad, LumisPortal);
	bindReady(this.HtmlProcessor.process);
	
	if(window.addEventListener)
	{
		try
		{
			window.addEventListener("pageshow", onPageShow, false);
		}
		catch(e)
		{
			;
		}
	}
	
	function bindReady(func, thisArg)
	{
		var done = false;
		var f = function()
		{
			if (!done)
			{
				if(!(document.body))
				{
					setTimeout(arguments.callee, 10);
					return;
				}
				else
				{
					done = true;
					func.call(thisArg);
				}
			}
		}
		
		if(document.addEventListener)
		{
			document.addEventListener("DOMContentLoaded", function()
			{
				if (window.opera)
				{
					for (var i = 0; i < document.styleSheets.length; i++)
					{
						if (document.styleSheets[i].disabled)
						{
							setTimeout(arguments.callee, 10);
							return;
						}
					}
				}
				f();
			}, false);
		}
		else if (/msie/i.test(navigator.userAgent)) // IE
		{
			(function() 
			{
				try
				{
					document.documentElement.doScroll("left");
				}
				catch (e)
				{
					setTimeout(arguments.callee, 10);
					return;
				}
				f();
			})();
		}
		else if (/webkit/i.test(navigator.userAgent))
		{
			(function() 
			{
				if (/loaded|complete/i.test(document.readyState) === false)
				{
					setTimeout(arguments.callee, 10);
					return;
				}
				f();
			})();
		}
		else
		{
			var oldonload = window.onload;
			window.onload = function()
			{
				if (oldonload && typeof window.onload == 'function')
					oldonload();
				f();
			}
		}
	}
				
	function onPageShow()
	{
		this.isSubmitting = false;
	}
	
	function gotoPage(lumPageId, lumChannelId)
	{
		var portalFormActionString = document.forms["LumisPortalForm"].action; 
		var mainUrl = portalFormActionString.substring(0, portalFormActionString.indexOf('main.jsp')+8);
		var url = mainUrl;
		if(lumPageId != null)
			url += "?"+this.pageParameterPageIdName+"="+lumPageId;
		if(lumChannelId != null)
		{
			if(lumPageId == null)
				url += "?";
			else
				url += "&";
			url += this.pageParameterChannelIdName+"="+lumChannelId;
		}
		
		window.location.href = url;
	}

	function onKeyDown(event)
	{
		if(this.isSubmitting)
			return;
		
		if(!event)
			event = window.event;
		
		if(event)
		{
			if(event.keyCode == 113)
			{
				// get toggle mode url
				var xmlHttp = getXmlHttpObject();
				var responseText = null;
				var toggleModeUrlServer = g_LumisRootPath+"lumis/api/rest/lum-internal/admin/mode/gettogglemodeurl?lumCurrentDisplayModeId="+g_LumisDisplayMode+"&lumReferer="+LumisPortal.lumisEncodeURIComponent(document.location.href)+"&lumPageId="+g_LumisPageId+"&lumChannelId="+g_LumisChannelId;
				xmlHttp.open("POST", toggleModeUrlServer, true);
				xmlHttp.onreadystatechange = function()
				{
					if (xmlHttp.readyState==4 && xmlHttp.status==200)
					{
						var json = eval("(" + xmlHttp.responseText + ")");
						if(json && json.toggleModeUrl)
						{
							try
							{
								if(event.ctrlKey)
									document.forms["LumisPortalForm"].elements["lumSafeRenderMode"].value = "1";
							}
							catch(e)
							{
								// IE8 looses the event and ctrlKey is not found
							}
	
							document.forms["LumisPortalForm"].action = json.toggleModeUrl;
							document.forms["LumisPortalForm"].elements["lumToggleModeOriginUrl"].value = window.location.href;
							document.forms["LumisPortalForm"].submit();
							this.isSubmitting = true;
						}
					}
				};
				xmlHttp.send();
			}
		}
	}
	
	function switchAutoAdministrationChannel(url) 
	{
		document.forms["LumisPortalForm"].action = url;
		document.forms["LumisPortalForm"].submit();
		this.isSubmitting = true;
	}
	
	function onRefresh()
	{
		if(this.isSubmitting)
			return;

		if (g_LumisIsHtmlCache)
		{
			this.isSubmitting = true;
			document.location.reload();
		}
		else
		{
			document.forms["LumisPortalForm"].submit();
			this.isSubmitting = true;
		}
	}
	
	function onPrint(bUseNewWindow)
	{
		if(this.isSubmitting)
			return;

		if(bUseNewWindow)
		{
			var strFormTarget = document.forms['LumisPortalForm'].target;
			
			document.forms['LumisPortalForm'].target = "_blank";
			document.forms['LumisPortalForm'].elements['lumPrinting'].value = '1';
			document.forms["LumisPortalForm"].submit();
			
			document.forms['LumisPortalForm'].target = strFormTarget;
			document.forms['LumisPortalForm'].elements['lumPrinting'].value = '0';
		}
		else
		{
			document.forms['LumisPortalForm'].elements['lumPrinting'].value = '1';
			document.forms["LumisPortalForm"].submit();
			
			this.isSubmitting = true;
		}	
	}
	
	function onSubmitForm(formName, destId, destType, bProcessAction, includeAnchor, updateElementId)
	{
		if(this.isSubmitting)
			return;

		var pForm = document.forms[formName];
		var portalForm = document.forms["LumisPortalForm"];
		if((!formHasFileInputs(pForm) && !isFormWSRPAction(pForm)) || (updateElementId != null))
		{
			if(destType == null)
				destType = "lumII";
			
			var parameters = "<parameters destId=\""+destId+"\" destType=\""+destType+"\">";
			parameters += getFormParameters(formName);
			parameters += "</parameters>";
	
			
			portalForm.elements["lumNewParams"].value = parameters;
			
			var originalPortalFormAction = portalForm.action;
			if(destId != null)
			{
				var destTypeElem = portalForm.elements[destType];
				if(destTypeElem != null)
					destTypeElem.value = destId;
			}
			
			if(includeAnchor != undefined)
				portalForm.action += "#" + includeAnchor;
			
			if(bProcessAction)
			{
				portalForm.elements["lumA"].value = "1";
			}
			else
			{
				if(pForm && pForm.action)
				{
					var strFormAction = pForm.action;
					
					if(updateElementId != null)
					{
						var containerElement = document.getElementById(updateElementId);
						if(containerElement)
						{
							renderInterfaceInstance(containerElement, destId, true);
							portalForm.elements["lumNewParams"].value = "";
							portalForm.action = originalPortalFormAction;
							return;
						}
					}
					else
					{
						var clientRenderedElem = pForm.elements["lumClientRendered"];
						if(clientRenderedElem != null && clientRenderedElem.value == 1)
						{
							var interfaceDiv = getInterfaceInstanceDiv(destId);
							if(interfaceDiv)
							{
								renderInterfaceInstance(interfaceDiv, destId);
								portalForm.elements["lumNewParams"].value = "";
								portalForm.action = originalPortalFormAction;
								return;
							}
						}
					}
				}
			}
			
			this.isSubmitting = true;
			portalForm.submit();
		}
		else
		{
			try
			{
				copyFormElements(portalForm, pForm);
				if(bProcessAction)
				{
					if(pForm.elements["lumA"] != null)
						pForm.elements["lumA"].value="1";
				}
				this.isSubmitting = true;
				pForm.submit();
			}
			catch(e)
			{
				if (lumis_doui_control_fileupload_FileUploadControl_msgFileNotFound)
					alert(lumis_doui_control_fileupload_FileUploadControl_msgFileNotFound);
				else
					alert(e.message);
				this.isSubmitting = false;
				return;
			}
		}
	}
	
	function getInterfaceInstanceDiv(destId)
	{
		var arrDivs = document.getElementsByTagName("*");
		for(var i = 0; i < arrDivs.length; i++)
		{
			if(arrDivs[i].replacedByII && destId == arrDivs[i].replacedByII)
				return arrDivs[i];
		}
		
		return document.getElementById("lumIId"+destId);
	}
	
	function copyFormElements(originForm, destForm)
	{
		if(destForm.elements["lumFromForm"] == null)
			createInputHidden(destForm, "lumFromForm", destForm.name);
		
		for(var i=0; i<originForm.elements.length; i++)
		{
			var pElement = originForm.elements[i];
			
			if(!pElement.type || !pElement.name || !pElement.name.length || pElement.name=="lumA")
				continue;
			if(pElement.type == "button" || pElement.type == "submit")
				continue;
			else if(pElement.type == "select-one" && pElement.selectedIndex != -1)
			{
				var strValue = pElement.options[pElement.selectedIndex].value;
				if(strValue.length)
					createInputHidden(destForm, pElement.name, strValue);
			}
			else if(pElement.type == "select-multiple")
			{
				var strValue = "";
				for(var j=0; j<pElement.options.length; j++)
				{
					var strValue = pElement.options[j].value;
					if(pElement.options[j].selected && strValue.length)
						createInputHidden(destForm, pElement.name, strValue);
				}
			}
			else
			{
				if((pElement.type == "checkbox" || pElement.type == "radio") && !pElement.checked)
					continue;
				
				var strValue = pElement.value;
				
				if(typeof strValue === 'undefined')
					continue;

				if(strValue.length)
					createInputHidden(destForm, pElement.name, strValue);
			}
		}
	}
	
	function createInputHidden(form, inputName, inputValue)
	{
		var newElement = window.document.createElement('input');
		newElement.type = 'hidden';
		newElement.name = inputName;
		newElement.value = inputValue;
		form.appendChild(newElement);
	}
	
	function formHasFileInputs(pForm)
	{
		for(var i=0; i<pForm.elements.length; i++)
		{
			pElement = pForm.elements[i];
			if(pElement.type == "file")
				return true;
		}
		
		return false;
	}

	function isFormWSRPAction(pForm)
	{
		return pForm.action && pForm.action.indexOf('&lwsUT=') != -1;
	}

	function getFormParameters(formName)
	{
		var strFormParams = "";
		var pForm = document.forms[formName];
		var pElement;
		
		strFormParams += "<p n=\"lumFromForm\">"+htmlEncode(formName)+"</p>";
		
		var strFormAction = pForm.action;
		if(strFormAction && strFormAction.length)
			strFormParams += '<p n="lumFormAction">' + htmlEncode(strFormAction) + '</p>';

		for(var i=0; i<pForm.elements.length; i++)
		{
			pElement = pForm.elements[i];
			
			if(!pElement.type || !pElement.name || !pElement.name.length)
				continue;
			if(pElement.type == "button" || pElement.type == "submit")
				continue;
			else if(pElement.type == "select-one" && pElement.selectedIndex != -1)
			{
				var strValue = pElement.options[pElement.selectedIndex].value;
				if(strValue.length)
					strFormParams += '<p n="'+pElement.name+'">' + htmlEncode(strValue) + '</p>';
			}
			else if(pElement.type == "select-multiple")
			{
				var strValue = "";
				for(var j=0; j<pElement.options.length; j++)
				{
					var strValue = pElement.options[j].value;
					if(pElement.options[j].selected && strValue.length)
						strFormParams += '<p n="'+pElement.name+'">' + htmlEncode(strValue) + '</p>';
				}
			}
			else
			{
				if((pElement.type == "checkbox" || pElement.type == "radio") && !pElement.checked)
					continue;
				
				var strValue = pElement.value;
				
				if(strValue && strValue.length)
					strFormParams += '<p n="'+pElement.name+'">' + htmlEncode(strValue) + '</p>';
			}
		}

		return strFormParams;
	}
	
	function xmlDecode(string)
	{
		string = string.replace(/\&lt;/g,'<');
		string = string.replace(/\&gt;/g,'>');
		string = string.replace(/\&apos;/g,'\'');
		string = string.replace(/\&quot;/g,'"');
		string = string.replace(/\&amp;/g,'&');
		
		return string;
	}
	
	function xmlEncode(string)
	{
		string = string.replace(/\&/g,'&amp;');
		string = string.replace(/</g,'&lt;');
		string = string.replace(/>/g,'&gt;');
		string = string.replace(/\'/g,'&apos;');
		string = string.replace(/\"/g,'&quot;');
		
		return string;
	}

	function getCookie(sName)
	{
		// cookies are separated by semicolons
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++)
		{
			// a name/value pair (a crumb) is separated by an equal sign
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0]) 
			{
				var strToDecode = aCrumb[1];
				
				// replace '+' by space, because javascript decoding miss it
				strToDecode = strToDecode.replace(/\+/g, ' ');
				
				if (decodeURIComponent)
					return decodeURIComponent(strToDecode);
				else
					return unescape(strToDecode); // fallback for old browsers. May not display unicode correctly.
			}
		}

		// a cookie with the requested name does not exist
		return null;
	}
	
	
	function setCookie(sName, cookieValue, cookieExpires)
	{
		var encodedValue = lumisEncodeURIComponent(cookieValue);
		if(cookieExpires)
		{
			var date = new Date();
			date.setTime(date.getTime()+(cookieExpires*24*60*60*1000));
			document.cookie = sName + "=" + encodedValue +  "; expires="+date.toGMTString() + "; ";
		}
		else
		{
			document.cookie = sName + "=" + encodedValue +  "; ";
		}
	}
	
	
	function removeCookie(sName)
	{
		// cookies are separated by semicolons
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++)
		{
			// a name/value pair (a crumb) is separated by an equal sign
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0]) 
			{
				var strToDecode = aCrumb[1];
				
				setCookie(sName, "", -1);
				
				// replace '+' by space, because javascript decoding miss it
				strToDecode = strToDecode.replace(/\+/g, ' ');
				if (decodeURIComponent)
					return decodeURIComponent(strToDecode);
				else
					return unescape(strToDecode); // fallback for old browsers. May not display unicode correctly.
			}
		}

		// a cookie with the requested name does not exist
		return null;
	}
	
	function addMessage(message)
	{
		var pMsg = document.forms['LumisPortalForm'].elements['lumClientMessage'];
		
		if (pMsg.value != '')
			pMsg.value += "\n";
		pMsg.value += message;
	}
	
	function onBodyLoad()
	{
		// clear any parameters set by doing a [back] in browser
		var portalForm = document.forms["LumisPortalForm"];
		if(portalForm)
		{
			portalForm.elements["lumNewParams"].value = "";
			portalForm.elements["lumA"].value = "";
			
			checkForMessages();
		}
	}
	
	function checkForMessages()
	{
		var strClientMessage = document.forms["LumisPortalForm"].elements["lumClientMessage"].value;
		if (strClientMessage != "") 
			window.setTimeout(showMessages, 1);
	}
	
	function showMessages()
	{
		var strClientMessage = document.forms["LumisPortalForm"].elements["lumClientMessage"].value;
		if (strClientMessage != "") 
		{ 
			alert(strClientMessage);
			document.forms["LumisPortalForm"].elements["lumClientMessage"].value = "";
		}
	}

	function htmlEncode(text)
	{
		if ( typeof( text ) != "string" )
			text = text.toString() ;
	
		text = text.replace(/&/g, "&amp;") ;
		text = text.replace(/"/g, "&quot;") ;
		text = text.replace(/</g, "&lt;") ;
		text = text.replace(/>/g, "&gt;") ;
		text = text.replace(/'/g, "&#39;") ;
	
		return text ;
	}
	
	var htmlSer = (function()
	{
		var div = document.createElement('div');
		div.style.display = "none";
		div.innerHTML = "   <link/>";
		return !!div.getElementsByTagName("link").length; 
	})();

	function renderInterfaceInstance(interfaceInstanceElement, interfaceInstanceId, updatingControl)
	{
		renderInterfaceInstance_internal(interfaceInstanceElement, interfaceInstanceId, updatingControl);
	}
	
	function renderInterfaceInstance_internal(interfaceInstanceElement, interfaceInstanceId, updatingControl, styleId, styleContent, customReferrer, xslToken)
	{
		if(updatingControl != true && interfaceInstanceElement.innerHTML.length > 0)
		{
	    	var loadingDivBg = document.createElement('div');
	    	loadingDivBg.style.position = "absolute";
	    	loadingDivBg.style.width = (interfaceInstanceElement.offsetWidth)+"px";
	    	loadingDivBg.style.height = (interfaceInstanceElement.offsetHeight)+"px";
	    	loadingDivBg.style.overflow = "hidden";
	    	loadingDivBg.style.zIndex = "1001";
	    	loadingDivBg.className = "cLumClientRenderWaitBox";
	    	
	    	var loadingDiv = document.createElement('div');
	    	loadingDiv.style.position = "absolute";
	    	loadingDiv.style.width = (interfaceInstanceElement.offsetWidth)+"px";
	    	loadingDiv.style.height = (interfaceInstanceElement.offsetHeight)+"px";
	    	loadingDiv.style.overflow = "hidden";
	    	loadingDiv.style.zIndex = "1002";
	    	loadingDiv.style.textAlign = "center";
	    	loadingDiv.style.paddingTop = "5px";
	    	loadingDiv.innerHTML = g_LumisLoadingHtmlMessage;

			if(interfaceInstanceElement.childNodes.length > 0)
				interfaceInstanceElement.insertBefore(loadingDivBg, interfaceInstanceElement.childNodes[0]);
			else
				interfaceInstanceElement.appendChild(loadingDivBg);

			interfaceInstanceElement.insertBefore(loadingDiv, interfaceInstanceElement.childNodes[0]);
		}
		else if(updatingControl != true)
		{
			interfaceInstanceElement.innerHTML = g_LumisLoadingHtmlMessage;
		}
		
		var xmlHttp = getXmlHttpObject();
		
		function handleRenderResponse()
		{
			if ( xmlHttp && xmlHttp.readyState == 4 )
			{
				replaceInnerHTML(interfaceInstanceElement, xmlHttp.responseText);
				xmlHttp = null;
			}
			
			function replaceInnerHTML(element, html)
			{
				while (element.firstChild)
					element.removeChild(element.firstChild);
				
				LumisPortal.tempRenderHtml = function(html, position)
				{
					appendInnerHTML(element, html, position);
				}
				
				appendInnerHTML(element, html);

				LumisPortal.tempRenderHtml = undefined;
				
				LumisPortal.HtmlProcessor.process(element);
				
				return element;

				function appendInnerHTML(element, html, position)
				{
					var doc = element.ownerDocument || document;
					var docHead = doc.head || doc.getElementsByTagName("head")[0];
					var frag = doc.createDocumentFragment();
					var scripts = [];
					extract(html, doc, frag, scripts);
					
					var first;
					if (frag.childNodes.length === 1)
						first = frag = frag.firstChild;
					else
						first = frag.firstChild;

					if (first)
					{
						if(position)
						{
							if(position === "HEAD_START")
							{
								docHead.insertBefore(frag, docHead.firstChild)
							}
							else if(position === "HEAD_END")
							{
								docHead.appendChild(frag)
							}
							else if(position === "BODY")
							{
								element.appendChild(frag);
							}
						}
						else
						{
							element.appendChild(frag);
						}	
					}
					
					if (scripts.length)
					{
						var totalCode = '';
						for (var i = 0; scripts[i]; i++)
						{
							var code = getScriptCode(scripts[i]);
							if (code)
								totalCode += code + ';';
						}
						evalScript(totalCode);
					}
				}
				
				function extract(html, doc, frag, scripts)
				{
					var elems = [];
					if (html)
					{
						var div = doc.createElement("div");
						if (!htmlSer)
						{
							div.innerHTML = 'div<div>' + html + '</div>';
							div = div.lastChild;
						}
						else
							div.innerHTML = html;

						var elem = div.childNodes;
						if (elem.nodeType)
							elems.push(elem);
						else
							elems = merge(elems, elem);
					}

					for ( var i = 0; elems[i]; i++ )
					{
						if (scripts && (elems[i].tagName || "").toLowerCase() === "script" && (!elems[i].type || elems[i].type.toLowerCase() === "text/javascript"))
						{
							scripts.push(elems[i].parentNode ? elems[i].parentNode.removeChild(elems[i]) : elems[i]);
						}
						else
						{
							if (elems[i].nodeType === 1)
							{
								var retScripts = merge([], elems[i].getElementsByTagName("script"));
								elems.splice.apply(elems, [i+1, 0].concat(retScripts));
							}
							frag.appendChild(elems[i]);
						}
					}
					
					function merge(first, second)
					{
						var i = first.length;
						for (var j=0; j<second.length; j++)
							first[i++] = second[j];
						first.length = i;
						return first;
					}		
				}	
				
				function getScriptCode(elem)
				{
					if(elem.src)
					{
						var xmlHttp = getXmlHttpObject();
						var responseText = null;
						xmlHttp.open("GET", elem.src, false);
						xmlHttp.send();
						var responseText = xmlHttp.responseText;
						return responseText;
					}
					else
					{
						return elem.text || elem.textContent || elem.innerHTML;
					}
				}
				
				function evalScript(code)
				{
					if(code)
					{
						(window.execScript || 
								function(code) 
								{
									window["eval"].call(window, code);
								}
						)(code);
					}
				}
			}
		}
		
		// get the interface content and render it
		var strRequest = "lumPrevParams="+lumisEncodeURIComponent(document.forms["LumisPortalForm"].elements["lumPrevParams"].value);
		var newParameters = document.forms["LumisPortalForm"].elements["lumNewParams"].value;
		
		// enqueue the new parameters to be processed later
		LumisParametersController.add(newParameters);
		strRequest += "&lumNewParams="+lumisEncodeURIComponent(newParameters);
		
		strRequest += "&lumReplIntfState="+lumisEncodeURIComponent(document.getElementsByName("lumReplIntfState")[0].value);
		
		if(styleContent !== undefined)
			strRequest += "&lumStyleToApply="+lumisEncodeURIComponent(styleContent);
		
		if(styleId !== undefined)
			strRequest += "&lumStyleToApplyId="+lumisEncodeURIComponent(styleId);
		
		if(xslToken !== undefined)
			strRequest += "&lumXslToApplyToken="+lumisEncodeURIComponent(xslToken);
		
		if (customReferrer === undefined)
			customReferrer = document.location.href;
		
		// add the before write keys already written in the page html
		if(window.LumisBWKeys)
		{
			for (key in window.LumisBWKeys)
				strRequest += "&lumWriterKeys="+lumisEncodeURIComponent(key);
		}
		xmlHttp.open("POST", document.forms["LumisPortalRenderInterfaceForm"].action+"&lumScript=1&lumRenderII="+interfaceInstanceId+"&lumReferer="+lumisEncodeURIComponent(customReferrer), true);
		xmlHttp.onreadystatechange = handleRenderResponse;
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlHttp.send(strRequest);
	}
	
	function getXmlHttpObject()
	{
		var httpObj = null;
		
		if (window.ActiveXObject)
			httpObj=new ActiveXObject("Microsoft.XMLHTTP");
		else
			httpObj=new XMLHttpRequest();
			
		return httpObj;
	}
	
	function lumisEncodeURIComponent(str)
	{
		if (encodeURIComponent)
			return encodeURIComponent(str);
		else
			return escape(str);
	}
	
	function closeInterfaceInstance(interfaceInstanceId, formName)
	{
		if(interfaceInstanceId)
		{
			if(formName == null)
				formName = "Form_" + interfaceInstanceId;
			
			var replaceInterfaces = document.getElementsByName('lumReplIntfState')[0].value;
			if(replaceInterfaces != null && replaceInterfaces.indexOf(interfaceInstanceId) != -1)
			{
				document.forms[formName].elements['lumReplIntfCommands'].value = 'r';
				onSubmitForm(formName, interfaceInstanceId, null, false);
				return;
			}
		}

		if(window.self != window.top && (window.parent.LumisLightBoxAdmin || window.parent.LumisLightBox))
 		{
			// If the client lightbox doesn't have the isOpen function, consider it as open and try to close it. Otherwise only close if it's open
			if (window.parent.LumisLightBoxAdmin && (!window.parent.LumisLightBoxAdmin.isOpen || window.parent.LumisLightBoxAdmin.isOpen()))
			{
				window.parent.LumisLightBoxAdmin.close();
			}
			else if (window.parent.LumisLightBox && (!window.parent.LumisLightBox.isOpen || window.parent.LumisLightBox.isOpen()))
			{
				window.parent.LumisLightBox.close();
			}
		}
		else
		{
			window.close();
		}
	}
	
	function getOpenerWindow()
	{
		if(typeof($_lumDoNotCalculateWindowOpener) != "undefined")
		{
			return null;
		}
		
		if(window.opener)
			return window.opener;
		
		else if (window.self != window.top && window.parent)
				return window.parent;

		return null;
	}

	/**
	 * Removes the given replaces form the client control.
	 * @param arrReplacesToRemove the replaces to be removed.
	 */
	this.removeReplaces = function(arrReplacesToRemove)
	{
		var replaceInterfacesString = document.getElementsByName("lumReplIntfState")[0].value;
		var newReplaceInterfacesString = "";
		var arrReplacesToRemoveStr = arrReplacesToRemove.join(',');
		var replaces = replaceInterfacesString.split(';');
		for(var i = 0; i < replaces.length; i++)
		{
			var replace = replaces[i].split("=");
			var replaceKey = replace[0];
			var replaceValue = replace[1];
			
			if(arrReplacesToRemoveStr.search(replaceKey) == -1)
			{
				if(newReplaceInterfacesString.length > 0)
					newReplaceInterfacesString += ";";
				
				newReplaceInterfacesString += (replaceKey +"="+replaceValue);
			}
		}
		
		document.getElementsByName("lumReplIntfState")[0].value = newReplaceInterfacesString;
	};

	/**
	 * Add replaces mappings to the client control.
	 * @param mapReplaces the replaces.
	 */
	this.addReplaces = function(mapReplaces)
	{
		var replaceInterfacesString = document.getElementsByName("lumReplIntfState")[0].value;
		
		for(var key in mapReplaces)
		{
			if(replaceInterfacesString.length > 0)
				replaceInterfacesString += ";";
			replaceInterfacesString += (key+"="+mapReplaces[key]);
		}
		
		document.getElementsByName("lumReplIntfState")[0].value = replaceInterfacesString;
	};
	
	/**
	 * Controller that performs the <code>lumPreviousParameters</code> updates.
	 */
	var LumisParametersController = (function()
	{
		var previousParameterInput;
		var newParametersToBeAdded = [];
		var controller = 
		{
				waitingResponse: false,
				running: false,
				process: function()
				{
					if(newParametersToBeAdded.length == 0)
					{
						controller.stop();
						return;
					}
					
					if(controller.waitingResponse)
					{
						controller.schedule(50);
						return;
					}
					
					var newParameters = newParametersToBeAdded[0];
					controller.makeRequest(newParameters);
					
					if(newParametersToBeAdded.length > 0)
						controller.schedule(10);
				},
				start: function()
				{
					this.running = true;
					this.schedule(10);
				},
				stop: function()
				{
					this.running = false;
				},
				schedule: function(millis)
				{
					window.setTimeout(this.process, millis);
				},
				add: function(newParameters) 
				{
					newParametersToBeAdded.push(newParameters);
					if(!this.running)
					{
						this.start();
					}
				},
				makeRequest: function (newParameters)
				{
					var strRequest = "lumPrevParams="+getValue();
					strRequest += "&lumNewParams="+lumisEncodeURIComponent(newParameters);
					
					var xmlHttp = getXmlHttpObject();
					xmlHttp.open("POST", g_LumisRootPath+"lumis/portal/controller/html/PortalRequestParametersControllerHtml.jsp", true);
					xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					this.waitingResponse = true;
					xmlHttp.onreadystatechange = function()
					{
						if ( xmlHttp && xmlHttp.readyState == 4 )
						{
							if (xmlHttp.status != 200)
							{
								(window.console.error||window.console.info||window.console.log||window.console.debug)('HTTP error ' + xmlHttp.status + ' on request to PortalRequestParametersControllerHtml.jsp');
								return;
							}
							
							var newPreviousParameters = xmlHttp.responseText;
							setValue(lumisEncodeURIComponent(newPreviousParameters));
							
							newParametersToBeAdded = (function()
							{
								var arr = [];
								for(var i = 1; i < newParametersToBeAdded.length; i++)
								{
									arr.push(newParametersToBeAdded[i]);
								}
								return arr;
							})();
							
							xmlHttp = null;
							controller.waitingResponse = false;
						}
					};
					xmlHttp.send(strRequest);
				}
		};
		
		function getPreviousParameterInput()
		{
			if(!previousParameterInput)
				previousParameterInput = document.forms["LumisPortalForm"].elements["lumPrevParams"];
			
			return previousParameterInput;
		}
		
		function getValue()
		{
			return getPreviousParameterInput().value;
		}
		
		function setValue(value)
		{
			getPreviousParameterInput().value = value;
		}
		
		return {
			add: function (newParameters)
			{
				controller.add(newParameters);
			}
		}
	})();
	
	/**
	 * Executes the replace interface commands.
	 * @param form the form that will be submitted.
	 * @param interfaceInstanceId the interface instance that will be considered the current one.
	 * @param commands the commands to be performed.
	 * @param parameters the parameters to be sent to the new interface.
	 */
	this.executeReplaceInterfaceCommands = function(form, interfaceInstanceId, commands, parameters)
	{
		form.elements['lumReplIntfCommands'].value=commands;
		if(parameters)
			form.elements['lumReplIntfParams'].value=parameters;
		onSubmitForm(form.id||form.name, interfaceInstanceId, null, false);
	}
	
	/** Internal use. */
	this.initLumisPortalForm = function(prevParams)
	{
		function decode(v) { return decodeURIComponent(v.replace(/\\+/g,'%20')); }
		
		var qsStart = location.href.indexOf('?');
		if (qsStart !== -1)
		{
			var qs = window.location.href.substring(qsStart+1);
			var qsEnd = qs.indexOf('#');
			if (qsEnd !== -1) qs = qs.substring(0,qsEnd);
			var params = qs.split('&');
			var newParams = '';
			for (var i=0; i<params.length; i++)
			{
				var parts = qs.split('=');
				if (parts.length === 2)
					newParams += '<p n=\"' + LumisPortal.xmlEncode(decode(parts[0])) + '\">' + LumisPortal.xmlEncode(decode(parts[1])) + '</p>';
			}
			if (newParams.length !== 0)
			{
				var endIndex = prevParams.lastIndexOf('</allParameters>');
				if (endIndex !== -1)
				{
					prevParams = prevParams.substring(0, endIndex);
					prevParams += '<parameters>'+newParams+'</parameters>';
					prevParams += '</allParameters>';
				}
			}
		}
		document.forms['LumisPortalForm'].elements['lumPrevParams'].value = encodeURIComponent(prevParams);
	}
 }
