/*
* XMLHttpRequest.js Copyright (C) 2011 Sergey Ilinsky (http://www.ilinsky.com)
*
* This work is free software; you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation; either version 2.1 of the License, or
* (at your option) any later version.
*
* This work is distributed in the hope that it will be useful,
* but without any warranty; without even the implied warranty of
* merchantability or fitness for a particular purpose. See the
* GNU Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public License
* along with this library; if not, write to the Free Software Foundation, Inc.,
* 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
*/

(function () 
{
	var oXMLHttpRequest = window.XMLHttpRequest;
	
	var bGecko  = !!window.controllers;
	var bIE     = !!window.document.namespaces;
	var bIE7    = bIE && window.navigator.userAgent.match(/MSIE 7.0/);

	function fXMLHttpRequest() 
	{
		if (!window.XMLHttpRequest || bIE7) 
		{
			this._object = new window.ActiveXObject("Microsoft.XMLHTTP");
		} 

		else if (window.XMLHttpRequest.isNormalizedObject) 
		{
			this._object = new oXMLHttpRequest();
		}
		
		else 
		{
			this._object = new window.XMLHttpRequest();		
		}

		this._listeners = [];
	}

	function cXMLHttpRequest() 
	{
		return new fXMLHttpRequest;
	}

	cXMLHttpRequest.prototype = fXMLHttpRequest.prototype;

	if (bGecko && oXMLHttpRequest.wrapped) 
	{
		cXMLHttpRequest.wrapped = oXMLHttpRequest.wrapped;
	}
	
	cXMLHttpRequest.isNormalizedObject = true;

	cXMLHttpRequest.UNSENT            = 0;
	cXMLHttpRequest.OPENED            = 1;
	cXMLHttpRequest.HEADERS_RECEIVED  = 2;
	cXMLHttpRequest.LOADING           = 3;
	cXMLHttpRequest.DONE              = 4;

	cXMLHttpRequest.prototype.UNSENT            = cXMLHttpRequest.UNSENT;
	cXMLHttpRequest.prototype.OPENED            = cXMLHttpRequest.OPENED;
	cXMLHttpRequest.prototype.HEADERS_RECEIVED  = cXMLHttpRequest.HEADERS_RECEIVED;
	cXMLHttpRequest.prototype.LOADING           = cXMLHttpRequest.LOADING;
	cXMLHttpRequest.prototype.DONE              = cXMLHttpRequest.DONE;
	cXMLHttpRequest.prototype.readyState    = cXMLHttpRequest.UNSENT;
	cXMLHttpRequest.prototype.responseText  = '';
	cXMLHttpRequest.prototype.responseXML   = null;
	cXMLHttpRequest.prototype.status        = 0;
	cXMLHttpRequest.prototype.statusText    = '';
	cXMLHttpRequest.prototype.priority    = "NORMAL";
	cXMLHttpRequest.prototype.onreadystatechange  = null;

	cXMLHttpRequest.onreadystatechange  = null;
	cXMLHttpRequest.onopen              = null;
	cXMLHttpRequest.onsend              = null;
	cXMLHttpRequest.onabort             = null;

	cXMLHttpRequest.prototype.open  = function(sMethod, sUrl, bAsync, sUser, sPassword) 
	{
		var sLowerCaseMethod = sMethod.toLowerCase();

		if (sLowerCaseMethod == "connect" || sLowerCaseMethod == "trace" || sLowerCaseMethod == "track") 
		{
			throw new Error(18);
		}

		delete this._headers;

		if (arguments.length < 3) 
		{
			bAsync  = true;
		}

		this._async   = bAsync;

		var oRequest  = this;
		var nState    = this.readyState;
		var fOnUnload = null;

		if (bIE && bAsync) 
		{
			fOnUnload = function() 
			{
				if (nState != cXMLHttpRequest.DONE) 
				{
					fCleanTransport(oRequest);
					oRequest.abort();
				}
			};

			window.attachEvent("onunload", fOnUnload);
		}

		if (cXMLHttpRequest.onopen) 
		{
			cXMLHttpRequest.onopen.apply(this, arguments);
		}

		if (arguments.length > 4) {
			this._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
		} else if (arguments.length > 3) {
			this._object.open(sMethod, sUrl, bAsync, sUser);
		} else {
			this._object.open(sMethod, sUrl, bAsync);
		}

		this.readyState = cXMLHttpRequest.OPENED;
		fReadyStateChange(this);

		this._object.onreadystatechange = function() 
		{
			if (bGecko && !bAsync) 
			{
				return;
			}

			oRequest.readyState = oRequest._object.readyState;
			fSynchronizeValues(oRequest);

			if (oRequest._aborted) 
			{
				oRequest.readyState = cXMLHttpRequest.UNSENT;
				return;
			}

			if (oRequest.readyState == cXMLHttpRequest.DONE) 
			{
				delete oRequest._data;
				fCleanTransport(oRequest);

				if (bIE && bAsync) 
				{
					window.detachEvent("onunload", fOnUnload);
				}

				if (nState != oRequest.readyState) 
				{
					fReadyStateChange(oRequest);
				}

				nState  = oRequest.readyState;
			}
		};
	};

	cXMLHttpRequest.prototype.send = function(vData) 
	{
		if (cXMLHttpRequest.onsend) 
		{
			cXMLHttpRequest.onsend.apply(this, arguments);
		}

		if (!arguments.length) 
		{
			vData = null;
		}

		if (vData && vData.nodeType) 
		{
			vData = window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
			
			if (!this._headers["Content-Type"]) 
			{
				this._object.setRequestHeader("Content-Type", "application/xml");
			}
		}

		this._data = vData;
		fXMLHttpRequest_send(this);
	};

	cXMLHttpRequest.prototype.abort = function() 
	{
		if (cXMLHttpRequest.onabort) 
		{
			cXMLHttpRequest.onabort.apply(this, arguments);
		}

		if (this.readyState > cXMLHttpRequest.UNSENT) 
		{
			this._aborted = true;
		}

		this._object.abort();
		fCleanTransport(this);
		this.readyState = cXMLHttpRequest.UNSENT;
		delete this._data;
	};

	cXMLHttpRequest.prototype.getAllResponseHeaders = function() 
	{
		return this._object.getAllResponseHeaders();
	};

	cXMLHttpRequest.prototype.getResponseHeader = function(sName) 
	{
		return this._object.getResponseHeader(sName);
	};

	cXMLHttpRequest.prototype.setRequestHeader  = function(sName, sValue) 
	{
		if (!this._headers) 
		{
			this._headers = {};
		}

		this._headers[sName]  = sValue;
		return this._object.setRequestHeader(sName, sValue);
	};

	cXMLHttpRequest.prototype.addEventListener  = function(sName, fHandler, bUseCapture) 
	{
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) 
		{
			if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture) 
			{
				return;
			}
		}

		this._listeners.push([sName, fHandler, bUseCapture]);
	};

	cXMLHttpRequest.prototype.removeEventListener = function(sName, fHandler, bUseCapture) 
	{
		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) 
		{
			if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture) 
			{
				break;
			}
		}

		if (oListener) 
		{
			this._listeners.splice(nIndex, 1);
		}
	};

	cXMLHttpRequest.prototype.dispatchEvent = function(oEvent) 
	{
		var oEventPseudo = 
		{
			'type':             oEvent.type,
			'target':           this,
			'currentTarget':    this,
			'eventPhase':       2,
			'bubbles':          oEvent.bubbles,
			'cancelable':       oEvent.cancelable,
			'timeStamp':        oEvent.timeStamp,
			'stopPropagation':  function() {},  // There is no flow
			'preventDefault':   function() {},  // There is no default action
			'initEvent':        function() {}   // Original event object should be initialized
		};

		if (oEventPseudo.type == "readystatechange" && this.onreadystatechange) 
		{
			(this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [oEventPseudo]);
		}

		for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) 
		{
			if (oListener[0] == oEventPseudo.type && !oListener[2]) 
			{
				(oListener[1].handleEvent || oListener[1]).apply(this, [oEventPseudo]);
			}
		}
	};

	cXMLHttpRequest.prototype.toString  = function() 
	{
		return '[' + "object" + ' ' + "XMLHttpRequest" + ']';
	};

	cXMLHttpRequest.toString  = function() 
	{
		return '[' + "XMLHttpRequest" + ']';
	};

	function fXMLHttpRequest_send(oRequest) 
	{
		oRequest._object.send(oRequest._data);

		if (bGecko && !oRequest._async) 
		{
			oRequest.readyState = cXMLHttpRequest.OPENED;
			fSynchronizeValues(oRequest);

			while (oRequest.readyState < cXMLHttpRequest.DONE) 
			{
				oRequest.readyState++;
				fReadyStateChange(oRequest);

				if (oRequest._aborted) 
				{
					return;
				}
			}
		}
	}

	function fReadyStateChange(oRequest) 
	{
		if (cXMLHttpRequest.onreadystatechange)
		{
			cXMLHttpRequest.onreadystatechange.apply(oRequest);
		}

		oRequest.dispatchEvent(
		{
			'type':       "readystatechange",
			'bubbles':    false,
			'cancelable': false,
			'timeStamp':  new Date().getTime()
		});
	}

	function fGetDocument(oRequest) 
	{
		var oDocument = oRequest.responseXML;
		var sResponse = oRequest.responseText;
		
		if (bIE && sResponse && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) 
		{
			oDocument = new window.ActiveXObject("Microsoft.XMLDOM");
			oDocument.async       = false;
			oDocument.validateOnParse = false;
			oDocument.loadXML(sResponse);
		}

		if (oDocument)
		{
			if ((bIE && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror")) {
				return null;
			}
		}

		return oDocument;
	}

	function fSynchronizeValues(oRequest) 
	{
		try { oRequest.responseText = oRequest._object.responseText;  } catch (e) {}
		try { oRequest.responseXML  = fGetDocument(oRequest._object); } catch (e) {}
		try { oRequest.status       = oRequest._object.status;        } catch (e) {}
		try { oRequest.statusText   = oRequest._object.statusText;    } catch (e) {}
	}

	function fCleanTransport(oRequest) 
	{
		oRequest._object.onreadystatechange = new window.Function;
	}

	if (!window.Function.prototype.apply) 
	{
		window.Function.prototype.apply = function(oRequest, oArguments) 
		{
			if (!oArguments) 
			{
				oArguments  = [];
			}

			oRequest.__func = this;
			oRequest.__func(oArguments[0], oArguments[1], oArguments[2], oArguments[3], oArguments[4]);
			delete oRequest.__func;
		};
	}

	window.XMLHttpRequest = cXMLHttpRequest;
})();