﻿using Catalog.Controllers.Interfaces;
using Catalog.DTO;
using Catalog.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Catalog.Controllers
{
	public class ControllerLista
	{
		public string criarLista(string dtoLista)
		{
			JavaScriptSerializer js = new JavaScriptSerializer();
			DtoRetorno retorno;
			DtoChave chave = new DtoChave();
			DtoLista lista = js.Deserialize<DtoLista>(dtoLista);

			Chave mChave = new Chave();

			try
			{
				mChave.validarChave(chave);
				Lista mLista = new Lista();
				lista.idUsuario = chave.idUsuario;
				lista = mLista.criarLista(lista);
				retorno = new DtoRetornoObjeto(chave, lista);
			}
			catch (DtoExcecao ex)
			{
				retorno = ex.ToDto();
			}
			catch (Exception ex)
			{
				retorno = new DtoRetornoErro(ex.Message);
			}

			/*Objeto: DtoLista puro*/
			return js.Serialize(retorno);
		}

		public string abrirLista(string dtoLista)
		{
			JavaScriptSerializer js = new JavaScriptSerializer();
			DtoRetorno retorno;
			DtoChave chave = new DtoChave();
			DtoLista lista = js.Deserialize<DtoLista>(dtoLista);

			Chave mChave = new Chave();

			try
			{
				mChave.validarChave(chave);
				Lista mLista = new Lista();
				lista = mLista.abrirLista(lista.id);
				retorno = new DtoRetornoObjeto(chave, lista);
			}
			catch (DtoExcecao ex)
			{
				retorno = ex.ToDto();
			}
			catch (Exception ex)
			{
				retorno = new DtoRetornoErro(ex.Message);
			}

			/*Objeto: DtoLista com array de DtoProdutosDaLista com o DtoProduto*/
			return js.Serialize(retorno);
		}


		public string editarLista(string dtoLista) 
		{
			JavaScriptSerializer js = new JavaScriptSerializer();
			DtoRetorno retorno;
			DtoChave chave = new DtoChave();
            DtoLista lista = js.Deserialize<DtoLista>(dtoLista);

            Chave mChave = new Chave();

            try
            {
                mChave.validarChave(chave);
                Lista mLista = new Lista();
                mLista.editarLista(lista.id, lista.titulo);
                retorno = new DtoRetornoObjeto(chave);
            }
            catch (DtoExcecao ex)
            {
                retorno = ex.ToDto();
            }
            catch (Exception ex)
            {
                retorno = new DtoRetornoErro(ex.Message);
            }

			/*Objeto: DtoLista puro*/
			return js.Serialize(retorno);
		}


		public string excluirLista(string dtoLista)
		{
			JavaScriptSerializer js = new JavaScriptSerializer();
			DtoRetorno retorno;
			DtoChave chave = new DtoChave();
			DtoLista lista = js.Deserialize<DtoLista>(dtoLista);

            Chave mChave = new Chave();
            try
            {
                mChave.validarChave(chave);
                Lista mLista = new Lista();
                mLista.excluirLista(lista.id);
                retorno = new DtoRetornoObjeto(chave); 
            }
            catch (DtoExcecao ex)
            {
                retorno = ex.ToDto();
            }
            catch (Exception ex)
            {
                retorno = new DtoRetornoErro(ex.Message);
            }

			/*Objeto: apenas a chave*/
			return js.Serialize(retorno);
		}

		public string pesquisarLista(int idUsuario)
		{
			JavaScriptSerializer js = new JavaScriptSerializer();
			DtoRetorno retorno;
            DtoChave chave = new DtoChave();
			DtoLista[] listas;

			Chave mChave = new Chave();

			try
			{
				mChave.validarChave(chave);
				Lista mLista = new Lista();
                listas = mLista.pesquisarListas(idUsuario);
				retorno = new DtoRetornoObjeto(chave, listas);
			}
			catch (DtoExcecao ex)
			{
				retorno = ex.ToDto();
			}
			catch (Exception ex)
			{
				retorno = new DtoRetornoErro(ex.Message);
			}

			/*Objeto: Array de DtoLista*/
			return js.Serialize(retorno);
		}

		public string listarItensEm(int idLista, int idEstabelecimento)
		{
			JavaScriptSerializer js = new JavaScriptSerializer();
			DtoRetorno retorno;
            DtoChave chave = new DtoChave();
			DtoLista lista;
			Chave mChave = new Chave();

			try
			{
				mChave.validarChave(chave);
				Lista mLista = new Lista();
				lista = mLista.listarItensEm(idLista, idEstabelecimento);
				retorno = new DtoRetornoObjeto(chave, lista);
			}
			catch (DtoExcecao ex)
			{
				retorno = ex.ToDto();
			}
			catch (Exception ex)
			{
				retorno = new DtoRetornoErro(ex.Message);
			}

			/*Objeto: DtoLista com array de DtoProdutoDaLista contendo DtoProduto e DtoItem (no mesmo indice, caso o item exista), contendo o endereço do estab e o estab*/
			return js.Serialize(retorno);
		}

		/*Não Implementado*/
		public string adicionarProduto(string dtoLista, string dtoProdutoDaLista)
		{
			JavaScriptSerializer js = new JavaScriptSerializer();
			DtoRetorno retorno;
            DtoChave chave = new DtoChave();
			DtoLista lista = js.Deserialize<DtoLista>(dtoLista);
		

            Chave mChave = new Chave();

            try
            {
                mChave.validarChave(chave);
                DtoProdutoDaLista produtoDaLista = js.Deserialize<DtoProdutoDaLista>(dtoProdutoDaLista);
                Lista mLista = new Lista();
                produtoDaLista = mLista.adicionarProduto(produtoDaLista);
                retorno = new DtoRetornoObjeto(chave, produtoDaLista);
            }
            catch (DtoExcecao ex)
            {
                retorno = ex.ToDto();
            }
            catch (Exception ex)
            {
                retorno = new DtoRetornoErro(ex.Message);
            }

			/*Objeto: DtoProdutoDaLista com o DtoProduto*/
			return js.Serialize(retorno);
		}

		public string removerProduto(string dtoLista, string dtoProduto)
		{
			JavaScriptSerializer js = new JavaScriptSerializer();
			DtoRetorno retorno;
            DtoChave chave = new DtoChave();
            DtoProdutoDaLista produtoDaLista = js.Deserialize<DtoProdutoDaLista>(dtoProduto);

            try
            {
                Chave mChave = new Chave();
                mChave.validarChave(chave);
                Lista mLista = new Lista();
                mLista.removerProduto(produtoDaLista.id);
                retorno = new DtoRetornoObjeto(chave);
            }
            catch (DtoExcecao ex)
            {
                retorno = ex.ToDto();
            }
            catch (Exception ex)
            {
                retorno = new DtoRetornoErro(ex.Message);
            }

			/*Objeto: apenas a chave*/
			return js.Serialize(retorno);
		}
	}
}