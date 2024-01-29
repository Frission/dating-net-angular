using AutoMapper;
using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Backend.Helpers;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

public class MessagesController(
    IUserRepository userRepository,
    IMessageRepository messageRepository,
    IMapper mapper
) : BaseApiController
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IMessageRepository _messageRepository = messageRepository;
    private readonly IMapper _mapper = mapper;

    [HttpPost]
    public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
    {
        var username = User.GetUsername();

        if (username.Equals(createMessageDTO.RecipientUsername, StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("You cannot send messages to yourself.");
        }

        var sender = await _userRepository.GetUserByUsernameAsync(username);
        var recipient = await _userRepository.GetUserByUsernameAsync(
            createMessageDTO.RecipientUsername
        );

        if (recipient == null || sender == null)
        {
            return NotFound();
        }

        var message = new Message
        {
            Sender = sender,
            SenderId = sender.Id,
            Recipient = recipient,
            RecipientId = recipient.Id,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDTO.Content
        };

        _messageRepository.AddMessage(message);

        if (await _messageRepository.SaveAllAsync())
        {
            return Ok(_mapper.Map<MessageDTO>(message));
        }

        return BadRequest("Failed to send message.");
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<MessageDTO>>> GetMessagesForUser(
        [FromQuery] MessageParams messageParams
    )
    {
        messageParams.Username = User.GetUsername();

        var messages = await _messageRepository.GetMessagesForUser(messageParams);

        Response.AddPaginationHeader(
            new PaginationHeader(
                messages.CurrentPage,
                messages.PageSize,
                messages.TotalCount,
                messages.TotalPages
            )
        );

        return messages;
    }

    [HttpGet("thread/{username}")]
    public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string username)
    {
        var currentUsername = User.GetUsername();

        return Ok(await _messageRepository.GetMessageThread(currentUsername, username));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id)
    {
        var username = User.GetUsername();
        var message = await _messageRepository.GetMessage(id);

        if (message == null)
            return NotFound();

        if (message.Sender.UserName != username && message.Recipient.UserName != username)
            return Unauthorized();
    }
}
