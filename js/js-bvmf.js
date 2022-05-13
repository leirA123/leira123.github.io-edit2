$(document).ready(function(e) {
    $('a[href$=".pdf"]').attr('download', '');  
	$('a[href$=".txt"]').attr('download', '');
	// eventos que rastream o menu acessivel
	var modal = document.createElement("DIV");   
	modal.classList.add("modal-bg-mobile");
	modal.id = "mobile-overlay";
	modal.style.display = "none";
	document.getElementsByTagName("body")[0].appendChild(modal);
	
	document.addEventListener("focusin", (e) => {
		if (document.activeElement.classList.contains("menu-item-acessivel")) {
			document.querySelector(".new-top-bar-section ul").classList.add("menu-margin-left");
		} else {
			document.querySelector(".new-top-bar-section ul").classList.remove("menu-margin-left");
		}
	});
	document.addEventListener("keyup",(e)=>{
		if(document.activeElement.classList.contains("menu-item-acessivel") && e.key === "Enter" ){
			document.querySelector(".new-top-bar-section ul").classList.remove("menu-margin-left");
			document.activeElement.blur();
		}
	});
	var menuItems = Array.from(document.getElementsByClassName("menu-item-acessivel"));
	if(menuItems){
		menuItems.forEach((el,i)=>{
			el.addEventListener("click",(e)=>{
				document.querySelector(".new-top-bar-section ul").classList.remove("menu-margin-left");
				document.activeElement.blur();
			})
		})
	}
	// Removendo o background preto para quando fechar a pesquisa da lupa
	if(document.getElementById("sb-search-close")){
		document.getElementById("sb-search-close").addEventListener("click",()=>{
			if(document.getElementsByClassName("reveal-modal-bg")[0]){
				document.getElementsByClassName("reveal-modal-bg")[0].style.display = "none";
			}
		});
	}
	document.addEventListener("keyup",(e)=>{
		if(e.key == "Enter" && document.activeElement.id === "sb-search-close"){
			document.getElementsByClassName("reveal-modal-bg")[0].style.display = "none";
		}
	});
	if(document.getElementById("sb-search-open")){
		document.getElementById("sb-search-open").addEventListener("click",()=>{
			if(document.getElementsByClassName("reveal-modal-bg")[0]){
				document.getElementsByClassName("reveal-modal-bg")[0].style.display = "block";
			}
		});
	};
	if(document.getElementsByClassName("sb-icon-search")){
		if(document.getElementsByClassName("sb-icon-search")[0]){
			document.getElementsByClassName("sb-icon-search")[0].addEventListener("touchstart",(e)=>{	
				if(window.innerWidth < 500){
					if(document.getElementById("mobile-overlay").style.display == "none"){
						document.getElementById("mobile-overlay").style.display = "block";
					}else{
						document.getElementById("mobile-overlay").style.display = "none";
					}
				}
			});
			document.getElementsByClassName("sb-icon-search")[0].addEventListener("click",(e)=>{	
					if(document.getElementById("mobile-overlay").style.display == "none"){
						document.getElementById("mobile-overlay").style.display = "block";
					}else{
						document.getElementById("mobile-overlay").style.display = "none";
					}
			});
		}
		if(document.getElementsByClassName("sb-icon-search")[1]){
			document.getElementsByClassName("sb-icon-search")[1].addEventListener("touchstart",(e)=>{	
				if(document.getElementById("mobile-overlay").style.display == "none"){
					document.getElementById("mobile-overlay").style.display = "block";
				}else{
					document.getElementById("mobile-overlay").style.display = "none";
				}
			});
			document.getElementsByClassName("sb-icon-search")[1].addEventListener("click",(e)=>{
				if(document.getElementById("mobile-overlay").style.display == "none"){
					document.getElementById("mobile-overlay").style.display = "block";
				}else{
					document.getElementById("mobile-overlay").style.display = "none";
				}
			});

		}
	}
	document.addEventListener("keyup",(e)=>{
		if(e.key == "Enter" && document.activeElement.id === "sb-search-open"){
			document.getElementsByClassName("reveal-modal-bg")[0].style.display = "block";
		}
	});
	// checando shift+tab e primeiro elemento para voltar a margem do menu ao padrao
	var flagTabFoward;
	if(document.querySelector(".menu-acessibilidade")){
		document.querySelector("a[tabindex='2']").addEventListener("focusin", (e) => {
			flagTabFoward = true;
		})
		document.querySelector("a[tabindex='1']").addEventListener("focusout", (e) => {
			setTimeout(() => {
				if (!flagTabFoward) {
					document.querySelector(".new-top-bar-section ul").classList.remove("menu-margin-left");
				}
			}, 100)
			flagTabFoward = false;
		});
	}
	// adicionando o id para as paginas com header
	var timeoutHeader = setInterval(()=>{
		if(document.getElementById("cabecalho") && document.querySelector(".new-top-bar-section")){
			document.getElementById("cabecalho").removeAttribute("id");
			document.querySelector(".new-top-bar-section").id = "cabecalho";
			clearInterval(timeoutHeader);
		}
	},100);

	// removendo a outline caso o usuário esteja utilizando o mouse para clicar
	var htmlElement = document.querySelector('html');
	document.addEventListener('click', function(){
		htmlElement.classList.add('clicking');
	});
	// fazendo um clique inicial no menu da pagina para remover a classe do outline
	var checkMenuExistence = setInterval(()=>{
		if(document.querySelector(".new-top-bar-section ul")){
			document.querySelector(".contain-to-grid.fixed").click();
			clearInterval(checkMenuExistence);
		}
	},50);

	document.addEventListener('keyup', function(e){
		if (e.key === "Tab") {
			htmlElement.classList.remove('clicking');
		}
	});

});


function getQuotSymbCurrDate(urlTarget, cdTarget, quotTarget){
	var finalSymb;
	$.ajax({
		url: urlTarget + quotTarget,
		async: false
	}).then(function(data) {
		var quot = [];
		for(var x in data.Scty)
			if(data.Scty[x].mkt.cd === cdTarget)
				quot.push(data.Scty[x]);
		quot.sort(function(a, b){return new Date(Date.parse(a.asset.AsstSummry.mtrtyCode)).getTime() - new Date(Date.parse(b.asset.AsstSummry.mtrtyCode)).getTime()});
		for(var x in quot)
			if(new Date().getTime() <= new Date(Date.parse(quot[x].asset.AsstSummry.mtrtyCode))){
				finalSymb = quot[x].symb;
				break;
			}
	});
	if (finalSymb === undefined)
		return '';
	var y = finalSymb.substring(finalSymb.length - 2, finalSymb.length);
	finalSymb = finalSymb.replace(y, parseInt(y) + 2000);//ANO ATUAL
	return finalSymb;
}

function get_lang() {
    return g_LumisLocale.substring(0,2);
 }

function htmlDecode(text)
	{
		if ( typeof( text ) != "string" )
			text = text.toString() ;
	
		text = text.split("&amp;").join("&");
		text = text.split("&quot;").join("\"");
		text = text.split( "&lt;").join("<");
		text = text.split("&gt;").join(">");
		text = text.split("&#39;").join("'");
	
		return text ;
	}

function bvmf_resizeIframe(URL) 
{
		
	try 
	{
		window.addEventListener("message", bvmf_resize, false);

		function bvmf_resize(event) {
			
			if (URL!=null)
			{
				var arr = URL.split("/");
				var dominio = arr[0] + "//" + arr[2];
			}
            else {
                dominio = "http://bvmf.bmfbovespa.com.br";
            }		
				
			if (event.origin != dominio) 
		    {
		        return;
		    }
			
		    //do something
			var bvmf_iframe = document.getElementById('bvmf_iframe');
			
			if (bvmf_iframe) 
			{ 
				bvmf_iframe.style.height = event.data + "px";
			}
		    
		}
	} 
	catch (ex)
	{
		alert(ex.Message());
	}
}
function get_param(name) {if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) var decoded_param = decodeURIComponent(name[1]); if (decoded_param) return decoded_param; return ""; }
function get_param(name, default_value) {if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) var decoded_param = decodeURIComponent(name[1]); if (decoded_param) return decoded_param; return default_value; }

/*
function setIframeSrc() {var parameter = ""; var src = document.getElementById("bvmf_iframe").src; var parameterName = document.getElementById("parameterName"); if(parameterName) { parameter = get_param(parameterName.value); } if(parameter == "") return; var redirect = document.getElementById("redirect"); if(redirect) { src = redirect.value; } if(src == "") return; var newSrc = src + parameter; document.getElementById("bvmf_iframe").src = newSrc; }
*/
function setIframeSrc() {
    var parameter = "";
    var src = document.getElementById("bvmf_iframe").src;
    var parameterName = document.getElementById("parameterName");
    if (parameterName != undefined && parameterName != null) {
        parameter = get_param(parameterName.value);
    }
    if (parameter === undefined || parameter === null || parameter === "") return;
    var redirect = document.getElementById("redirect");
    if (redirect != undefined && redirect != null) {
        src = redirect.value;
    }
    if (src === undefined || src === null || src === "") return;
    var newSrc = src + parameter;
    document.getElementById("bvmf_iframe").src = newSrc;
}

$(window).load(function() {
	//aria expanded accordions
	$('.accordion-navigation a').click(function() {
		if ($(this).siblings().hasClass('active')) {
			$(this).attr('aria-expanded', 'false');
		} else {
			$('.accordion-navigation a').attr('aria-expanded', 'false');
			$(this).attr('aria-expanded', 'true');
		}
	});

	[...document.querySelectorAll("a[target=_blank]")]
		.forEach(lnk => lnk.setAttribute("rel", "noopener noreferrer"));
	
	//aria hidden calendário
	$('.ui-datepicker-trigger, .ui-datepicker').attr('aria-hidden', true);
});