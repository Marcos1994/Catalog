angular.module('ListaControllers', 
[
'ionic',
'services.verificarLogin',
'services.WebServices',
'services.modalAlerta',
'model.lista',
'model.produto'
])
.config(function($stateProvider, $urlRouterProvider) {
	
    $stateProvider
		.state('listas', {
			url: '/listas',
			templateUrl: 'listas.html',
			controller: 'ListaController'
		})
		.state('produtos-lista/:id', {
			url: '/produtos-lista',
			templateUrl: 'produtos-lista.html',
			controller: 'ProdutosListaController'
		})
})
.controller('ListaController', function($scope, $ionicModal, $http, modalAlerta, verificarLogin, WebServices, $ionicPopup, listaModelo) 
{
	//chave e listas
	var idUsuario = window.localStorage.idUsuario;
	var chave = "{idUsuario:'"+idUsuario+"',token:'"+window.localStorage.token+"',ultimoAcesso:'"+window.localStorage.ultimoAcesso+"'}";
	window.localStorage.idUltimoListaCriada = 0;
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
				listaModelo.update(0, lista.nome, idUsuario, $scope.listas[i].titulo);
				$scope.listas[i].titulo = lista.nome;
			}
		}
		// var dtoLista = "{idLista:'"+idLista+"',idUsuario:'"+idUsuario+"',titulo:'"+titulo+"'}";
	
		// WebServices.editarListas(chave,dtoLista)
		// .success(function(data, status, headers, config)
		// {
			// var retorno = angular.fromJson(data.d);		
		// });
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
	   var res = modalAlerta.confirmar("Deletar","Tem certeza que deseja deletar " + lista.titulo + " ?",function(res){
		   if(res)
		   {
				$scope.listas.splice($scope.listas.indexOf(lista), 1);
				var dtoLista = "{idLista:'"+lista.idLista+"',idUsuario:'"+lista.idUsuario+"',titulo:'"+lista.titulo+"'}";
				
				listaModelo.deletar(lista.titulo, idUsuario);
				
				// $http.post('http://localhost:51786/Webservices/WsLista.asmx/excluirLista', {dtoChave:chave,dtoLista:dtoLista}).
				// success(function(data, status, headers, config)
				// {
					// var retorno = angular.fromJson(data.d);	
				// });
		   } 	   	   
	   });
	};
  	
	//________________ PESQUISAR LISTAS _____________//
	$scope.pesquisarLista = function()
	{	
		listaModelo.select(idUsuario, function(retorno){
			for(var l=0; retorno.length > l; l++)
			{
				var idLista = retorno[l].id;
				var idUsuario = retorno[l].id_usuario;
				var titulo = retorno[l].nome;
				
				$scope.listas[l] = {idLista:idLista,idUsuario:idUsuario,titulo:titulo,indice:l};
			}		
		});	
		// WebServices.pesquisarListas(chave)
	    // .success(function(data, status, headers, config)
		// {
			// var retorno = angular.fromJson(data.d);	
			// for(var l=0; retorno.objeto.length > l; l++)
			// {
				// var idLista = retorno.objeto[l].id;
				// var idUsuario = retorno.objeto[l].idUsuario;
				// var titulo = retorno.objeto[l].titulo;
				
				// $scope.listas[l] = {idLista:idLista,idUsuario:idUsuario,titulo:titulo,indice:l};
			// }
		// });
	} 

	//________________ CRIAR LISTA _________________//
	$scope.criarLista = function(lista)
	{
		if(lista != undefined){
			
			$scope.listas.push({ titulo: lista.nome});
			$scope.modal.hide();	
			var dtoLista = "{idUsuario:'"+idUsuario+"',titulo:'"+lista.nome+"'}";
			var id = window.localStorage.idUltimoListaCriada-1;
			listaModelo.insertInto(id, lista.nome, idUsuario);
			window.localStorage.idUltimoListaCriada--;
			
			// WebServices.criarListas(chave,dtoLista)
			// .success(function(data, status, headers, config)
			// {
				// var retorno = angular.fromJson(data.d);	
				// modalAlerta.alerta("Lista","Lista criada com sucesso!");
			// });
		}
		else
		{
			modalAlerta.alerta("Lista","Adicione um nome a lista");
		}
	}
  
	$scope.pesquisarClicado = false;
    //________________ PESQUISAR POR LISTA _________________//
	$scope.pesquisarPorLista = function()
	{
		if($scope.pesquisarClicado == false)
		{
			document.getElementById("titulo").className = "title animacao-titulo";
			$scope.pesquisarClicado = !$scope.pesquisarClicado;
		}
		else
		{
			document.getElementById("titulo").className = "title";
			$scope.pesquisarClicado = !$scope.pesquisarClicado;
		}
	}
	
	//________________ VERIFICAR LOGIN _________________//
	$scope.verificarLogin = function(lugarPagina)
	{
		$scope.pesquisarLista(); //chama as listas
		listaModelo.openDataBase();
		$scope.produtos = [];
		verificarLogin.verificarLista(lugarPagina);
	}
	
	
	//_______________ ABRIR MODAL DE CADASTRO DA LISTA __________________//
	$ionicModal.fromTemplateUrl('templates/adicionarLista.html', {
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
})
//########################################################################################################//
.controller('ProdutosListaController', function($scope, $ionicModal, produto, verificarLogin)
{
	$scope.produtos = [];
	
	var url = window.location.href.toString();
	$scope.idLista = url.split("?")[1];
	
	//_______________ ABRIR MODAL DE CADASTRO DO PRODUTO __________________//
	$ionicModal.fromTemplateUrl('templates/adicionarProduto.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	//________________ VERIFICAR LOGIN _________________//
	$scope.verificarLogin = function(lugarPagina)
	{
		$scope.pesquisarProdutos();
		produto.openDataBase();
		console.log($scope.produtos);
		verificarLogin.verificarProduto(lugarPagina);
	}
	
	//________________ ADICIONAR PRODUTOS _______________//
	$scope.adicionarProduto = function(prod)
	{
		$scope.produtos.push({ nome: prod.nome, quantidade: prod.quantidade});
		$scope.modal.hide();	
		produto.insertInto(1,prod.nome,prod.quantidade,"Alimenticia",$scope.idLista);
	}
	
	//_________________ PESQUISAR PRODUTOS _________________//
	$scope.pesquisarProdutos = function()
	{	
		produto.select($scope.idLista, function(retorno){
			for(var l=0; retorno.length > l; l++)
			{
				var id = retorno[l].id;
				var nome = retorno[l].nome;
				var quantidade = retorno[l].quantidade;
				var categoria = retorno[l].categoria;
				var idLista = retorno[l].idLista;
				
				$scope.produtos[l] = {id:id, nome:nome, quantidade:quantidade ,categoria:categoria, idLista:idLista};
			}		
		});	
	}	
});