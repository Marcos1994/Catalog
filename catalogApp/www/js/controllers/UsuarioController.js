var app = angular.module("UsuarioControllers",['ionic','services.verificarLogin','services.modalAlerta','services.WebServices'])
.config(function($stateProvider, $urlRouterProvider) {
	
    $stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'index.html',
			controller: 'UsuarioController'
		})
		.state('logar', {
			url: '/logar',
			templateUrl: 'logar.html',
			controller: 'UsuarioController'
		})
		.state('cadastrar', {
			url: '/cadastrar',
			templateUrl: 'cadastrar.html',
			controller: 'UsuarioController'
		})
		.state('menu', {
			url: '/menu',
			templateUrl: 'principal.html',
			controller: 'PrincipalController'
		});
		$urlRouterProvider.otherwise('/home');
})
.controller("UsuarioController",function($scope, $ionicModal, $http, $ionicPopup, $timeout, verificarLogin, modalAlerta, WebServices){

    //___________________ LOGAR__________________//
	$scope.logar = function(usuario)
	{
		if(usuario != undefined)//campos foram preenchidos
		{
			var email = usuario.email;
			var senha = usuario.senha;
			var json = "{email:'"+email+"',senha:'"+senha+"'}";

			WebServices.logar(json)
			.success(function(data, status, headers, config)
			{
				var retorno = angular.fromJson(data.d);	
				if(retorno.tipoRetorno == "ACK") //logado
				{
					window.localStorage.idUsuario = retorno.chave.idUsuario;
					window.localStorage.token = retorno.chave.token;
					window.localStorage.ultimoAcesso = retorno.chave.ultimoAcesso;
					modalAlerta.sucesso("Login","Logando...","#/menu");
				}
				else //erro
				{
					modalAlerta.alerta("Ocorreu um erro",retorno.mensagem);
				}
			})
			.error(function(data, status, headers, config) {
				modalAlerta.alerta("Ocorreu um erro","Voce esta sem acesso a rede!");
			});
		}
		else //campos vazios
		{
			modalAlerta.alerta("Ocorreu um erro","Preencha todos os campos!");
			return false;
		}
	}
	
	//___________________ CADASTRAR___________________//
	$scope.cadastrar = function(user)
	{
		var usuario = user.nome;
		var email =  user.email;
		var senha = user.senha;
		var confirmarSenha = user.confirmarSenha;
		var json = "{email:'"+email+"',senha:'"+senha+"',nome:'"+usuario+"'}";
		
		if(senha.length >=6)
		{	
			if(senha == confirmarSenha) //senhas conferem
			{
				var filtro = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
				if(filtro.test(email))//email valido
				{
					WebServices.cadastrar(json)
					.success(function(data, status, headers, config)
					{
						var retorno = angular.fromJson(data.d);	
						if(retorno.tipoRetorno == "ACK") //cadastrado
						{
							window.localStorage.idUsuario = retorno.chave.idUsuario;
							window.localStorage.token = retorno.chave.token;
							window.localStorage.ultimoAcesso = retorno.chave.ultimoAcesso;
							modalAlerta.sucesso("Cadastro","Cadastrando...","#/menu");		
							return true;
						}
						else //erro
						{
							modalAlerta.alerta("Ocorreu um erro",retorno.mensagem);
							return false;
						}
					})
					.error(function(data, status, headers, config) {
						modalAlerta.alerta("Ocorreu um erro","Voce esta sem acesso a rede!");
					});
				}
				else //email inv�lido
				{
					$scope.erro = true;
					document.getElementById("email").value = "Email incorreto!";
					return false;
				}
			}
			else //senhas nao conferem
			{
				modalAlerta.alerta("Ocorreu um erro","Senhas n�o conferem!");
				return false;
			}	
		}
		else
		{
			modalAlerta.alerta("Ocorreu um erro","Senha deve conter mais de 5 digitos!");
		}
	}	
	
	//_________________ CONFERE SENHA ERRADA _________________//
	$scope.confereSenhaErrada = function()
	{
		var senha = document.getElementById("senha").value;
		var repetirSenha = document.getElementById("repetirSenha").value;
		if(senha!="" && repetirSenha.length<6 && repetirSenha!=senha)
		{
			document.getElementById("senha").className = "input-form senha-errada";
			document.getElementById("repetirSenha").className = "input-form senha-errada";
		}
	}
	
	//________________ CONFERE SENHA CERTA __________________//
	$scope.confereSenhaCerta = function()
	{
		var senha = document.getElementById("senha").value;
		var repetirSenha = document.getElementById("repetirSenha").value;
		if(senha!="" && repetirSenha!="" && senha==repetirSenha && repetirSenha.length>5)
		{
			document.getElementById("senha").className = "input-form senha-correta";
			document.getElementById("repetirSenha").className = "input-form senha-correta";
		}
	}
	
	//___________ VERIFICAR LOGIN _____________//
	$scope.verificarLogin = function(lugarPagina)
	{
		verificarLogin.verificarUsuario(lugarPagina);	
	};
	
	//_______________ ABRIR MODAL DE CADASTRO __________________//
	$ionicModal.fromTemplateUrl('templates/recuperarSenha.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	//_______________ RECUPERAR SENHA __________________//
	$scope.recuperarSenha = function(user)
	{
		if(user != undefined)
		{
			var email =  user.email;
			var json = "{email:'"+email+"'}";
			
			modalAlerta.sucesso("Recuperar Senha","enviando...","#/logar");		
			WebServices.recuperarSenha(json)
			.success(function(data, status, headers, config)
			{
				var retorno = angular.fromJson(data.d);	
				if(retorno.tipoRetorno == "ACK") 
				{
					$scope.modal.hide();	
				}
				else
				{
					modalAlerta.alerta("Ocorreu um erro",retorno.mensagem);
				}
			})
			.error(function(data, status, headers, config) {
				modalAlerta.alerta("Ocorreu um erro","Voce esta sem acesso a rede!");
			});	
		}
		else
		{
			modalAlerta.alerta("Ocorreu um erro","Preencha todos os campos!");
		}
	}
});
