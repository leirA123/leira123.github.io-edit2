// $Revision: 14374 $ $Date: 2012-06-12 17:54:33 +0000 (Tue, 12 Jun 2012) $
function LumisDouiValidatorSetMessages(validatorId, localMessage, summaryMessage)
{
	var validatorSpan = document.getElementById(validatorId);

	var setMessagesFunction = eval("window."+validatorId+"_SetMessages");
	if(setMessagesFunction)
		setMessagesFunction.call(this, localMessage, summaryMessage);
	else
	{
		if (validatorSpan != null)
		{
			validatorSpan.innerHTML = localMessage;
			validatorSpan.title = summaryMessage;
		}
	}
}
