using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BibliotecaSUPABASE.Banco.DTOs;
using ApiTreccoRENDER.Services;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("enviar_email")]
    public async Task<IActionResult> EnviarEmail([FromBody] EmailDTO emailDto)
    {
        await _emailService.EnviarEmailAsync(emailDto.Para, emailDto.Assunto, emailDto.Corpo);
        return Ok("E-mail enviado com sucesso!");
    }
}

