// $Revision: 18293 $ $Date: 2016-02-04 17:05:48 +0000 (Thu, 04 Feb 2016) $
	function LumisDouiValidateSelection(strSelectionType, strFormName, strControlName, strNoItemMsg, strOneItemMsg)
	{
		var pForm = document.forms[strFormName];
		var pElement, pElements;
		var bFoundOne = false;
		var bFoundMoreThanOne = false;
		
		if(strSelectionType == "selectedOne" || strSelectionType == "selectedMany")
		{
			pElements = pForm.elements[strControlName];
	
			if(pElements && !pElements.length)
			{
				if(pElements.checked)
					bFoundOne = true;
			}
			else if(pElements)
			{
				for(var i=0; i<pElements.length; i++)
				{
					if(pElements[i].checked)
					{
						if(bFoundOne)
						{
							bFoundMoreThanOne = true;
							break;
						}
	
						bFoundOne = true;
					}
				}
			}
	
			if(!bFoundOne)
			{
				if(strNoItemMsg)
					alert(strNoItemMsg);
					
				return false;
			}
	
			if(strSelectionType == "selectedOne" && bFoundMoreThanOne)
			{
				if(strOneItemMsg)
				{
					alert(strOneItemMsg); 
					return false;
				}
			}
		}
		
		return true;
	}
	
	function LumisDouiGetSelectedItems(strFormName, strControlName)
	{
		var elementValues = "";
		var pForm = document.forms[strFormName];
		var bFoundOne = false;
	
		pElements = pForm.elements[strControlName];
		
		if(pElements && !pElements.length)
		{
			if(pElements.checked)
				elementValues += pElements.value;
		}
		else if(pElements)
		{
			for(var i=0; i<pElements.length; i++)
			{
				if(pElements[i].checked)
				{
					if(bFoundOne)
						elementValues += ";";
					elementValues += pElements[i].value;
					
					bFoundOne = true;
				}
			}
		}
		
		return elementValues;
	}

	function LumisDouiToggleSelection(formId, checkBoxName, checked)
	{
		var form = document.forms[formId];
		var items = form.getElementsByTagName("input");
		for(var i=0; i<items.length; i++)
		{
			if (items[i].name == checkBoxName && items[i].type == 'checkbox')
				items[i].checked = checked;
		}
	}
	

	var LumisDoui = new LumisDoui();
	function LumisDoui()
	{
		this.registerGetValueFunction = registerGetValueFunction;
		this.registerGetDisplayValueFunction = registerGetDisplayValueFunction;
		this.registerClearValueFunction = registerClearValueFunction;
		this.executeAction = executeAction;
		this.getControlValue = getControlValue;
		this.getControlDisplayValue = getControlDisplayValue;
		this.clearControlValue = clearControlValue;
		this.getFormElementValue = getFormElementValue;
		
		var getValueFunctions = new Array();
		var getDisplayValueFunctions = new Array();
		var clearValueFunctions = new Array();
		function registerGetValueFunction(formName, controlId, pFunction)
		{
			getValueFunctions[formName+"#"+controlId] = pFunction;
		}
		
		function registerGetDisplayValueFunction(formName, controlId, pFunction)
		{
			getDisplayValueFunctions[formName+"#"+controlId] = pFunction;
		}

		function registerClearValueFunction(formName, controlId, pFunction)
		{
			clearValueFunctions[formName+"#"+controlId] = pFunction;
		}
		
		/**
		 * Executes a action.
		 * @param actionControlId the identifier of the action control (usually a button).
		 * @param tabularDataValues a string or an array of strings that will be sent as the request parameter value
		 * for the tabular data control (usually data primary key value). This parameter is optional. 
		 * @param tabularDataControlId the identifier of the tabular data control that will process tabularDataValues. Must be
		 * specified if tabularDataValues is specified.
		 */
		function executeAction(actionControlId, tabularDataValues, tabularDataControlId)
		{
			var actionControl = document.getElementById(actionControlId);
			var form = actionControl;
			while (form && form.tagName.toUpperCase() !== 'FORM')
				form = form.parentNode;
			
			var tempCheckboxes;
			if (tabularDataValues)
			{
				if (!(tabularDataValues instanceof Array))
					tabularDataValues = [tabularDataValues];
				
				var hasListControlCheckbox = false;
				for(var i=0; i<form.elements.length; i++)
				{	
					var element = form.elements[i];
						
					if(!element.name || !element.name.length || element.name !== tabularDataControlId)	
						continue;	
					
					if (element.type === 'checkbox' || element.type === 'radio')
					{
						var checked = false;
						for (var j=0; !checked && j<tabularDataValues.length; j++)
							checked = element.value === tabularDataValues[j];
						element.checked = checked;
						hasListControlCheckbox = true;
					}
				}	
				
				if (!hasListControlCheckbox)
				{
					for (var i=0; i<tabularDataValues.length; i++)
					{
						form.insertAdjacentHTML('beforeend', '<input type="checkbox" name="' + LumisPortal.xmlEncode(tabularDataControlId) + 
								'" checked="checked" style="display:none" value="' + LumisPortal.xmlEncode(tabularDataValues[i]) + '"/>');
					}
					tempCheckboxes = form.elements[tabularDataControlId];
				}
			}
			
			actionControl.click();
			
			if (tempCheckboxes)
			{
				if (tempCheckboxes.length)
					for (var i=0; i<tempCheckboxes.length; i++)
						tempCheckboxes[i].parentNode.removeChild(tempCheckboxes[i]);
				else
					tempCheckboxes.parentNode.removeChild(tempCheckboxes);
			}
		}
		
		function getControlValue(formName, controlId)
		{
			var functionImpl = getValueFunctions[formName+"#"+controlId];
			if(functionImpl != null)
				return functionImpl(formName, controlId);
			else
				return getFormElementValue(formName, controlId);
		}
		
		function getFormElementValue(formName, controlId)
		{
			var pForm = document.forms[formName];
			var strControlName = controlId;
			var strValuesArray = new Array();
			for(var i=0; i<pForm.elements.length; i++)	
			{	
				var pElement = pForm.elements[i];
					
				if(!pElement.name || !pElement.name.length || pElement.name != strControlName)	
					continue;	
				
				if(pElement.type == "select-one" && pElement.selectedIndex != -1)	
				{	
					strValuesArray[strValuesArray.length] = pElement.options[pElement.selectedIndex].value;	
				}	
				else if(pElement.type == "select-multiple")	
				{	
					for(var j=0; j<pElement.options.length; j++)	
					{	
						if(pElement.options[j].selected && pElement.options[j].value)	
							strValuesArray[strValuesArray.length] = pElement.options[j].value;	
					}	
				}	
				else
				{	
					if (pElement.type != 'checkbox' || pElement.checked)
						strValuesArray[strValuesArray.length] = pElement.value;	
				}	
			}	
			return strValuesArray;
		}

		function getControlDisplayValue(formName, controlId)
		{
			var functionImpl = getDisplayValueFunctions[formName+"#"+controlId];
			if(functionImpl != null)
				return functionImpl(formName, controlId);
			else
			{
				var pForm = document.forms[formName];
				var strControlName = controlId;
				var strValue = null;
				for(var i=0; i<pForm.elements.length; i++)	
				{	
					var pElement = pForm.elements[i];
						
					if(!pElement.name || !pElement.name.length || pElement.name != strControlName)	
						continue;	
					
					if(pElement.type == "select-one" && pElement.selectedIndex != -1)	
					{	
						strValue = pElement.options[pElement.selectedIndex].text;	
					}	
					else if(pElement.type == "select-multiple")	
					{	
						var strValue = "";
						for(var j=0; j<pElement.options.length; j++)
						{
							if(pElement.options[j].selected)
							{
								if(strValue && strValue.length)
									strValue += ", ";
								strValue += pElement.options[j].text;
							}
						}
					}	
					else
					{	
						if (pElement.type != 'checkbox' || pElement.checked)
							strValue = pElement.value;	
					}
				}	
				return strValue;
			}
		}

		function clearControlValue(formName, controlId)
		{
			var functionImpl = clearValueFunctions[formName+"#"+controlId];
			if(functionImpl != null)
				return functionImpl(formName, controlId);
			else
			{
				var pForm = document.forms[formName];
				var strControlName = controlId;
				for(var i=0; i<pForm.elements.length; i++)	
				{	
					var pElement = pForm.elements[i];
						
					if(!pElement.name || !pElement.name.length || pElement.name != strControlName)	
						continue;	
					
					if(pElement.type == "select-one" && pElement.selectedIndex != -1)	
					{	
						pElement.selectedIndex = -1;
					}	
					else if(pElement.type == "select-multiple")	
					{	
						for(var j=0; j<pElement.options.length; j++)	
						{	
							if(pElement.options[j].selected)
								pElement.options[j].selected = false;	
						}
					}	
					else if (pElement.type == 'checkbox' && pElement.checked)
					{
						pElement.checked = false;
					}
					else if(pElement.value)
					{
						pElement.value = '';	
					}	
				}	
			}
		}
	}	