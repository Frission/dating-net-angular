using Backend.Controllers;
using Backend.Data;
using Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend;

public class BuggyController(DataContext context) : BaseApiController
{
    private readonly DataContext _context = context;

    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetSecret()
    {
        return "secrit text";
    }

    [HttpGet("notfound")]
    public ActionResult<AppUser> GetNoutFound()
    {
        var thing = _context.Users.Find(-1);

        return thing != null ? thing : NotFound();
    }

    [HttpGet("server-error")]
    public ActionResult<string> GetServerError()
    {
        var thing = _context.Users.Find(-1);

        // cause an exception manually, impresive that the compiler can figure out that it will happen
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8604 // Possible null reference argument.
        var causeException = thing.ToString();

        return causeException;
#pragma warning restore CS8604 // Possible null reference argument.
#pragma warning restore CS8602 // Dereference of a possibly null reference.
    }

    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("You can do better than this..");
    }
}
