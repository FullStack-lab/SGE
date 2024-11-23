using backend.Database;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UsuarioService
    {
        private readonly AppDbContext _context;

        public UsuarioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios.ToListAsync();
        }

        public async Task<Usuario> CreateAsync(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return false;
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAsync(Usuario usuario)
        {
            var existingUsuario = await _context.Usuarios.FindAsync(usuario.Id);
            if (existingUsuario == null)
            {
                return false;
            }

            existingUsuario.Nome = usuario.Nome;
            existingUsuario.Email = usuario.Email;
            existingUsuario.SenhaHash = usuario.SenhaHash;
            existingUsuario.Role = usuario.Role;

            _context.Usuarios.Update(existingUsuario);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
