angular.module('ListaControllers', ['ionic','services.verificarLogin','services.WebServices','services.modalAlerta'])
.config(function($stateProvider, $urlRouterProvider) {
	
    $stateProvider
		.state('listas', {
			url: '/listas',
			templateUrl: 'listas.html',
			controller: 'ListaController'
		})
})
.controller('ListaController', function($scope, $ionicModal, $http, modalAlerta, verificarLogin, WebServices, $ionicPopup) {
  
	//chave e listas
	var chave = "{idUsuario:'"+window.localStorage.idUsuario+"',token:'"+window.localStorage.token+"',ultimoAcesso:'"+window.localStorage.ultimoAcesso+"'}";
	$scope.listas = [];

	//________________ EDITAR LISTAS _____________//
	$scope.editarLista = function(lista,indiceLista) {
		for(var i=0; i< $scope.listas.length; i++)
		{
			if($scope.listas[i].indice == indiceLista)
			{
				var idLista = $scope.listas[i].idLista;
				var idUsuario = $scope.listas[i].idUsuario;
				var titulo = lista.nome;
				$scope.listas[i].titulo = lista.nome;
			}
		}
		var dtoLista = "{idLista:'"+idLista+"',idUsuario:'"+idUsuario+"',titulo:'"+titulo+"'}";
	
		WebServices.editarListas(chave,dtoLista)
		.success(function(data, status, headers, config)
		{
			var retorno = angular.fromJson(data.d);		
		});
	};
	
    //__________________ MOVER LISTA _________________//
	$scope.moverLista = function(lista, fromIndex, toIndex)
	{
		$scope.listas.splice(fromIndex, 1);
		$scope.listas.splice(toIndex, 0, lista);
	};
  
    //___________________ DELETAR LISTA ______________//
	$scope.deletarLista = function(lista) 
	{
	   var res = modalAlerta.confirmar("Lista","Adicione um nome a lista",function(res){
		   if(res)
		   {
				$scope.listas.splice($scope.listas.indexOf(lista), 1);
				var dtoLista = "{idLista:'"+lista.idLista+"',idUsuario:'"+lista.idUsuario+"',titulo:'"+lista.titulo+"'}";
				
				$http.post('http://localhost:51786/Webservices/WsLista.asmx/excluirLista', {dtoChave:chave,dtoLista:dtoLista}).
				success(function(data, status, headers, config)
				{
					var retorno = angular.fromJson(data.d);	
				});
		   } 	   	   
	   });
	};
  	
	//________________ PESQUISAR LISTAS _____________//
	$scope.pesquisarLista = function()
	{	
		WebServices.pesquisarListas(chave)
	    .success(function(data, status, headers, config)
		{
			var retorno = angular.fromJson(data.d);	
			for(var l=0; retorno.objeto.length > l; l++)
			{
				var idLista = retorno.objeto[l].id;
				var idUsuario = retorno.objeto[l].idUsuario;
				var titulo = retorno.objeto[l].titulo;
				
				$scope.listas[l] = {idLista:idLista,idUsuario:idUsuario,titulo:titulo,indice:l};
			}
		});
	}

	//________________ CRIAR LISTA _________________//
	$scope.criarLista = function(lista)
	{
		if(lista != undefined){
			$scope.listas.push({ titulo: lista.nome});
			$scope.modal.hide();	
			var dtoLista = "{idUsuario:'"+window.localStorage.idUsuario+"',titulo:'"+lista.nome+"'}";
			
			WebServices.criarListas(chave,dtoLista)
			.success(function(data, status, headers, config)
			{
				var retorno = angular.fromJson(data.d);	
				modalAlerta.alerta("Lista","Lista criada com sucesso!");
			});
		}
		else
		{
			modalAlerta.alerta("Lista","Adicione um nome a lista");
		}
	}
	
	$scope.pesquisar =  function()
	{
		
	}
  
	//________________ VERIFICAR LOGIN _________________//
	$scope.verificarLogin = function(lugarPagina)
	{
		$scope.pesquisarLista(); //chama as listas
		verificarLogin.verificarLista(lugarPagina);
	}
	
	//_______________ ABRIR MODAL DE CADASTRO DA LISTA __________________//
	$ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	//_______________ MODAL EDITAR LISTA __________________//
	$scope.modalEditarLista = function(indiceLista) {
	   $scope.lista = {};
	   

	   var myPopup = $ionicPopup.show
	   ({
		 template: '<input type="text" ng-model="lista.nome">',
		 title: 'Editar Lista',
		 subTitle: 'Edite o nome da lista',
		 scope: $scope,
		 buttons: [
		   { text: 'Cancel' },
		   {
			 text: '<b>Save</b>',
			 type: 'button-positive',
			 onTap: function(e) {
			   if (!$scope.lista.nome) {
				 e.preventDefault();
			   } else {
				 myPopup.close;  
				 $scope.editarLista($scope.lista,indiceLista);
			   }
			 }
		   },
		 ]
		});
	}
});