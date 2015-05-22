﻿using Catalog.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Catalog.Models.Interfaces
{
	public class IEstabelecimento
	{
		public DtoEnderecoEstabelecimento cadastrarEstabelecimento(DtoEnderecoEstabelecimento estabelecimento);
		public DtoItem[] procurarProduto(string[] parametros);
	}
}