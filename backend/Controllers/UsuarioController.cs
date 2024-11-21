using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public UsuarioController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsuarios()
        {
            var usuarios = await _usuarioService.GetAllAsync();
            return Ok(usuarios);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUsuario(Usuario usuario)
        {
            var createdUsuario = await _usuarioService.CreateAsync(usuario);
            return CreatedAtAction(nameof(GetAllUsuarios), new { id = createdUsuario.Id }, createdUsuario);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Usuario loginUsuario)
        {
            var usuario = await _usuarioService.GetByEmailAsync(loginUsuario.Email);

            if (usuario == null || usuario.SenhaHash != loginUsuario.SenhaHash)
            {
                return Unauthorized(new { Message = "Credenciais inválidas!" });
            }

            return Ok(usuario);
        }

    }
}
